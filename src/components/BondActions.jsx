import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from 'antd';
import cx from 'classnames';

import ComponentSwitcher from './ComponentSwitcher';
import InvestorBondActions from './InvestorBondActions';
import MasterBondActions from './MasterBondActions';
import IssuerBondActions from './IssuerBondActions';
import BondReport from './BondReport';
import ModalView from './ModalView';

import useXState from '../hooks/useXState';

import { getCurrentUser } from '../utils/cookies';

import styles from './BondActions.module.less';

const BondCard = ({ bond, mode }) => {
  const { role } = getCurrentUser();
  const [state, updateState] = useXState({
    visibleReportModal: false,
  });

  return (
    <>
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
        <Button
          size={mode === 'table' ? 'small' : 'middle'}
          type="primary"
          onClick={() => updateState({ visibleReportModal: true })}
          className={cx(styles.actionButton, { [styles.tableButton]: mode === 'table' })}
        >
          View bond
        </Button>
        <ComponentSwitcher
          activeItemIndex={['investor', 'master', 'issuer'].indexOf(role)}
          items={[
            <InvestorBondActions bond={bond} mode={mode} />,
            <MasterBondActions bond={bond} mode={mode} />,
            <IssuerBondActions bond={bond} mode={mode} />,
          ]}
          defaultItem={
            null
          }
        />
      </div>
    </>
  );
};

BondCard.propTypes = {
  bond: PropTypes.shape().isRequired,
  mode: PropTypes.string,
};

BondCard.defaultProps = {
  mode: 'card',
};

export default BondCard;
