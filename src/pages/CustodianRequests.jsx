/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { message, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';

import SimpleForm from '../components/SimpleForm';

import useXState from '../hooks/useXState';
import usePolkadot from '../hooks/usePolkadot';

import styles from './CustodianRequests.module.less';

const CustodianRequests = () => {
  const { t } = useTranslation();
  const [state, updateState] = useXState({
    amount: '0',
    deadline: '0',
    show: false,
  });
  const { checkMintRequest, checkBurnRequest } = usePolkadot();

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
    const { amount, deadline } = action === 'mintRequestEverUSD' ? await checkMintRequest(address) : await checkBurnRequest(address);

    if (amount === '0' && deadline === '0') {
      message.warning('No requests from this address');
      updateState({ show: false });
    } else {
      updateState({ amount, deadline, show: true });
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <div className={styles.container}>
      {state.show && (
        <div className={styles.results}>
          <Statistic title={t('Amount')} value={state.amount} />
          <Statistic.Countdown
            title={t('Deadline')}
            value={parseInt(state?.deadline?.replaceAll(',', ''), 10)}
            format={state?.deadline === '0' ? '0' : 'DD HH:mm:ss'}
          />
        </div>
      )}
      <SimpleForm
        config={formConfig}
        onSubmit={handleSubmit}
        submitText={t('Submit')}
        className={styles.form}
        labelAlign="left"
        {...layout}
      />
    </div>
  );
};

CustodianRequests.propTypes = {
};

CustodianRequests.defaultProps = {};

export default CustodianRequests;
