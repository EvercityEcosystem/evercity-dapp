/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import SimpleForm from '../components/SimpleForm';

import { SUBSTRATE_ROLES } from '../utils/roles';

import usePolkadot from '../hooks/usePolkadot';

import styles from './Roles.module.less';

const Roles = () => {
  const { createOrAssignRole } = usePolkadot();

  const formConfig = {
    action: {
      label: 'Action',
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
      label: 'Address',
      required: true,
      type: 'string',
      span: 24,
    },
    role: {
      label: 'Role',
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
    <div className={styles.container}>
      <SimpleForm
        config={formConfig}
        style={{ width: '100%' }}
        onSubmit={createOrAssignRole}
        submitText="Submit"
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
