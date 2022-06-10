import React, { useEffect } from "react";
import useAssets from "../hooks/useAssets";
import { Outlet, useParams } from "react-router-dom";

const Project = () => {
  const { fetchProject, project } = useAssets();
  const params = useParams();
  useEffect(() => {
    fetchProject(params.projectId);
  }, [fetchProject]);
  return <Outlet context={{ project }} />;
};

export default Project;
