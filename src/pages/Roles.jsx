/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Divider, message } from 'antd';
import { useTranslation } from 'react-i18next';

import SimpleForm from '../components/SimpleForm';
import Loader from '../components/Loader';

import { SUBSTRATE_ROLES } from '../utils/roles';
import { getCurrentUser } from '../utils/cookies';
import { api, injector } from '../utils/polkadot';

import styles from './Roles.module.less';

const Roles = () => {
  const { t } = useTranslation();
  const [transactionSending, setTransactionSending] = useState(false);

  const formConfig = {
    action: {
      label: t('Action'),
      required: true,
      display: 'select',
      span: 24,
      allowClear: false,
      showSearch: true,
      values: [
        { 'Add new account': 'accountAddWithRoleAndData' },
        { 'Change role for existing account': 'accountSetWithRoleAndData' }
      ],
    },
    address: {
      label: t('Address'),
      required: true,
      type: 'string',
      span: 24,
    },
    role: {
      label: t('Role'),
      required: true,
      display: 'select',
      span: 24,
      allowClear: false,
      showSearch: true,
      values: Object.entries(SUBSTRATE_ROLES).map(([key, value]) => ({ [value]: key })),
    },
  };

  const handleSubmit = async (values) => {
    const { address: currentUserAddress } = getCurrentUser();
    const { action, role, address } = values;
    const identity = Math.floor(Math.random() * 50);

    try {
      setTransactionSending(true);
      await api
        .tx
        .evercity[action](address, role, identity)
        .signAndSend(currentUserAddress, { signer: injector.signer }, ({ status, events }) => {
          setTransactionSending(false);

          if (status.isFinalized) {
            message.success('Block was finalized successfully');
            // setTransactionSending(false);
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

  return (
    <div className={styles.formContainer}>
      <Divider>Accounts</Divider>
      <Loader spinning={transactionSending}>
        <SimpleForm
          config={formConfig}
          style={{ width: '100%' }}
          onSubmit={handleSubmit}
          submitText={t('Submit')}
          labelAlign="left"
          {...layout}
        />
      </Loader>
    </div>
  );
};

Roles.propTypes = {
};

Roles.defaultProps = {};

export default Roles;
