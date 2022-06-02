/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";

import { getOr } from "unchanged";

import { Link } from "react-router-dom";
import { Badge, Menu } from "antd";

import pickKeys from "../utils/pickKeys";

import styles from "./MenuView.module.less";

const noop = () => {};
const MenuView = props => {
  const { nodes } = props;

  const getLink = node => {
    const linkProps = {
      to: node.path,
      onClick: (node.onClick && (() => node.onClick(node))) || noop,
    };

    return (
      <Link className={styles.link} {...linkProps}>
        {node.title}
      </Link>
    );
  };

  const renderNode = node => {
    const children = getOr([], "children", node);

    if (children.length) {
      return (
        <Menu.SubMenu key={node.key || node.title} title={node.title}>
          {children.map(renderNode)}
        </Menu.SubMenu>
      );
    }

    return (
      <Menu.Item key={node.key || node.title} icon={node.icon}>
        {node.badgeCount ? (
          <Badge count={node.badgeCount} offset={[8, 0]} size="small">
            {getLink(node)}
          </Badge>
        ) : (
          getLink(node)
        )}
      </Menu.Item>
    );
  };

  const activeNodes = nodes
    .filter(n => n.active === true)
    .map(n => n.key || n.title);

  return (
    <Menu
      {...pickKeys(
        ["className", "style", "mode", "selectable", "onClick", "theme"],
        props,
      )}
      selectedKeys={activeNodes}>
      {nodes.map(renderNode)}
    </Menu>
  );
};

MenuView.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  className: PropTypes.string,
  style: PropTypes.shape(),
  mode: PropTypes.string,
};

MenuView.defaultProps = {
  className: null,
  style: {},
  mode: "horizontal",
};

export default MenuView;
