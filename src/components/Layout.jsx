import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

import { Layout, Button } from "antd";

import MenuView from "./MenuView";

import { getCurrentUser } from "../utils/storage";

import styles from "./Layout.module.less";
import logoUrl from "/logos/logo-header.svg";

const { Sider, Header, Content, Footer } = Layout;

const getRoutesByRole = role => {
  switch (role) {
    case 1:
      return [
        {
          path: "/dapp/master/roles",
          title: "Roles",
        },
      ];
    case 4:
      return [
        {
          title: "Wallet",
          children: [
            {
              path: "/dapp/issuer/tokens/mint",
              title: "Mint EVERUSD",
            },
            {
              path: "/dapp/issuer/tokens/burn",
              title: "Burn EVERUSD",
            },
          ],
        },
        {
          path: "/dapp/issuer/bond",
          title: "New Bond",
        },
        // {
        //   path: '/dapp/issuer/impact',
        //   title: 'Impact',
        // },
      ];
    case 8:
      return [
        {
          title: "Wallet",
          children: [
            {
              path: "/dapp/investor/tokens/mint",
              title: "Mint EVERUSD",
            },
            {
              path: "/dapp/investor/tokens/burn",
              title: "Burn EVERUSD",
            },
          ],
        },
      ];
    case 2:
      return [
        {
          path: "/dapp/custodian/requests",
          title: "Requests",
        },
        {
          title: "Finance",
          children: [
            {
              path: "/dapp/custodian/tokens/confirm",
              title: "Confirm Mint/Burn",
            },
            {
              path: "/dapp/custodian/tokens/decline",
              title: "Decline Mint/Burn",
            },
          ],
        },
        {
          path: "/dapp/custodian/reporting",
          title: "Reporting",
        },
      ];

    case 256:
      return [
        {
          title: "Assets",
          children: [
            {
              path: "/dapp/project_owner/assets/projects",
              title: "My Assets",
            },
            {
              path: "/dapp/project_owner/sign/projects",
              title: "Sign",
            },
          ],
        },
      ];
    case 512:
      return [
        {
          title: "Assets",
          children: [
            {
              path: "/dapp/auditor_cc/sign/projects",
              title: "Sign",
            },
          ],
        },
      ];

    case 1024:
      return [
        {
          title: "Assets",
          children: [
            {
              path: "/dapp/standard_cc/sign/projects",
              title: "Sign",
            },
          ],
        },
      ];

    case 4096:
      return [
        {
          title: "Assets",
          children: [
            {
              path: "/dapp/registry_cc/sign/projects",
              title: "Sign",
            },
          ],
        },
      ];
    default:
      return [];
  }
};

const MainLayout = ({ children }) => {
  const location = useNavigate();

  let routes = [];

  const { role } = getCurrentUser();
  if (role) {
    routes = [
      {
        key: "profile",
        path: "/dapp/profile",
        title: "Profile",
      },
      {
        key: "logout",
        path: "/dapp/logout",
        title: "Logout",
      },
    ];
  }

  let siderRoutes = [
    {
      path: "/",
      title: "Home",
    },
    {
      path: "/dapp/events",
      title: "Events",
    },
    ...getRoutesByRole(role),
  ];

  routes = routes.map(item => {
    if (item.path === location) {
      return { ...item, active: true };
    }

    return item;
  });

  siderRoutes = siderRoutes.map(item => {
    if (item.path === location) {
      return { ...item, active: true };
    }

    return item;
  });

  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoWrapper}>
            <Link to="/">
              <img src={logoUrl} className={styles.logo} alt="" />
            </Link>
          </div>
          <div className={styles.navWrapper}>
            {!role && (
              <div>
                <Link to="/login">
                  <Button className={styles.navButton} type="primary">
                    Log in
                  </Button>
                </Link>
              </div>
            )}
            {!!routes.filter(Boolean).length && (
              <MenuView
                theme="dark"
                mode="horizontal"
                className={styles.navigation}
                nodes={routes.filter(Boolean)}
              />
            )}
          </div>
        </div>
      </Header>
      <Layout className={styles.contentLayout}>
        {!!role && (
          <Sider theme="light" className={styles.sider}>
            <MenuView
              theme="light"
              mode="vertical"
              className={styles.navigation}
              nodes={siderRoutes}
            />
          </Sider>
        )}
        <Content className={styles.content}>{children}</Content>
      </Layout>
      <Footer style={{ fontWeight: 600, textAlign: "center" }}>
        © 2022 Evercity UG
      </Footer>
    </Layout>
  );
};

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

MainLayout.defaultProps = {};

export default MainLayout;
