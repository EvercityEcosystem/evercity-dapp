export const { WS_PROVIDER_URL } = process.env;
export const HOME_BASE_PATH = '/';

export const EXTENSION_NAME = 'polkadot-js';
export const EXTENSION_URL = 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd';
export const DEFAULT_AUDITOR_ADDRESS = '5G4J6NvaRAWh7QXdFr34E3D2UxiRFEeksbKnBVrFMGYXC5WU';
export const DEFAULT_ADDRESS = '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM';

export const IMPACT_DATA_TYPES = {
  POWER_GENERATED: {
    title: 'Renewable energy generation (MWh)',
    color: 'cyan',
  },
  CO2_EMISSIONS_REDUCTION: {
    title: 'CO2 reduction (MtCO2e)',
    color: 'green',
  },
};

export const BOND_STATE_COLORS = {
  BOOKING: '#4E248D',
  ACTIVE: '#31CC79',
  FINISHED: '#FFD700',
};

export const PRE_INSTALLED_BONDS = [
  'ECBD101',
  'ECBD102',
  'ECBD103',
  'ECBD104',
  'ECBD105',
];
