import React, { useEffect, useContext } from "react";
import { Row, Col, Empty, Radio } from "antd";

import useXState from "../hooks/useXState";
import usePolkadot from "../hooks/usePolkadot";

import BondCard from "../components/BondCard";
import BondsTable from "../components/BondsTable";
import Loader from "../components/Loader";
import { store } from "../components/PolkadotProvider";
import BondReport from "../components/BondReport";
import ModalView from "../components/ModalView";

import { setViewParams, getViewParams } from "../utils/storage";

import styles from "./Bonds.module.less";
import { PageHeader } from "../ui";

const Bonds = () => {
  const { polkadotState } = useContext(store);
  const { fetchBonds } = usePolkadot();

  const { listView: defaultListView } = getViewParams();

  const [state, updateState] = useXState({
    listView: defaultListView,
    currentBond: null,
    bondsLoading: false,
  });

  useEffect(() => {
    (async () => {
      updateState({ bondsLoading: true });
      await fetchBonds();
      updateState({ bondsLoading: false });
    })();
  }, [fetchBonds, updateState]);

  let data = (
    <div className={styles.container}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </div>
  );

  if (polkadotState.bonds.length) {
    data = (
      <Row gutter={26}>
        {polkadotState.bonds.map(bond => (
          <Col span={8} key={bond.id}>
            <BondCard bond={bond} onClick={updateState} />
          </Col>
        ))}
      </Row>
    );
  }

  if (state.listView === "table") {
    data = (
      <BondsTable dataSource={polkadotState.bonds} onClick={updateState} />
    );
  }

  return (
    <div className={styles.container}>
      <ModalView
        visible={!!state.currentBond}
        onCancel={() => updateState({ currentBond: null })}
        width={900}
        title={state.currentBond?.id}
        content={
          state.currentBond ? <BondReport bond={state.currentBond} /> : <></>
        }
      />
      <PageHeader
        title="Bond explorer"
        extra={
          <div className={styles.viewSettings}>
            <Radio.Group
              buttonStyle="solid"
              value={state.listView}
              onChange={e => {
                const listView = e?.target?.value;

                updateState({ listView });
                setViewParams({ listView });
              }}>
              <Radio.Button className={styles.selectorButton} value="cards">
                Cards
              </Radio.Button>
              <Radio.Button className={styles.selectorButton} value="table">
                Table
              </Radio.Button>
            </Radio.Group>
          </div>
        }
      />
      <div className={styles.projectsContainer}>
        <Loader spinning={state.bondsLoading}>{data}</Loader>
      </div>
    </div>
  );
};

Bonds.propTypes = {};

Bonds.defaultProps = {};

export default Bonds;
