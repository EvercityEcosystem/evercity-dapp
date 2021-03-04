import React from 'react';
import PropTypes from 'prop-types';
import useLocation from 'wouter/use-location';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import { Layout, Button } from 'antd';

import MenuView from './MenuView';

import { getCurrentUser } from '../utils/storage';

import styles from './Layout.module.less';
import logoUrl from '../assets/logos/logo-header.svg';

const {
  Sider,
  Header,
  Content,
  Footer,
} = Layout;

const getLoggedRoutes = (t) => [
  {
    path: '/dapp/profile',
    title: t('Profile'),
  },
];

const getRoutesByRole = (role, { t }) => {
  switch (role) {
    case 'master':
      return [
        {
          path: '/dapp/master/roles',
          title: t('Roles'),
        },
      ];
    case 'issuer':
      return [
        {
          title: t('Wallet'),
          children: [
            {
              path: '/dapp/issuer/tokens/mint',
              title: t('Mint EVERUSD'),
            },
            {
              path: '/dapp/issuer/tokens/burn',
              title: t('Burn EVERUSD'),
            },
          ],
        },
        {
          path: '/dapp/issuer/bond',
          title: t('New Bond'),
        },
        // {
        //   path: '/dapp/issuer/impact',
        //   title: t('Impact'),
        // },
      ];
    case 'investor':
      return [
        {
          title: t('Wallet'),
          children: [
            {
              path: '/dapp/investor/tokens/mint',
              title: t('Mint EVERUSD'),
            },
            {
              path: '/dapp/investor/tokens/burn',
              title: t('Burn EVERUSD'),
            },
          ],
        },
      ];
    case 'custodian':
      return [
        {
          path: '/dapp/custodian/requests',
          title: t('Requests'),
        },
        {
          title: t('Finance'),
          children: [
            {
              path: '/dapp/custodian/tokens/confirm',
              title: t('Confirm Mint/Burn'),
            },
            {
              path: '/dapp/custodian/tokens/decline',
              title: t('Decline Mint/Burn'),
            },
          ],
        },
        {
          path: '/dapp/custodian/reporting',
          title: t('Reporting'),
        },
      ];
    default:
      return [];
  }
};

const MainLayout = ({ children }) => {
  const [path] = useLocation();
  const { t } = useTranslation();

  let routes = [];

  const { role } = getCurrentUser();
  if (role) {
    routes = [
      ...getLoggedRoutes(t),
      {
        path: '/dapp/logout',
        title: t('Logout'),
      },
    ];
  }

  let siderRoutes = [
    {
      path: '/',
      title: t('Home'),
    },
    ...getRoutesByRole(role, { t }),
  ];

  routes = routes.map((item) => {
    if (item.path === path) {
      return { ...item, active: true };
    }

    return item;
  });

  siderRoutes = siderRoutes.map((item) => {
    if (item.path === path) {
      return { ...item, active: true };
    }

    return item;
  });

  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoWrapper}>
            <Link href="/">
              <img src={logoUrl} className={styles.logo} alt="" />
            </Link>
          </div>
          <div className={styles.navWrapper}>
            {!role && (
              <div>
                <Link to="/login">
                  <Button className={styles.navButton} type="primary">Log in</Button>
                </Link>
              </div>
            )}
            <MenuView
              theme="dark"
              mode="horizontal"
              className={styles.navigation}
              nodes={routes.filter(Boolean)}
            />
          </div>
        </div>
      </Header>
      <Layout className={styles.contentLayout}>
        {!!role && (
          <Sider
            theme="light"
            className={styles.sider}
          >
            <MenuView
              theme="light"
              mode="vertical"
              className={styles.navigation}
              nodes={siderRoutes}
            />
          </Sider>
        )}
        <Content className={styles.content}>
          {children}
        </Content>
      </Layout>
      <Footer style={{ fontWeight: 600, textAlign: 'center' }}>
        © 2021 Evercity PTE LTD
      </Footer>
    </Layout>
  );
};

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

MainLayout.defaultProps = {};

export default MainLayout;
