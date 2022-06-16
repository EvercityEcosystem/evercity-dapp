import React from "react";
import dayjs from "dayjs";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import SimpleForm from "../components/SimpleForm";

import useXState from "../hooks/useXState";
import usePolkadot from "../hooks/usePolkadot";

import { IMPACT_DATA_TYPES, BOND_TICKER_LIMIT } from "../utils/env";
import { toEverUSD } from "../utils/converters";

import styles from "./BondConfig.module.less";

const U64MAX = 18446744073709551615n;
const MIN_PAYMENT_PERIOD = 1;
const MIN_BOND_DURATION = 1;
const DEFAULT_IMPACT_BASELINE = 800;

const DEFAULT_BOND_PARAMS = {
  bond_duration: 4,
  interest_rate_start_period_value: 1,
  interest_rate_base_value: 3,
  interest_rate_margin_floor: 1,
  interest_rate_margin_cap: 5,
  interest_rate_penalty_for_missed_report: 2,
  impact_data_type: "POWER_GENERATED",
  bond_units_mincap_amount: 10,
  bond_units_maxcap_amount: 60,
  payment_period: 5,
  interest_pay_period: 4,
  bond_finishing_period: 1,
  mincap_deadline: dayjs().add(30, "day"),
  impact_data_send_period: 3,
  impact_data_max_deviation_floor: 400,
  impact_data_max_deviation_cap: 1600,
  bond_units_base_price: 100,
  start_period: 5,
};

const BondConfig = () => {
  const randomTicker = Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();

  const [state, updateState] = useXState({
    ...DEFAULT_BOND_PARAMS,
    bond_id: randomTicker,
  });

  const { prepareBond } = usePolkadot();

  const bondDuration = state.bond_duration > 0 ? state.bond_duration : 0;
  const impactMeasure = IMPACT_DATA_TYPES[state.impact_data_type].measure;
  const impactMeasureLabel = impactMeasure ? `, ${impactMeasure}` : "";
  const penalty =
    (state.interest_rate_penalty_for_missed_report || 0) +
    (state.interest_rate_base_value || 0);

  const startPeriod = state.mincap_deadline.add(state.start_period || 0, "day");
  const startPeriodInterestRate = state.interest_rate_start_period_value || 0;

  // grace period first
  let chartData = [...Array(bondDuration).keys()].map(item => ({
    period: startPeriod
      ?.add(state.payment_period * item, "day")
      .format("DD-MM-YYYY"),
    interest_rate: state.interest_rate_base_value || 0,
    interest_rate_min: state.interest_rate_margin_floor || 0,
    interest_rate_max: state.interest_rate_margin_cap || 0,
    penalty,
    grace_period: item === 0 ? startPeriodInterestRate : null,
    impact_baseline: state?.[`impact_baseline_${item}`],
  }));

  // last point for last period
  // grace period doesn't have any params except interest_rate_start_period_value and baseline
  chartData = [
    {
      period: state.mincap_deadline?.format("DD-MM-YYYY"),
      grace_period: startPeriodInterestRate,
      impact_baseline: state.impact_baseline_0,
    },
    ...chartData,
    {
      ...chartData[bondDuration - 1],
      impact_baseline: null,
      grace_period: null,
      period: startPeriod
        ?.add(state.payment_period * bondDuration, "day")
        .format("DD-MM-YYYY"),
    },
  ];

  const formConfig = {
    bond_divider: {
      display: "divider",
      label: "Bond details",
    },
    bond_id: {
      label: "Ticker name",
      suffix: "Short bond ID, up to 16 characters",
      required: true,
      span: 12,
      default: randomTicker,
      rules: [
        {
          validator: async (rule, value) => {
            if (value?.length > BOND_TICKER_LIMIT) {
              throw new Error(`Must be less than ${BOND_TICKER_LIMIT} symbols`);
            }

            if (!/^[a-zA-Z0-9]*$/.test(value)) {
              throw new Error(`Should contain only letters and numbers`);
            }
          },
        },
      ],
    },
    mincap_deadline: {
      label: "Issuance date",
      suffix: "Scheduled date for bond issuance",
      required: true,
      display: "date",
      span: 12,
      default: DEFAULT_BOND_PARAMS.mincap_deadline,
    },
    bond_duration: {
      label: "Time to maturity, periods",
      suffix:
        "Time to maturity is measured in equal periods - the number of days after which the bond interest rate is recalculated",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      default: DEFAULT_BOND_PARAMS.bond_duration,
      rules: [
        {
          validator: async (rule, value) => {
            if (value < MIN_BOND_DURATION) {
              throw new Error(`Must be bigger or equal ${MIN_BOND_DURATION}`);
            }
          },
        },
      ],
    },
    payment_period: {
      label: "Days in period",
      suffix: "Number of days in a period",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      default: DEFAULT_BOND_PARAMS.payment_period,
      rules: [
        {
          validator: async (rule, value) => {
            if (value < MIN_PAYMENT_PERIOD) {
              throw new Error(`Must be bigger or equal ${MIN_PAYMENT_PERIOD}`);
            }
          },
        },
        {
          validator: async (rule, value) => {
            if (value > state.start_period) {
              throw new Error("Must be less or equal than grace period");
            }
          },
        },
      ],
    },
    bond_finishing_period: {
      label: "Face value payment period, days",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      default: DEFAULT_BOND_PARAMS.bond_finishing_period,
      suffix:
        "Time period in days after bond maturity when the Issuer should pay bond’s face value",
    },
    bond_units_mincap_amount: {
      label: "Minimum amount of bond sale, bond units",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      default: DEFAULT_BOND_PARAMS.bond_units_mincap_amount,
      suffix:
        "Minimum amount of bonds to be sold. Should be <= number of bonds in issue",
      rules: [
        {
          validator: async (rule, value) => {
            if (value <= 0) {
              throw new Error("Must be bigger than 0");
            }
          },
        },
        {
          validator: async (rule, value) => {
            if (value > state.bond_units_maxcap_amount) {
              throw new Error("Must be less than maxcap");
            }
          },
        },
      ],
    },
    bond_units_maxcap_amount: {
      label: "Number of bonds in issue, bond units",
      suffix: "Total number of bonds in issue",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      default: DEFAULT_BOND_PARAMS.bond_units_maxcap_amount,
      rules: [
        {
          validator: async (rule, value) => {
            if (value < state.bond_units_mincap_amount) {
              throw new Error("Must be bigger than mincap");
            }
          },
        },
        {
          validator: async (rule, value) => {
            if (toEverUSD(value * state.bond_units_base_price) > U64MAX) {
              throw new Error("Bond price * maxcap is too large");
            }
          },
        },
      ],
    },
    bond_units_base_price: {
      label: "Bond price, USD",
      suffix: "Price of one bond, USD",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      default: DEFAULT_BOND_PARAMS.bond_units_base_price,
      rules: [
        {
          validator: async (rule, value) => {
            if (value <= 0) {
              throw new Error("Must be bigger than 0");
            }
          },
        },
        {
          validator: async (rule, value) => {
            if (toEverUSD(value * state.bond_units_maxcap_amount) > U64MAX) {
              throw new Error("Bond price * maxcap is too large");
            }
          },
        },
      ],
    },
    chart: {
      display: "custom",
      component: !!bondDuration && (
        <div className={styles.chartContainer}>
          <span className={styles.tabLabel}>
            {state.bond_id},{" "}
            {`$${(
              state.bond_units_maxcap_amount * state.bond_units_base_price || 0
            ).toLocaleString("en-US")}`}
          </span>
          <LineChart
            width={800}
            height={400}
            data={chartData}
            margin={{
              top: 20,
              right: 0,
              bottom: 20,
              left: 40,
            }}>
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
              name="Grace period interest rate"
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
            <XAxis
              dataKey="period"
              label={{
                value: "Periods",
                offset: -10,
                position: "insideBottom",
              }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: "%", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: impactMeasure, angle: -90, position: "right" }}
            />
            <Tooltip />
          </LineChart>
        </div>
      ),
    },
    impact_divider: {
      display: "divider",
      label: "Interest rate details",
    },
    interest_rate_base_value: {
      label: "Basic interest rate, %",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      min: 0,
      max: 100,
      default: DEFAULT_BOND_PARAMS.interest_rate_base_value,
    },
    interest_pay_period: {
      label: "Interest payment period, days",
      suffix:
        "Time period in days when the Issuer should pay coupon for the previous period",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      default: DEFAULT_BOND_PARAMS.interest_pay_period,
      rules: [
        {
          validator: async (rule, value) => {
            if (value > state.payment_period) {
              throw new Error("Must be less than payment_period");
            }
          },
        },
      ],
    },
    floating_rate_divider: {
      display: "divider",
      label: "Floating rate details",
    },
    impact_data_type: {
      label: "Impact indicator for reporting",
      suffix: "Indicator for impact measurement and reporting",
      required: true,
      display: "select",
      span: 12,
      allowClear: false,
      showSearch: true,
      values: [
        { "Renewable energy generation (MWh)": "POWER_GENERATED" },
        { "CO2 reduction (MtCO2e)": "CO2_EMISSIONS_REDUCTION" },
      ],
      default: DEFAULT_BOND_PARAMS.impact_data_type,
    },
    interest_rate_margin_floor: {
      label: "Minimum interest rate, %",
      suffix: "Lower boundary of the interest rate corridor",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      min: 0,
      max: 100,
      default: DEFAULT_BOND_PARAMS.interest_rate_margin_floor,
    },
    interest_rate_margin_cap: {
      label: "Maximum interest rate, %",
      suffix: "Upper boundary of the interest rate corridor",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      min: 0,
      max: 100,
      default: DEFAULT_BOND_PARAMS.interest_rate_margin_cap,
    },
    impact_data_max_deviation_cap: {
      label: `Impact value leading to minimum interest rate${impactMeasureLabel}`,
      suffix: "The impact value which results in the minimum interest rate",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      default: DEFAULT_BOND_PARAMS.impact_data_max_deviation_cap,
      rules: [
        {
          validator: async (rule, value) => {
            if (value < state.impact_data_max_deviation_floor) {
              throw new Error("Must be bigger than max deviation floor");
            }
          },
        },
      ],
    },
    impact_data_max_deviation_floor: {
      label: `Impact value leading to maximum interest rate${impactMeasureLabel}`,
      suffix: "The impact value which results in the maximum interest rate",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      default: DEFAULT_BOND_PARAMS.impact_data_max_deviation_floor,
      rules: [
        {
          validator: async (rule, value) => {
            if (value > state.impact_data_max_deviation_cap) {
              throw new Error("Must be less than max deviation cap");
            }
          },
        },
      ],
    },
    impact_data_send_period: {
      label: "Time window to submit impact data, days",
      suffix:
        "Time period in days when impact data should be submitted by the issuer. Verified impact data is used to calculate the interest rate for the next period",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      default: DEFAULT_BOND_PARAMS.impact_data_send_period,
      rules: [
        {
          validator: async (rule, value) => {
            if (value > state.payment_period) {
              throw new Error("Must be less than payment_period");
            }
          },
        },
      ],
    },
    interest_rate_penalty_for_missed_report: {
      label: "Interest rate penalty, %",
      suffix: "Interest rate increase in case of missed report, %",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      min: 0,
      max: 100,
      default: DEFAULT_BOND_PARAMS.interest_rate_penalty_for_missed_report,
    },
    start_period: {
      label: "Grace period, days",
      suffix:
        "Number of days when a grace period interest rate is active. In case the grace period is selected, time to maturity is extended by the number of days in the grace period",
      required: true,
      type: "number",
      display: "text",
      span: 12,
      default: DEFAULT_BOND_PARAMS.start_period,
    },
    interest_rate_start_period_value: {
      label: "Grace period interest rate, %",
      suffix: "Interest rate for the grace period",
      required: true,
      type: "number",
      display: "text",
      min: 0,
      max: 100,
      span: 12,
      default: DEFAULT_BOND_PARAMS.interest_rate_start_period_value,
    },
    carbon_metadata: {
      display: "divider",
      label: "Carbon credits",
    },
    carbon_metadata_count: {
      label: "Count",
      type: "number",
      display: "text",
      min: 0,
    },
    carbon_metadata_distribution_investors: {
      label: "Distribution for investors, %",
      type: "number",
      disabled: !state.carbon_metadata_count,
      display: "text",
      min: 0,
      max: 100 - (state.carbon_metadata_distribution_issuer || 0),
      onChange: (form, percentage) => {
        form.setFieldsValue({
          carbon_metadata_distribution_issuer: 100 - percentage,
        });
      },
    },
    carbon_metadata_distribution_issuer: {
      label: "Distribution for issuer, %",
      type: "number",
      display: "text",
      disabled: !state.carbon_metadata_count,
      max: 100 - (state.carbon_metadata_distribution_investors || 0),
      min: 0,
      onChange: (form, percentage) => {
        form.setFieldsValue({
          carbon_metadata_distribution_investors: 100 - percentage,
        });
      },
    },
    impact_baseline_divider: {
      display: "divider",
      label: "Impact baseline",
    },
  };

  [...Array(bondDuration).keys()].forEach(item => {
    const label =
      item === 0
        ? "Grace period impact baseline"
        : `Impact baseline for period ${item}${impactMeasureLabel}`;

    formConfig[`impact_baseline_${item}`] = {
      label,
      required: true,
      type: "number",
      display: "text",
      step: 100,
      span: 12,
      default: DEFAULT_IMPACT_BASELINE,
      rules: [
        {
          validator: async (rule, value) => {
            if (value > state.impact_data_max_deviation_cap) {
              throw new Error("Must be less than max deviation cap");
            } else if (value < state.impact_data_max_deviation_floor) {
              throw new Error("Must be bigger than max deviation floor");
            }
          },
        },
      ],
    };
  });

  const onChange = value => updateState(value);

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

BondConfig.propTypes = {};

BondConfig.defaultProps = {};

export default BondConfig;
