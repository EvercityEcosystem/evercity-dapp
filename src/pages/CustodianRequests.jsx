/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';

import SimpleForm from '../components/SimpleForm';

import { api } from '../utils/polkadot';
import useXState from '../hooks/useXState';

import styles from './CustodianRequests.module.less';

const CustodianRequests = () => {
  const { t } = useTranslation();
  const [state, updateState] = useXState({ amount: '0', deadline: '0' });

  const formConfig = {
    action: {
      label: t('Action'),
      required: true,
      display: 'select',
      span: 24,
      allowClear: false,
      showSearch: true,
      values: [
        { 'Check Mint Request': 'mintRequestEverUSD' },
        { 'Check Burn Request': 'burnRequestEverUSD' },
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
    const { action, address } = values;

    const result = await api.query.evercity[action](address);
    const { amount, deadline } = result?.toHuman();

    updateState({ amount, deadline });
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <div className={styles.formContainer}>
      <Divider>Requests</Divider>
      <SimpleForm
        config={formConfig}
        style={{ width: '100%' }}
        onSubmit={handleSubmit}
        submitText={t('Submit')}
        labelAlign="left"
        {...layout}
      />
      <div className={styles.results}>
        <Statistic title={t('Amount')} value={state.amount} />
        <Statistic.Countdown
          title={t('Deadline')}
          value={parseInt(state?.deadline?.replaceAll(',', ''), 10)}
          format={state?.deadline === '0' ? '0' : 'DD HH:mm:ss'}
        />
      </div>
    </div>
  );
};

CustodianRequests.propTypes = {
};

CustodianRequests.defaultProps = {};

export default CustodianRequests;
