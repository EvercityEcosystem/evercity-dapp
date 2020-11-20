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

import styles from './Tokens.module.less';

const { Content, Sider } = Layout;

const Tokens = ({ params }) => {
  const { actionType = 'request' } = params;
  const { t } = useTranslation();
  const [transactionSending, setTransactionSending] = useState(false);
  const { address: currentUserAddress, role } = getCurrentUser();

  const requestFormConfig = {
    action: {
      label: t('Action'),
      required: true,
      display: 'select',
      span: 24,
      allowClear: false,
      showSearch: true,
      values: [
        { 'Request Mint EverUSD': 'tokenMintRequestCreateEverusd' },
        { 'Request Burn EverUSD': 'tokenBurnRequestCreateEverusd' },
      ],
    },
    amount: {
      label: t('Amount'),
      required: true,
      type: 'number',
      span: 24,
    },
  };

  const revokeFormConfig = {
    action: {
      label: t('Action'),
      required: true,
      display: 'select',
      span: 24,
      allowClear: false,
      showSearch: true,
      values: [
        { 'Revoke Mint EverUSD': 'tokenMintRequestRevokeEverusd' },
        { 'Revoke Burn EverUSD': 'tokenBurnRequestRevokeEverusd' },
      ],
    },
  };

  const handleSubmit = async (values) => {
    const { action, amount } = values;
    const args = actionType === 'request' ? [amount] : [];

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
      path: `/dapp/${role}/tokens/request`,
      title: t('Request'),
      active: actionType === 'request',
    },
    {
      path: `/dapp/${role}/tokens/revoke`,
      title: t('Revoke'),
      active: actionType === 'revoke',
    },
  ];

  return (
    <div>
      <Layout style={{ backgroundColor: '#fff', minHeight: 220 }}>
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
                config={actionType === 'request' ? requestFormConfig : revokeFormConfig}
                style={{ width: '100%' }}
                onSubmit={handleSubmit}
                submitText={t('Submit')}
                labelAlign="left"
                initialValues={{ action: null, amount: null }}
                {...layout}
              />
            </Loader>
          </div>
        </Content>
      </Layout>
    </div>
  );
};

Tokens.propTypes = {
  params: PropTypes.shape({
    actionType: PropTypes.string,
  }).isRequired,
};

Tokens.defaultProps = {};

export default Tokens;
