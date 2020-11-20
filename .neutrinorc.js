const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');
let lessLoader = require('neutrino-middleware-less-loader');

const webpack = require('webpack');

const __DEV__ = process.env.NODE_ENV !== 'production';
const WS_PROVIDER_URL = process.env.WS_PROVIDER_URL || 'ws://51.15.47.43:9944';

const defineEnv = neutrino => {
  return neutrino.config.plugin('env').use(
    webpack.DefinePlugin,
    [{
        'process.env': {
          WS_PROVIDER_URL: JSON.stringify(WS_PROVIDER_URL),
          __DEV__: JSON.stringify(__DEV__),
        }
    }]
  );
}

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    airbnb(),
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
    neutrino => neutrino.config.node.set('Buffer', true)
  ],
};
