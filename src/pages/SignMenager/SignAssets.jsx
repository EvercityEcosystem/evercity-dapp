import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAssets from "../../hooks/useAssets";
import SwitchLink from "../../ui/Link/SwitchLink";
import { NavLink, PageHeader } from "../../ui";
import Container from "../../ui/Container/Container";
const SignAssets = () => {
  const { assets, fetchAssets } = useAssets();
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return (
    <Container>
      <PageHeader
        title="Sign manager"
        extra={
          <SwitchLink>
            <NavLink to="projects" type="switch">
              Projects
            </NavLink>
            <NavLink to="reports" type="switch">
              Reports
            </NavLink>
          </SwitchLink>
        }
      />
      <Outlet context={{ assets }} />
    </Container>
  );
};

export default SignAssets;
