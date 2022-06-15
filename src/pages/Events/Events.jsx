import React, { useEffect, useState } from "react";
import usePolkadot from "../../hooks/usePolkadot";
import { Descriptions } from "antd";
import { PageHeader, TableList } from "../../ui";
import Container from "../../ui/Container/Container";

const columns = [
  {
    title: "Pallet",
    dataIndex: "pallet",
  },
  {
    title: "Method",
    dataIndex: "method",
  },
  {
    title: "Block number",
    width: 150,
    dataIndex: "block_number",
    render: number => (
      <a
        target="__blank"
        href={`https://polkadot.js.org/apps/?rpc=${
          import.meta.env.VITE_WS_PROVIDER_URL
        }/#/explorer/query/${number}`}>
        {number}
      </a>
    ),
  },
  {
    title: "Params",
    dataIndex: "params",
    width: 500,
    render: params => (
      <Descriptions size="small" bordered layout="vertical">
        {Object.keys(params).map(key => (
          <Descriptions.Item key={key} label={key}>
            {params[key]}
          </Descriptions.Item>
        ))}
      </Descriptions>
    ),
  },
];

const Events = () => {
  const { subscribeOnEvents } = usePolkadot();
  const [dataEvents, setDataEvents] = useState([]);
  useEffect(() => {
    subscribeOnEvents(newEvents => {
      setDataEvents(dataEvents => [...dataEvents, ...newEvents]);
    });
  }, [subscribeOnEvents]);

  return (
    <Container>
      <PageHeader title="Events monitoring" />
      <TableList dataSource={dataEvents} columns={columns} />
    </Container>
  );
};

export default Events;
