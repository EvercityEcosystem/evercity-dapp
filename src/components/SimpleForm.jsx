import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get, getOr } from 'unchanged';

import { Button, Row, Form, Tabs, Collapse } from 'antd';

import {
  CaretRightOutlined,
  SendOutlined,
} from '@ant-design/icons';

import cx from 'classnames';

import useFormItems from '../hooks/useFormItems';
import useCollapse from '../hooks/useCollapse';

import s from './SimpleForm.module.css';

const { Panel } = Collapse;
const { TabPane } = Tabs;

const noop = () => {};
const openAnimation = {
  appear: () => { },
  enter: () => { },
};
const SimpleForm = (props) => {
  const [form] = Form.useForm();

  const {
    initialValues,
    onSubmit,
    loading,
    config,
    size,
    submitText,
    submitIcon,
    disabled,
    children,
    itemClassName,
    collapseActiveKeys,
    tabsConfig,
    ghost,
    ...restProps
  } = props;

  const cls = cx({
    [s.formItem] : true,
    ...itemClassName,
  });

  const { state: collapseState, onToggleSection } = useCollapse(collapseActiveKeys);
  const [formItems, { sectionsIndex, getFormItem }] = useFormItems({ form, initialValues, config, size, itemClassName: cls });

  const formContent = useMemo(() => {
    let items = formItems;

    if (Object.keys(sectionsIndex).length > 1) { // if not only default section
      items = (
        <Tabs defaultActiveKey="1" animated={false}>
          {Object.entries(sectionsIndex).map(([key, section]) => {
            const subSections = Object.entries(section);

            if (!subSections.length) {
              return null;
            }

            let res = null;
            if (subSections.length > 1) {
              res = subSections.map(([subSectionKey, subSectionItems]) => {
                const subSectionFormItems = Object.entries(subSectionItems);

                return (
                  <Collapse
                    key={`${subSectionKey}_collapse`}
                    className={s.collapse}
                    bordered={false}
                    activeKey={collapseState.activePanelKey}
                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    onChange={() => onToggleSection(subSectionKey)}
                    openAnimation={openAnimation}
                  >
                    <Panel header={subSectionKey} key={subSectionKey}>
                      {subSectionFormItems.map(([itemKey, item]) => getFormItem(itemKey, item))}
                    </Panel>
                  </Collapse>
                );
              });
            } else {
              // if contains only default subsection
              const sectionFormItems = Object.entries(getOr({}, '[0][1]', subSections));
              res = sectionFormItems.map(([itemKey, item]) => getFormItem(itemKey, item));
            }

            const onTabClose = get(`${key}.onTabClose`, tabsConfig) || noop;
            const closable = get(`${key}.closable`, tabsConfig) || false;

            const tab = (
              <div>
                {key}
                {closable && (
                  <Button onClick={() => onTabClose(key)} type="link" shape="circle" icon="close" size="small" className={s.close} />
                )}
              </div>
            );

            return (
              <TabPane
                tab={tab} 
                key={key}
              >
                {res}
              </TabPane>
            );
          })}
        </Tabs>
      );
    }

    return items;
  },
  [collapseState.activePanelKey, formItems, getFormItem, onToggleSection, sectionsIndex, tabsConfig]
  );

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues]);

  const onFormSubmit = async (e) => {
    try {
      const values = await form.validateFields();
      return onSubmit(values);
    } catch (err) {
      console.error('Error: ', err);
      return;
    }

    e.preventDefault();
  };

  return (
    <Row gutter={24}>
      <Form 
        form={form}
        {...restProps}
      >
        {formContent}
        {submitText && (
          <div style={{ display: 'flex', width: '100%', paddingLeft: 12, paddingRight: 12, paddingTop: 5, paddingBottom: 5 }}>
            <Button loading={loading} onClick={onFormSubmit} disabled={disabled} type="primary" ghost={ghost} style={{ width: '100%' }} htmlType="submit" block>
              {submitIcon}
              {submitText}
            </Button>
          </div>
        )}
        {children(onFormSubmit)}
      </Form>
    </Row>
  );
};

SimpleForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  config: PropTypes.object,
  style: PropTypes.object,
  size: PropTypes.string,
  submitIcon: PropTypes.element,
  submitText: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.func,
  itemClassName: PropTypes.object,
  collapseActiveKeys: PropTypes.array,
  tabsConfig: PropTypes.object,
  ghost: PropTypes.bool,
};

SimpleForm.defaultProps = {
  loading: false,
  initialValues: {},
  config: null,
  style: {},
  size: 'default',
  submitIcon: <SendOutlined />,
  submitText: null,
  disabled: false,
  children: noop,
  itemClassName: {},
  collapseActiveKeys: [],
  tabsConfig: {},
  ghost: false,
};

export default SimpleForm;
