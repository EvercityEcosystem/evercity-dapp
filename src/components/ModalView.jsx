/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Modal, PageHeader,
} from 'antd';

import pickKeys from '../utils/pickKeys';

import Message from './Message';
import Loader from './Loader';
import Breadcrumbs from './Breadcrumbs';

import s from './ModalView.module.css';

const ModalView = (props) => {
  const {
    breadcrumbs, loading, visible, onVisibleChange,
    title, tags, content, extraContent, style, headerStyle,
    info, error, width,
  } = props;

  useEffect(
    () => {
      onVisibleChange(visible);
    },
    [onVisibleChange, visible],
  );

  return (
    <Modal
      width={width}
      className={s.modalContainer}
      destroyOnClose
      title={(
        <PageHeader
          className={s.pageHeader}
          style={headerStyle}
          title={title}
          tags={tags}
        />
      )}
      visible={visible}
      {...pickKeys(['onCancel', 'footer'], props)}
      style={{ padding: 0, ...style }}
    >
      <Loader spinning={loading}>
        <div className={s.container}>
          <Message type="info" text={info} />
          <Message text={error} />

          <Breadcrumbs data={breadcrumbs} />
          {content}
        </div>

        {extraContent}
      </Loader>
    </Modal>
  );
};

ModalView.propTypes = {
  content: PropTypes.element.isRequired,
  title: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string,
  tags: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape),
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onVisibleChange: PropTypes.func,
  footer: PropTypes.element,
  style: PropTypes.shape(),
  headerStyle: PropTypes.shape(),
  extraContent: PropTypes.element,
  loading: PropTypes.bool,
  width: PropTypes.number,
};

ModalView.defaultProps = {
  title: '',
  info: '',
  error: '',
  tags: [],
  breadcrumbs: [],
  onCancel: () => {},
  onVisibleChange: () => {},
  visible: false,
  footer: null,
  style: {},
  headerStyle: {},
  extraContent: null,
  loading: false,
  width: 800,
};

export default ModalView;
