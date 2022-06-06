import React from "react";
import TableList from "../../ui/TableList/TableList";
import { Link, useOutletContext } from "react-router-dom";
import styles from "./Assets.module.less";
import { RightCircleOutlined } from "@ant-design/icons";
import { Typography } from "antd";

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
    <>
      <TableList
        columns={columns}
        dataSource={assets}
        className={styles.table}
      />
      <div className={styles.newProject}>
        <Link to="/dapp/assets/projects" className={styles.newProject__link}>
          <RightCircleOutlined className={styles.newProject__icon} />
          <Typography.Text>Create a new project</Typography.Text>
        </Link>
      </div>
    </>
  );
};

export default AssetsTable;
