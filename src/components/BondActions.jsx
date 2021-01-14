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

import { getCurrentUser } from '../utils/storage';

import styles from './BondActions.module.less';

const BondActions = ({ bond, mode, onClick }) => {
  const { role } = getCurrentUser();

  return (
    <>
      <div className={cx(styles.actions, { [styles.tableActions]: mode === 'table' })}>
        <Button
          size={mode === 'table' ? 'small' : 'middle'}
          type="primary"
          className={cx(styles.actionButton, { [styles.tableButton]: mode === 'table' })}
          onClick={onClick}
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

BondActions.propTypes = {
  bond: PropTypes.shape().isRequired,
  mode: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

BondActions.defaultProps = {
  mode: 'card',
};

export default BondActions;
