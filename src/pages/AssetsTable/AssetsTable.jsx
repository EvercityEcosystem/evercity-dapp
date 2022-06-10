import React from "react";
import TableList from "../../ui/TableList/TableList";
import { useOutletContext } from "react-router-dom";
import styles from "./AssetsTable.module.less";
import { Link } from "@ui";
import { Button } from "antd";

const PROJECT_STATES = {
  1: "Project owner sign pending",
  2: "Auditor sign pending",
  4: "Standard sign pending",
  8: "Investor sign pending",
  16: "Registry sign pending",
  32: "Registered",
  64: "Evercity sign pending",
};

const columns = [
  {
    title: "Project ID",
    dataIndex: "id",
  },
  {
    title: "Status",
    dataIndex: "state",
    render: state => PROJECT_STATES[state],
  },
  {
    title: "Manage",
    dataIndex: "id",
    render: id => (
      <>
        <Link to={`/dapp/project_owner/assets/${id}/signatures`}>
          Signatures
        </Link>
        <Link to={`/dapp/project_owner/assets/${id}/reports`}>Reports</Link>
      </>
    ),
  },
];

const AssetsTable = () => {
  const { assets } = useOutletContext();
  const expandedRowRender = record => {
    const columns = [
      {
        title: "Name",
      },
      {
        title: "ID",
        dataIndex: "asset_id",
      },
      {
        title: "Count",
      },
      {
        title: "Actions",
        render: () => <Button>Burn</Button>,
      },
    ];

    return (
      <TableList
        pagination={false}
        columns={columns}
        dataSource={record.annual_reports}
      />
    );
  };
  return (
    <div className={styles.container}>
      <TableList
        expandable={{ expandedRowRender }}
        columns={columns}
        rowKey="id"
        dataSource={assets}
        className={styles.container__table}
      />
      <Link to="/dapp/project_owner/assets/create" type="button">
        Create a new project
      </Link>
    </div>
  );
};

export default AssetsTable;
