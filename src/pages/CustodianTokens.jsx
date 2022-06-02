/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React from 'react';

import SimpleForm from '../components/SimpleForm';

import usePolkadot from '../hooks/usePolkadot';

import styles from './CustodianTokens.module.less';
import { useParams } from "react-router-dom";

const CustodianTokens = () => {
  const params = useParams();
  const { actionType = 'confirm' } = params;
  const { confirmEverusdRequest, declineEverusdRequest } = usePolkadot();

  const confirmFormConfig = {
    action: {
      label: 'Action',
      required: true,
      display: 'select',
      span: 24,
      allowClear: false,
      showSearch: true,
      values: [
        { 'Confirm Mint EverUSD': 'Mint' },
        { 'Confirm Burn EverUSD': 'Burn' },
      ],
    },
    address: {
      label: 'Address',
      required: true,
      type: 'string',
      span: 24,
    },
    amount: {
      label: 'Amount',
      required: true,
      type: 'number',
      span: 24,
    },
  };

  const declineFormConfig = {
    action: {
      label: 'Action',
      required: true,
      display: 'select',
      span: 24,
      allowClear: false,
      showSearch: true,
      values: [
        { 'Decline Mint EverUSD': 'Mint' },
        { 'Decline Burn EverUSD': 'Burn' },
      ],
    },
    address: {
      label: 'Address',
      required: true,
      type: 'string',
      span: 24,
    },
  };

  const handleSubmit = async (values) => {
    const { action, amount, address } = values;

    if (actionType === 'confirm') {
      confirmEverusdRequest(action, amount, address);
    } else {
      declineEverusdRequest(action, address);
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <div className={styles.container}>
      <SimpleForm
        config={actionType === 'confirm' ? confirmFormConfig : declineFormConfig}
        onSubmit={handleSubmit}
        submitText="Submit"
        className={styles.form}
        labelAlign="left"
        initialValues={{ action: null, address: null, amount: null }}
        {...layout}
      />
    </div>
  );
};

CustodianTokens.defaultProps = {};

export default CustodianTokens;
