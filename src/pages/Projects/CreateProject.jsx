import React from "react";
import FileHasher from "../../components/FileHasher/FileHasher";
import { Button, Form, Input, Select } from "antd";
import useAssets from "../../hooks/useAssets";

const projectStandardOptions = [
  {
    label: "Gold Standard",
    value: "gold_standard",
  },
];

const CreateProject = () => {
  const { createProject, createFile } = useAssets();

  const handleSubmit = async values => {
    const fileId = await createFile(values.hashs[0], values.tag);
    await createProject(values.standard, fileId);
  };

  return (
    <Form
      onFinish={handleSubmit}
      labelAlign="left"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}>
      <Form.Item
        name="tag"
        label="Tag"
        rules={[
          {
            required: true,
          },
        ]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="hashs"
        label="Upload your project"
        rules={[
          {
            required: true,
          },
        ]}>
        <FileHasher maxCount={1} />
      </Form.Item>
      <Form.Item
        name="standard"
        label="Project standard"
        rules={[
          {
            required: true,
          },
        ]}>
        <Select options={projectStandardOptions} />
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

export default CreateProject;
