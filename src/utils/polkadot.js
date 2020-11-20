/* eslint-disable import/no-mutable-exports */
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3FromSource, web3Enable } from '@polkadot/extension-dapp';

import { EXTENSION_NAME, WS_PROVIDER_URL } from './env';
import { getAvailableRoles } from './roles';

const wsProvider = new WsProvider(WS_PROVIDER_URL);
let api;
let injector;

(async () => {
  api = await ApiPromise.create({
    provider: wsProvider,
    types: {
      Address: 'AccountId',
      BondId: '[u8;8]',
      BondImpactReportStruct: {
        create_date: 'Moment',
        impact_data: 'u64',
        signed: 'bool',
      },
      BondUnitSaleLotStructOf: {
        deadline: 'Moment',
        new_bondholder: 'AccountId',
        bond_units: 'u32',
        amount: 'EverUSDBalance',
      },
      Event: {
        _enum: [],
      },
      EverUSDBalance: 'u64',
      EvercityAccountStructOf: {
        roles: 'u8',
        identity: 'u64',
        create_time: 'Moment',
      },
      LookupSource: 'AccountId',
      MintRequestStruct: {
        amount: 'u64',
      },
      TokenBurnRequestStructOf: {
        amount: 'EverUSDBalance',
        deadline: 'Moment',
      },
      TokenMintRequestStructOf: {
        amount: 'EverUSDBalance',
        deadline: 'Moment',
      },
      Weight: 'u32',
    },
  });
})();

(async () => {
  await web3Enable('Evercity dApp');
  injector = await web3FromSource(EXTENSION_NAME) || null;
})();

export { api, injector };

export const accountRegistry = async (address) => {
  const data = await api
    .query
    .evercity
    .accountRegistry(address);

  const { roles: roleMask, identity } = data.toHuman();
  const roles = getAvailableRoles(roleMask);

  return { roles, identity };
};

export const balanceEverUSD = async (address) => {
  const data = await api
    .query
    .evercity
    .balanceEverUSD(address);

  return data?.toHuman();
};
