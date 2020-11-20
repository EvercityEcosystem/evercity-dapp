import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import useLocation from 'wouter/use-location';
import { web3Accounts } from '@polkadot/extension-dapp';

import SimpleForm from '../components/SimpleForm';
import Loader from '../components/Loader';

import useXState from '../hooks/useXState';

import { saveCurrentUser } from '../utils/cookies';
import { EXTENSION_URL } from '../utils/env';
import { accountRegistry, injector } from '../utils/polkadot';

import styles from './Login.module.less';

const Login = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [state, updateState] = useXState({
    accounts: [],
    roles: [],
    address: null
  });

  const accountsFormConfig = {
    address: {
      label: t('Choose polkadot account'),
      required: true,
      display: 'select',
      span: 24,
      allowClear: false,
      showSearch: true,
      values: state?.accounts?.map(acc => ({
        [`${acc.meta.name} ${acc.address}`]: acc.address
      }))
    },
  };

  const rolesFormConfig = {
    role: {
      label: t('Choose role'),
      required: true,
      display: 'select',
      span: 24,
      allowClear: false,
      showSearch: true,
      values: state?.roles?.map(role => ({
        [role]: role
      }))
    },
  };

  const checkExtension = useCallback(async () => {
    const allAccounts = await web3Accounts();
    if (allAccounts.length) {
      updateState({ accounts: allAccounts });
    }
  }, [updateState]);

  const handleAccountSubmit = async (values) => {
    const { address } = values;
    const { roles } = await accountRegistry(address);

    if (roles.length === 1) {
      saveCurrentUser(address, roles[0]);
      setLocation('/dapp/profile');
      return null;
    }

    updateState({ roles, address });
  };

  const handleRoleSubmit = async (values) => {
    const { role } = values;
    const { address } = state;

    saveCurrentUser(address, role);
    setLocation('/dapp/profile');
  };

  useEffect(() => {
    checkExtension();
  }, [checkExtension]);

  let block = (
    <div className={styles.formFooter}>
      <Button onClick={() => window.location.reload()} type="primary" block size="large">
        {t('Reload Page to Apply the Extension')}
      </Button>
      <a href={EXTENSION_URL} target="_blank" style={{ width: '100%' }}>
        <Button type="default" block size="large">
          {t('Install Extension')}
        </Button>
      </a>
    </div>
  );

  if (injector) {
    let submitText = t('Refresh Accounts');
    let submitFunc = checkExtension;
    let config = {};

    if (state?.accounts?.length) {
      config = accountsFormConfig;
      submitFunc = handleAccountSubmit;
      submitText = t('Login');
    }

    if (state?.roles?.length) {
      config = rolesFormConfig;
      submitFunc = handleRoleSubmit;
      submitText = t('Select Role');
    }

    block = (
      <SimpleForm
        config={config}
        onSubmit={submitFunc}
        submitText={submitText}
        style={{ width: '100%' }}
        labelAlign="left"
      />
    );
  }

  const injectorDetection = typeof (injector) === 'undefined';
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <Loader spinning={injectorDetection}>
          {block}
        </Loader>
      </div>
    </div>
  );
};

Login.propTypes = {

};

Login.defaultProps = {

};

export default Login;
