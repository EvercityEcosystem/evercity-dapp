import { hot } from 'react-hot-loader';

import React, { useEffect, useContext, useMemo } from 'react';
import 'antd/dist/antd.css';

import {
  Router, Route, Switch, Redirect,
} from 'wouter';

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

import { checkAuth, checkRole } from './utils/checks';
import { connect, getInjector } from './utils/polkadot';

const App = () => {
  const { polkadotState, dispatch } = useContext(store);

  useEffect(
    () => {
      const connectAPI = async () => {
        const api = await connect();
        dispatch({
          type: 'setAPI',
          payload: api,
        });
      };

      connectAPI();
    },
    [dispatch],
  );

  useEffect(
    () => {
      const setInjector = async () => {
        const injector = await getInjector();
        dispatch({
          type: 'setInjector',
          payload: injector,
        });
      };

      setInjector();
    },
    [dispatch],
  );

  const isAPIReady = useMemo(
    () => polkadotState?.api?.isConnected && polkadotState?.api?.isReady,
    [polkadotState],
  );

  return (
    <Router>
      <Loader spinning={!isAPIReady} tip="Connecting to blockchain node">
        <Layout>
          <Switch>
            <Route path="/" component={Bonds} />
            <Route path="/login" component={Login} />

            <Route path="/dapp/:rest*">
              <Router hook={checkAuth}>
                <Switch>
                  <Route path="/dapp/profile" component={Profile} />
                  <Route path="/dapp/logout" component={Logout} />

                  <Route path="/dapp/master/:rest*">
                    <Router hook={() => checkRole('master')}>
                      <Route path="/dapp/master/roles" component={Roles} />
                    </Router>
                  </Route>

                  <Route path="/dapp/issuer/:rest*">
                    <Router hook={() => checkRole('issuer')}>
                      <Route path="/dapp/issuer/tokens/:action?" component={Tokens} />
                      <Route path="/dapp/issuer/bond" component={BondConfig} />
                    </Router>
                  </Route>

                  <Route path="/dapp/investor/:rest*">
                    <Router hook={() => checkRole('investor')}>
                      <Route path="/dapp/investor/tokens/:action?" component={Tokens} />
                    </Router>
                  </Route>

                  <Route path="/dapp/custodian/:rest*">
                    <Router hook={() => checkRole('custodian')}>
                      <Route path="/dapp/custodian/requests" component={CustodianRequests} />
                      <Route path="/dapp/custodian/tokens/:actionType?" component={CustodianTokens} />
                      <Route path="/dapp/custodian/reporting" component={CustodianReporting} />
                    </Router>
                  </Route>
                </Switch>
              </Router>
            </Route>

            <Route path="/404" component={ErrorFound} />
            <Route path="/:rest*"><Redirect to="/" /></Route>
          </Switch>
        </Layout>
      </Loader>
    </Router>
  );
};

App.propTypes = {};

export default hot(module)(App);
