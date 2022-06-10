import React, { useMemo } from "react";
import {
  AuditOutlined,
  BankOutlined,
  FileProtectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Signatures from "../components/Signature/Signatures";
import { useOutletContext, useParams } from "react-router-dom";
import useAssets from "../hooks/useAssets";

const SignaturesReport = () => {
  const { report } = useOutletContext();
  const params = useParams();
  console.log(report);
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
      projectId: params.projectId,
      signer: address,
      role,
    });
  };

  return (
    <Signatures
      title="Report signers"
      list={signatures}
      requiredSigners={report.required_signers}
      handleAssign={handleAssign}
    />
  );
};

export default SignaturesReport;
