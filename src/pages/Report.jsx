import React from "react";
import { Outlet, useOutletContext, useParams } from "react-router-dom";

const Report = () => {
  const params = useParams();
  const { project } = useOutletContext();
  const report = project?.annual_reports?.find(
    report => (report.create_time = params.reportId),
  );

  return <Outlet context={{ report }} />;
};

export default Report;
