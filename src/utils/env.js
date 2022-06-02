export const WS_PROVIDER_URL = import.meta.env.VITE_WS_PROVIDER_URL;
export const HOME_BASE_PATH = "/";

export const EXTENSION_NAME = "polkadot-js";
export const EXTENSION_URL =
  "https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd";
export const DEFAULT_AUDITOR_ADDRESS =
  "5G4J6NvaRAWh7QXdFr34E3D2UxiRFEeksbKnBVrFMGYXC5WU";
export const DEFAULT_ADDRESS =
  "5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM";

export const BONDS_PAGE_SIZE = 100;
export const LIST_VIEW_DEFAULT_MODE = "cards";

export const BOND_TICKER_LIMIT = 16;

export const IMPACT_DATA_TYPES = {
  POWER_GENERATED: {
    title: "Renewable energy generation (MWh)",
    color: "cyan",
    measure: "MWh",
  },
  CO2_EMISSIONS_REDUCTION: {
    title: "CO2 reduction (MtCO2e)",
    color: "green",
    measure: "MtCO2e",
  },
};

export const BOND_STATES = {
  PREPARE: {
    title: "PRE-LAUNCH",
    color: "grey",
  },
  FINISHED: {
    title: "REDEEMED",
    color: "grey",
  },
  BOOKING: {
    title: "BOOKING",
    color: "#31CC79",
  },
  ACTIVE: {
    title: "ISSUED",
    color: "#4E248D",
  },
  BANKRUPT: {
    title: "BANKRUPT",
    color: "grey",
  },
};
