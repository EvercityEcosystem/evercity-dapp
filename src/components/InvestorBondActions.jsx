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
import useDocuments from '../hooks/useDocuments';

import stopPropagation from '../utils/bubbling';

import styles from './BondActions.module.less';

const InvestorBondActions = ({ bond, mode }) => {
  const [state, updateState] = useXState({
    visibleInvestModal: false,
    visibleCheckModal: false,
    filehash: null,
  });

  const {
    bondUnitPackageBuy,
    bondWithdrawEverusd
  } = usePolkadot();

  const { checkDocumentsFormConfig } = useDocuments({ state, updateState, bond });

  const buyFormConfig = {
    amount: {
      label: 'Amount',
      required: true,
      type: 'number',
      display: 'text',
      span: 24,
      default: 0,
    },
  };

  return (
    <>
      <ModalView
        visible={state.visibleInvestModal}
        onCancel={(e) => stopPropagation(e, () => updateState({ visibleInvestModal: false }))}
        width={400}
        title="Buy Bond Units"
        content={(
          <SimpleForm
            style={{ width: '100%' }}
            config={buyFormConfig}
            layout="vertical"
            onSubmit={async ({ amount }) => {
              await bondUnitPackageBuy(bond.id, amount);
              updateState({ visibleInvestModal: false });
            }}
            submitText="Buy"
          />
        )}
      />
      <ModalView
        visible={state.visibleCheckModal}
        onCancel={(e) => stopPropagation(e, () => updateState({ visibleCheckModal: false }))}
        width={400}
        title="Check documents"
        content={(
          <SimpleForm
            style={{ width: '100%' }}
            config={checkDocumentsFormConfig}
          />
        )}
      />
      {['BOOKING', 'ACTIVE', 'FINISHED'].includes(bond?.state) && (
        <Dropdown
          overlay={(
            <Menu>
              {['ACTIVE', 'BOOKING'].includes(bond.state) && (
                <Menu.Item key="invest" onClick={(e) => stopPropagation(e, () => updateState({ visibleInvestModal: true }))}>
                  Buy Bond Units
                </Menu.Item>
              )}
              <Menu.Item key="check" onClick={(e) => stopPropagation(e, () => updateState({ visibleCheckModal: true }))}>
                Check documents
              </Menu.Item>
              {['ACTIVE', 'FINISHED'].includes(bond.state) && (
                <Menu.Item key="withdraw" onClick={(e) => stopPropagation(e, () => bondWithdrawEverusd(bond.id))}>
                  Withdraw
                </Menu.Item>
              )}
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

InvestorBondActions.propTypes = {
  bond: PropTypes.shape().isRequired,
  mode: PropTypes.string,
};

InvestorBondActions.defaultProps = {
  mode: 'table',
};

export default InvestorBondActions;
