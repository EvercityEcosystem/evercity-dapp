import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Statistic,
  Progress,
  Tag,
} from 'antd';

import ComponentSwitcher from './ComponentSwitcher';
import InvestorBondActions from './InvestorBondActions';
import MasterBondActions from './MasterBondActions';
import IssuerBondActions from './IssuerBondActions';

import { IMPACT_DATA_TYPES, BOND_STATE_COLORS } from '../utils/env';
import { getCurrentUser } from '../utils/cookies';

import styles from './BondCard.module.less';

const { Countdown } = Statistic;

const BondCard = ({ bond }) => {
  const currentVolume = (bond?.issued_amount || 0) * (bond?.inner?.bond_units_base_price || 0);
  const totalVolume = (bond?.inner?.bond_units_maxcap_amount || 0)
    * (bond?.inner?.bond_units_base_price || 0);

  const percentage = Math.floor((currentVolume / (totalVolume || 1)) * 100);

  const { role } = getCurrentUser();

  return (
    <Card
      hoverable
      className={styles.bondCard}
    >
      <div className={styles.bondState}>
        <Tag color={BOND_STATE_COLORS[bond?.state]}>{bond?.state}</Tag>
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          {bond?.id}
        </div>
        <div className={styles.types}>
          <Tag color={IMPACT_DATA_TYPES[bond?.inner?.impact_data_type]?.color}>
            {IMPACT_DATA_TYPES[bond?.inner?.impact_data_type]?.title}
          </Tag>
        </div>
        <div className={styles.bondDataContainer}>
          <Statistic className={styles.bondData} suffix="$" title="Unit Base Price" value={bond?.inner?.bond_units_base_price} />
        </div>
        <div className={styles.bondDataContainer}>
          {bond?.state === 'BOOKING' && (
            <Countdown className={styles.bondData} title="Mincap Days Left" format="D" value={bond?.inner?.mincap_deadline} />
          )}
          <Statistic className={styles.bondData} suffix="%" title="Interest" value={bond?.inner?.interest_rate_base_value / 1000} />
          <Statistic className={styles.bondData} suffix="years" title="Maturity" value={bond?.inner?.bond_duration} />
        </div>
        {['BOOKING', 'ACTIVE'].includes(bond?.state) && (
          <div className={styles.bookingProgress}>
            <div className={styles.bookingProgressLabel}>
              {`${percentage}% booked of $${totalVolume}`}
            </div>
            <Progress
              percent={percentage}
              status="active"
              strokeColor="#31CC79"
              showInfo={false}
            />
          </div>
        )}
        <ComponentSwitcher
          activeItemIndex={['investor', 'master', 'issuer'].indexOf(role)}
          items={[
            <InvestorBondActions bond={bond} />,
            <MasterBondActions bond={bond} />,
            <IssuerBondActions bond={bond} />,
          ]}
          defaultItem={
            null
          }
        />
      </div>
    </Card>
  );
};

BondCard.propTypes = {
  bond: PropTypes.shape().isRequired,
};

BondCard.defaultProps = {
};

export default BondCard;
