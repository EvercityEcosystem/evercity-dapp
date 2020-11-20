/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Divider, message, Layout } from 'antd';
import { useTranslation } from 'react-i18next';

import SimpleForm from '../components/SimpleForm';
import Loader from '../components/Loader';
import MenuView from '../components/MenuView';

import { getCurrentUser } from '../utils/cookies';
import { api, injector } from '../utils/polkadot';

import styles from './CustodianTokens.module.less';

const { Content, Sider } = Layout;

const CustodianTokens = ({ params }) => {
  const { actionType = 'confirm' } = params;
  const { t } = useTranslation();
  const [transactionSending, setTransactionSending] = useState(false);
  const { address: currentUserAddress, role } = getCurrentUser();

  const confirmFormConfig = {
    action: {
      label: t('Action'),
      required: true,
      display: 'select',
      span: 24,
      allowClear: false,
      showSearch: true,
      values: [
        { 'Confirm Mint EverUSD': 'tokenMintRequestConfirmEverusd' },
        { 'Confirm Burn EverUSD': 'tokenBurnRequestConfirmEverusd' },
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
        { 'Decline Mint EverUSD': 'tokenMintRequestDeclineEverusd' },
        { 'Decline Burn EverUSD': 'tokenBurnRequestDeclineEverusd' },
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
    const args = actionType === 'confirm' ? [address, amount] : [address];

    try {
      setTransactionSending(true);
      await api
        .tx
        .evercity[action](...args)
        .signAndSend(currentUserAddress, { signer: injector.signer }, ({ status, events }) => {
          if (status.isInBlock) {
            message.success('Transaction in block');
          }

          if (status.isFinalized) {
            message.success('Block finalized');
            setTransactionSending(false);
          }
        });
    } catch (error) {
      setTransactionSending(false);
      console.error(error);
      message.error('Signing and sending transaction process failed');
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const siderNodes = [
    {
      path: `/dapp/${role}/tokens/confirm`,
      title: t('Confirm'),
      active: actionType === 'confirm',
    },
    {
      path: `/dapp/${role}/tokens/decline`,
      title: t('Decline'),
      active: actionType === 'decline',
    },
  ];

  return (
    <div>
      <Layout style={{ backgroundColor: '#fff', minHeight: 300 }}>
        <Sider theme="light">
          <MenuView
            theme="light"
            mode="vertical"
            nodes={siderNodes}
          />
        </Sider>
        <Content>
          <div className={styles.formContainer}>
            <Divider>Tokens</Divider>
            <Loader spinning={transactionSending}>
              <SimpleForm
                config={actionType === 'confirm' ? confirmFormConfig : declineFormConfig}
                style={{ width: '100%' }}
                onSubmit={handleSubmit}
                submitText={t('Submit')}
                labelAlign="left"
                initialValues={{ action: null, address: null, amount: null }}
                {...layout}
              />
            </Loader>
          </div>
        </Content>
      </Layout>
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
