import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useLocation from 'wouter/use-location';

import { 
  Breadcrumb,
} from 'antd';

const Breadcrumbs = ({ data, style }) => {
  const [_, setLocation] = useLocation();

  return (
    <Breadcrumb separator=">" style={style}>
      {data.map(bc => (
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
  data: PropTypes.array.isRequired,
  style: PropTypes.object,
};

Breadcrumbs.defaultProps = {
  style: {},
};

export default Breadcrumbs;
