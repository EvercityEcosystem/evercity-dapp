import React from "react";
import styles from "./Link.module.less";

const SwitchLink = ({ children }) => {
  return <div className={styles.switch}>{children}</div>;
};

export default SwitchLink;
