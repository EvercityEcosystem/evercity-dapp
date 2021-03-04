import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Progress } from 'antd';
import { useTranslation } from 'react-i18next';

import { IMPACT_DATA_TYPES, BOND_STATES } from '../utils/env';
import { toPercent, fromEverUSD } from '../utils/converters';

import TableList from './TableList';
import BondActions from './BondActions';

import styles from './BondsTable.module.less';

const BondsTable = ({ dataSource, onClick }) => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('State'),
      key: 'bond.state',
      render: (_, bond) => (
        <div className={styles.bondState}>
          <Tag color={BOND_STATES[bond?.state].color}>{BOND_STATES[bond?.state].title}</Tag>
        </div>
      ),
    },
    {
      title: t('Impact indicator'),
      key: 'bond_type',
      render: (_, record) => (
        <Tag color={IMPACT_DATA_TYPES[record?.inner?.impact_data_type]?.color}>
          {IMPACT_DATA_TYPES[record?.inner?.impact_data_type]?.title}
        </Tag>
      ),
    },
    {
      title: t('Bond price'),
      key: 'bond_type',
      render: (_, bond) => `$ ${fromEverUSD(bond?.inner?.bond_units_base_price)}`,
    },
    {
      title: t('Booked'),
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
      title: t('Interest'),
      key: 'interest',
      render: (_, bond) => `${bond.currentInterestRate}%`,
    },
    {
      title: t('Actions'),
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
