import React from 'react';
import PropTypes from 'prop-types';
import useLocation from 'wouter/use-location';
import { useTranslation } from 'react-i18next';

import { Layout, Col } from 'antd';

import MenuView from './MenuView';

import { getCurrentUser } from '../utils/cookies';

import s from './Layout.module.less';
import logoUrl from '../assets/logos/logo-header.svg';

const { Header, Content, Footer } = Layout;

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
        // {
        //   path: '/dapp/master/tasks',
        //   title: t('Tasks'),
        // },
      ];
    case 'issuer':
      return [
        {
          path: '/dapp/issuer/tokens/',
          title: t('Tokens'),
        },
        // {
        //   path: '/dapp/issuer/impact',
        //   title: t('Impact'),
        // },
      ];
    case 'investor':
      return [
        {
          path: '/dapp/investor/tokens/',
          title: t('Tokens'),
        },
        // {
        //   path: '/dapp/investor/orders',
        //   title: t('Orders'),
        // },
        // {
        //   path: '/dapp/investor/report',
        //   title: t('Report'),
        // },
      ];
    case 'custodian':
      return [
        {
          path: '/dapp/custodian/requests',
          title: t('Requests'),
        },
        {
          path: '/dapp/custodian/tokens',
          title: t('Tokens'),
        },
      ];
    default:
      return [];
  }
};

const MainLayout = ({ children }) => {
  const [path] = useLocation();
  const { t } = useTranslation();

  let routes = [
    {
      path: '/login',
      title: t('Login'),
    },
  ];

  const { role } = getCurrentUser();
  if (role) {
    routes = [
      ...getRoutesByRole(role, { t }),
      ...getLoggedRoutes(t),
      {
        path: '/dapp/logout',
        title: t('Logout'),
      },
    ];
  }

  routes = routes.map((item) => {
    if (item.path === path) {
      return { ...item, active: true };
    }

    return item;
  });

  return (
    <Layout>
      <Header className={s.header}>
        <div className={s.headerContent}>
          <div className={s.logoWrapper}>
            <img src={logoUrl} className={s.logo} alt="" />
          </div>
          <div className={s.navWrapper}>
            <MenuView
              theme="dark"
              mode="horizontal"
              nodes={routes.filter(Boolean)}
            />
          </div>
        </div>
      </Header>
      <Col
        xs={{ span: 24 }}
        md={{ span: 22, offset: 1 }}
        lg={{ span: 20, offset: 2 }}
        xl={{ span: 18, offset: 3 }}
      >
        <Content className={s.content}>
          {children}
        </Content>
      </Col>
      <Footer style={{ fontWeight: 600, textAlign: 'center' }}>
        ©2020 Evercity PTE LTD
      </Footer>
    </Layout>
  );
};

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

MainLayout.defaultProps = {};

export default MainLayout;
