import React, { useMemo } from "react";
import { getCurrentUser } from "../../utils/storage";
import { useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
import { Button } from "antd";
import { roleToStateMapping } from "../../utils/roles";
import { TableList } from "../../ui";
import useAssets from "../../hooks/useAssets";

const SignReports = () => {
  const { signLastReport } = useAssets();
  const { address, role } = getCurrentUser();
  const { assets } = useOutletContext();

  const onSignReport = record => {
    signLastReport(record.project_id);
  };

  const reportsColumns = [
    {
      title: "Creation date",
      dataIndex: "create_time",
      render: date => dayjs(date).format("MM/DD/YYYY"),
    },
    {
      title: "Project ID",
      dataIndex: "project_id",
    },
    {
      title: "Action",
      render: record => (
        <Button onClick={() => onSignReport(record)}>Sign</Button>
      ),
    },
  ];

  const requiredReports = useMemo(
    () =>
      assets.reduce((reports, project) => {
        project.annual_reports.forEach(report => {
          const relatedReports = report.required_signers?.filter(
            signer =>
              signer[0] === address &&
              signer[1] === role &&
              roleToStateMapping[role] >= report.state,
          );
          if (relatedReports.length > 0) {
            reports.push({
              project_id: project.id,
              ...report,
            });
          }
        });

        return reports;
      }, []),
    [assets],
  );

  return <TableList columns={reportsColumns} dataSource={requiredReports} />;
};

export default SignReports;
