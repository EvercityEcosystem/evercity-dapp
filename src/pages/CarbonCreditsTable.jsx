import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { TableList } from "../ui";
import Actions from "../components/Actions/Actions";
import { Button, Form, Modal } from "antd";
import Slider from "../components/Slider";
import useAssets from "../hooks/useAssets";

const CarbonCreditsTable = () => {
  const { carbonCredits } = useOutletContext();
  const [form] = Form.useForm();
  const { burnCarbonCredits } = useAssets();
  const [isShowBurnModal, setIsShowBurnModal] = useState(false);
  const toggleShowModal = () => {
    setIsShowBurnModal(!isShowBurnModal);
  };
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

  const columns = [
    {
      title: "Asset ID",
      dataIndex: "asset_id",
    },
    {
      title: "Project ID",
      dataIndex: "project_id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
    },
    {
      title: "Decimals",
      dataIndex: "decimals",
    },
    {
      title: "Count",
      dataIndex: "count",
    },
    {
      title: "Supply",
      dataIndex: "supply",
    },
    {
      title: "Deposit",
      dataIndex: "deposit",
    },
    {
      title: "Action",
      dataIndex: "asset_id",
      render: assetId => (
        <Actions>
          <Button onClick={() => onBurn(assetId)}>Burn</Button>
        </Actions>
      ),
    },
  ];
  console.log(carbonCredits);
  return (
    <>
      <TableList dataSource={carbonCredits} columns={columns} />
      <Modal
        title="Burn Carbon Credits"
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
    </>
  );
};

export default CarbonCreditsTable;
