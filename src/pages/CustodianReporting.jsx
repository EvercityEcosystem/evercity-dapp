import React, { useEffect, useState } from "react";
import { Statistic } from "antd";

import usePolkadot from "../hooks/usePolkadot";

import styles from "./CustodianReporting.module.less";

const CustodianReporting = () => {
  const [totalSupply, setTotalSupply] = useState(0);
  const { totalSupplyEverUSD } = usePolkadot();

  useEffect(() => {
    const getTotalSupply = async () => {
      const result = await totalSupplyEverUSD();
      setTotalSupply(result.toFixed(2));
    };

    getTotalSupply();
  }, [totalSupplyEverUSD]);

  return (
    <div className={styles.container}>
      <Statistic suffix="$" title="Total supply EVERUSD" value={totalSupply} />
    </div>
  );
};

CustodianReporting.propTypes = {};

CustodianReporting.defaultProps = {};

export default CustodianReporting;
