const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');
const copy = require('@neutrinojs/copy');
let lessLoader = require('neutrino-middleware-less-loader');
const antdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

const webpack = require('webpack');

const __DEV__ = process.env.NODE_ENV !== 'production';
const WS_PROVIDER_URL = process.env.WS_PROVIDER_URL || 'wss://node.evercity.dev/';
const IPCI = true;

const defineEnv = neutrino => {
  return neutrino.config.plugin('env').use(
    webpack.DefinePlugin,
    [{
        'process.env': {
          WS_PROVIDER_URL: JSON.stringify(WS_PROVIDER_URL),
          __DEV__: JSON.stringify(__DEV__),
          IPCI
        }
    }]
  );
}

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    // airbnb(),
    copy({
      patterns: [
        { from: 'src/assets/fonts/', to: 'fonts' },
      ]
    }),
    react({
      html: {
        title: 'Evercity dApp'
      },
      devServer: {
        port: 3001
      },
      babel: {
        plugins: [
          '@babel/plugin-proposal-optional-chaining'
        ]
      },
    }),
    lessLoader({
      less: {
        javascriptEnabled: true
      }
    }),
    jest(),
    defineEnv,
    neutrino => neutrino.config.node.set('Buffer', true),
    neutrino => neutrino.config.plugin('antddayjs').use(antdDayjsWebpackPlugin),
    neutrino => neutrino.config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .type('javascript/auto')
      .use('babel')
      .loader('babel-loader')
      .options({
        include: /node_modules/
      })
  ],
};
