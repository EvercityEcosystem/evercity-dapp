/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { message, Statistic } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

import { getCurrentUser } from '../utils/cookies';
import { balanceEverUSD } from '../utils/polkadot';

import styles from './Profile.module.less';

const Roles = () => {
  const { t } = useTranslation();
  const { address, role } = getCurrentUser();
  const [balance, setBalance] = useState();

  useEffect(
    () => {
      const getBalance = async () => {
        const res = await balanceEverUSD(address);
        setBalance(res);
      };

      getBalance();
    },
  );

  return (
    <div className={styles.container}>
      <div className={styles.address}>
        <Statistic className={styles.statistic} title={t('Address')} value={address} />
        <CopyOutlined
          className={styles.copyIcon}
          onClick={() => {
            navigator.clipboard.writeText(address);
            message.success('Address copied!');
          }}
        />
      </div>
      <Statistic className={styles.statistic} title={t('Role')} value={role} />
      <Statistic className={styles.statistic} title={t('Account Balance (EVERUSD)')} value={balance} />
    </div>
  );
};

Roles.propTypes = {
};

Roles.defaultProps = {};

export default Roles;
