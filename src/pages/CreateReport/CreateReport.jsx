import React from "react";
import { Button, Form, Input } from "antd";
import FileHasher from "../../components/FileHasher/FileHasher";
import InputNumber from "../../components/InputNumber";
import { useParams } from "react-router-dom";
import useAssets from "../../hooks/useAssets";

const CreateReport = () => {
  const params = useParams();
  const { createReport } = useAssets();

  const handleSubmit = async ({ hashes, ...values }) => {
    await createReport({
      projectId: params.projectId,
      hash: hashes[0],
      ...values,
    });
  };

  return (
    <Form
      onFinish={handleSubmit}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      labelAlign="left">
      <Form.Item name="tag" label="Tag Report">
        <Input />
      </Form.Item>
      <Form.Item name="hashes" label="Upload Report">
        <FileHasher maxCount={1} />
      </Form.Item>
      <Form.Item name="count" label="Count Credits">
        <InputNumber />
      </Form.Item>
      <Form.Item name="name" label="Carbon Credit name">
        <Input />
      </Form.Item>
      <Form.Item name="symbol" label="Tag Carbon Credits">
        <Input />
      </Form.Item>
      <Form.Item name="decimals" label="Decimals">
        <InputNumber />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 15, span: 3 }}>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: "100%",
          }}>
          Assign signers
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateReport;
