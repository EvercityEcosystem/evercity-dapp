import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Divider, message } from 'antd';
import { useTranslation } from 'react-i18next';

import SimpleForm from '../components/SimpleForm';
import { api, injector } from '../utils/polkadot';

import styles from './InvestorReport.module.less';
import Loader from '../components/Loader';

const InvestorReport = () => {
  const { t } = useTranslation();

  const formConfig = {
    
  };

  const handleSubmit = async values => {
    // const { action, role, address } = values;

    // if (!address) {
    //   message.error('Can\'t assign a role without connected Polkadot account');
    //   return;
    // }

    // const substrateRole = SUBSTRATE_ROLES.find(item => item.name === role);
    // const identity = Math.floor(Math.random() * 50);

    // try {
    //   await api
    //     .tx
    //     .evercity
    //     [action](address, substrateRole.mask, identity)
    //     .signAndSend(adminUserBlockchainId, { signer: injector.signer });
    // } catch (error) {
    //   console.error(error);
    //   message.error('Signing and sending transaction process failed');
    //   return false;
    // }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <Loader spinning={currentData.fetching}>
      <div className={styles.formContainer}>
        <Divider>InvestorReport</Divider>
        <SimpleForm
          config={formConfig}
          style={{ width: '100%' }}
          onSubmit={handleSubmit}
          labelAlign="left"
          {...layout}
        >
        </SimpleForm>
      </div>
    </Loader>
  );
};

InvestorReport.propTypes = {
};

InvestorReport.defaultProps = {};

export default InvestorReport;
