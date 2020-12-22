/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Statistic } from 'antd';

import usePolkadot from '../hooks/usePolkadot';

import styles from './CustodianReporting.module.less';

const CustodianReporting = () => {
  const [totalSupply, setTotalSupply] = useState(0);
  const { totalSupplyEverUSD } = usePolkadot();

  useEffect(
    () => {
      const getTotalSupply = async () => {
        const result = await totalSupplyEverUSD();
        setTotalSupply(result);
      };

      getTotalSupply();
    },
    [totalSupplyEverUSD],
  );

  return (
    <div className={styles.container}>
      <Statistic title="Total supply EVERUSD" value={totalSupply} />
    </div>
  );
};

CustodianReporting.propTypes = {
};

CustodianReporting.defaultProps = {};

export default CustodianReporting;
