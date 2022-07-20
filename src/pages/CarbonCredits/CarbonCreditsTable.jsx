import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { TableList } from "../../ui";
import Actions from "../../components/Actions/Actions";
import { Form, Modal } from "antd";
import useAssets from "../../hooks/useAssets";
import Button from "../../ui/Button/Button";
import InputNumber from "../../components/InputNumber";

const CarbonCreditsTable = () => {
  const { carbonCredits } = useOutletContext();
  const [form] = Form.useForm();
  const { burnCarbonCredits } = useAssets();
  const [isShowBurnModal, setIsShowBurnModal] = useState(false);
  const toggleShowModal = () => {
    setIsShowBurnModal(!isShowBurnModal);
  };
  const handleBurn = () => {
    form.validateFields().then(() => {
      form.submit();
    });
  };

  const handleSubmit = ({ amount, assetId }) => {
    burnCarbonCredits({
      assetId,
      amount,
    }).then(() => {
      toggleShowModal();
      form.resetFields();
    });
  };

  const onBurn = assetId => {
    form.setFieldsValue({ assetId });
    toggleShowModal();
  };

  const columns = [
    {
      title: "Asset ID",
      dataIndex: "assetId",
    },
    {
      title: "Project ID",
      dataIndex: "projectId",
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
      dataIndex: "assetId",
      render: assetId => (
        <Actions>
          <Button type="action" onClick={() => onBurn(assetId)}>
            Burn
          </Button>
        </Actions>
      ),
    },
  ];
  return (
    <>
      <TableList dataSource={carbonCredits} columns={columns} />
      <Modal
        title="Burn Carbon Credits"
        okText="Burn"
        visible={isShowBurnModal}
        onCancel={toggleShowModal}
        onOk={handleBurn}>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item hidden name="assetId" />
          <Form.Item
            name="amount"
            label="Amount credits"
            rules={[
              { required: true, message: "Amount is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    value <=
                      Number(
                        carbonCredits.find(
                          cc => cc.assetId === getFieldValue("assetId"),
                        ).supply,
                      )
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Amount must be less than or equal to the supply of the asset",
                    ),
                  );
                },
              }),
            ]}>
            <InputNumber min={1} debounce={false} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CarbonCreditsTable;
