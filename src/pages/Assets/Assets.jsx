import React, { useEffect } from "react";
import useAssets from "../../hooks/useAssets";
import { Outlet } from "react-router-dom";
import styles from "./Assets.module.less";
import { PageHeader } from "@ui";
import Loader from "../../components/Loader";
import { NavLink } from "../../ui";
import SwitchLink from "../../ui/Link/SwitchLink";

const Assets = () => {
  const { fetchAssets, assets } = useAssets();

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return (
    <div className={styles.container}>
      <PageHeader
        title="Asset explorer"
        extra={
          <SwitchLink>
            <NavLink to="projects" type="switch">
              Projects
            </NavLink>
            <NavLink to="reports" type="switch">
              Reports
            </NavLink>
            <NavLink to="carbon_credits" type="switch">
              Carbon Credits
            </NavLink>
          </SwitchLink>
        }
      />
      <Loader>
        <Outlet context={{ assets }} />
      </Loader>
    </div>
  );
};

export default Assets;
