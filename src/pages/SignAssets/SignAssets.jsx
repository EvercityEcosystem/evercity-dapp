import React, { useEffect, useMemo } from "react";
import useAssets from "../../hooks/useAssets";
import { TableList } from "../../ui";
import { getCurrentUser } from "../../utils/storage";
import { Button } from "antd";

const SignAssets = () => {
  const { assets, fetchAssets, signProject } = useAssets();
  const { role, address } = getCurrentUser();

  const onSign = id => {
    signProject(id);
  };

  const dataSource = useMemo(
    () =>
      assets.reduce((accum, asset) => {
        const foundDemands = asset.required_signers.filter(
          signer => signer[0] === address && signer[1] === role,
        );
        if (foundDemands.length > 0) {
          accum.push(asset);
        }
        return accum;
      }, []),
    [role, address, assets],
  );

  const columns = [
    {
      title: "Type",
    },
    {
      title: "Action",
      dataIndex: "id",
      render: id => <Button onClick={() => onSign(id)}>Sign</Button>,
    },
  ];
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);
  return <TableList columns={columns} dataSource={dataSource} />;
};

export default SignAssets;
