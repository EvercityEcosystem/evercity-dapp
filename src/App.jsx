import React, { useEffect, useContext, useMemo } from "react";

import { Route, Routes } from "react-router-dom";

import "./App.less";

import Layout from "./components/Layout";
import ErrorFound from "./components/ErrorFound";
import Loader from "./components/Loader";
import { store } from "./components/PolkadotProvider";

import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Roles from "./pages/Roles";
import Tokens from "./pages/Tokens";
import Bonds from "./pages/Bonds";
import CustodianRequests from "./pages/CustodianRequests";
import CustodianTokens from "./pages/CustodianTokens";
import CustodianReporting from "./pages/CustodianReporting";
import Profile from "./pages/Profile";
import BondConfig from "./pages/BondConfig";

import { connect, getInjector } from "./utils/polkadot";
import usePolkadot from "./hooks/usePolkadot";
import ProtectedRouter from "./components/ProtectedRouter";
import RoleRouter from "./components/RoleRouter";
import Assets from "./pages/Assets/Assets";
import CreateProject from "./pages/CreateProject/CreateProject";
import SignaturesProject from "./pages/SignaturesProject/SignaturesProject";
import SignAssets from "./pages/SignAssets/SignAssets";
import ReportsTable from "./pages/ReportsTable/ReportsTable";
import CreateReport from "./pages/CreateReport/CreateReport";
import Project from "./pages/Project";
import SignaturesReport from "./pages/SignaturesReport";
import Report from "./pages/Report";
import CarbonCredits from "./pages/CarbonCredits/CarbonCredits";
import ProjectsTable from "./pages/ProjectsTable/ProjectsTable";
import Reports from "./pages/Reports";
import CarbonCreditsTable from "./pages/CarbonCredits/CarbonCreditsTable";
import SignReports from "./pages/SignAssets/SignReports";
import SignProjects from "./pages/SignAssets/SignProjects";

const App = () => {
  const { polkadotState, dispatch } = useContext(store);
  const { dayDuration } = usePolkadot();

  const connectAPI = async () => {
    const api = await connect();
    api.on("error", error => {
      console.error("API error: ", error);
    });

    dispatch({
      type: "setAPI",
      payload: api,
    });
  };

  const setTimeStep = async () => {
    const timeStep = await dayDuration();

    dispatch({
      type: "setTimeStep",
      payload: timeStep,
    });
  };

  const setInjector = async () => {
    const injector = await getInjector();
    dispatch({
      type: "setInjector",
      payload: injector,
    });
  };

  useEffect(() => {
    connectAPI();
    setInjector();
  }, [dispatch]);

  const isAPIReady = useMemo(
    () => polkadotState?.api?.isConnected && polkadotState?.api?.isReady,
    [polkadotState],
  );

  useEffect(() => {
    if (isAPIReady) {
      setTimeStep();
    }
  }, [isAPIReady]);

  return (
    <Loader spinning={!isAPIReady} tip="Connecting to blockchain node">
      <Layout>
        <Routes>
          <Route path="/" index element={<Bonds />} />
          <Route path="login" element={<Login />} />
          <Route path="dapp" element={<ProtectedRouter />}>
            <Route path="profile" element={<Profile />} />
            <Route path="logout" element={<Logout />} />
            <Route path="master" element={<RoleRouter roles={[1]} />}>
              <Route path="roles" element={<Roles />} />
            </Route>
            <Route path="issuer" element={<RoleRouter roles={[4]} />}>
              <Route path="tokens/:action" element={<Tokens />} />
              <Route path="bond" element={<BondConfig />} />
            </Route>
            <Route path="investor" element={<RoleRouter roles={[8]} />}>
              <Route path="tokens/:action" element={<Tokens />} />
            </Route>
            <Route path="auditor_cc">
              <Route path="sign" element={<SignAssets />}>
                <Route path="projects" element={<SignProjects />} />
                <Route path="reports" element={<SignReports />} />
              </Route>
            </Route>
            <Route path="registry_cc">
              <Route path="sign" element={<SignAssets />}>
                <Route path="projects" element={<SignProjects />} />
                <Route path="reports" element={<SignReports />} />
              </Route>
            </Route>
            <Route path="standard_cc">
              <Route path="sign" element={<SignAssets />}>
                <Route path="projects" element={<SignProjects />} />
                <Route path="reports" element={<SignReports />} />
              </Route>
            </Route>
            <Route path="project_owner" element={<RoleRouter roles={[256]} />}>
              <Route path="assets" element={<Assets />}>
                <Route path="projects">
                  <Route index element={<ProjectsTable />} />
                  <Route path="create" element={<CreateProject />} />
                  <Route path=":projectId" element={<Project />}>
                    <Route path="signatures" element={<SignaturesProject />} />
                  </Route>
                </Route>
                <Route path="reports" element={<Reports />}>
                  <Route index element={<ReportsTable />} />
                  <Route path="create" element={<CreateReport />} />
                  <Route path=":reportId" element={<Report />}>
                    <Route path="signatures" element={<SignaturesReport />} />
                  </Route>
                </Route>
                <Route path="carbon_credits" element={<CarbonCredits />}>
                  <Route index element={<CarbonCreditsTable />} />
                </Route>
              </Route>
              <Route path="sign" element={<SignAssets />}>
                <Route path="projects" element={<SignProjects />} />
                <Route path="reports" element={<SignReports />} />
              </Route>
            </Route>
            <Route path="custodian" element={<RoleRouter roles={[2]} />}>
              <Route path="requests" element={<CustodianRequests />} />
              <Route path="tokens/:actionType" element={<CustodianTokens />} />
              <Route path="reporting" element={<CustodianReporting />} />
            </Route>
          </Route>
          <Route path="*" element={<ErrorFound status={404} />} />
        </Routes>
      </Layout>
    </Loader>
  );
};

App.propTypes = {};

export default App;
