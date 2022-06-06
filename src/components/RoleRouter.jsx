import React from "react";
import { Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/storage";
import ErrorFound from "./ErrorFound";

const RoleRouter = ({ roles, children }) => {
  const { role } = getCurrentUser();
  return roles.includes(role.toLowerCase()) ? (
    children || <Outlet />
  ) : (
    <ErrorFound status={403} />
  );
};

export default RoleRouter;
