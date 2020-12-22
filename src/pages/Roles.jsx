/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'antd';
import { useTranslation } from 'react-i18next';

import SimpleForm from '../components/SimpleForm';

import { SUBSTRATE_ROLES } from '../utils/roles';

import usePolkadot from '../hooks/usePolkadot';

import styles from './Roles.module.less';

const Roles = () => {
  const { t } = useTranslation();
  const { createOrAssignRole } = usePolkadot();

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
        { 'Change role for existing account': 'accountSetWithRoleAndData' },
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

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <div className={styles.formContainer}>
      <Divider>Accounts</Divider>
      <SimpleForm
        config={formConfig}
        style={{ width: '100%' }}
        onSubmit={createOrAssignRole}
        submitText={t('Submit')}
        labelAlign="left"
        {...layout}
      />
    </div>
  );
};

Roles.propTypes = {
};

Roles.defaultProps = {};

export default Roles;
