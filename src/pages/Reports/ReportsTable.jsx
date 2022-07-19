import React from "react";
import { Link, TableList } from "../../ui";
import { useOutletContext } from "react-router-dom";
import { Popconfirm, Tag } from "antd";
import Actions from "../../components/Actions/Actions";
import dayjs from "dayjs";
import useAssets from "../../hooks/useAssets";
import Button from "../../ui/Button/Button";
import styles from "./ReportsTable.module.less";

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

const ReportsTable = () => {
  const { reports } = useOutletContext();
  const { releaseCarbonCredits } = useAssets();

  const onRelease = projectId => {
    releaseCarbonCredits({
      projectId,
    });
  };

  const columns = [
    {
      title: "Project ID",
      dataIndex: "project_id",
    },
    {
      title: "Status",
      dataIndex: "state",
      render: state => (
        <Tag color={reportStates[state].color}>{reportStates[state].name}</Tag>
      ),
    },
    {
      title: "Creation Date",
      dataIndex: "create_time",
      render: date => dayjs(date).format("MM/DD/YYYY"),
    },
    {
      title: "Manage",
      dataIndex: "create_time",
      render: (createTime, record) => (
        <Actions>
          <Link to={`${createTime}/signatures`} type="action">
            Signatures
          </Link>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => onRelease(record.project_id)}
            disabled={record.carbon_credits_released || record.state !== 32}>
            <Button
              disabled={record.carbon_credits_released || record.state !== 32}
              type="action">
              Release
            </Button>
          </Popconfirm>
        </Actions>
      ),
    },
  ];
  return (
    <>
      <TableList
        columns={columns}
        dataSource={reports}
        className={styles.table}
      />
      <div className={styles.container}>
        <Link to="create" type="button">
          Create a new report
        </Link>
      </div>
    </>
  );
};

export default ReportsTable;
