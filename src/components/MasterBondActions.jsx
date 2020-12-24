import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  message,
  Dropdown,
  Menu,
} from 'antd';
import SparkMD5 from 'spark-md5';
import cx from 'classnames';
import { DownOutlined } from '@ant-design/icons';

import ModalView from './ModalView';
import SimpleForm from './SimpleForm';

import useXState from '../hooks/useXState';
import usePolkadot from '../hooks/usePolkadot';

import styles from './BondActions.module.less';

const MasterBondActions = ({ bond, mode }) => {
  const [state, updateState] = useXState({
    visibleCheckModal: false,
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
      {['PREPARE', 'BOOKING', 'ACTIVE'].includes(bond?.state) && (
        <Dropdown
          overlay={(
            <Menu>
              {bond.state === 'PREPARE' && (
                <Menu.Item key="1" onClick={() => releaseBond(bond.id)}>
                  Open book
                </Menu.Item>
              )}
              {bond.state === 'BOOKING' && (
                <Menu.Item key="2" onClick={() => activateBond(bond.id)}>
                  Issue bond
                </Menu.Item>
              )}
              {['BOOKING', 'ACTIVE'].includes(bond.state) && (
                <Menu.Item key="3" onClick={() => updateState({ visibleCheckModal: true })}>
                  Check Documents
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

MasterBondActions.propTypes = {
  bond: PropTypes.shape().isRequired,
  mode: PropTypes.string,
};

MasterBondActions.defaultProps = {
  mode: 'column',
};

export default MasterBondActions;
