import React from "react";
import { NavLink as BaseLink } from "react-router-dom";
import styles from "./Link.module.less";
import classnames from "classnames";

const NavLink = React.forwardRef(
  ({ className, type, activeStyle, activeClassName, ...linkProps }, ref) => {
    const baseStyles = [className, styles.link, styles[`link-${type}`]];

    return (
      <BaseLink
        type={type}
        className={({ isActive }) =>
          isActive
            ? classnames(
                ...baseStyles,
                styles[`link-${type}--active`],
                activeClassName,
              )
            : classnames(...baseStyles)
        }
        style={({ isActive }) => ({
          ...linkProps.style,
          ...(isActive ? activeStyle : null),
        })}
        ref={ref}
        {...linkProps}
      />
    );
  },
);

export default NavLink;
