import { hot } from 'react-hot-loader';

import React from 'react';
import 'antd/dist/antd.css';

import {
  Router, Route, Switch, Redirect,
} from 'wouter';

import './App.less';

import Layout from './components/Layout';
import ErrorFound from './components/ErrorFound';

import Login from './pages/Login';
import Logout from './pages/Logout';
import Roles from './pages/Roles';
import Tokens from './pages/Tokens';
// import Tasks from './pages/Tasks';
// import IssuerBonds from './pages/IssuerBonds';
// import ImpactManagement from './pages/ImpactManagement';
// import InvestorBonds from './pages/InvestorBonds';
// import InvestorOrders from './pages/InvestorOrders';
// import InvestorReport from './pages/InvestorReport';
import CustodianRequests from './pages/CustodianRequests';
import CustodianTokens from './pages/CustodianTokens';
import Profile from './pages/Profile';

import { checkAuth, checkRole } from './utils/checks';

const App = () => (
  <Router>
    <Layout>
      <Switch>
        <Route path="/login" component={Login} />

        <Route path="/dapp/:rest*">
          <Router hook={checkAuth}>
            <Switch>
              <Route path="/dapp/profile" component={Profile} />
              <Route path="/dapp/logout" component={Logout} />

              <Route path="/dapp/master/:rest*">
                <Router hook={() => checkRole('master')}>
                  <Route path="/dapp/master/roles" component={Roles} />
                  {/* <Route path="/dapp/master/tasks" component={Tasks} /> */}
                </Router>
              </Route>

              <Route path="/dapp/issuer/:rest*">
                <Router hook={() => checkRole('issuer')}>
                  <Route path="/dapp/issuer/tokens/:actionType?" component={Tokens} />
                  {/* <Route path="/dapp/issuer/impact" component={ImpactManagement} /> */}
                </Router>
              </Route>

              <Route path="/dapp/investor/:rest*">
                <Router hook={() => checkRole('investor')}>
                  <Route path="/dapp/investor/tokens/:actionType?" component={Tokens} />
                  {/* <Route path="/dapp/investor/orders" component={InvestorOrders} />
                  <Route path="/dapp/investor/report" component={InvestorReport} /> */}
                </Router>
              </Route>

              <Route path="/dapp/custodian/:rest*">
                <Router hook={() => checkRole('custodian')}>
                  <Route path="/dapp/custodian/requests" component={CustodianRequests} />
                  <Route path="/dapp/custodian/tokens/:actionType?" component={CustodianTokens} />
                </Router>
              </Route>
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
