import { useCallback, useContext } from "react";

import { notification } from "antd";
import dayjs from "dayjs";
import { u8aToString } from "@polkadot/util";
import { useNavigate } from "react-router-dom";

import { store } from "../components/PolkadotProvider";

import { getAvailableRoles } from "../utils/roles";
import { DEFAULT_AUDITOR_ADDRESS, BONDS_PAGE_SIZE } from "../utils/env";
import { getCurrentUserAddress } from "../utils/storage";
import { calculateInterestRate } from "../utils/interestRate";
import { bondCurrentPeriod } from "../utils/period";
import formatTicker from "../utils/tickerFormatter";
import {
  fromEverUSD,
  fromPercent,
  toBondDays,
  toEverUSD,
  toPercent,
} from "../utils/converters";
import pullAllWith from "lodash/pullAllWith";
import isMatch from "lodash/isMatch";
export default () => {
  const navigate = useNavigate();
  const { polkadotState, dispatch } = useContext(store);
  const { api, injector, timeStep } = polkadotState;

  const bondImpactReport = useCallback(
    async bondID => {
      const result = await api.query.evercity.bondImpactReport(bondID);

      return result?.toJSON();
    },
    [api],
  );

  const bondCouponYield = useCallback(
    async bondID => {
      const currentUserAddress = getCurrentUserAddress();

      if (!currentUserAddress) {
        return [];
      }

      const result = await api.query.evercity.bondCouponYield(bondID);

      return result?.toJSON();
    },
    [api],
  );

  const bondUnitPackageRegistry = useCallback(
    async bondID => {
      const currentUserAddress = getCurrentUserAddress();

      if (!currentUserAddress) {
        return [];
      }

      const result = await api.query.evercity.bondUnitPackageRegistry(
        bondID,
        currentUserAddress,
      );

      const jsonResult = result?.toJSON()?.map(res => {
        const { bond_units: bondUnits, coupon_yield: couponYield } = res;

        return {
          bondUnits,
          couponYield: fromEverUSD(couponYield).toFixed(2),
        };
      });

      return jsonResult;
    },
    [api],
  );

  const fetchBonds = useCallback(async () => {
    let payload = [];

    if (!api) {
      return payload;
    }

    let result;

    try {
      result = await api.query.evercity.bondRegistry.entriesPaged({
        args: [],
        pageSize: BONDS_PAGE_SIZE,
      });
    } catch (error) {
      console.error("bond fetching error: ", error.message);
      return payload;
    }

    const promises = result.map(
      async ([
        {
          args: [ticker],
        },
        value,
      ]) => {
        const id = u8aToString(ticker);
        const couponYield = await bondCouponYield(
          `${id.replace("\u0000", "0")}`,
        );
        const bondData = value.toJSON();

        const packageRegistry = await bondUnitPackageRegistry(id);
        const impactData = await bondImpactReport(id);
        const currentPeriod = bondCurrentPeriod(bondData, id);

        const { inner } = bondData;

        const { interest_rate_base_value: interestRate } = inner;

        const calculatedInterestRate = toPercent(
          calculateInterestRate(bondData, impactData, currentPeriod) ||
            interestRate,
        );
        const currentInterestRate = calculatedInterestRate?.toFixed(2);

        return {
          id,
          bondCouponYield: couponYield,
          currentInterestRate,
          packageRegistry,
          impactData,
          currentPeriod,
          ...bondData,
        };
      },
    );

    try {
      payload = await Promise.all(promises);
    } catch (error) {
      notification.error({
        message: "An error has occured while loading bonds",
        description: error,
      });
    }

    dispatch({
      type: "setBonds",
      payload,
    });
  }, [api, dispatch]);

  const accountRegistry = useCallback(
    async address => {
      const data = await api.query.evercityAccounts.accountRegistry(address);
      const { roles: roleMask, identity } = data.toJSON();
      const roles = getAvailableRoles(roleMask);

      return { roles, identity };
    },
    [api],
  );

  const fetchBalance = useCallback(async () => {
    const currentUserAddress = getCurrentUserAddress();

    if (!api || !currentUserAddress) {
      return 0;
    }

    const data = await api.query.evercity.balanceEverUSD(currentUserAddress);

    const balance = parseInt(data?.toBigInt());

    return fromEverUSD(balance);
  }, [api]);

  const transactionCallback =
    message =>
    ({ status }) => {
      if (status.isInBlock) {
        notification.success({
          message,
          description: "Transaction is in block",
        });
      }

      if (status.isFinalized) {
        const { Finalized } = status.toJSON();
        console.info(message, Finalized);

        notification.success({
          message,
          description: "Block finalized",
        });
        fetchBonds();
        fetchBalance();
      }
    };

  const requestMintTokens = useCallback(
    async values => {
      const currentUserAddress = getCurrentUserAddress();
      const { amount } = values;

      if (amount <= 0) {
        return;
      }

      try {
        await api.tx.evercity
          .tokenMintRequestCreateEverusd(BigInt(toEverUSD(amount)))
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback("Mint request"),
          );

        notification.success({
          message: "Mint request",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const revokeMintTokens = useCallback(async () => {
    const currentUserAddress = getCurrentUserAddress();

    try {
      await api.tx.evercity.tokenMintRequestRevokeEverusd().signAndSend(
        currentUserAddress,
        {
          signer: injector.signer,
          nonce: -1,
        },
        transactionCallback("Mint revoke"),
      );

      notification.success({
        message: "Mint revoke",
        description: "Transaction has been sent to blockchain",
      });
    } catch (error) {
      notification.error({
        message: "Signing/sending transaction process failed",
        description: `${error}`,
      });
    }
  }, [api, injector, transactionCallback]);

  const requestBurnTokens = useCallback(
    async values => {
      const { amount } = values;
      const currentUserAddress = getCurrentUserAddress();

      if (amount <= 0) {
        return;
      }

      try {
        await api.tx.evercity
          .tokenBurnRequestCreateEverusd(BigInt(toEverUSD(amount)))
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback("Burn request"),
          );

        notification.success({
          message: "Burn request",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const revokeBurnTokens = useCallback(async () => {
    const currentUserAddress = getCurrentUserAddress();

    try {
      await api.tx.evercity.tokenBurnRequestRevokeEverusd().signAndSend(
        currentUserAddress,
        {
          signer: injector.signer,
          nonce: -1,
        },
        transactionCallback("Burn revoke"),
      );

      notification.success({
        message: "Burn revoke",
        description: "Transaction has been sent to blockchain",
      });
    } catch (error) {
      notification.error({
        message: "Signing/sending transaction process failed",
        description: `${error}`,
      });
    }
  }, [api, injector, transactionCallback]);

  const createOrAssignRole = useCallback(
    async values => {
      const { action, role, address } = values;
      const identity = Math.floor(Math.random() * 50);
      const currentUserAddress = getCurrentUserAddress();

      const args = [address];

      if (
        ["accountSetWithRoleAndData", "accountAddWithRoleAndData"].includes(
          action,
        )
      ) {
        args.push(role);
      }

      if (action === "accountAddWithRoleAndData") {
        args.push(identity);
      }

      try {
        await api.tx.evercityAccounts[action](...args).signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Create/Assign role"),
        );

        notification.success({
          message: "Create/Assign role",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const checkMintRequest = useCallback(
    async address => {
      const result = await api.query.evercity.mintRequestEverUSD(address);

      const { amount, deadline } = result?.toJSON() || {};
      return {
        amount: fromEverUSD(amount),
        deadline,
      };
    },
    [api],
  );

  const checkBurnRequest = useCallback(
    async address => {
      const result = await api.query.evercity.burnRequestEverUSD(address);

      const { amount, deadline } = result?.toJSON() || {};
      return {
        amount: fromEverUSD(amount),
        deadline,
      };
    },
    [api],
  );

  const confirmEverusdRequest = useCallback(
    async (action, amount, address) => {
      const command =
        action.toLowerCase() === "mint"
          ? "tokenMintRequestConfirmEverusd"
          : "tokenBurnRequestConfirmEverusd";
      const currentUserAddress = getCurrentUserAddress();

      try {
        await api.tx.evercity[command](
          address,
          BigInt(toEverUSD(amount)),
        ).signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
          },
          transactionCallback(`${action} confirm`),
        );

        notification.success({
          message: `${action} confirm`,
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const declineEverusdRequest = useCallback(
    async (action, address) => {
      const command =
        action.toLowerCase() === "mint"
          ? "tokenMintRequestDeclineEverusd"
          : "tokenBurnRequestDeclineEverusd";
      const currentUserAddress = getCurrentUserAddress();

      try {
        await api.tx.evercity[command](address).signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback(`${action} decline`),
        );

        notification.success({
          message: `${action} decline`,
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const totalSupplyEverUSD = useCallback(async () => {
    const data = await api.query.evercity.totalSupplyEverUSD();

    return fromEverUSD(data?.toNumber());
  }, [api]);

  const bondRegistry = useCallback(
    async bondID => {
      const bond = await api.query.evercity.bondRegistry(bondID);

      return bond?.toJSON();
    },
    [api],
  );

  const bondUnitPackageBuy = useCallback(
    async (bondID, bondUnitsCount) => {
      const bond = await api.query.evercity.bondRegistry(bondID);
      const currentUserAddress = getCurrentUserAddress();

      try {
        await api.tx.evercity
          .bondUnitPackageBuy(bondID, bond?.nonce?.toNumber(), bondUnitsCount)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback("Bond invest"),
          );

        notification.success({
          message: "Bond invest",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const bondUnitLotBid = useCallback(
    async values => {
      const currentUserAddress = getCurrentUserAddress();
      const { bondID, deadline, bondholder, unitsCount, amount } = values;

      const lot = api.createType("BondUnitSaleLotStructOf", {
        deadline: deadline.unix() * 1000,
        new_bondholder: bondholder,
        bond_units: unitsCount,
        amount,
      });

      try {
        await api.tx.evercity.bondUnitLotBid(bondID, lot).signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Bond unit lot bid"),
        );

        notification.success({
          message: "Bond unit lot bid",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const bondUnitLotSettle = useCallback(
    async values => {
      const currentUserAddress = getCurrentUserAddress();
      const {
        bondID,
        deadline,
        bondholder,
        bond_units: unitsCount,
        amount,
        new_bondholder: newBondholder,
      } = values;

      const lot = api.createType("BondUnitSaleLotStructOf", {
        deadline,
        new_bondholder: newBondholder,
        bond_units: unitsCount,
        amount,
      });

      try {
        await api.tx.evercity
          .bondUnitLotSettle(bondID, bondholder, lot)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback("Bond unit lot settle"),
          );

        notification.success({
          message: "Bond unit lot settle",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const bondUnitPackageLot = useCallback(
    async bondID => {
      const result = await api.query.evercity.bondUnitPackageLot.entries(
        bondID,
      );

      const allLots = [];

      result.forEach(
        ([
          {
            args: [, bondholder],
          },
          value,
        ]) => {
          const inner = value.toJSON();
          inner.forEach(data => {
            allLots.push({
              bondID,
              bondholder: bondholder.toHuman(),
              ...data,
            });
          });
        },
      );

      return allLots.filter(item => !!item.bond_units);
    },
    [api],
  );

  const prepareBond = useCallback(
    async values => {
      const bondStruct = {
        docs_pack_root_hash_main: [],
        docs_pack_root_hash_legal: [],
        docs_pack_root_hash_finance: [],
        docs_pack_root_hash_tech: [],

        // from 0,001% to 1%
        // eslint-disable-next-line max-len
        interest_rate_penalty_for_missed_report:
          values.interest_rate_penalty_for_missed_report * 1000,
        interest_rate_start_period_value:
          values.interest_rate_start_period_value * 1000,
        interest_rate_base_value: values.interest_rate_base_value * 1000,
        interest_rate_margin_cap: values.interest_rate_margin_cap * 1000,
        interest_rate_margin_floor: values.interest_rate_margin_floor * 1000,

        interest_pay_period: toBondDays(values.interest_pay_period, timeStep),
        bond_finishing_period: toBondDays(
          values.bond_finishing_period,
          timeStep,
        ),
        impact_data_send_period: toBondDays(
          values.impact_data_send_period,
          timeStep,
        ),
        start_period: toBondDays(values.start_period, timeStep),
        payment_period: toBondDays(values.payment_period, timeStep),

        impact_data_type: values.impact_data_type,
        impact_data_max_deviation_cap: values.impact_data_max_deviation_cap,
        impact_data_max_deviation_floor: values.impact_data_max_deviation_floor,
        bond_duration: values.bond_duration,
        mincap_deadline: dayjs(values.mincap_deadline).unix() * 1000,
        bond_units_mincap_amount: values.bond_units_mincap_amount,
        bond_units_maxcap_amount: values.bond_units_maxcap_amount,
        bond_units_base_price: values.bond_units_base_price * 10 ** 9,
        impact_data_baseline: [...Array(values.bond_duration).keys()].map(
          item => values[`impact_baseline_${item}`],
        ),
        carbon_metadata: {
          count: values.carbon_metadata_count,
          carbon_distribution: {
            investors: fromPercent(
              values.carbon_metadata_distribution_investors,
            ),
            issuer: fromPercent(values.carbon_metadata_distribution_issuer),
          },
          account_investments: null,
        },
      };

      const currentUserAddress = getCurrentUserAddress();

      const bondId = formatTicker(values.bond_id);

      try {
        await api.tx.evercity.bondAddNew(bondId, bondStruct).signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Bond prepare"),
        );

        notification.success({
          message: "Bond prepare",
          description: "Transaction has been sent to blockchain",
        });

        navigate("/");
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const releaseBond = useCallback(
    async bondId => {
      const bond = await api.query.evercity.bondRegistry(bondId);
      const currentUserAddress = getCurrentUserAddress();

      try {
        await api.tx.evercity
          .bondRelease(bondId, bond?.nonce?.toNumber())
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback("Bond release"),
          );

        notification.success({
          message: "Bond release",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const activateBond = useCallback(
    async bondId => {
      const bond = await api.query.evercity.bondRegistry(bondId);
      const currentUserAddress = getCurrentUserAddress();

      try {
        await api.tx.evercity
          .bondSetAuditor(bondId, DEFAULT_AUDITOR_ADDRESS)
          .signAndSend(currentUserAddress, { signer: injector.signer });

        await api.tx.evercity
          .bondActivate(bondId, bond.nonce.toNumber() + 1)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback("Bond activate"),
          );

        notification.success({
          message: "Bond activate",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: error,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const bondImpactReportSend = useCallback(
    async (bondID, period, impactValue) => {
      const currentUserAddress = getCurrentUserAddress();

      try {
        await api.tx.evercity
          .bondImpactReportSend(bondID, period, impactValue)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback("Send impact data"),
          );

        notification.success({
          message: "Send impact data",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const bondDepositEverusd = useCallback(
    async (bondID, amount) => {
      const currentUserAddress = getCurrentUserAddress();

      try {
        await api.tx.evercity
          .bondDepositEverusd(bondID, toEverUSD(amount))
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback("Deposit"),
          );

        notification.success({
          message: "Deposit",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const dayDuration = useCallback(async () => {
    const result = await api.consts.evercity.timeStep;
    return result?.toJSON();
  }, [api]);

  const bondImpactReportApprove = useCallback(
    async (bondID, period, impactData) => {
      const currentUserAddress = getCurrentUserAddress();

      try {
        await api.tx.evercity
          .bondImpactReportApprove(bondID, period, impactData)
          .signAndSend(
            currentUserAddress,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback("Report approve"),
          );

        notification.success({
          message: "Report approve",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const bondAccrueCouponYield = useCallback(
    async bondID => {
      const currentUserAddress = getCurrentUserAddress();

      try {
        await api.tx.evercity.bondAccrueCouponYield(bondID).signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Bond accrue"),
        );

        notification.success({
          message: "Bond accrue",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const bondWithdrawEverusd = useCallback(
    async bondID => {
      const currentUserAddress = getCurrentUserAddress();

      try {
        await api.tx.evercity.bondWithdrawEverusd(bondID).signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Bond withdraw"),
        );

        notification.success({
          message: "Bond withdraw",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const redeemBond = useCallback(
    async bondID => {
      const currentUserAddress = getCurrentUserAddress();

      try {
        await api.tx.evercity.bondRedeem(bondID).signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Bond redeem"),
        );

        notification.success({
          message: "Bond redeem",
          description: "Transaction has been sent to blockchain",
        });
      } catch (error) {
        notification.error({
          message: "Signing/sending transaction process failed",
          description: `${error}`,
        });
      }
    },
    [api, injector, transactionCallback],
  );

  const subscribeOnEvents = useCallback(
    cb => {
      if (!api) {
        return;
      }
      const FILTERS = [{ pallet: "system", method: "ExtrinsicSuccess" }];
      api.query.system.events(async events => {
        const header = await api.rpc.chain.getHeader(events.createdAtHash);
        const transformedEvents = events.map(({ event }) => {
          const types = event.typeDef;
          const params = {};
          event.data.forEach((data, index) => {
            params[types[index].type] = data.toString();
          });
          return {
            params,
            pallet: event.section,
            method: event.method,
            block_hash: header.hash.toHex(),
            block_number: header.number.unwrap().toNumber(),
          };
        });
        pullAllWith(transformedEvents, FILTERS, isMatch);

        cb(transformedEvents);
      });
    },
    [api],
  );

  return {
    accountRegistry,
    fetchBonds,
    fetchBalance,
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
    bondCouponYield,
    dayDuration,
    bondRegistry,
    bondImpactReportApprove,
    bondAccrueCouponYield,
    bondWithdrawEverusd,
    redeemBond,
    subscribeOnEvents,
  };
};
