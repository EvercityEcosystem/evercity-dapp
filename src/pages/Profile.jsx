import React, { useEffect, useState } from "react";
import { message, Statistic } from "antd";
import { CopyOutlined } from "@ant-design/icons";

import { getCurrentUser } from "../utils/storage";
import usePolkadot from "../hooks/usePolkadot";

import styles from "./Profile.module.less";

const Roles = () => {
  const { address, role } = getCurrentUser();
  const [balance, setBalance] = useState();
  const { fetchBalance } = usePolkadot();

  useEffect(() => {
    const getBalance = async () => {
      const res = await fetchBalance(address);
      setBalance(res.toFixed(2));
    };

    getBalance();
  });

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.address}>
          <Statistic
            className={styles.statistic}
            title="Address"
            value={address}
          />
          <CopyOutlined
            className={styles.copyIcon}
            onClick={() => {
              navigator.clipboard.writeText(address);
              message.success("Address copied!");
            }}
          />
        </div>
        <Statistic className={styles.statistic} title="Role" value={role} />
        <Statistic
          className={styles.statistic}
          suffix="$"
          title="Account Balance (EVERUSD)"
          value={balance}
        />
      </div>
    </div>
  );
};

Roles.propTypes = {};

Roles.defaultProps = {};

export default Roles;
