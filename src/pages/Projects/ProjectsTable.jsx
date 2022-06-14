import React from "react";
import TableList from "../../ui/TableList/TableList";
import { useOutletContext } from "react-router-dom";
import styles from "./ProjectsTable.module.less";
import { Link } from "@ui";
import Actions from "../../components/Actions/Actions";
import { Tag } from "antd";

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
    render: state => <Tag>{PROJECT_STATES[state]}</Tag>,
  },
  {
    title: "Manage",
    dataIndex: "id",
    render: id => (
      <Actions>
        <Link to={`${id}/signatures`} type="action">
          Signatures
        </Link>
      </Actions>
    ),
  },
];

const ProjectsTable = () => {
  const { assets } = useOutletContext();

  return (
    <>
      <TableList
        columns={columns}
        rowKey="id"
        dataSource={assets}
        className={styles.table}
      />
      <div className={styles.container}>
        <Link to="create" type="button">
          Create a new project
        </Link>
      </div>
    </>
  );
};

export default ProjectsTable;
