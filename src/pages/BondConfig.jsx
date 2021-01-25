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
import { toEverUSD } from '../utils/converters';

import styles from './BondConfig.module.less';

const U64MAX = 18446744073709551615n;
const MIN_PAYMENT_PERIOD = 1;
const MIN_BOND_DURATION = 1;
const DEFAULT_IMPACT_BASELINE = 4000;

const DEFAULT_BOND_PARAMS = {
  bond_duration: 12,
  interest_rate_start_period_value: 1,
  interest_rate_base_value: 3,
  interest_rate_margin_floor: 1,
  interest_rate_margin_cap: 5,
  interest_rate_penalty_for_missed_report: 2,
  impact_data_type: 'POWER_GENERATED',
  bond_units_mincap_amount: 100,
  bond_units_maxcap_amount: 600,
  payment_period: 365,
  interest_pay_period: 60,
  bond_finishing_period: 1,
  mincap_deadline: dayjs().add(30, 'day'),
  impact_data_send_period: 60,
  impact_data_max_deviation_floor: 4000,
  impact_data_max_deviation_cap: 16000,
  bond_units_base_price: 100,
  start_period: '365',
}

const BondConfig = () => {
  const [state, updateState] = useXState(DEFAULT_BOND_PARAMS);

  const { prepareBond } = usePolkadot();

  const bondDuration = state.bond_duration > 0 ? state.bond_duration : 0;
  const impactMeasure = IMPACT_DATA_TYPES[state.impact_data_type].measure;
  const penalty = (state.interest_rate_penalty_for_missed_report || 0) + (state.interest_rate_base_value || 0);
  
  const startPeriod = state.mincap_deadline.add(state.start_period, 'day');
  const startPeriodInterestRate = state.interest_rate_start_period_value || 0;

  let chartData = [...Array((bondDuration)).keys()].map((item) => ({
    period: startPeriod.add(state.payment_period * (item + 1), 'day').format('DD-MM-YYYY'),
    interest_rate: state.interest_rate_base_value || 0,
    interest_rate_min: state.interest_rate_margin_floor || 0,
    interest_rate_max: state.interest_rate_margin_cap || 0,
    penalty,
    impact_baseline: state?.[`impact_baseline_${item + 1}`] || DEFAULT_IMPACT_BASELINE,
  }));

  // grace period first
  chartData = [
    {
      period:  state.mincap_deadline.format('DD-MM-YYYY'),
      grace_period: startPeriodInterestRate
    },
    {
      period: startPeriod.format('DD-MM-YYYY'),
      grace_period: startPeriodInterestRate,
      interest_rate: state.interest_rate_base_value || 0,
      interest_rate_min: state.interest_rate_margin_floor || 0,
      interest_rate_max: state.interest_rate_margin_cap || 0,
      penalty,
      impact_baseline: state.impact_baseline_0 || DEFAULT_IMPACT_BASELINE,
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
      default: DEFAULT_BOND_PARAMS.mincap_deadline,
    },
    bond_duration: {
      label: 'Time to maturity, periods',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: DEFAULT_BOND_PARAMS.bond_duration,
      rules: [
        {
          validator: async (rule, value) => {
            if (value < MIN_BOND_DURATION) {
              throw new Error(`Must be bigger or equal ${MIN_BOND_DURATION}`);
            }
          }
        }
      ]
    },
    payment_period: {
      label: 'Coupon period, days',
      suffix: 'Frequency of interest rate recalculation',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: DEFAULT_BOND_PARAMS.payment_period,
      rules: [
        {
          validator: async (rule, value) => {
            if (value < MIN_PAYMENT_PERIOD) {
              throw new Error(`Must be bigger or equal ${MIN_PAYMENT_PERIOD}`);
            }
          }
        },
        {
          validator: async (rule, value) => {
            if (value > parseInt(state.start_period, 10)) {
              throw new Error('Must be less or equal than grace period');
            }
          }
        }
      ]
    },
    bond_finishing_period: {
      label: 'Face value payment period, days',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: DEFAULT_BOND_PARAMS.bond_finishing_period,
      suffix: 'Number of days after bond maturity to pay bond par value',
    },
    bond_units_mincap_amount: {
      label: 'Minimum amount of bond sale, bond units',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: DEFAULT_BOND_PARAMS.bond_units_mincap_amount,
      suffix: 'Minimum number of bond units sold needed to issue bond',
      rules: [
        {
          validator: async (rule, value) => {
            if (value <= 0) {
              throw new Error('Must be bigger than 0');
            }
          }
        },
        {
          validator: async (rule, value) => {
            if (value > state.bond_units_maxcap_amount) {
              throw new Error('Must be less than maxcap');
            }
          }
        }
      ]
    },
    bond_units_maxcap_amount: {
      label: 'Number of bonds in issue, bond units',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: DEFAULT_BOND_PARAMS.bond_units_maxcap_amount,
      rules: [
        {
          validator: async (rule, value) => {
            if (value < state.bond_units_mincap_amount) {
              throw new Error('Must be bigger than mincap');
            }
          }
        },
        {
          validator: async (rule, value) => {
            if (toEverUSD(value * state.bond_units_base_price) > U64MAX) {
              throw new Error('Bond price * maxcap is too large');
            }
          }
        },
      ]
    },
    bond_units_base_price: {
      label: 'Bond price, USD',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: DEFAULT_BOND_PARAMS.bond_units_base_price,
      rules: [
        {
          validator: async (rule, value) => {
            if (value <= 0) {
              throw new Error('Must be bigger than 0');
            }
          }
        },
        {
          validator: async (rule, value) => {
            if (toEverUSD(value * state.bond_units_maxcap_amount) > U64MAX) {
              throw new Error('Bond price * maxcap is too large');
            }
          }
        },
      ]
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
      default: DEFAULT_BOND_PARAMS.interest_rate_base_value,
    },
    interest_pay_period: {
      label: 'Interest rate payment period, days',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: DEFAULT_BOND_PARAMS.interest_pay_period,
      suffix: 'Number of days to pay interest rate after interest recalculation',
      rules: [
        {
          validator: async (rule, value) => {
            if (value > state.payment_period) {
              throw new Error('Must be less than payment_period');
            }
          }
        }
      ]
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
      default: DEFAULT_BOND_PARAMS.impact_data_type,
    },
    interest_rate_margin_floor: {
      label: 'Minimum interest rate, %',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      min: 1,
      max: 100,
      default: DEFAULT_BOND_PARAMS.interest_rate_margin_floor,
    },
    interest_rate_margin_cap: {
      label: 'Maximum interest rate, %',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      min: 1,
      max: 100,
      default: DEFAULT_BOND_PARAMS.interest_rate_margin_cap,
    },
    impact_data_max_deviation_cap: {
      label: `Impact value leading to maximum interest rate, ${impactMeasure}`,
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: DEFAULT_BOND_PARAMS.impact_data_max_deviation_cap,
      rules: [
        {
          validator: async (rule, value) => {
            if (value < state.impact_data_max_deviation_floor) {
              throw new Error('Must be bigger than max deviation floor');
            }
          }
        }
      ]
    },
    impact_data_max_deviation_floor: {
      label: `Impact value leading to minimum interest rate, ${impactMeasure}`,
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: DEFAULT_BOND_PARAMS.impact_data_max_deviation_floor,
      rules: [
        {
          validator: async (rule, value) => {
            if (value > state.impact_data_max_deviation_cap) {
              throw new Error('Must be less than max deviation cap');
            }
          }
        }
      ]
    },
    impact_data_send_period: {
      label: 'Time window to submit impact data, days',
      suffix: 'days before interest rate reset',
      required: true,
      type: 'number',
      display: 'text',
      span: 12,
      default: DEFAULT_BOND_PARAMS.impact_data_send_period,
      rules: [
        {
          validator: async (rule, value) => {
            if (value > state.payment_period) {
              throw new Error('Must be less than payment_period');
            }
          }
        }
      ]
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
      default: DEFAULT_BOND_PARAMS.interest_rate_penalty_for_missed_report,
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
      default: DEFAULT_BOND_PARAMS.start_period,
    },
    interest_rate_start_period_value: {
      label: 'Grace period interest rate, %',
      required: true,
      type: 'number',
      display: 'text',
      min: 1,
      max: 100,
      span: 12,
      default: DEFAULT_BOND_PARAMS.interest_rate_start_period_value,
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
      default: DEFAULT_IMPACT_BASELINE,
      rules: [{
        validator: async (rule, value) => {
          if (value > state.impact_data_max_deviation_cap) {
            throw new Error('Must be less than max deviation cap');
          } else if (value < state.impact_data_max_deviation_floor) {
            throw new Error('Must be bigger than max deviation floor');
          }
        }
      }]
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
