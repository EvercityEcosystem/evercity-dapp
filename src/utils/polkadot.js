/* eslint-disable import/no-mutable-exports */
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3FromSource, web3Enable } from '@polkadot/extension-dapp';

import { EXTENSION_NAME, WS_PROVIDER_URL, IPCI } from './env';

import types from './types.json';
import typesIPCI from './types_ipci.json';

const wsProvider = new WsProvider(WS_PROVIDER_URL);

wsProvider.on('disconnected', () => {
  console.warn('Provider disconnected. Reconnecting...');
});

wsProvider.on('error', (error) => {
  console.error('Provider error: ', error);
});

const connect = async () => ApiPromise.create({
  provider: wsProvider,
  types: IPCI ? typesIPCI : types,
});

const getInjector = async () => {
  await web3Enable('Evercity dApp');
  const injector = await web3FromSource(EXTENSION_NAME) || null;

  return injector;
};

export { connect, getInjector };
