import React from "react";
import TableList from "../../ui/TableList/TableList";
import { useOutletContext } from "react-router-dom";
import styles from "./AssetsTable.module.less";
import { Link } from "@ui";

const columns = [
  {
    title: "Project ID",
  },
  {
    title: "ID",
  },
  {
    title: "Status",
  },
  {
    title: "Owner",
  },
  {
    title: "Report ID",
  },
];

const AssetsTable = () => {
  const { assets } = useOutletContext();
  return (
    <div className={styles.container}>
      <TableList
        columns={columns}
        dataSource={assets}
        className={styles.container__table}
      />
      <Link to="/dapp/assets/projects" type="button">
        Create a new project
      </Link>
    </div>
  );
};

export default AssetsTable;
