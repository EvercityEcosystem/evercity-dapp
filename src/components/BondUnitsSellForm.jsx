/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import SimpleForm from './SimpleForm';

import usePolkadot from '../hooks/usePolkadot';

import styles from './BondUnitsSellForm.module.less';

const BondUnitsSellForm = ({ bondID, maxSell }) => {
  const { bondUnitLotBid } = usePolkadot();

  const formConfig = {
    bondID: {
      label: 'Bond ID',
      required: true,
      disabled: true,
      default: bondID,
      span: 24,
    },
    deadline: {
      label: 'Deadline',
      display: 'date',
      required: true,
      span: 24,
      default: dayjs().add(7, 'days'),
    },
    new_bondholder: {
      label: 'New bondholder',
      required: false,
      span: 24,
    },
    unitsCount: {
      label: 'Number of bonds',
      required: true,
      type: 'number',
      max: maxSell,
      span: 24,
    },
    amount: {
      label: 'Total price for lot, $',
      required: true,
      type: 'number',
      span: 24,
    },
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <div className={styles.container}>
      <SimpleForm
        config={formConfig}
        onSubmit={bondUnitLotBid}
        submitText="Sell"
        initialValues={{
          amount: null,
          unitsCount: maxSell,
          bondholder: null,
          bondID,
        }}
        labelAlign="left"
        className={styles.form}
        {...layout}
      />
    </div>
  );
};

BondUnitsSellForm.propTypes = {
  bondID: PropTypes.string.isRequired,
  maxSell: PropTypes.number.isRequired,
};

BondUnitsSellForm.defaultProps = {};

export default BondUnitsSellForm;
