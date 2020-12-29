import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  PageHeader,
  Empty,
  Radio,
} from 'antd';

import { useTranslation } from 'react-i18next';

import useXState from '../hooks/useXState';
import usePolkadot from '../hooks/usePolkadot';

import BondCard from '../components/BondCard';
import BondsTable from '../components/BondsTable';
import Loader from '../components/Loader';
import { store } from '../components/PolkadotProvider';
import BondReport from '../components/BondReport';
import ModalView from '../components/ModalView';

import styles from './Bonds.module.less';

const Bonds = () => {
  const { polkadotState } = useContext(store);
  const { t } = useTranslation();
  const { fetchBonds } = usePolkadot();
  const [state, updateState] = useXState({
    view: 'cards',
    currentBond: null,
    bondsLoading: false,
  });

  useEffect(
    () => {
      (async () => {
        updateState({ bondsLoading: true });
        await fetchBonds();
        updateState({ bondsLoading: false });
      })();
    },
    [fetchBonds, updateState],
  );

  let data = (
    <div className={styles.container}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </div>
  );

  if (polkadotState.bonds.length) {
    data = (
      <Row gutter={26}>
        {polkadotState.bonds.map((bond) => (
          <Col span={8}>
            <BondCard bond={bond} onClick={updateState} />
          </Col>
        ))}
      </Row>
    );
  }

  if (state.view === 'table') {
    data = (<BondsTable dataSource={polkadotState.bonds} onClick={updateState} />);
  }

  return (
    <div className={styles.container}>
      <ModalView
        visible={!!state.currentBond}
        onCancel={() => updateState({ currentBond: null })}
        width={900}
        title={state.currentBond?.id}
        content={(
          <BondReport bond={state.currentBond} />
        )}
      />
      <PageHeader
        ghost={false}
        className={styles.pageHeader}
        title={(
          <span className={styles.pageHeaderTitle}>
            {t('Bond explorer')}
          </span>
        )}
        extra={(
          <div className={styles.viewSettings}>
            <Radio.Group buttonStyle="solid" value={state.view} onChange={(e) => updateState({ view: e?.target?.value })}>
              <Radio.Button className={styles.selectorButton} value="cards">Cards</Radio.Button>
              <Radio.Button className={styles.selectorButton} value="table">Table</Radio.Button>
            </Radio.Group>
          </div>
        )}
      />
      <div className={styles.projectsContainer}>
        <Loader spinning={state.bondsLoading}>
          {data}
        </Loader>
      </div>
    </div>
  );
};

Bonds.propTypes = {};

Bonds.defaultProps = {};

export default Bonds;
