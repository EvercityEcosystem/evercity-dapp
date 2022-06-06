import React from "react";
import TableList from "../../components/TableList";
import { Link, useOutletContext } from "react-router-dom";
import styles from "./Assets.module.less";
import { RightCircleOutlined } from "@ant-design/icons";
import { Typography } from "antd";

const columns = [
  {
    title: "ID",
  },
  {
    title: "Project ID",
  },
  {
    title: "Status",
  },
];

const AssetsTable = () => {
  const { assets } = useOutletContext();
  return (
    <>
      {assets.length > 0 && <TableList columns={columns} dataSource={assets} />}
      <Link to="/dapp/assets/projects">
        <span className={styles.newProjectLink}>
          <RightCircleOutlined className={styles.newProjectLink__icon} />
          <Typography.Text>Create a new project</Typography.Text>
        </span>
      </Link>
    </>
  );
};

export default AssetsTable;
