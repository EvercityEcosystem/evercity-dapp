import React from "react";
import { AuditOutlined, BankOutlined, UserOutlined } from "@ant-design/icons";
import Signature from "../../components/Signature/Signature";
import { Card } from "antd";

const SignProject = () => {
  return (
    <Card title="Project signers">
      <Card.Grid>
        <Signature icon={<UserOutlined />} role={256} />
      </Card.Grid>
      <Card.Grid>
        <Signature icon={<AuditOutlined />} role={512} />
      </Card.Grid>
      <Card.Grid>
        <Signature icon={<BankOutlined />} role={4096} />
      </Card.Grid>
    </Card>
  );
};

export default SignProject;
