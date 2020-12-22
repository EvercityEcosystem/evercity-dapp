import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button, message,
} from 'antd';
import SparkMD5 from 'spark-md5';
import cx from 'classnames';

import ModalView from './ModalView';
import SimpleForm from './SimpleForm';
import BondReport from './BondReport';

import useXState from '../hooks/useXState';
import usePolkadot from '../hooks/usePolkadot';

import styles from './BondActions.module.less';

const InvestorBondActions = ({ bond, mode }) => {
  const [state, updateState] = useXState({
    visibleInvestModal: false,
    visibleCheckModal: false,
    visibleReportModal: false,
    filehash: null,
  });
  const { bondUnitPackageBuy } = usePolkadot();

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

  const checkDocumentsFormConfig = {
    docs: {
      display: 'file',
      placeholder: 'Upload document',
      accept: '.pdf,.xls,.xlsx',
      span: 24,
      beforeUpload: async (file) => {
        const reader = new FileReader();

        reader.onload = () => {
          const spark = new SparkMD5.ArrayBuffer();
          spark.append(reader.result);
          const filehash = spark.end();

          updateState({ filehash });
        };

        reader.readAsArrayBuffer(file);

        return false;
      },
    },
  };

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

  const baseActions = [
    <Button
      type="primary"
      size={mode === 'table' ? 'small' : 'middle'}
      onClick={() => updateState({ visibleInvestModal: true })}
      className={cx(styles.actionButton, { [styles.tableButton]: mode === 'table' })}
    >
      Buy Bond Units
    </Button>,
  ];

  const extendedActions = [
    ...baseActions,
    <Button type="default" onClick={() => updateState({ visibleReportModal: true })} className={styles.button}>
      View Report
    </Button>,
    <Button type="default" onClick={() => updateState({ visibleCheckModal: true })} className={styles.button}>
      Check Documents
    </Button>,
  ];

  const actions = mode === 'table' ? baseActions : extendedActions;

  return (
    <>
      <ModalView
        visible={state.visibleInvestModal}
        onCancel={() => updateState({ visibleInvestModal: false })}
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
        onCancel={() => updateState({ visibleCheckModal: false })}
        width={400}
        title="Check documents"
        content={(
          <SimpleForm
            style={{ width: '100%' }}
            config={checkDocumentsFormConfig}
          />
        )}
      />
      <ModalView
        visible={state.visibleReportModal}
        onCancel={() => updateState({ visibleReportModal: false })}
        width={900}
        title={bond.id}
        content={(
          <BondReport bond={bond} />
        )}
      />
      <div className={cx(styles.actions, { [styles.tableActions]: mode === 'table' })}>
        {['BOOKING', 'ACTIVE'].includes(bond?.state) && actions}
      </div>
    </>
  );
};

InvestorBondActions.propTypes = {
  bond: PropTypes.shape().isRequired,
  mode: PropTypes.string,
};

InvestorBondActions.defaultProps = {
  mode: 'column',
};

export default InvestorBondActions;
