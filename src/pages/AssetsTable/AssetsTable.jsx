import React, { useState } from "react";
import TableList from "../../ui/TableList/TableList";
import { useOutletContext } from "react-router-dom";
import styles from "./AssetsTable.module.less";
import { Link } from "@ui";
import { Button, Form, Modal } from "antd";
import useAssets from "../../hooks/useAssets";
import Slider from "../../components/Slider";

const PROJECT_STATES = {
  1: "Project owner sign pending",
  2: "Auditor sign pending",
  4: "Standard sign pending",
  8: "Investor sign pending",
  16: "Registry sign pending",
  32: "Registered",
  64: "Evercity sign pending",
};

const columns = [
  {
    title: "Project ID",
    dataIndex: "id",
  },
  {
    title: "Status",
    dataIndex: "state",
    render: state => PROJECT_STATES[state],
  },
  {
    title: "Manage",
    dataIndex: "id",
    render: id => (
      <>
        <Link to={`/dapp/project_owner/assets/${id}/signatures`}>
          Signatures
        </Link>
        <Link to={`/dapp/project_owner/assets/${id}/reports`}>Reports</Link>
      </>
    ),
  },
];

const AssetsTable = () => {
  const { assets } = useOutletContext();
  const { burnCarbonCredits } = useAssets();
  const [isShowBurnModal, setIsShowBurnModal] = useState(false);
  const toggleShowModal = () => {
    setIsShowBurnModal(!isShowBurnModal);
  };
  const [form] = Form.useForm();
  const handleBurn = () => {
    const { amount, assetId } = form.getFieldValue();
    burnCarbonCredits({
      assetId,
      amount,
    }).then(() => {
      toggleShowModal();
    });
  };

  const onBurn = assetId => {
    form.setFieldsValue({ assetId });
    toggleShowModal();
  };

  const expandedRowRender = record => {
    const columns = [
      {
        title: "Asset ID",
        dataIndex: "asset_id",
      },
      {
        title: "Name",
        dataIndex: "annual_report_index",
        render: annual_report_index =>
          record.annual_reports[annual_report_index - 1].carbon_credits_meta
            .name,
      },
      {
        title: "Symbol",
        dataIndex: "annual_report_index",
        render: annual_report_index =>
          record.annual_reports[annual_report_index - 1].carbon_credits_meta
            .symbol,
      },
      {
        title: "Count",
        dataIndex: "annual_report_index",
        render: annual_report_index =>
          record.annual_reports[annual_report_index - 1].carbon_credits_count,
      },
      {
        title: "Decimals",
        dataIndex: "annual_report_index",
        render: annual_report_index =>
          record.annual_reports[annual_report_index - 1].carbon_credits_meta
            .decimals,
      },
      {
        title: "Supply",
        dataIndex: "supply",
      },
      {
        title: "Actions",
        dataIndex: "asset_id",
        render: assetId => (
          <Button onClick={() => onBurn(assetId)}>Burn</Button>
        ),
      },
    ];

    return (
      <TableList
        pagination={false}
        columns={columns}
        dataSource={record.carbon_credits}
      />
    );
  };
  return (
    <div className={styles.container}>
      <Modal
        okText="Burn"
        visible={isShowBurnModal}
        onCancel={toggleShowModal}
        onOk={handleBurn}>
        <Form form={form}>
          <Form.Item name="amount" label="Amount credits">
            <Slider />
          </Form.Item>
        </Form>
      </Modal>
      <TableList
        expandable={{
          expandedRowRender,
          rowExpandable: record => record.carbon_credits.length > 0,
        }}
        columns={columns}
        rowKey="id"
        dataSource={assets}
        className={styles.container__table}
      />
      <Link to="/dapp/project_owner/assets/create" type="button">
        Create a new project
      </Link>
    </div>
  );
};

export default AssetsTable;
