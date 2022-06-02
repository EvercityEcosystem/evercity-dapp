import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tag, Progress, Tooltip } from 'antd';
import { ClockCircleFilled } from '@ant-design/icons';

import { IMPACT_DATA_TYPES, BOND_STATES } from '../utils/env';
import { fromEverUSD } from '../utils/converters';
import { getCurrentUser } from '../utils/storage';
import {
  isTimeToPayMaturity,
  isTimeToPayInterest,
  isTimeToSendImpact,
  bondCurrentPeriod,
  currentPeriodName
} from '../utils/period';

import TableList from './TableList';
import BondActions from './BondActions';

import styles from './BondsTable.module.less';

const BondsTable = ({ dataSource, onClick }) => {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const { role } = getCurrentUser();

  let columns = [];

  if (role === 'issuer') {
    columns = [
      {
        render: (_, record) => {
          const periodNumber = bondCurrentPeriod(record);

          const [isImpactSendTime] = isTimeToSendImpact(record);
          const isPayInterestTime = isTimeToPayInterest(record);
          const isPayMaturityTime = isTimeToPayMaturity(record);
  
          return (
            <>
              {isImpactSendTime && (
                <Tooltip title={`Time to send impact for ${currentPeriodName(record, periodNumber)}`}>
                  <ClockCircleFilled style={{ margin: '0 1px', color: '#F5222D' }} />
                </Tooltip>
              )}
              {isPayMaturityTime && (
                <Tooltip title={'Time to pay maturity'}>
                  <ClockCircleFilled style={{ margin: '0 1px', color: '#FFE800' }} />
                </Tooltip>
              )}
              {isPayInterestTime && (
                <Tooltip title={`Time to pay interest for ${currentPeriodName(record, periodNumber - 1)}`}>
                  <ClockCircleFilled style={{ margin: '0 1px', color: '#FFC800' }} />
                </Tooltip>
              )}
            </>
          );
        }
      },
    ];
  }

  columns = [
    ...columns,
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'State',
      key: 'bond.state',
      render: (_, bond) => (
        <div className={styles.bondState}>
          <Tag color={BOND_STATES[bond?.state].color}>{BOND_STATES[bond?.state].title}</Tag>
        </div>
      ),
    },
    {
      title: 'Impact indicator',
      key: 'bond_type',
      render: (_, record) => (
        <Tag color={IMPACT_DATA_TYPES[record?.inner?.impact_data_type]?.color}>
          {IMPACT_DATA_TYPES[record?.inner?.impact_data_type]?.title}
        </Tag>
      ),
    },
    {
      title: 'Bond price',
      key: 'bond_type',
      render: (_, bond) => `$ ${fromEverUSD(bond?.inner?.bond_units_base_price)}`,
    },
    {
      title: 'Booked',
      key: 'issued',
      render: (_, bond) => {
        const percentage = Math.floor(
          ((bond?.issued_amount || 0) / (bond?.inner?.bond_units_maxcap_amount || 1)) * 100,
        );

        return (
          <Progress
            percent={percentage}
            status="active"
            strokeColor="#31CC79"
          />
        );
      },
    },
    {
      title: 'Interest',
      key: 'interest',
      render: (_, bond) => `${bond.currentInterestRate}%`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, bond) => (
        <BondActions onClick={() => onClick({ currentBond: bond })} bond={bond} mode="table" />
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <TableList
        rowKey={(row) => row.id}
        columns={columns}
        dataSource={dataSource}
        size="middle"
      />
    </div>
  );
};

BondsTable.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.shape()),
  onClick: PropTypes.func.isRequired,
};

BondsTable.defaultProps = {
  dataSource: [],
};

export default BondsTable;
