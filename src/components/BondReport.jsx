import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Statistic,
  Divider,
  Tabs,
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

import usePolkadot from '../hooks/usePolkadot';

import TableList from './TableList';

import styles from './BondReport.module.less';

const { TabPane } = Tabs;

const BondCard = ({ bond }) => {
  const [impactData, setImpactData] = useState([]);
  const [packageLot, setPackageLot] = useState([]);
  const [packageRegistry, setPackageRegistry] = useState([]);

  const {
    bondImpactReport,
    bondUnitPackageLot,
    bondUnitPackageRegistry,
  } = usePolkadot();

  useEffect(
    () => {
      const getImpactData = async () => {
        const result = await bondImpactReport(bond.id);

        const data = result.map((item, index) => ({
          period: dayjs(bond.creation_date).add(index, 'year').format('YYYY'),
          value: item.impact_data,
        }));

        setImpactData(data);
      };

      getImpactData();
    },
    [bond, bondImpactReport],
  );

  useEffect(
    () => {
      const get = async () => {
        const data = await bondUnitPackageLot(bond.id);

        setPackageLot(data);
      };

      get();
    },
    [bond, bondUnitPackageLot],
  );

  useEffect(
    () => {
      const get = async () => {
        const data = await bondUnitPackageRegistry(bond.id);

        setPackageRegistry(data);
      };

      get();
    },
    [bond, bondUnitPackageRegistry],
  );

  const impactBaselineData = bond?.inner?.impact_data_baseline?.map((item, index) => ({
    period: dayjs(bond.creation_date).add(index, 'year').format('YYYY'),
    value: item,
  }));

  const packageRegistryColumns = [
    {
      title: 'Amount',
      dataIndex: 'bond_units',
      key: 'bond_units',
    },
    {
      title: 'Acquisition',
      dataIndex: 'acquisition',
      key: 'acquisition',
    },
    {
      title: 'Coupon yield',
      dataIndex: 'coupon_yield',
      key: 'coupon_yield',
    },
  ];

  const packageLotColumns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Units count',
      dataIndex: 'bond_units',
      key: 'bond_units',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (_, row) => dayjs(parseInt(row.deadline.replaceAll(',', ''), 10)).format('DD-MM-YYYY'),
    },
    {
      title: 'New bondholder',
      dataIndex: 'new_bondholder',
      key: 'new_bondholder',
    },
  ];

  return (
    <Tabs defaultActiveKey="general">
      <TabPane tab="General" key="general">
        <Row>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="years" title="Maturity" value={bond?.inner?.bond_duration} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="$" title="Unit Base Price" value={bond?.inner?.bond_units_base_price} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Issued amount" value={bond?.issued_amount} />
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Mincap amount" value={bond?.inner?.bond_units_mincap_amount} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Maxcap amount" value={bond?.inner?.bond_units_maxcap_amount} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Mincap deadline" value={dayjs(bond?.inner?.mincap_deadline).format('DD-MM-YYYY')} />
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Bond debit" value={bond?.bond_debit} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Coupon yield" value={bond?.coupon_yield} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Bond credit" value={bond?.bond_credit} />
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Lifecycle" key="lifecycle">
        <Row>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Creation start date" value={dayjs(bond?.creation_date).format('DD-MM-YYYY')} />
          </Col>
          {!!bond?.booking_start_date && (
            <Col span={8}>
              <Statistic className={styles.bondData} title="Booking start date" value={dayjs(bond?.booking_start_date).format('DD-MM-YYYY')} />
            </Col>
          )}
          {!!bond?.active_start_date && (
            <Col span={8}>
              <Statistic className={styles.bondData} title="Active start date" value={dayjs(bond?.active_start_date).format('DD-MM-YYYY')} />
            </Col>
          )}
        </Row>
      </TabPane>
      <TabPane tab="Interest" key="interest">
        <Row>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="%" title="Interest rate margin floor" value={(bond?.inner?.interest_rate_margin_floor || 0) / 1000} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="%" title="Interest" value={(bond?.inner?.interest_rate_base_value || 0) / 1000} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="%" title="Interest rate margin cap" value={(bond?.inner?.interest_rate_margin_cap || 0) / 1000} />
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Interest pay period" value={(bond?.inner?.interest_pay_period || 0)} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="%" title="Interest rate penalty for missed report" value={(bond?.inner?.interest_rate_penalty_for_missed_report || 0) / 1000} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} suffix="%" title="Interest rate start period value" value={(bond?.inner?.interest_rate_start_period_value || 0) / 1000} />
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Impact" key="impact">
        <Row>
          <Col span={24}>
            <Statistic className={styles.bondData} title="Impact data type" value={bond?.inner?.impact_data_type} />
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Impact data send period (days)" value={bond?.inner?.impact_data_send_period} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Impact data max deviation floor" value={bond?.inner?.impact_data_max_deviation_floor || 0} />
          </Col>
          <Col span={8}>
            <Statistic className={styles.bondData} title="Impact data max deviation cap" value={bond?.inner?.impact_data_max_deviation_cap || 0} />
          </Col>
        </Row>
        <Divider orientation="left">
          Impact baseline by period
        </Divider>
        <LineChart
          width={700}
          height={300}
          data={impactBaselineData}
          margin={{
            top: 26,
            right: 20,
            bottom: 5,
            left: 0,
          }}
        >
          <Line type="monotone" dataKey="value" />
          <CartesianGrid stroke="#DDD" strokeDasharray="7 7" />
          <XAxis dataKey="period" />
          <YAxis dataKey="value" />
          <Tooltip />
        </LineChart>
        <Divider orientation="left">
          Impact report by period
        </Divider>
        <LineChart
          width={700}
          height={300}
          data={impactData}
          margin={{
            top: 5,
            right: 20,
            bottom: 5,
            left: 0,
          }}
        >
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="period" />
          <YAxis dataKey="value" />
          <Tooltip />
        </LineChart>
      </TabPane>
      <TabPane tab="My bond units" key="my_units">
        <TableList
          pagination={false}
          className={styles.table}
          rowKey={(row) => row.id}
          columns={packageRegistryColumns}
          dataSource={packageRegistry}
          size="middle"
        />
      </TabPane>
      <TabPane tab="My bids" key="my_bids">
        <TableList
          pagination={false}
          className={styles.table}
          rowKey={(row) => row.id}
          columns={packageLotColumns}
          dataSource={packageLot}
          size="middle"
        />
      </TabPane>
    </Tabs>
  );
};

BondCard.propTypes = {
  bond: PropTypes.shape().isRequired,
};

BondCard.defaultProps = {
};

export default BondCard;
