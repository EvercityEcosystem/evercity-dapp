import React from "react";
import { PageHeader as Header, Typography } from "antd";
import classnames from "classnames";
import styles from "./PageHeader.module.less";

const PageHeader = ({ className, title, ...rest }) => {
  return (
    <Header
      ghost={false}
      className={classnames(styles.pageHeader, className)}
      title={
        <Typography.Title level={2} className={styles.title}>
          {title}
        </Typography.Title>
      }
      {...rest}
    />
  );
};

export default PageHeader;
