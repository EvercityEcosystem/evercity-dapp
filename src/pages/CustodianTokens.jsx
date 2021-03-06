/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import SimpleForm from '../components/SimpleForm';

import usePolkadot from '../hooks/usePolkadot';

import styles from './CustodianTokens.module.less';

const CustodianTokens = ({ params }) => {
  const { actionType = 'confirm' } = params;
  const { t } = useTranslation();
  const { confirmEverusdRequest, declineEverusdRequest } = usePolkadot();

  const confirmFormConfig = {
    action: {
      label: t('Action'),
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
      label: t('Address'),
      required: true,
      type: 'string',
      span: 24,
    },
    amount: {
      label: t('Amount'),
      required: true,
      type: 'number',
      span: 24,
    },
  };

  const declineFormConfig = {
    action: {
      label: t('Action'),
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
      label: t('Address'),
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
        submitText={t('Submit')}
        className={styles.form}
        labelAlign="left"
        initialValues={{ action: null, address: null, amount: null }}
        {...layout}
      />
    </div>
  );
};

CustodianTokens.propTypes = {
  params: PropTypes.shape({
    actionType: PropTypes.string,
  }).isRequired,
};

CustodianTokens.defaultProps = {};

export default CustodianTokens;
