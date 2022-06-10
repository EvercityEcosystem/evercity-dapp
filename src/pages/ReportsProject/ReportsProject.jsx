import React from "react";
import { Link } from "../../ui";
import { useOutletContext } from "react-router-dom";
import { Timeline } from "antd";

const reportStates = {
  1: {
    name: "Project owner sign pending",
    color: "grey",
  },
  2: {
    name: "Auditor sign pending",
    color: "grey",
  },
  4: {
    name: "Standard sign pending",
    color: "grey",
  },
  8: {
    name: "Investor sign pending",
    color: "grey",
  },
  16: {
    name: "Registry sign pending",
    color: "grey  ",
  },
  32: {
    name: "Issued",
    color: "green",
  },
};

const ReportsProject = () => {
  const { project } = useOutletContext();
  return (
    <div>
      <Timeline mode="alternate">
        {project?.annual_reports?.map(report => (
          <Timeline.Item
            key={report.create_time}
            color={reportStates[report.state].color}
            label={reportStates[report.state].name}>
            <p>{new Date(report.create_time).toDateString()}</p>
            <Link to={`${report.create_time}/signatures`}>Signatures</Link>
            <Link to={`${report.create_time}/release`}>Release</Link>
          </Timeline.Item>
        ))}
      </Timeline>
      <Link to="create" type="button">
        New Report
      </Link>
    </div>
  );
};

export default ReportsProject;
