import React, { useEffect, useMemo } from "react";
import useAssets from "../../hooks/useAssets";
import { TableList } from "../../ui";
import { getCurrentUser } from "../../utils/storage";
import { Button } from "antd";

const SignAssets = () => {
  const { assets, fetchAssets, signProject, signLastReport } = useAssets();
  const { role, address } = getCurrentUser();

  const onSign = record => {
    if (record.typeSignature === "Project") {
      signProject(record.id);
    }
    if (record.typeSignature === "Report") {
      signLastReport(record.projectId);
    }
  };

  const dataSource = useMemo(
    () =>
      assets.reduce((accum, asset) => {
        const foundDemandsInProject = asset.required_signers.filter(
          signer => signer[0] === address && signer[1] === role,
        );
        if (foundDemandsInProject.length > 0) {
          accum.push({ ...asset, typeSignature: "Project" });
        }

        asset.annual_reports.forEach(report => {
          const foundDemandsInReport = report.required_signers?.filter(
            signer => signer[0] === address && signer[1] === role,
          );

          if (foundDemandsInReport.length > 0) {
            accum.push({
              ...report,
              typeSignature: "Report",
              projectId: asset.id,
            });
          }
        });

        return accum;
      }, []),
    [role, address, assets],
  );

  const columns = [
    {
      title: "Type",
      dataIndex: "typeSignature",
    },
    {
      title: "ID",
      dataIndex: "typeSignature",
      render: (typeSignature, record) =>
        typeSignature === "Project" ? record.id : record.projectId,
    },
    {
      title: "Creation date",
      dataIndex: "create_time",
      render: date => (date ? new Date(date).toDateString() : "-"),
    },
    {
      title: "Action",
      render: record => <Button onClick={() => onSign(record)}>Sign</Button>,
    },
  ];
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);
  return <TableList columns={columns} dataSource={dataSource} />;
};

export default SignAssets;
