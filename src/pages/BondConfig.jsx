import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import SimpleForm from '../components/SimpleForm';

import useXState from '../hooks/useXState';
import usePolkadot from '../hooks/usePolkadot';

import styles from './BondConfig.module.less';

const DEFAULT_PERIODS = 12;
const IR_SP_DEFAULT = 1;
const IR_PENALTY_DEFAULT = 2;
const IR_MC_DEFAULT = 5;
const IR_MF_DEFAULT = 1;
const IR_DEFAULT = 3;
const IMPACT_BASELINE_DEFAULT = 4;

const BondConfig = () => {
  const [state, updateState] = useXState({
    bond_duration: DEFAULT_PERIODS,
    interest_rate_start_period_value: IR_SP_DEFAULT,
    interest_rate_base_value: IR_DEFAULT,
    interest_rate_margin_floor: IR_MF_DEFAULT,
    interest_rate_margin_cap: IR_MC_DEFAULT,
    interest_rate_penalty_for_missed_report: IR_PENALTY_DEFAULT,
  });

  const { prepareBond } = usePolkadot();

  const periods = state.bond_duration - 2 < 0 ? 2 : state.bond_duration - 2;

  let chartData = [...Array((periods)).keys()].map((item) => ({
    period: dayjs().add(item + 2, 'year').format('YYYY'),
    interest_rate: state.interest_rate_base_value,
    interest_rate_min: state.interest_rate_margin_floor,
    interest_rate_max: state.interest_rate_margin_cap,
    penalty: state.interest_rate_penalty_for_missed_report,
    impact_baseline: state?.[`impact_baseline_${item + 2}`] || IMPACT_BASELINE_DEFAULT,
  }));

  // grace period first
  chartData = [
    {
      period: dayjs().format('YYYY'),
      grace_period: state.interest_rate_start_period_value,
      impact_baseline: state.impact_baseline_0 || IMPACT_BASELINE_DEFAULT,
    },
    {
      period: dayjs().add(1, 'year').format('YYYY'),
      interest_rate: state.interest_rate_base_value,
      grace_period: state.interest_rate_start_period_value,
      interest_rate_min: state.interest_rate_margin_floor,
      interest_rate_max: state.interest_rate_margin_cap,
      penalty: state.interest_rate_penalty_for_missed_report,
      impact_baseline: state.impact_baseline_1 || IMPACT_BASELINE_DEFAULT,
    },
    ...chartData,
  ];

  const formConfig = {
    bond_divider: {
      display: 'divider',
      label: 'Bond details',
    },
    bond_id: {
      label: 'Ticker Name',
      required: true,
      span: 12,
      default: 'BOND',
    },
    mincap_deadline: {
      label: 'Issuance Date, timestamp(ms)',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: Math.floor(dayjs().add(30, 'day') / 1000) * 1000,
    },
    bond_duration: {
      label: 'Time To Maturity, periods',
      min: 2,
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: DEFAULT_PERIODS,
    },
    bond_finishing_period: {
      label: 'Maturity Payment Period, days',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 1,
    },
    bond_units_mincap_amount: {
      label: 'Minimum Amount of Bond Sale',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 100,
    },
    bond_units_maxcap_amount: {
      label: 'Maximum Amount of Bond Sale',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 600,
    },
    bond_units_base_price: {
      label: 'Bond Price',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 10000000,
    },
    chart: {
      display: 'custom',
      component: (
        <LineChart
          width={800}
          height={400}
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <Line
            name="Impact baseline"
            dot={false}
            strokeWidth={3}
            stroke="#2f4fee"
            dataKey="impact_baseline"
          />
          <Line
            name="Interest rate"
            dot={false}
            strokeWidth={3}
            stroke="#548F5D"
            dataKey="interest_rate"
          />
          <Line
            name="Grace period"
            dot={false}
            strokeWidth={3}
            stroke="#392897"
            dataKey="grace_period"
          />
          <Line
            name="Minimum interest rate value"
            dot={false}
            strokeWidth={2}
            stroke="#fdac47"
            dataKey="interest_rate_min"
          />
          <Line
            name="Maximum interest rate value"
            dot={false}
            strokeWidth={2}
            stroke="#86a9dc"
            dataKey="interest_rate_max"
          />
          <Line
            name="Penalty for missed report"
            dot={false}
            strokeWidth={2}
            stroke="#ff2255"
            dataKey="penalty"
          />
          <CartesianGrid stroke="#EEE" strokeDasharray="5 5" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
        </LineChart>
      ),
    },
    impact_divider: {
      display: 'divider',
      label: 'Interest rate details',
    },
    interest_rate_base_value: {
      label: 'Interest Rate, %',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      min: 1,
      max: 100,
      default: IR_DEFAULT,
    },
    payment_period: {
      label: 'Payment Period',
      suffix: 'Frequency of Interest Rate Payment/Recalculation (once in x days)',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 120,
    },
    interest_pay_period: {
      label: 'Interest Rate Payment Period',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 60,
    },
    floating_rate_divider: {
      display: 'divider',
      label: 'Floating rate details',
    },
    impact_data_type: {
      label: 'Impact Indicator for Reporting',
      required: true,
      display: 'select',
      span: 12,
      allowClear: false,
      showSearch: true,
      values: [
        { 'Renewable energy generation (MWh)': 'POWER_GENERATED' },
        { 'CO2 reduction (MtCO2e)': 'CO2_EMISSIONS_REDUCTION' },
      ],
      default: 'POWER_GENERATED',
    },
    interest_rate_margin_floor: {
      label: 'Minimum Interest Rate Value, %',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      min: 1,
      max: 100,
      default: IR_MF_DEFAULT,
    },
    interest_rate_margin_cap: {
      label: 'Maximum Interest Rate Value, %',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      min: 1,
      max: 100,
      default: IR_MC_DEFAULT,
    },
    impact_data_max_deviation_cap: {
      label: 'Max Deviation Cap',
      suffix: 'Impact Value Leading to the Minimum Interest Rate Value',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 16000,
    },
    impact_data_max_deviation_floor: {
      label: 'Max Deviation Floor',
      suffix: 'Impact Value Which Results in the Maximum Interest Rate Value',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 4000,
    },
    impact_data_send_period: {
      label: 'Time Window to Submit Impact',
      suffix: 'Time Window to Submit Impact Data Report (# days before interest rate reset)',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 60,
    },
    interest_rate_penalty_for_missed_report: {
      label: 'Interest Rate Penalty',
      suffix: 'Interest Rate Increase Penalty in Case of Missed Report, %',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      min: 1,
      max: 100,
      default: IR_PENALTY_DEFAULT,
    },
    start_period: {
      label: 'Grace Period',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 120,
    },
    interest_rate_start_period_value: {
      label: 'Grace Period Interest Rate, %',
      required: true,
      type: 'number',
      display: 'text',
      min: 1,
      max: 100,
      span: 12,
      default: IR_SP_DEFAULT,
    },
    impact_baseline_divider: {
      display: 'divider',
      label: 'Impact baseline',
    },
  };

  [...Array(state.bond_duration).keys()].forEach((item) => {
    formConfig[`impact_baseline_${item}`] = {
      label: `Impact baseline for period ${item + 1}`,
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: IMPACT_BASELINE_DEFAULT,
    };
  });

  const onChange = (value) => updateState(value);

  return (
    <div className={styles.container}>
      <SimpleForm
        config={formConfig}
        onValuesChange={onChange}
        onSubmit={prepareBond}
        submitText="Prepare"
        className={styles.form}
        labelAlign="left"
        layout="vertical"
      />
    </div>
  );
};

BondConfig.propTypes = {
};

BondConfig.defaultProps = {};

export default BondConfig;
