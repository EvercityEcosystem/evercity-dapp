import React from "react";
import FileHasher from "../../components/FileHasher/FileHasher";
import { Form, Input } from "antd";

const CreateProject = () => {
  const onChange = values => {
    console.log(values);
  };

  return (
    <Form onValuesChange={onChange}>
      <Form.Item name="tag" label="Tag">
        <Input />
      </Form.Item>
      <Form.Item name="hash">
        <FileHasher />
      </Form.Item>
    </Form>
  );
};

export default CreateProject;
