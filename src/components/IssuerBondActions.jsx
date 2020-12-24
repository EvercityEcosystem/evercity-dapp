import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dropdown,
  Menu,
} from 'antd';
import cx from 'classnames';
import { DownOutlined } from '@ant-design/icons';

import ModalView from './ModalView';
import SimpleForm from './SimpleForm';

import useXState from '../hooks/useXState';
import usePolkadot from '../hooks/usePolkadot';

import styles from './BondActions.module.less';

const IssuerBondActions = ({ bond, mode }) => {
  const [state, updateState] = useXState({
    visibleImpactModal: false,
    visibleDepositModal: false,
  });
  const { bondImpactReportSend, bondDepositEverusd } = usePolkadot();

  const depositFormConfig = {
    amount: {
      label: 'Amount',
      required: true,
      type: 'number',
      display: 'text',
      span: 24,
      default: 0,
    },
  };

  const impactFormConfig = {
    period: {
      label: 'Period',
      required: true,
      type: 'number',
      display: 'text',
      span: 24,
      default: 0,
    },
    impactValue: {
      label: 'Impact value',
      required: true,
      type: 'number',
      display: 'text',
      span: 24,
      default: 0,
    },
  };

  const sendImpactData = async ({ period, impactData }) => {
    await bondImpactReportSend(bond.id, period, impactData);
    updateState({ visibleImpactModal: false });
  };

  const deposit = async ({ amount }) => {
    await bondDepositEverusd(bond.id, amount);
    updateState({ visibleDepositModal: false });
  };

  return (
    <>
      <ModalView
        visible={state.visibleDepositModal}
        onCancel={() => updateState({ visibleDepositModal: false })}
        width={400}
        title="Bond deposit"
        content={(
          <SimpleForm
            style={{ width: '100%' }}
            config={depositFormConfig}
            layout="vertical"
            submitText="Send"
            onSubmit={deposit}
          />
        )}
      />
      <ModalView
        visible={state.visibleImpactModal}
        onCancel={() => updateState({ visibleImpactModal: false })}
        width={400}
        title="Send impact data"
        content={(
          <SimpleForm
            style={{ width: '100%' }}
            config={impactFormConfig}
            layout="vertical"
            submitText="Send"
            onSubmit={sendImpactData}
          />
        )}
      />
      {['BOOKING', 'ACTIVE'].includes(bond?.state) && (
        <Dropdown
          overlay={(
            <Menu>
              <Menu.Item key="1" onClick={() => updateState({ visibleDepositModal: true })}>
                Deposit
              </Menu.Item>
              <Menu.Item key="2" onClick={() => updateState({ visibleImpactModal: true })}>
                Send impact data
              </Menu.Item>
            </Menu>
          )}
        >
          <Button
            className={cx(styles.button, { [styles.tableButton]: mode === 'table' })}
            size={mode === 'table' ? 'small' : 'middle'}
          >
            Actions
            <DownOutlined />
          </Button>
        </Dropdown>
      )}
    </>
  );
};

IssuerBondActions.propTypes = {
  bond: PropTypes.shape().isRequired,
  mode: PropTypes.string,
};

IssuerBondActions.defaultProps = {
  mode: 'card',
};

export default IssuerBondActions;
