import React from "react";
import { Outlet, useOutletContext, useParams } from "react-router-dom";

const Report = () => {
  const params = useParams();
  const { reports } = useOutletContext();

  const report = reports?.find(
    report => String(report.create_time) === String(params.reportId),
  );
  return <Outlet context={{ report }} />;
};

export default Report;
