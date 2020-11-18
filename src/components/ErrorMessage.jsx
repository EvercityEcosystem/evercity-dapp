import React from 'react';
import PropTypes from 'prop-types';

import { Alert } from 'antd';

const ErrorMessage = ({ style, type, text }) => {
  let message = text;

  if (typeof text === 'string') {
    message = (text || '').trim();
  }

  if (!message) {
    return null;
  }

  return (
    <Alert 
      style={{ marginBottom: 20, whiteSpace: 'pre-wrap', ...style }}
      message={message}
      type={type}
    />
  );
};

ErrorMessage.propTypes = {
  style: PropTypes.object,
  type: PropTypes.string,
  text: PropTypes.any,
};

ErrorMessage.defaultProps = {
  style: {},
  type: 'error',
  text: '',
};

export default ErrorMessage;
