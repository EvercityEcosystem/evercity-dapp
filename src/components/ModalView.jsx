import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { 
  Modal, PageHeader, Breadcrumb,
} from 'antd';

import useLocation from 'wouter/use-location';
import pickKeys from 'utils/pickKeys';

import ErrorMessage from './ErrorMessage';
import Loader from './Loader';
import Breadcrumbs from './Breadcrumbs';

import s from './ModalView.module.css';

const ModalView = (props) => {
  const [, setLocation] = useLocation();

  const {
    breadcrumbs, loading, visible, onVisibleChange,
    title, tags, content, extraContent, style, headerStyle,
    info, error,
  } = props;

  useEffect(
    () => {
      onVisibleChange(visible);
    },
    [visible]
  );

  return (
    <Modal
      width={800}
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
          <ErrorMessage type="info" text={info} />
          <ErrorMessage text={error} />

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
    PropTypes.arrayOf(PropTypes.object)
  ]),
  breadcrumbs: PropTypes.array,
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onVisibleChange: PropTypes.func,
  footer: PropTypes.element,
  style: PropTypes.object,
  headerStyle: PropTypes.object,
  extraContent: PropTypes.element,
  loading: PropTypes.bool,
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
};

export default ModalView;
