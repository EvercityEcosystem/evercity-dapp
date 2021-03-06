/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

import SimpleForm from '../components/SimpleForm';

import usePolkadot from '../hooks/usePolkadot';

import styles from './Tokens.module.less';

const Tokens = ({ params }) => {
  const { action } = params;
  const { t } = useTranslation();
  const {
    requestMintTokens,
    revokeMintTokens,
    requestBurnTokens,
    revokeBurnTokens,
  } = usePolkadot();

  const formConfig = {
    amount: {
      label: t('Amount'),
      required: true,
      type: 'number',
      span: 24,
    },
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const requestAction = action === 'mint' ? requestMintTokens : requestBurnTokens;
  const revokeAction = action === 'mint' ? revokeMintTokens : revokeBurnTokens;

  return (
    <div className={styles.container}>
      <SimpleForm
        config={formConfig}
        onSubmit={requestAction}
        submitText={t(`Request ${action}`)}
        labelAlign="left"
        className={styles.form}
        initialValues={{ amount: null }}
        {...layout}
      />
      <Button className={styles.revokeButton} onClick={revokeAction}>
        {t(`Revoke ${action}`)}
      </Button>
    </div>
  );
};

Tokens.propTypes = {
  params: PropTypes.shape({ action: PropTypes.string.isRequired }).isRequired,
};

Tokens.defaultProps = {};

export default Tokens;
