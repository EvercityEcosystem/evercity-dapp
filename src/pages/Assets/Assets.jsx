import React, { useEffect, useMemo } from "react";
import useAssets from "../../hooks/useAssets";
import { Outlet } from "react-router-dom";
import { PageHeader } from "@ui";
import Loader from "../../components/Loader";
import { NavLink } from "../../ui";
import SwitchLink from "../../ui/Link/SwitchLink";
import Container from "../../ui/Container/Container";
import { getCurrentUser } from "../../utils/storage";

const Assets = () => {
  const { fetchAssets, assets } = useAssets();
  const { address } = getCurrentUser();
  const ownableAssets = useMemo(
    () => assets?.filter(asset => asset.owner === address),
    [address, assets],
  );
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
        <Outlet context={{ assets: ownableAssets }} />
      </Loader>
    </Container>
  );
};

export default Assets;
