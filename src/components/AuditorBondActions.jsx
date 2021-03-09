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
import { bondCurrentPeriod } from '../utils/period';

import styles from './BondActions.module.less';

const AuditorBondActions = ({ bond, mode }) => {
  const [state, updateState] = useXState({
    visibleCheckModal: false
  });

  const {
    bondImpactReportApprove
  } = usePolkadot();

  const period = bondCurrentPeriod(bond);

  const approveImpactFormConfig = {
    period: {
      label: 'Period',
      required: true,
      disabled: true,
      type: 'number',
      span: 24,
    },
    impactData: {
      label: 'Impact data',
      required: true,
      type: 'number',
      span: 24,
    },
  };

  const handleSubmit = ({ period, impactData }) => {
    bondImpactReportApprove(bond.id, period, impactData);
  };

  return (
    <>
      <ModalView
        visible={state.visibleCheckModal}
        onCancel={(e) => stopPropagation(e, () => updateState({ visibleCheckModal: false }))}
        width={400}
        title="Approve impact"
        content={(
          <SimpleForm
            style={{ width: '100%' }}
            config={approveImpactFormConfig}
            layout="vertical"
            submitText="Approve"
            onSubmit={handleSubmit}
            initialValues={{
              period
            }}
          />
        )}
      />
      {['ACTIVE'].includes(bond?.state) && period !== null && (
        <Dropdown
          overlay={(
            <Menu>
              <Menu.Item key="check" onClick={(e) => stopPropagation(e, () => updateState({ visibleCheckModal: true }))}>
                Approve impact
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

AuditorBondActions.propTypes = {
  bond: PropTypes.shape().isRequired,
  mode: PropTypes.string,
};

AuditorBondActions.defaultProps = {
  mode: 'table',
};

export default AuditorBondActions;
