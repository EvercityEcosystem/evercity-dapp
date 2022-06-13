import React, { useMemo } from "react";
import { Button, Form, Input, Select } from "antd";
import FileHasher from "../../components/FileHasher/FileHasher";
import InputNumber from "../../components/InputNumber";
import useAssets from "../../hooks/useAssets";
import { useOutletContext } from "react-router-dom";

const CreateReport = () => {
  const { createReport } = useAssets();
  const { assets } = useOutletContext();

  const projectIdOptions = useMemo(
    () =>
      assets?.map(asset => ({
        label: asset.id,
        value: asset.id,
      })),
    [assets],
  );
  const handleSubmit = async ({ hashes, ...values }) => {
    await createReport({
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
      <Form.Item name="project_id" label="Project">
        <Select options={projectIdOptions} />
      </Form.Item>
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
