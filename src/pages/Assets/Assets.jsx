import React, { useEffect } from "react";
import useAssets from "../../hooks/useAssets";
import { Outlet } from "react-router-dom";
import { PageHeader } from "@ui";
import Loader from "../../components/Loader";
import { NavLink } from "../../ui";
import SwitchLink from "../../ui/Link/SwitchLink";
import Container from "../../ui/Container/Container";

const Assets = () => {
  const { fetchAssets, assets } = useAssets();

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return (
    <Container>
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
    </Container>
  );
};

export default Assets;
