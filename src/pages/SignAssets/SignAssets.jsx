import React from "react";
import useAssets from "../../hooks/useAssets";
import { TableList } from "../../ui";
import { Button, Col, Row } from "antd";
import { useOutletContext } from "react-router-dom";

const SignAssets = () => {
  const { signProject, signLastReport } = useAssets();
  const { assets } = useOutletContext();
  const onSign = record => {
    if (record.typeSignature === "Project") {
      signProject(record.id);
    }
    if (record.typeSignature === "Report") {
      signLastReport(record.projectId);
    }
  };

  const projectsColumns = [
    {
      title: "Type",
      dataIndex: "typeSignature",
    },
    {
      title: "ID",
      dataIndex: "typeSignature",
      render: (typeSignature, record) =>
        typeSignature === "Project" ? record.id : record.projectId,
    },
    {
      title: "Creation date",
      dataIndex: "create_time",
      render: date => (date ? new Date(date).toDateString() : "-"),
    },
    {
      title: "Action",
      render: record => <Button onClick={() => onSign(record)}>Sign</Button>,
    },
  ];

  const reportsColumns = [
    {
      title: "Type",
      dataIndex: "typeSignature",
    },
    {
      title: "ID",
      dataIndex: "typeSignature",
      render: (typeSignature, record) =>
        typeSignature === "Project" ? record.id : record.projectId,
    },
    {
      title: "Creation date",
      dataIndex: "create_time",
      render: date => (date ? new Date(date).toDateString() : "-"),
    },
    {
      title: "Action",
      render: record => <Button onClick={() => onSign(record)}>Sign</Button>,
    },
  ];

  return (
    <Row>
      <Col>
        Projects: <TableList columns={projectsColumns} dataSource={assets} />
      </Col>
      <Col>
        Reports:{" "}
        <TableList
          columns={reportsColumns}
          dataSource={assets.map(asset => asset.annual_reports)}
        />
      </Col>
    </Row>
  );
};

export default SignAssets;
