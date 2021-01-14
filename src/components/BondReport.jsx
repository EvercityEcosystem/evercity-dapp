import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Statistic,
  Divider,
  Tabs,
  Button,
} from 'antd';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import dayjs from 'dayjs';

import { DEFAULT_ADDRESS, IMPACT_DATA_TYPES } from '../utils/env';
import { toPercent, fromEverUSD, fromBondDays } from '../utils/converters';
import { getCurrentUser } from '../utils/storage';

import usePolkadot from '../hooks/usePolkadot';
import useXState from '../hooks/useXState';

import TableList from './TableList';
import BondUnitsSellForm from './BondUnitsSellForm';

import styles from './BondReport.module.less';

const { TabPane } = Tabs;

const BondReport = ({ bond }) => {
  const [state, updateState] = useXState({
    impactData: [],
    packageLot: [],
    packageRegistry: [],
    sellFormShown: false,
    maxSell: 0,
  });
  const { address: currentUserAddress, role } = getCurrentUser();

  const {
    bondImpactReport,
    bondUnitPackageLot,
    bondUnitPackageRegistry,
    bondUnitLotSettle,
  } = usePolkadot();

  useEffect(
    () => {
      const getImpactData = async () => {
        const result = await bondImpactReport(bond.id);

        const impactData = result.map((item, index) => ({
          period: dayjs(bond.creation_date).add(index, 'year').format('YYYY'),
          impactData: item.impact_data,
        }));

        updateState({ impactData });
      };

      getImpactData();
    },
    [bond, bondImpactReport, updateState],
  );

  useEffect(
    () => {
      const get = async () => {
        const packageLot = await bondUnitPackageLot(bond.id);

        updateState({ packageLot });
      };

      get();
    },
    [bond.id, bondUnitPackageLot, updateState],
  );

  useEffect(
    () => {
      const get = async () => {
        const packageRegistry = await bondUnitPackageRegistry(bond.id);

        updateState({ packageRegistry });
      };

      get();
    },
    [bond, bondUnitPackageRegistry, updateState],
  );

  const impactMeasure = IMPACT_DATA_TYPES[bond.inner.impact_data_type].measure;
  const impactBaselineData = bond.inner.impact_data_baseline.map((item, index) => ({
    period: dayjs(bond.creation_date).add(index, 'year').format('YYYY'),
    value: item,
  }));


  const packageRegistryColumns = [
    {
      title: 'Number of bonds',
      dataIndex: 'bond_units',
      key: 'bond_units',
    },
    {
      title: 'Coupon yield',
      dataIndex: 'coupon_yield',
      key: 'coupon_yield',
    },
    {
      title: '',
      key: 'actions',
      render: (_, row) => (
        !!currentUserAddress && (
          <Button
            size="small"
            type="primary"
            onClick={() => updateState({
              sellFormShown: true,
              maxSell: row.bond_units,
            })}
          >
            Sell
          </Button>
        )
      ),
    },
  ];

  const packageLotColumns = [
    {
      title: 'Bondholder',
      dataIndex: 'bondholder',
      key: 'bondholder',
    },
    {
      title: 'Number of bonds',
      dataIndex: 'bond_units',
      key: 'bond_units',
    },
    {
      title: 'Total price',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (_, row) => dayjs(row.deadline).format('DD-MM-YYYY HH:mm'),
    },
    {
      title: '',
      key: 'actions',
      render: (_, row) => (
        [DEFAULT_ADDRESS, currentUserAddress].includes(row.new_bondholder)
          && currentUserAddress !== row.bondholder
          && role === 'investor'
          && (
            <Button
              size="small"
              type="primary"
              onClick={() => bondUnitLotSettle(row)}
            >
              Buy
            </Button>
          )
      ),
    },
  ];

  return (
    <Tabs defaultActiveKey="general">
      <TabPane tab="General" key="general">
        <Row>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="years" title="Time to maturity" value={bond.inner.bond_duration} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="$" title="Bond price" value={fromEverUSD(bond.inner.bond_units_base_price)} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Number of bonds purchased" value={bond.issued_amount} />
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Minimum amount of bond sale" value={bond.inner.bond_units_mincap_amount} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Number of bonds in issue" value={bond.inner.bond_units_maxcap_amount} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Issuance date" value={dayjs(bond.inner.mincap_deadline).format('DD-MM-YYYY')} />
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Lifecycle" key="lifecycle">
        <Row>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Bond created" value={dayjs(bond.creation_date).format('DD-MM-YYYY')} />
          </Col>
          {!!bond.booking_start_date && (
            <Col span={8}>
              <Statistic className={styles.bondData} title="Booking opened" value={dayjs(bond.booking_start_date).format('DD-MM-YYYY')} />
            </Col>
          )}
          {!!bond.active_start_date && (
            <Col span={8}>
              <Statistic className={styles.bondData} title="Bond issued" value={dayjs(bond.active_start_date).format('DD-MM-YYYY')} />
            </Col>
          )}
        </Row>
      </TabPane>
      <TabPane tab="Interest" key="interest">
        <Row>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="%" title="Minimum interest rate" value={toPercent(bond.inner.interest_rate_margin_floor)} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="%" title="Basic interest rate" value={toPercent(bond.inner.interest_rate_base_value)} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="%" title="Maximum interest rate" value={toPercent(bond.inner.interest_rate_margin_cap)} />
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="days" title="Interest rate payment period" value={fromBondDays(bond.inner.interest_pay_period || 0)} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="%" title="Interest rate penalty" value={toPercent(bond.inner.interest_rate_penalty_for_missed_report)} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="%" title="Grace period interest rate" value={toPercent(bond.inner.interest_rate_start_period_value)} />
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Impact" key="impact">
        <Row>
          <Col span={24}>
            <Statistic className={styles.bondData} title="Impact indicator for reporting" value={IMPACT_DATA_TYPES[bond.inner.impact_data_type].title} />
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="days" title="Time window to submit impact data" value={fromBondDays(bond.inner.impact_data_send_period)} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Impact value leading to maximum interest rate" value={bond.inner.impact_data_max_deviation_floor || 0} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Impact value leading to minimum interest rate" value={bond.inner.impact_data_max_deviation_cap || 0} />
          </Col>
        </Row>
        <Divider orientation="left">
          Impact baseline by period
        </Divider>
        <div className={styles.chartContainer}>
          <LineChart
            width={700}
            height={300}
            data={impactBaselineData}
            margin={{
              top: 26,
              bottom: 15,
              right: 60,
            }}
          >
            <Line
              type="monotone"
              strokeWidth={2}
              name="Impact baseline"
              dataKey="value"
              dot={false}
            />
            <CartesianGrid stroke="#DDD" strokeDasharray="7 7" />
            <XAxis dataKey="period" label={{ value: 'Periods', offset: -10, position: 'insideBottom' }} />
            <YAxis dataKey="value" label={{ value: impactMeasure, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
          </LineChart>
        </div>
        {['ACTIVE', 'FINISHED'].includes(bond.state) && (
          <div className={styles.chartContainer}>
            <Divider orientation="left">
              Impact report by period
            </Divider>
            <LineChart
              width={700}
              height={300}
              data={state.impactData}
              margin={{
                top: 5,
                right: 60,
                bottom: 15,
              }}
            >
              <Line
                strokeWidth={2}
                name="Impact report"
                type="monotone"
                dataKey="impactData"
                dot={false}
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="period" label={{ value: 'Periods', offset: -10, position: 'insideBottom' }} />
              <YAxis dataKey="impactData" label={{ value: impactMeasure, angle: -90, position: 'insideLeft' }} />
              <Tooltip />
            </LineChart>
          </div>
        )}
      </TabPane>
      <TabPane tab="All bids" key="my_bids">
        <TableList
          pagination={false}
          className={styles.table}
          columns={packageLotColumns}
          dataSource={state.packageLot}
          size="middle"
        />
      </TabPane>
      {!!currentUserAddress && (
        <TabPane tab="My bond units" key="my_units">
          <Row>
            <TableList
              pagination={false}
              className={styles.table}
              rowKey={(row) => row.id}
              columns={packageRegistryColumns}
              dataSource={state.packageRegistry}
              size="middle"
            />
          </Row>
          <Row style={{ marginTop: 20 }}>
            {state.sellFormShown && (
              <BondUnitsSellForm bondID={bond.id} maxSell={state.maxSell} />
            )}
          </Row>
        </TabPane>
      )}
    </Tabs>
  );
};

BondReport.propTypes = {
  bond: PropTypes.shape().isRequired,
};

BondReport.defaultProps = {
};

export default BondReport;
