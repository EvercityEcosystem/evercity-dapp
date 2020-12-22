import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  PageHeader,
  Empty,
  Radio,
  Card,
  Button,
  message,
} from 'antd';

import { useTranslation } from 'react-i18next';

import useXState from '../hooks/useXState';

import BondCard from '../components/BondCard';
import BondsTable from '../components/BondsTable';
import Loader from '../components/Loader';
import SimpleForm from '../components/SimpleForm';
import ModalView from '../components/ModalView';

import styles from './Bonds.module.less';
import useBonds from '../hooks/useBonds';
import usePolkadot from '../hooks/usePolkadot';

const Bonds = () => {
  const { t } = useTranslation();
  const { bonds } = useBonds();
  const [state, updateState] = useXState({
    view: 'cards',
    bondIndexModalVisible: false,
  });

  const { bondRegistry } = usePolkadot();

  const formConfig = {
    bondID: {
      label: 'Bond ID',
      required: true,
      span: 24,
    },
  };

  const addBondToIndex = async ({ bondID }) => {
    const bond = await bondRegistry(bondID);

    if (!bond?.inner?.bond_duration) {
      message.error('Bond not found');
      return;
    }

    const indices = localStorage.getItem('bond_index');
    if (indices) {
      localStorage.setItem('bond_index', `${bondID},${indices}`);
    } else {
      localStorage.setItem('bond_index', bondID);
    }

    message.success('Bond added to index');
    updateState({ bondIndexModalVisible: false });
  };

  let data = (
    <div className={styles.container}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </div>
  );

  if (bonds.length) {
    data = (
      <Row gutter={26}>
        {bonds.map((bond) => (
          <Col span={8}>
            <BondCard bond={bond} />
          </Col>
        ))}
      </Row>
    );
  }

  if (state.view === 'table') {
    data = (<BondsTable dataSource={bonds} />);
  }

  return (
    <div className={styles.container}>
      <ModalView
        visible={state.bondIndexModalVisible}
        onCancel={() => updateState({ bondIndexModalVisible: false })}
        width={400}
        title="Check documents"
        content={(
          <SimpleForm
            style={{ width: '100%' }}
            config={formConfig}
            submitText="Add bond"
            onSubmit={addBondToIndex}
          />
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
        <Loader spinning={false}>
          {data}
        </Loader>
      </div>
    </div>
  );
};

Bonds.propTypes = {};

Bonds.defaultProps = {};

export default Bonds;
