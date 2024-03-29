import React from "react";
import PropTypes from "prop-types";
import { Card, Statistic, Progress, Tag } from "antd";

import BondActions from "./BondActions";

import { IMPACT_DATA_TYPES, BOND_STATES } from "../utils/env";
import { fromEverUSD } from "../utils/converters";

import styles from "./BondCard.module.less";

const { Countdown } = Statistic;

const BondCard = ({ bond, onClick }) => {
  const currentVolume =
    (bond?.issued_amount || 0) *
    fromEverUSD(bond?.inner?.bond_units_base_price);
  const totalVolume =
    (bond?.inner?.bond_units_maxcap_amount || 0) *
    fromEverUSD(bond?.inner?.bond_units_base_price);

  const percentage = Math.floor((currentVolume / (totalVolume || 1)) * 100);

  return (
    <>
      <Card hoverable className={styles.bondCard}>
        <div className={styles.bondState}>
          <Tag color={BOND_STATES[bond?.state].color}>
            {BOND_STATES[bond?.state].title}
          </Tag>
        </div>
        <div className={styles.content}>
          <div className={styles.title}>{bond?.id}</div>
          <div className={styles.types}>
            <Tag
              color={IMPACT_DATA_TYPES[bond?.inner?.impact_data_type]?.color}>
              {IMPACT_DATA_TYPES[bond?.inner?.impact_data_type]?.title}
            </Tag>
          </div>
          <div className={styles.bondDataContainer}>
            <Statistic
              className={styles.bondData}
              suffix="$"
              title="Unit Base Price"
              value={fromEverUSD(bond?.inner?.bond_units_base_price)}
            />
          </div>
          <div className={styles.bondDataContainer}>
            <Statistic
              className={styles.bondData}
              suffix="$"
              title="Total Volume"
              value={totalVolume}
            />
          </div>
          <div className={styles.bondDataContainer}>
            {bond?.state === "BOOKING" && (
              <Countdown
                className={styles.bondData}
                title="Mincap Days Left"
                format="D"
                value={bond?.inner?.mincap_deadline}
              />
            )}
            <Statistic
              className={styles.bondData}
              suffix="%"
              title="Interest"
              value={bond?.currentInterestRate}
            />
            <Statistic
              className={styles.bondData}
              suffix="periods"
              title="Maturity"
              value={bond?.inner?.bond_duration}
            />
          </div>
          <div className={styles.bookingProgress}>
            <div className={styles.bookingProgressLabel}>
              {["BOOKING", "ACTIVE", "FINISHED"].includes(bond?.state)
                ? `${percentage}% booked`
                : "Booking coming soon"}
            </div>
            <Progress
              percent={percentage}
              status="active"
              strokeColor="#31CC79"
              showInfo={false}
            />
          </div>
          <div className={styles.actions}>
            <BondActions
              bond={bond}
              onClick={() => onClick({ currentBond: bond })}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

BondCard.propTypes = {
  bond: PropTypes.shape().isRequired,
  onClick: PropTypes.func.isRequired,
};

BondCard.defaultProps = {};

export default BondCard;
