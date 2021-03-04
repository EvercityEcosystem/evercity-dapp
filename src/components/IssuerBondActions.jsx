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

import stopPropagation from '../utils/bubbling';

import styles from './BondActions.module.less';

const IssuerBondActions = ({ bond, mode }) => {
  const [state, updateState] = useXState({
    visibleImpactModal: false,
    visibleDepositModal: false,
  });
  const {
    bondImpactReportSend,
    bondDepositEverusd,
    bondAccrueCouponYield,
    redeemBond
  } = usePolkadot();

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

  if (!['ACTIVE', 'FINISHED'].includes(bond.state)) {
    return null;
  }

  return (
    <>
      <ModalView
        visible={state.visibleDepositModal}
        onCancel={(e) => stopPropagation(e, () => updateState({ visibleDepositModal: false }))}
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
        onCancel={(e) => stopPropagation(e, () => updateState({ visibleImpactModal: false }))}
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
      <Dropdown
        overlay={(
          <Menu>
            <Menu.Item key="deposit" onClick={(e) => stopPropagation(e, () => updateState({ visibleDepositModal: true }))}>
              Deposit
            </Menu.Item>
            {bond.state === 'ACTIVE' && [
              <Menu.Item key="accrue" onClick={(e) => stopPropagation(e, () => bondAccrueCouponYield(bond.id))}>
                Calculate interest
              </Menu.Item>,
              <Menu.Item key="redeem" onClick={(e) => stopPropagation(e, () => redeemBond(bond.id))}>
                Redeem
              </Menu.Item>,
              <Menu.Item key="impact" onClick={(e) => stopPropagation(e, () => updateState({ visibleImpactModal: true }))}>
                Send impact data
              </Menu.Item>
            ]}
          </Menu>
        )}
      >
        <Button
          size={mode === 'table' ? 'small' : 'middle'}
          onClick={(e) => stopPropagation(e)}
          type="primary"
          className={cx(styles.button, { [styles.tableButton]: mode === 'table' })}
        >
          Actions
          <DownOutlined />
        </Button>
      </Dropdown>
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
