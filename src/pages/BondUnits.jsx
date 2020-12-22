/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import SimpleForm from '../components/SimpleForm';

import usePolkadot from '../hooks/usePolkadot';

import styles from './BondUnits.module.less';

const BondUnits = ({ params }) => {
  const { t } = useTranslation();
  const { bondUnitLotBid, bondUnitLotSettle } = usePolkadot();
  const { action } = params;

  const formConfig = {
    bondID: {
      label: t('Bond ID'),
      required: true,
      span: 24,
    },
    deadline: {
      label: t('Deadline'),
      required: true,
      span: 24,
      default: Math.round(dayjs().add(7, 'days') / 1000) * 1000,
      suffix: '7 days by default',
    },
    bondholder: {
      label: action === 'bid' ? t('New bondholder') : t('Bondholder'),
      required: action === 'settle',
      span: 24,
    },
    unitsCount: {
      label: t('Units count'),
      required: true,
      type: 'number',
      span: 24,
    },
    amount: {
      label: t('Amount'),
      required: true,
      type: 'number',
      span: 24,
    },
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const bondUnitAction = action === 'bid' ? bondUnitLotBid : bondUnitLotSettle;

  return (
    <div className={styles.container}>
      <SimpleForm
        config={formConfig}
        onSubmit={bondUnitAction}
        submitText={t(`Units ${action}`)}
        initialValues={{
          amount: null,
          unitsCount: null,
          bondholder: null,
          bondID: null,
        }}
        labelAlign="left"
        className={styles.form}
        {...layout}
      />
    </div>
  );
};

BondUnits.propTypes = {
  params: PropTypes.shape({ action: PropTypes.string.isRequired }).isRequired,
};

BondUnits.defaultProps = {};

export default BondUnits;
