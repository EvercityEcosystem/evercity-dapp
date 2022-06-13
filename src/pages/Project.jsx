import React, { useMemo } from "react";
import { Outlet, useOutletContext, useParams } from "react-router-dom";

const Project = () => {
  const { assets } = useOutletContext();
  const params = useParams();
  const project = useMemo(
    () => assets.find(asset => asset.id === Number(params.projectId)),
    [params, assets],
  );
  return <Outlet context={{ project }} />;
};

export default Project;
