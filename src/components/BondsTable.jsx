import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Progress } from 'antd';
import { useTranslation } from 'react-i18next';

import { IMPACT_DATA_TYPES, BOND_STATE_COLORS } from '../utils/env';

import TableList from './TableList';
import BondActions from './BondActions';

import styles from './BondsTable.module.less';

const BondsTable = ({ dataSource, onRowClick }) => {
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
          <Tag color={BOND_STATE_COLORS[bond?.state]}>{bond?.state}</Tag>
        </div>
      ),
    },
    {
      title: t('Impact Data Dype'),
      key: 'bond_type',
      render: (_, record) => (
        <Tag color={IMPACT_DATA_TYPES[record?.inner?.impact_data_type]?.color}>
          {IMPACT_DATA_TYPES[record?.inner?.impact_data_type]?.title}
        </Tag>
      ),
    },
    {
      title: t('Bond Unit Price'),
      key: 'bond_type',
      render: (_, bond) => `$ ${bond?.inner?.bond_units_base_price}`,
    },
    {
      title: t('Issued Units'),
      key: 'issued',
      render: (_, bond) => {
        const percentage = Math.floor(
          ((bond?.issued_amount || 0) / (bond?.inner?.bond_units_maxcap_amount || 1)) * 100,
        );

        return <Progress percent={percentage} />;
      },
    },
    {
      title: t('Interest'),
      key: 'interest_rate_base_value',
      render: (_, bond) => `${bond?.inner?.interest_rate_base_value / 1000}%`,
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_, bond) => (
        <BondActions bond={bond} mode="table" />
      ),
    },
  ];

  const onClick = (record) => {
    if (onRowClick) {
      onRowClick(record);
    }
  };

  return (
    <div className={styles.container}>
      <TableList
        rowKey={(row) => row.id}
        columns={columns}
        dataSource={dataSource}
        size="middle"
        onRow={(record) => ({
          onClick: () => onClick(record),
        })}
      />
    </div>
  );
};

BondsTable.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.shape()),
  onRowClick: PropTypes.func,
};

BondsTable.defaultProps = {
  dataSource: [],
  onRowClick: null,
};

export default BondsTable;
