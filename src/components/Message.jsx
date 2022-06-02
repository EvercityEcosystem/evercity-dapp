import React from 'react';
import PropTypes from 'prop-types';

import { Alert } from 'antd';

const Message = ({ style, type, text }) => {
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

Message.propTypes = {
  style: PropTypes.shape(),
  type: PropTypes.string,
  text: PropTypes.string,
};

Message.defaultProps = {
  style: {},
  type: 'error',
  text: '',
};

export default Message;
