import React from "react";
import { Button, Form } from "antd";
import InputNumber from "../../components/InputNumber";
import useAssets from "../../hooks/useAssets";
import { useParams } from "react-router-dom";

const ReleaseCC = () => {
  const { releaseCarbonCredits } = useAssets();
  const params = useParams();
  const handleSubmit = () => {
    releaseCarbonCredits(params.projectId);
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item name="minBalance">
        <InputNumber />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">Release</Button>
      </Form.Item>
    </Form>
  );
};

export default ReleaseCC;
