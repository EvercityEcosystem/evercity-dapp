export const WS_PROVIDER_URL = process.env.WS_PROVIDER_URL;
export const HOME_BASE_PATH = '/';

export const EXTENSION_NAME = 'polkadot-js';
export const EXTENSION_URL = 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd';

export const SUBSTRATE_ROLES = [
  {
    name: 'master',
    mask: 1
  },
  {
    name: 'custodian',
    mask: 2
  },
  {
    name: 'issuer',
    mask: 4
  },
  {
    name: 'auditor',
    mask: 16
  },
  {
    name: 'investor',
    mask: 8
  },
  {
    name: 'manager',
    mask: 32
  }
]
