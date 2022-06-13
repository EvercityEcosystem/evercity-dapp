import React from "react";
import { Button as BaseButton } from "antd";
import classnames from "classnames";
import styles from "./Button.module.less";

const typeToSize = {
  action: "small",
};

const Button = ({ className, type, size, ...props }) => {
  return (
    <BaseButton
      className={classnames(
        styles.button,
        styles[`button--${type}`],
        className,
      )}
      size={typeToSize[type] || size}
      {...props}
    />
  );
};

export default Button;
