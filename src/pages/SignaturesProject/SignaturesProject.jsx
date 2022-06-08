import React, { useEffect } from "react";
import { AuditOutlined, BankOutlined, UserOutlined } from "@ant-design/icons";
import Signature from "../../components/Signature/Signature";
import { Card } from "antd";
import { useParams } from "react-router-dom";
import useAssets from "../../hooks/useAssets";

const SignaturesProject = () => {
  const params = useParams();
  const { assignRoleInProject, fetchProject, project } = useAssets();

  useEffect(() => {
    fetchProject(params.projectId);
  }, [fetchProject]);

  const handleAssign = async (address, role) => {
    await assignRoleInProject({
      projectId: params.projectId,
      signer: address,
      role,
    });
  };

  return (
    <Card title="Project signers">
      <Card.Grid>
        <Signature
          icon={<UserOutlined />}
          role={256}
          signer={
            project?.required_signers.find(([, role]) => role === 256)?.[0]
          }
          onAssign={handleAssign}
        />
      </Card.Grid>
      <Card.Grid>
        <Signature
          icon={<AuditOutlined />}
          role={512}
          signer={
            project?.required_signers?.find(([, role]) => role === 512)?.[0]
          }
          onAssign={handleAssign}
        />
      </Card.Grid>
      <Card.Grid>
        <Signature
          icon={<BankOutlined />}
          role={4096}
          signer={
            project?.required_signers?.find(([, role]) => role === 4096)?.[0]
          }
          onAssign={handleAssign}
        />
      </Card.Grid>
    </Card>
  );
};

export default SignaturesProject;
