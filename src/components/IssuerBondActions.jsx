import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button, message,
} from 'antd';
import cx from 'classnames';

import ModalView from './ModalView';
import SimpleForm from './SimpleForm';
import BondReport from './BondReport';

import useXState from '../hooks/useXState';
import usePolkadot from '../hooks/usePolkadot';

import { getCurrentUser } from '../utils/cookies';

import styles from './MasterBondActions.module.less';

const MasterBondActions = ({ bond, mode }) => {
  const { address: currentUserAddress } = getCurrentUser();
  const [state, updateState] = useXState({
    visibleReportModal: false,
    visibleImpactModal: false,
    visibleDepositModal: false,
  });
  const { bondImpactReportSend, bondDepositEverusd } = usePolkadot();

  useEffect(
    () => {
      const isDocumentValid = [
        bond.inner?.docs_pack_root_hash_main,
        bond.inner?.docs_pack_root_hash_tech,
        bond.inner?.docs_pack_root_hash_legal,
        bond.inner?.docs_pack_root_hash_finance,
      ].includes(state.filehash);

      if (!state.filehash) {
        return;
      }

      if (isDocumentValid) {
        message.success('Document is valid');
        updateState({ filehash: null });
        return;
      }

      message.error('Document is not valid');
      updateState({ filehash: null });
    },
    [state.filehash, bond, updateState],
  );

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

  const baseActions = [];

  const sendImpactData = async ({ period, impactData }) => {
    await bondImpactReportSend(bond.id, period, impactData);
    updateState({ visibleImpactModal: false });
  };

  const deposit = async ({ amount }) => {
    await bondDepositEverusd(bond.id, amount);
    updateState({ visibleDepositModal: false });
  };

  if (bond.state === 'ACTIVE' && bond.issuer === currentUserAddress) {
    baseActions.push(
      <Button type="primary" onClick={() => updateState({ visibleDepositModal: true })} className={styles.actionButton}>
        Deposit
      </Button>,
    );
  }

  const extendedActions = [
    ...baseActions,
    <Button type="default" onClick={() => updateState({ visibleImpactModal: true })} className={styles.button}>
      Send impact data
    </Button>,
    <Button type="default" onClick={() => updateState({ visibleReportModal: true })} className={styles.button}>
      View Report
    </Button>,
  ];

  const actions = mode === 'table' ? baseActions : extendedActions;

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
      <ModalView
        visible={state.visibleReportModal}
        onCancel={() => updateState({ visibleReportModal: false })}
        width={800}
        title={bond.id}
        content={(
          <BondReport bond={bond} />
        )}
      />
      <div className={cx(styles.actions, { [styles.tableActions]: mode === 'table' })}>
        {actions}
      </div>
    </>
  );
};

MasterBondActions.propTypes = {
  bond: PropTypes.shape().isRequired,
  mode: PropTypes.string,
};

MasterBondActions.defaultProps = {
  mode: 'column',
};

export default MasterBondActions;
