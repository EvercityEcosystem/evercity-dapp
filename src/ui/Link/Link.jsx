import React from "react";
import { Link as BaseLink } from "react-router-dom";
import styles from "./Link.module.less";
import classnames from "classnames";

const Link = ({ type, className, ...props }) => {
  return (
    <BaseLink
      className={classnames(className, styles[`link-${type}`])}
      {...props}
    />
  );
};

export default Link;
