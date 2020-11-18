import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import useLocation from 'wouter/use-location';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

import SimpleForm from '../components/SimpleForm';

import useXState from '../hooks/useXState';

import { saveCurrentUser } from '../utils/cookies';
import { EXTENSION_URL, EXTENSION_NAME } from '../utils/env';

import styles from './Login.module.less';

const ExtensionProvider = props => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [state, updateState] = useXState({
    extension: null,
    accounts: null
  });

  const formConfig = {
    'address': {
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

  const checkExtension = useCallback(async () => {
    const allInjected = await web3Enable('Evercity Platform');
    if (allInjected.length) {
      const polkadotExtension = allInjected.find(ext => ext.name === EXTENSION_NAME);
      updateState({ extension: polkadotExtension });
    }

    const allAccounts = await web3Accounts();
    if (allAccounts.length) {
      updateState({ accounts: allAccounts });
    }
  }, [updateState]);

  const handleSubmit = values => {
    const { address } = values;

    // TODO get account registry here

    saveCurrentUser(address);
  }

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

  if (state?.extension) {
    let submitText = t('Refresh Accounts');
    let submitFunc = checkExtension;
    let config = {};

    if (state?.accounts?.length) {
      config = formConfig;
      submitFunc = handleSubmit;
      submitText = t('Next');
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

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {block}
      </div>
    </div>
  );
};

ExtensionProvider.propTypes = {
  params: PropTypes.shape({ action: PropTypes.string })
};

ExtensionProvider.defaultProps = {
  params: {}
};

export default ExtensionProvider;
