import React from "react";
import TableList from "../../ui/TableList/TableList";
import { useOutletContext } from "react-router-dom";
import styles from "./AssetsTable.module.less";
import { Link } from "@ui";

const columns = [
  {
    title: "Project ID",
    dataIndex: "id",
  },
  {
    title: "ID",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Actions",
  },
];

const AssetsTable = () => {
  const { assets } = useOutletContext();

  const expandedRowRender = () => {
    return <div>11</div>;
  };
  return (
    <div className={styles.container}>
      <TableList
        expandable={{ expandedRowRender }}
        columns={columns}
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
