import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3FromSource, web3Enable } from '@polkadot/extension-dapp';

import { EXTENSION_NAME, WS_PROVIDER_URL } from './env';

const wsProvider = new WsProvider(WS_PROVIDER_URL);
let api;
let injector;

(async () => {
  api = await ApiPromise.create({
    provider: wsProvider,
    types: {
      'Address': 'AccountId',
      'LookupSource': 'AccountId',
      'Weight': 'u32',
      'EverUSDBalance': 'u64',
      'EvercityAccountStruct': {
          'roles': 'u8',
          'identity': 'u64'
      },
      'MintRequestStruct': {
        'amount': 'u64'
      },
      'BondId': '[u8;8]'
    }
  });
})();

(async () => {
  await web3Enable('Evercity Platform');
  injector = await web3FromSource(EXTENSION_NAME);
})();

export { api, injector };
