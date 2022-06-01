import { hot } from 'react-hot-loader';

import React, { useEffect, useContext, useMemo } from 'react';
import 'antd/dist/antd.css';

import {
  Route, Routes
} from 'react-router-dom';

import './App.less';

import Layout from './components/Layout';
import ErrorFound from './components/ErrorFound';
import Loader from './components/Loader';
import { store } from './components/PolkadotProvider';

import Login from './pages/Login';
import Logout from './pages/Logout';
import Roles from './pages/Roles';
import Tokens from './pages/Tokens';
import Bonds from './pages/Bonds';
import CustodianRequests from './pages/CustodianRequests';
import CustodianTokens from './pages/CustodianTokens';
import CustodianReporting from './pages/CustodianReporting';
import Profile from './pages/Profile';
import BondConfig from './pages/BondConfig';

import { connect, getInjector } from './utils/polkadot';
import usePolkadot from './hooks/usePolkadot';
import ProtectedRouter from "./components/ProtectedRouter";
import RoleRouter from "./components/RoleRouter";

const App = () => {
  const { polkadotState, dispatch } = useContext(store);
  const { dayDuration } = usePolkadot();

  const connectAPI = async () => {
    const api = await connect();
    api.on('error', (error) => {
      console.error('API error: ', error);
    });

    dispatch({
      type: 'setAPI',
      payload: api,
    });
  };

  const setTimeStep = async () => {
    const timeStep = await dayDuration();

    dispatch({
      type: 'setTimeStep',
      payload: timeStep,
    });
  };

  const setInjector = async () => {
    const injector = await getInjector();
    dispatch({
      type: 'setInjector',
      payload: injector,
    });
  };

  useEffect(
    () => {
      connectAPI();
      setInjector();
    },
    [dispatch],
  );

  const isAPIReady = useMemo(
    () => polkadotState?.api?.isConnected && polkadotState?.api?.isReady,
    [polkadotState],
  );

  useEffect(
    () => {
      if (isAPIReady){
        setTimeStep();
      }
    },
    [isAPIReady],
  );

  return (<Loader spinning={!isAPIReady} tip="Connecting to blockchain node">
    <Layout>
      <Routes>
        <Route path="/" index element={<Bonds />} />
        <Route path="login" element={<Login />} />
        <Route path="dapp" element={<ProtectedRouter />}>
          <Route path="profile" element={<Profile />} />
          <Route path="logout" element={<Logout />} />
          <Route path="master" element={<RoleRouter roles={["master"]} />}>
              <Route path="roles" element={<Roles />} />
            </Route>
            <Route path="issuer" element={<RoleRouter roles={["issuer"]} />}>
              <Route path="tokens/:action" element={<Tokens />} />
              <Route path="bond" element={<BondConfig />} />
            </Route>
            <Route path="investor" element={<RoleRouter roles={["investor"]} />}>
              <Route path="tokens/:action" element={<Tokens />} />
            </Route>
          <Route path="custodian" element={<RoleRouter roles={["custodian"]} />}>
            <Route path="requests" element={<CustodianRequests />} />
            <Route path="tokens/:actionType" element={<CustodianTokens />} />
            <Route path="reporting" element={<CustodianReporting />} />
          </Route>
        </Route>
        <Route path="*" element={<ErrorFound status={404}/>} />
      </Routes>
    </Layout>
  </Loader>);
};

App.propTypes = {};

export default hot(module)(App);
