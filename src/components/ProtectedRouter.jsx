import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/storage";

const ProtectedRouter = () => {
  const { role } = getCurrentUser();
  return role ? <Outlet /> : <Navigate to="/login"/>;
};

export default ProtectedRouter;
