/* eslint-disable import/no-mutable-exports */
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3FromSource, web3Enable } from '@polkadot/extension-dapp';

import { EXTENSION_NAME, WS_PROVIDER_URL } from './env';

const wsProvider = new WsProvider(WS_PROVIDER_URL);

const connect = async () => ApiPromise.create({
  provider: wsProvider,
  types: {
    Address: 'AccountId',
    LookupSource: 'AccountId',
    EverUSDBalance: 'u64',
    Moment: 'u64',
    BondId: '[u8;8]',
    EvercityAccountStructOf: {
      roles: 'u8',
      identity: 'u64',
      create_time: 'Moment',
    },
    TokenMintRequestStructOf: {
      amount: 'EverUSDBalance',
      deadline: 'Moment',
    },
    TokenBurnRequestStructOf: {
      amount: 'EverUSDBalance',
      deadline: 'Moment',
    },
    BondImpactType: {
      _enum: ['POWER_GENERATED', 'CO2_EMISSIONS_REDUCTION'],
    },
    BondState: {
      _enum: ['PREPARE', 'BOOKING', 'ACTIVE', 'BANKRUPT', 'FINISHED'],
    },
    Hash: '[u8;32]',
    BondPeriod: 'u32',
    BondUnitAmount: 'u32',
    BondInterest: 'u32',
    BondPeriodNumber: 'u32',
    BondInnerStructOf: {
      docs_pack_root_hash_main: 'Hash',
      docs_pack_root_hash_legal: 'Hash',
      docs_pack_root_hash_finance: 'Hash',
      docs_pack_root_hash_tech: 'Hash',
      impact_data_type: 'BondImpactType',
      impact_data_baseline: 'Vec<u64>',
      impact_data_max_deviation_cap: 'u64',
      impact_data_max_deviation_floor: 'u64',
      impact_data_send_period: 'BondPeriod',
      interest_rate_penalty_for_missed_report: 'BondInterest',
      interest_rate_base_value: 'BondInterest',
      interest_rate_margin_cap: 'BondInterest',
      interest_rate_margin_floor: 'BondInterest',
      interest_rate_start_period_value: 'BondInterest',
      interest_pay_period: 'BondPeriod',
      start_period: 'BondPeriod',
      payment_period: 'BondPeriod',
      bond_duration: 'BondPeriodNumber',
      bond_finishing_period: 'BondPeriod',
      mincap_deadline: 'Moment',
      bond_units_mincap_amount: 'BondUnitAmount',
      bond_units_maxcap_amount: 'BondUnitAmount',
      bond_units_base_price: 'EverUSDBalance',
    },
    BondStructOf: {
      inner: 'BondInnerStructOf',
      issuer: 'AccountId',
      manager: 'AccountId',
      auditor: 'AccountId',
      impact_reporter: 'AccountId',
      issued_amount: 'BondUnitAmount',
      creation_date: 'Moment',
      booking_start_date: 'Moment',
      active_start_date: 'Moment',
      state: 'BondState',
      bond_debit: 'EverUSDBalance',
      bond_credit: 'EverUSDBalance',
      coupon_yield: 'EverUSDBalance',
    },
    AccountYield: {
      coupon_yield: 'EverUSDBalance',
      period_num: 'BondPeriodNumber',
    },
    BondUnitPackage: {
      bond_units: 'BondUnitAmount',
      acquisition: 'BondPeriod',
      coupon_yield: 'EverUSDBalance',
    },
    BondImpactReportStruct: {
      create_date: 'BondPeriod',
      impact_data: 'u64',
      signed: 'bool',
    },
    BondUnitSaleLotStructOf: {
      deadline: 'Moment',
      new_bondholder: 'AccountId',
      bond_units: 'BondUnitAmount',
      amount: 'EverUSDBalance',
    },
    PeriodYield: {
      total_yield: 'EverUSDBalance',
      coupon_yield_before: 'EverUSDBalance',
      interest_rate: 'BondInterest',
    },
  },
});

const getInjector = async () => {
  await web3Enable('Evercity dApp');
  const injector = await web3FromSource(EXTENSION_NAME) || null;

  return injector;
};

export { connect, getInjector };
