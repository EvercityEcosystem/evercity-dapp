import React from "react";
import classnames from "classnames";

import styles from "./Container.module.less";

const Container = ({ children, className }) => (
  <div className={classnames(styles.container, className)}>{children}</div>
);
export default Container;
