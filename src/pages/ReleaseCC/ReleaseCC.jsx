import React from "react";
import { Button, Form } from "antd";
import InputNumber from "../../components/InputNumber";
import useAssets from "../../hooks/useAssets";
import { useParams } from "react-router-dom";

const ReleaseCC = () => {
  const { releaseCarbonCredits } = useAssets();
  const params = useParams();
  const handleSubmit = ({ minBalance }) => {
    releaseCarbonCredits({
      projectId: params.projectId,
      minBalance,
    });
  };

  return (
    <Form
      onFinish={handleSubmit}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      labelAlign="left">
      <Form.Item name="minBalance" label="Min balance">
        <InputNumber />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 15, span: 3 }}>
        <Button
          style={{
            width: "100%",
          }}
          htmlType="submit"
          type="primary">
          Release
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ReleaseCC;
