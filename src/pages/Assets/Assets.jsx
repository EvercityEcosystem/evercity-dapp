import React, { useEffect } from "react";
import useAssets from "../../hooks/useAssets";
import { Outlet } from "react-router-dom";
import styles from "./Assets.module.less";
import { PageHeader } from "@ui";
import Loader from "../../components/Loader";

const Assets = () => {
  const { fetchAssets, assets } = useAssets();

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return (
    <div className={styles.container}>
      <PageHeader title={"Carbon Credits"} />
      <Loader>
        <Outlet context={{ assets }} />
      </Loader>
    </div>
  );
};

export default Assets;
