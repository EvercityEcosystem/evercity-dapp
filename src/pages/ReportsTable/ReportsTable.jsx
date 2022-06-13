import React, { useState } from "react";
import { Link, TableList } from "../../ui";
import { useOutletContext } from "react-router-dom";
import { Button, Form, Tag } from "antd";
import Actions from "../../components/Actions/Actions";
import dayjs from "dayjs";
import Modal from "antd/es/modal/Modal";
import Slider from "../../components/Slider";
import useAssets from "../../hooks/useAssets";

const reportStates = {
  1: {
    name: "Project owner sign pending",
    color: "grey",
  },
  2: {
    name: "Auditor sign pending",
    color: "grey",
  },
  4: {
    name: "Standard sign pending",
    color: "grey",
  },
  8: {
    name: "Investor sign pending",
    color: "grey",
  },
  16: {
    name: "Registry sign pending",
    color: "grey  ",
  },
  32: {
    name: "Issued",
    color: "green",
  },
};

const ReportsTable = () => {
  const { reports } = useOutletContext();
  const { releaseCarbonCredits } = useAssets();
  const [form] = Form.useForm();
  const [isShowReleaseModal, setIsShowReleaseModal] = useState(false);
  const toggleShowModal = () => {
    setIsShowReleaseModal(!isShowReleaseModal);
  };
  const onRelease = ({ projectId }) => {
    form.setFieldsValue({ projectId });
    toggleShowModal();
  };

  const handleSubmit = () => {
    const { projectId, minBalance } = form.form.getFieldValue();
    releaseCarbonCredits({
      projectId,
      minBalance,
    });
  };

  const columns = [
    {
      title: "Project ID",
      dataIndex: "project_id",
    },
    {
      title: "Status",
      dataIndex: "state",
      render: state => (
        <Tag color={reportStates[state].color}>{reportStates[state].name}</Tag>
      ),
    },
    {
      title: "Creation Date",
      dataIndex: "create_time",
      render: date => dayjs(date).format("MM/DD/YYYY"),
    },
    {
      title: "Manage",
      dataIndex: "create_time",
      render: (createTime, record) => (
        <Actions>
          <Link to={`${createTime}/signatures`} type="action">
            signatures
          </Link>
          <Button onClick={() => onRelease({ projectId: record.project_id })}>
            Release
          </Button>
        </Actions>
      ),
    },
  ];
  console.log(reports);
  return (
    <>
      <Modal
        title="Issuance Carbon Credits"
        visible={isShowReleaseModal}
        onCancel={toggleShowModal}
        onOk={handleSubmit}
        okText="Release">
        <Form form={form}>
          <Form.Item name="min_balance" label="Min balance">
            <Slider />
          </Form.Item>
        </Form>
      </Modal>
      <TableList columns={columns} dataSource={reports} />
    </>
  );
};

export default ReportsTable;
