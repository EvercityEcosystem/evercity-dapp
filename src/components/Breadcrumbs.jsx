/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import useLocation from 'wouter/use-location';

import {
  Breadcrumb,
} from 'antd';

const Breadcrumbs = ({ data, style }) => {
  const [, setLocation] = useLocation();

  return (
    <Breadcrumb separator=">" style={style}>
      {data.map((bc) => (
        <Breadcrumb.Item key={bc.path}>
          <a style={{ cursor: 'pointer' }} onClick={() => setLocation(bc.path)}>
            {bc.title}
          </a>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

Breadcrumbs.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    title: PropTypes.string,
  })).isRequired,
  style: PropTypes.shape(),
};

Breadcrumbs.defaultProps = {
  style: {},
};

export default Breadcrumbs;
