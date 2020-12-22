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

import styles from './MasterBondActions.module.less';

const MasterBondActions = ({ bond, mode }) => {
  const [state, updateState] = useXState({
    visibleCheckModal: false,
    visibleReportModal: false,
  });
  const { releaseBond, activateBond } = usePolkadot();

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

  const baseActions = [];

  if (bond.state === 'PREPARE') {
    baseActions.push(
      <Button type="primary" onClick={() => releaseBond(bond.id)} className={styles.actionButton}>
        Open book
      </Button>,
    );
  }

  if (bond.state === 'BOOKING') {
    baseActions.push(
      <Button type="primary" onClick={() => activateBond(bond.id)} className={styles.actionButton}>
        Issue bond
      </Button>,
    );
  }

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
