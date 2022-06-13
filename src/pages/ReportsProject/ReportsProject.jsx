import React, { useMemo } from "react";
import { Link } from "../../ui";
import { useOutletContext } from "react-router-dom";
import { Tag, Timeline } from "antd";
import styles from "./ReportsProject.module.less";
import { PlusCircleOutlined } from "@ant-design/icons";

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
  const isAvailableCreate = useMemo(
    () =>
      project?.annual_reports?.[project?.annual_reports?.length - 1]?.state ===
        32 || project?.annual_reports.length === 0,
    [project],
  );
  return (
    <div>
      <Timeline mode="alternate" className={styles.reports}>
        {project?.annual_reports?.map(report => (
          <Timeline.Item
            key={report.create_time}
            color={reportStates[report.state].color}
            label={new Date(report.create_time).toDateString()}>
            <Tag>{reportStates[report.state].name}</Tag>
            <p>
              <Link to={`${report.create_time}/signatures`}>Signatures</Link>
              <Link to={`${report.create_time}/release`}>Release</Link>
            </p>
          </Timeline.Item>
        ))}
        {isAvailableCreate && (
          <Timeline.Item dot={<PlusCircleOutlined />}>
            <Link to="create">New Report</Link>
          </Timeline.Item>
        )}
      </Timeline>
    </div>
  );
};

export default ReportsProject;
