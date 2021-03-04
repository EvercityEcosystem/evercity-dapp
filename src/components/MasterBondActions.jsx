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

const MasterBondActions = ({ bond, mode }) => {
  const [state, updateState] = useXState({
    visibleCheckModal: false,
  });
  const { releaseBond, activateBond } = usePolkadot();

  const { checkDocumentsFormConfig } = useDocuments({ state, updateState, bond });

  return (
    <>
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
      {['PREPARE', 'BOOKING', 'ACTIVE'].includes(bond?.state) && (
        <Dropdown
          overlay={(
            <Menu>
              {bond.state === 'PREPARE' && (
                <Menu.Item key="1" onClick={(e) => stopPropagation(e, () => releaseBond(bond.id))}>
                  Open book
                </Menu.Item>
              )}
              {bond.state === 'BOOKING' && (
                <Menu.Item key="2" onClick={(e) => stopPropagation(e, () => activateBond(bond.id))}>
                  Issue bond
                </Menu.Item>
              )}
              {['BOOKING', 'ACTIVE'].includes(bond.state) && (
                <Menu.Item key="3" onClick={(e) => stopPropagation(e, () => updateState({ visibleCheckModal: true }))}>
                  Check documents
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
