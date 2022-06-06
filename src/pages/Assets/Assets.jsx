import React, { useEffect } from "react";
import { PageHeader } from "antd";
import useAssets from "../../hooks/useAssets";
import { Outlet } from "react-router-dom";
import styles from "./Assets.module.less";

const Assets = () => {
  const { fetchAssets, assets } = useAssets();

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return (
    <div className={styles.container}>
      <PageHeader title="Carbon Credits" />
      <Outlet context={{ assets }} />
    </div>
  );
};

export default Assets;
