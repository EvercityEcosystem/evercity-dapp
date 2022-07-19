import React, { useMemo } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

const Reports = () => {
  const { assets } = useOutletContext();
  const reports = useMemo(
    () =>
      assets.reduce((reports, project) => {
        const bindedReports = project.annualReports.map(report => ({
          project_id: project.id,
          ...report,
        }));
        reports.push(...bindedReports);
        return reports;
      }, []),
    [assets],
  );
  return <Outlet context={{ reports, assets }} />;
};

export default Reports;
