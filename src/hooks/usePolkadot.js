import {
  useCallback,
  useContext,
} from 'react';

import { notification } from 'antd';

import { store } from '../components/PolkadotProvider';

import { getAvailableRoles } from '../utils/roles';
import { getCurrentUser } from '../utils/cookies';
import { DEFAULT_AUDITOR_ADDRESS } from '../utils/env';

const transactionCallback = (message) => ({ status }) => {
  if (status.isInBlock) {
    notification.success({
      message,
      description: 'Transaction is in block',
    });
  }

  if (status.isFinalized) {
    notification.success({
      message,
      description: 'Block finalized',
    });
  }
};

export default () => {
  const { polkadotState } = useContext(store);
  const { address: currentUserAddress } = getCurrentUser();
  const { api, injector } = polkadotState;

  const accountRegistry = useCallback(
    async (address) => {
      const data = await api
        .query
        .evercity
        .accountRegistry(address);

      const { roles: roleMask, identity } = data.toHuman();
      const roles = getAvailableRoles(roleMask);

      return { roles, identity };
    },
    [api],
  );

  const balanceEverUSD = useCallback(
    async (address) => {
      const data = await api
        .query
        .evercity
        .balanceEverUSD(address);

      return data?.toHuman();
    },
    [api],
  );

  const bondRegistry = useCallback(
    async (bondId) => {
      const data = await api
        .query
        .evercity
        .bondRegistry(bondId);

      return data.toJSON();
    },
    [api],
  );

  const requestMintTokens = useCallback(
    async (values) => {
      const { amount } = values;

      try {
        await api
          .tx
          .evercity
          .tokenMintRequestCreateEverusd(amount)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback('Mint request'),
          );

        notification.success({
          message: 'Mint request',
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const revokeMintTokens = useCallback(
    async () => {
      try {
        await api
          .tx
          .evercity
          .tokenMintRequestRevokeEverusd()
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback('Mint revoke'),
          );

        notification.success({
          message: 'Mint revoke',
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const requestBurnTokens = useCallback(
    async (values) => {
      const { amount } = values;

      try {
        await api
          .tx
          .evercity
          .tokenBurnRequestCreateEverusd(amount)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback('Burn request'),
          );

        notification.success({
          message: 'Burn request',
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const revokeBurnTokens = useCallback(
    async () => {
      try {
        await api
          .tx
          .evercity
          .tokenBurnRequestRevokeEverusd()
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback('Burn revoke'),
          );

        notification.success({
          message: 'Burn revoke',
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const createOrAssignRole = useCallback(
    async (values) => {
      const { action, role, address } = values;
      const identity = Math.floor(Math.random() * 50);

      try {
        await api
          .tx
          .evercity[action](address, role, identity)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback('Create/Assign role'),
          );

        notification.success({
          message: 'Create/Assign role',
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const checkMintRequest = useCallback(
    async (address) => {
      const result = await api
        .query
        .evercity
        .mintRequestEverUSD(address);

      const { amount, deadline } = result?.toHuman();
      return { amount, deadline };
    },
    [api],
  );

  const checkBurnRequest = useCallback(
    async (address) => {
      const result = await api
        .query
        .evercity
        .burnRequestEverUSD(address);

      const { amount, deadline } = result?.toHuman();
      return { amount, deadline };
    },
    [api],
  );

  const confirmEverusdRequest = useCallback(
    async (action, amount, address) => {
      const command = action === 'Mint' ? 'tokenMintRequestConfirmEverusd' : 'tokenBurnRequestConfirmEverusd';

      try {
        await api
          .tx
          .evercity[command](address, amount)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback(`${action} confirm`),
          );

        notification.success({
          message: `${action} confirm`,
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const declineEverusdRequest = useCallback(
    async (action, address) => {
      const command = action === 'Mint' ? 'tokenMintRequestDeclineEverusd' : 'tokenBurnRequestDeclineEverusd';

      try {
        await api
          .tx
          .evercity[command](address)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback(`${action} decline`),
          );

        notification.success({
          message: `${action} decline`,
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const totalSupplyEverUSD = useCallback(
    async () => {
      const data = await api
        .query
        .evercity
        .totalSupplyEverUSD();

      return data?.toHuman();
    },
    [api],
  );

  const bondUnitPackageBuy = useCallback(
    async (bondID, bondUnitsCount) => {
      const bond = await api.query.evercity.bondRegistry(bondID);

      try {
        await api
          .tx
          .evercity
          .bondUnitPackageBuy(bondID, bond?.nonce?.toNumber(), bondUnitsCount)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback('Bond invest'),
          );

        notification.success({
          message: 'Bond invest',
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const bondImpactReport = useCallback(
    async (bondID) => {
      const result = await api
        .query
        .evercity
        .bondImpactReport(bondID);

      return result?.toHuman();
    },
    [api],
  );

  const bondUnitLotBid = useCallback(
    async (values) => {
      const {
        bondID,
        deadline,
        bondholder,
        unitsCount,
        amount,
      } = values;

      const lot = api.createType('BondUnitSaleLotStructOf', {
        deadline,
        new_bondholder: bondholder,
        bond_units: unitsCount,
        amount,
      });

      try {
        await api
          .tx
          .evercity
          .bondUnitLotBid(bondID, lot)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback('Bond unit lot bid'),
          );

        notification.success({
          message: 'Bond unit lot bid',
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const bondUnitLotSettle = useCallback(
    async (values) => {
      const {
        bondID,
        deadline,
        bondholder,
        bond_units: unitsCount,
        amount,
        new_bondholder: newBondholder,
      } = values;

      const lot = api.createType('BondUnitSaleLotStructOf', {
        deadline,
        new_bondholder: newBondholder,
        bond_units: unitsCount,
        amount,
      });

      try {
        await api
          .tx
          .evercity
          .bondUnitLotSettle(bondID, bondholder, lot)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback('Bond unit lot settle'),
          );

        notification.success({
          message: 'Bond unit lot settle',
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const bondUnitPackageLot = useCallback(
    async (bondID) => {
      const result = await api
        .query
        .evercity
        .bondUnitPackageLot
        .entries(bondID);

      return result
        .map(([{ args: [, bondholder] }, value]) => ({
          bondID,
          bondholder: bondholder.toHuman(),
          ...value.toJSON()[0],
        }))
        .filter((item) => !!item.bond_units);
    },
    [api],
  );

  const bondUnitPackageRegistry = useCallback(
    async (bondID) => {
      const result = await api
        .query
        .evercity
        .bondUnitPackageRegistry(bondID, currentUserAddress);

      return result?.toHuman();
    },
    [api, currentUserAddress],
  );

  const prepareBond = useCallback(
    async (values) => {
      const bondStruct = {
        docs_pack_root_hash_main: [0],
        docs_pack_root_hash_legal: [0],
        docs_pack_root_hash_finance: [0],
        docs_pack_root_hash_tech: [0],

        // from 0,001% to 1%
        // eslint-disable-next-line max-len
        interest_rate_penalty_for_missed_report: values.interest_rate_penalty_for_missed_report * 1000,
        interest_rate_start_period_value: values.interest_rate_start_period_value * 1000,
        interest_rate_base_value: values.interest_rate_base_value * 1000,
        interest_rate_margin_cap: values.interest_rate_margin_cap * 1000,
        interest_rate_margin_floor: values.interest_rate_margin_floor * 1000,
        // days to seconds
        bond_finishing_period: values.bond_finishing_period * 24 * 60 * 60,

        impact_data_type: values.impact_data_type,
        impact_data_max_deviation_cap: values.impact_data_max_deviation_cap,
        impact_data_max_deviation_floor: values.impact_data_max_deviation_floor,
        impact_data_send_period: values.impact_data_send_period,
        interest_pay_period: values.interest_pay_period,
        start_period: values.start_period,
        payment_period: values.payment_period,
        bond_duration: values.bond_duration,
        mincap_deadline: values.mincap_deadline,
        bond_units_mincap_amount: values.bond_units_mincap_amount,
        bond_units_maxcap_amount: values.bond_units_maxcap_amount,
        bond_units_base_price: values.bond_units_base_price,
        impact_data_baseline: [...Array(values.bond_duration).keys()].map((item) => values[`impact_baseline_${item}`] * 1000),
      };

      try {
        await api
          .tx
          .evercity
          .bondAddNew(values.bond_id, bondStruct)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback('Bond prepare'),
          );

        notification.success({
          message: 'Bond prepare',
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const releaseBond = useCallback(
    async (bondId) => {
      const bond = await api.query.evercity.bondRegistry(bondId);

      try {
        await api
          .tx
          .evercity
          .bondRelease(bondId, bond?.nonce?.toNumber())
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback('Bond release'),
          );

        notification.success({
          message: 'Bond release',
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const activateBond = useCallback(
    async (bondId) => {
      const bond = await api.query.evercity.bondRegistry(bondId);

      try {
        await api
          .tx
          .evercity
          .bondSetAuditor(bondId, DEFAULT_AUDITOR_ADDRESS)
          .signAndSend(currentUserAddress, { signer: injector.signer, nonce: -1 });

        await api
          .tx
          .evercity
          .bondActivate(bondId, bond.nonce.toNumber() + 1)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback('Bond activate'),
          );

        notification.success({
          message: 'Bond activate',
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const bondImpactReportSend = useCallback(
    async (bondID, period, impactValue) => {
      try {
        await api
          .tx
          .evercity
          .bondImpactReportSend(bondID, period, impactValue)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback('Send impact data'),
          );

        notification.success({
          message: 'Send impact data',
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  const bondDepositEverusd = useCallback(
    async (bondID, amount) => {
      try {
        await api
          .tx
          .evercity
          .bondDepositEverusd(bondID, amount)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback('Deposit'),
          );

        notification.success({
          message: 'Deposit',
          description: 'Transaction has been sent to blockchain',
        });
      } catch (error) {
        notification.error({
          message: 'Signing/sending transaction process failed',
          description: error,
        });
      }
    },
    [api, injector, currentUserAddress],
  );

  return {
    accountRegistry,
    bondRegistry,
    balanceEverUSD,
    requestMintTokens,
    revokeMintTokens,
    requestBurnTokens,
    revokeBurnTokens,
    createOrAssignRole,
    checkMintRequest,
    checkBurnRequest,
    confirmEverusdRequest,
    declineEverusdRequest,
    totalSupplyEverUSD,
    bondUnitPackageBuy,
    bondImpactReport,
    bondUnitLotBid,
    bondUnitLotSettle,
    bondUnitPackageLot,
    bondUnitPackageRegistry,
    prepareBond,
    releaseBond,
    activateBond,
    bondImpactReportSend,
    bondDepositEverusd,
  };
};
