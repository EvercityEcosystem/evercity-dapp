import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import { Breadcrumb } from "antd";

const Breadcrumbs = ({ data, style }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumb separator=">" style={style}>
      {data.map(bc => (
        <Breadcrumb.Item key={bc.path}>
          <a style={{ cursor: "pointer" }} onClick={() => navigate(bc.path)}>
            {bc.title}
          </a>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

Breadcrumbs.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  style: PropTypes.shape(),
};

Breadcrumbs.defaultProps = {
  style: {},
};

export default Breadcrumbs;
