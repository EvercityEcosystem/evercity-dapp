import React, { useMemo } from "react";
import {
  AuditOutlined,
  BankOutlined,
  FileProtectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useOutletContext, useParams } from "react-router-dom";
import useAssets from "../../hooks/useAssets";
import Signatures from "../../components/Signature/Signatures";
import { roleToStateMapping } from "../../utils/roles";

const SignaturesProject = () => {
  const params = useParams();
  const { project } = useOutletContext();
  const { assignRoleInProject } = useAssets();
  const signatures = useMemo(() => {
    const requirements = [
      {
        role: 256,
        icon: <UserOutlined />,
      },
      {
        role: 512,
        icon: <AuditOutlined />,
      },
      {
        role: 1024,
        icon: <FileProtectOutlined />,
      },
      {
        role: 4096,
        icon: <BankOutlined />,
      },
    ];

    return requirements;
  }, [project]);

  const handleAssign = async (address, role) => {
    await assignRoleInProject({
      projectId: params.projectId,
      signer: address,
      role,
    });
  };

  return (
    <Signatures
      roleToStateMapping={roleToStateMapping}
      state={project?.state}
      list={signatures}
      handleAssign={handleAssign}
      requiredSigners={project?.required_signers}
    />
  );
};

export default SignaturesProject;
