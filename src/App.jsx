import { hot } from 'react-hot-loader';

import React from 'react';
import 'antd/dist/antd.css';

import {
  Router, Route, Switch, Redirect
} from 'wouter';

import './App.less';

import Layout from './components/Layout';
import ErrorFound from './components/ErrorFound';

import Login from './pages/Login';
import Logout from './pages/Logout';
import Roles from './pages/Roles';
import Tasks from './pages/Tasks';
import IssuerBonds from './pages/IssuerBonds';
import ImpactManagement from './pages/ImpactManagement';
import InvestorBonds from './pages/InvestorBonds';
import InvestorOrders from './pages/InvestorOrders';
import InvestorReport from './pages/InvestorReport';
import TokenManagement from './pages/TokenManagement';

import { useCheckAuth, useCheckRole } from './utils/checks';

const App = () => (
  <Router>
    <Layout>
      <Switch>
        <Route path="/login" component={Login} />

        <Route path="/dapp/:rest*">
          <Router hook={useCheckAuth}>
            <Switch>
              <Route path="/dapp/profile" component={Profile} />

              <Route path="/dapp/master/:rest*">
                <Router hook={() => useCheckRole('master')}>
                  <Route path="/dapp/master/roles" component={Roles} />
                  <Route path="/dapp/master/tasks" component={Tasks} />
                </Router>
              </Route>

              <Route path="/dapp/issuer/:rest*">
                <Router hook={() => useCheckRole('issuer')}>
                  <Route path="/dapp/issuer/bonds" component={IssuerBonds} />
                  <Route path="/dapp/issuer/impact" component={ImpactManagement} />
                </Router>
              </Route>

              <Route path="/dapp/investor/:rest*">
                <Router hook={() => useCheckRole('investor')}>
                  <Route path="/dapp/investor/bonds" component={InvestorBonds} />
                  <Route path="/dapp/investor/orders" component={InvestorOrders} />
                  <Route path="/dapp/investor/report" component={InvestorReport} />
                </Router>
              </Route>

              <Route path="/dapp/custodian/:rest*">
                <Router hook={() => useCheckRole('custodian')}>
                  <Route path="/dapp/custodian" component={TokenManagement} />
                </Router>
              </Route>

              <Route path="/d/logout" component={Logout} />
            </Switch>
          </Router>
        </Route>

        <Route path="/404" component={ErrorFound} />
        <Route path="/:rest*"><Redirect to="/login" /></Route>
      </Switch>
    </Layout>
  </Router>
  );

App.propTypes = {};

export default hot(module)(App);
