import React, { useMemo } from "react";
import {
  AuditOutlined,
  BankOutlined,
  FileProtectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Signatures from "../../components/Signature/Signatures";
import { useOutletContext } from "react-router-dom";
import useAssets from "../../hooks/useAssets";
import { roleToStateMapping } from "../../utils/roles";

const SignaturesReport = () => {
  const { report } = useOutletContext();
  const { assignLastReportSigner } = useAssets();
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
  }, []);

  const handleAssign = async (address, role) => {
    await assignLastReportSigner({
      projectId: report.project_id,
      signer: address,
      role,
    });
  };
  return (
    <Signatures
      title="Report signers"
      list={signatures}
      roleToStateMapping={roleToStateMapping}
      state={report?.state}
      requiredSigners={report?.required_signers}
      handleAssign={handleAssign}
    />
  );
};

export default SignaturesReport;
