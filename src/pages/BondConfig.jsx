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
  Label,
} from 'recharts';

import SimpleForm from '../components/SimpleForm';

import useXState from '../hooks/useXState';
import usePolkadot from '../hooks/usePolkadot';

import { IMPACT_DATA_TYPES } from '../utils/env';

import styles from './BondConfig.module.less';

const DEFAULT_PERIODS = 12;
const IR_SP_DEFAULT = 1;
const IR_PENALTY_DEFAULT = 2;
const IR_MC_DEFAULT = 5;
const IR_MF_DEFAULT = 1;
const IR_DEFAULT = 3;
const IMPACT_BASELINE_DEFAULT = 4000;
const DEFAULT_IMPACT_DATA_TYPE = 'POWER_GENERATED';

const BondConfig = () => {
  const [state, updateState] = useXState({
    bond_duration: DEFAULT_PERIODS,
    interest_rate_start_period_value: IR_SP_DEFAULT,
    interest_rate_base_value: IR_DEFAULT,
    interest_rate_margin_floor: IR_MF_DEFAULT,
    interest_rate_margin_cap: IR_MC_DEFAULT,
    interest_rate_penalty_for_missed_report: IR_PENALTY_DEFAULT,
    impact_data_type: DEFAULT_IMPACT_DATA_TYPE,
  });

  const { prepareBond } = usePolkadot();

  const bondDuration = state.bond_duration || 0;
  const periods = bondDuration - 2 <= 0 ? 1 : bondDuration - 2;
  const impactMeasure = IMPACT_DATA_TYPES[state.impact_data_type].measure;
  const penalty = (state.interest_rate_penalty_for_missed_report || 0) + (state.interest_rate_base_value || 0);

  let chartData = [...Array((periods)).keys()].map((item) => ({
    period: dayjs().add(item + 2, 'year').format('YYYY'),
    interest_rate: state.interest_rate_base_value || 0,
    interest_rate_min: state.interest_rate_margin_floor || 0,
    interest_rate_max: state.interest_rate_margin_cap || 0,
    penalty,
    impact_baseline: state?.[`impact_baseline_${item + 2}`] || IMPACT_BASELINE_DEFAULT,
  }));

  // grace period first
  chartData = [
    {
      period: dayjs().format('YYYY'),
      grace_period: state.interest_rate_start_period_value || 0,
      impact_baseline: state.impact_baseline_0 || IMPACT_BASELINE_DEFAULT,
    },
    {
      period: dayjs().add(1, 'year').format('YYYY'),
      interest_rate: state.interest_rate_base_value || 0,
      grace_period: state.interest_rate_start_period_value || 0,
      interest_rate_min: state.interest_rate_margin_floor || 0,
      interest_rate_max: state.interest_rate_margin_cap || 0,
      penalty,
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
      label: 'Ticker name',
      required: true,
      span: 12,
      default: 'BOND',
    },
    mincap_deadline: {
      label: 'Issuance date',
      required: true,
      display: 'date',
      span: 12,
      default: dayjs().add(30, 'day'),
    },
    bond_duration: {
      label: 'Time to maturity, periods',
      min: 2,
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: DEFAULT_PERIODS,
    },
    payment_period: {
      label: 'Coupon period, days',
      suffix: 'Frequency of interest rate recalculation',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 365,
      disabled: true,
    },
    bond_finishing_period: {
      label: 'Face value payment period, days',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 1,
      suffix: 'Number of days after bond maturity to pay bond par value',
    },
    bond_units_mincap_amount: {
      label: 'Minimum amount of bond sale, bond units',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 100,
      suffix: 'Minimum number of bond units sold needed to issue bond',
    },
    bond_units_maxcap_amount: {
      label: 'Number of bonds in issue, bond units',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 600,
    },
    bond_units_base_price: {
      label: 'Bond price, USD',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 100,
    },
    chart: {
      display: 'custom',
      component: !!bondDuration && (
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
            yAxisId="right"
          />
          <Line
            name="Interest rate"
            dot={false}
            strokeWidth={3}
            stroke="#548F5D"
            dataKey="interest_rate"
            yAxisId="left"
          />
          <Line
            name="Grace period"
            dot={false}
            strokeWidth={3}
            stroke="#392897"
            dataKey="grace_period"
            yAxisId="left"
          />
          <Line
            name="Minimum interest rate value"
            dot={false}
            strokeWidth={2}
            stroke="#fdac47"
            dataKey="interest_rate_min"
            yAxisId="left"
          />
          <Line
            name="Maximum interest rate value"
            dot={false}
            strokeWidth={2}
            stroke="#86a9dc"
            dataKey="interest_rate_max"
            yAxisId="left"
          />
          <Line
            name="Penalty for missed report"
            dot={false}
            strokeWidth={2}
            stroke="#ff2255"
            dataKey="penalty"
            yAxisId="left"
          />
          <CartesianGrid stroke="#EEE" strokeDasharray="5 5" />
          <XAxis dataKey="period" label={{ value: 'Periods', offset: -10, position: 'insideBottom' }} />
          <YAxis yAxisId="left" label={{ value: '%', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: impactMeasure, angle: -90, position: 'right' }} />
          <Tooltip />
        </LineChart>
      ),
    },
    impact_divider: {
      display: 'divider',
      label: 'Interest rate details',
    },
    interest_rate_base_value: {
      label: 'Basic interest rate, %',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      min: 1,
      max: 100,
      default: IR_DEFAULT,
    },
    interest_pay_period: {
      label: 'Interest rate payment period, days',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 60,
      suffix: 'Number of days to pay interest rate after interest recalculation',
    },
    floating_rate_divider: {
      display: 'divider',
      label: 'Floating rate details',
    },
    impact_data_type: {
      label: 'Impact indicator for reporting',
      required: true,
      display: 'select',
      span: 12,
      allowClear: false,
      showSearch: true,
      values: [
        { 'Renewable energy generation (MWh)': 'POWER_GENERATED' },
        { 'CO2 reduction (MtCO2e)': 'CO2_EMISSIONS_REDUCTION' },
      ],
      default: DEFAULT_IMPACT_DATA_TYPE,
    },
    interest_rate_margin_floor: {
      label: 'Minimum interest rate, %',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      min: 1,
      max: 100,
      default: IR_MF_DEFAULT,
    },
    interest_rate_margin_cap: {
      label: 'Maximum interest rate, %',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      min: 1,
      max: 100,
      default: IR_MC_DEFAULT,
    },
    impact_data_max_deviation_cap: {
      label: `Impact value leading to maximum interest rate, ${impactMeasure}`,
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 16000,
    },
    impact_data_max_deviation_floor: {
      label: `Impact value leading to minimum interest rate, ${impactMeasure}`,
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 4000,
    },
    impact_data_send_period: {
      label: 'Time window to submit impact data, days',
      suffix: 'days before interest rate reset',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: 60,
    },
    interest_rate_penalty_for_missed_report: {
      label: 'Interest rate penalty, %',
      suffix: 'Interest rate penalty in case of missed report, %',
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
      display: 'select',
      span: 12,
      allowClear: false,
      showSearch: true,
      values: [
        { 'One year': '365' },
        { 'Half year': '182' },
        { 'One quarter': '91' },
      ],
      default: '365',
    },
    interest_rate_start_period_value: {
      label: 'Grace period interest rate, %',
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

  [...Array(bondDuration).keys()].forEach((item) => {
    formConfig[`impact_baseline_${item}`] = {
      label: `Impact baseline for period ${item + 1}, ${impactMeasure}`,
      required: true,
      type: 'number',
      display: 'text',
      step: 100,
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
