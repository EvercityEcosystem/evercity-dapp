import { useCallback, useContext } from "react";
import { store } from "../components/PolkadotProvider";
import { getRandom16Id } from "../utils/id";
import { getCurrentUserAddress } from "../utils/storage";
import { transactionCallback } from "../utils/notify";
import { SUBSTRATE_ROLES } from "../utils/roles";

const MIN_BALANCE_CC = 1;

const useAssets = () => {
  const { polkadotState, dispatch } = useContext(store);
  const { api, injector } = polkadotState;

  const fetchAssets = useCallback(() => {
    if (!api) {
      return;
    }
    api.query.evercityCarbonCredits.carbonCreditPassportRegistry
      .entries()
      .then(credits => credits.map(([, value]) => value.toJSON()))
      .then(async credits => {
        const evercityAssets = await api.query.evercityAssets.asset
          .entries()
          .then(projects =>
            projects.map(([key, value]) => {
              const asset = value.toHuman();
              return {
                asset_id: Number(key.toHuman()[0]),
                ...asset,
              };
            }),
          );
        const projects = await api.query.evercityCarbonCredits.projectById
          .entries()
          .then(projects => projects.map(([, value]) => value.toJSON()));

        const assets = projects.map(project => {
          const foundCarbonCredits = credits.filter(
            credit => credit.project_id.carbonProject === project.id,
          );

          const filledCarbonCredits = foundCarbonCredits.map(
            ({ annual_report_index, asset_id }) => {
              const foundEvercityAsset = evercityAssets.find(
                asset => asset.asset_id === asset_id,
              );

              return {
                asset_id,
                annual_report_index,
                project_id: project.id,
                supply: foundEvercityAsset.supply,
                deposit: foundEvercityAsset.deposit,
                is_frozen: foundEvercityAsset.is_frozen,
                min_balance: foundEvercityAsset.min_balance,
              };
            },
          );
          return {
            ...project,
            carbon_credits: filledCarbonCredits,
          };
        });
        dispatch({
          type: "setAssets",
          payload: assets,
        });
      });
  }, [api, dispatch]);

  const createFile = useCallback(
    async (filehash, tag) => {
      if (!api || !injector) {
        return;
      }
      const currentUserAddress = getCurrentUserAddress();
      const ttag = api.createType("Vec<u8>", tag);
      const tfilehash = api.createType("H256", filehash);
      const fileId = api.createType("Option<FileId>", getRandom16Id());
      await api.tx.evercityFilesign
        .createNewFile(ttag, tfilehash, fileId)
        .signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Create file"),
        );

      return fileId;
    },
    [api, transactionCallback, injector],
  );

  const createProject = useCallback(
    async (standard, fileId) => {
      if (!api) {
        return;
      }
      const tfileId = api.createType("Option<FileId>", fileId);
      const tstandard = api.createType("Standard", standard);
      const currentUserAddress = getCurrentUserAddress();
      await api.tx.evercityCarbonCredits
        .createProject(tstandard, tfileId)
        .signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Project create"),
        );
    },
    [api, injector, transactionCallback],
  );

  const assignRoleInProject = useCallback(
    async ({ projectId, signer, role }) => {
      if (!api) {
        return;
      }
      const currentUserAddress = getCurrentUserAddress();
      const tsigner = api.createType("AccountId", signer);
      await api.tx.evercityCarbonCredits
        .assignProjectSigner(tsigner, role, projectId)
        .signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Assign role in project", () => {
            fetchAssets();
          }),
        );
    },
    [api, injector, transactionCallback],
  );

  const signProject = useCallback(
    projectId => {
      if (!api) {
        return;
      }
      const currentUserAddress = getCurrentUserAddress();

      api.tx.evercityCarbonCredits.signProject(projectId).signAndSend(
        currentUserAddress,
        {
          signer: injector.signer,
          nonce: -1,
        },
        transactionCallback("Sign project", () => {
          fetchAssets();
        }),
      );
    },
    [api, injector, transactionCallback],
  );

  const createReport = useCallback(
    async ({ projectId, hash, tag, count, name, symbol, decimals }) => {
      if (!api) {
        return;
      }
      const reportId = getRandom16Id();
      const tfileId = api.createType("FileId", reportId);
      const tfilehash = api.createType("H256", hash);
      const ttag = api.createType("Vec<u8>", tag);
      const tcarbonCreditsCount = api.createType("Balance", count);
      const tassetName = api.createType("Vec<u8>", name);
      const tassetSymbol = api.createType("Vec<u8>", symbol);
      const tassetDecimals = api.createType("u8", decimals);
      const currentUserAddress = getCurrentUserAddress();
      await api.tx.evercityCarbonCredits
        .createAnnualReportWithFile(
          projectId,
          tfileId,
          tfilehash,
          ttag,
          tcarbonCreditsCount,
          tassetName,
          tassetSymbol,
          tassetDecimals,
        )
        .signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Create report", () => {
            fetchAssets();
          }),
        );

      await api.tx.evercityCarbonCredits
        .assignLastAnnualReportSigner(currentUserAddress, 256, projectId)
        .signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Assign project owner", () => {
            fetchAssets();
          }),
        );
    },
    [api, transactionCallback, injector],
  );

  const assignLastReportSigner = useCallback(
    async ({ projectId, signer, role }) => {
      if (!api) {
        return;
      }

      const tsigner = api.createType("AccountId", signer);
      const currentUserAddress = getCurrentUserAddress();
      await api.tx.evercityCarbonCredits
        .assignLastAnnualReportSigner(tsigner, role, projectId)
        .signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback(`Assign ${SUBSTRATE_ROLES[role]}`, () => {
            fetchAssets();
          }),
        );
    },
    [api, transactionCallback, injector],
  );

  const signLastReport = useCallback(
    async projectId => {
      if (!api) {
        return;
      }
      const currentUserAddress = getCurrentUserAddress();
      await api.tx.evercityCarbonCredits
        .signLastAnnualReport(projectId)
        .signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Sign report", () => {
            fetchAssets();
          }),
        );
    },
    [api, injector, transactionCallback],
  );

  const releaseCarbonCredits = useCallback(
    async ({ projectId }) => {
      if (!api) {
        return;
      }
      const currentUserAddress = getCurrentUserAddress();
      const assets = await api.query.evercityAssets.asset.entries();
      const lastAssetId =
        assets.length > 0 ? Number(assets[0][0].toHuman()[0]) : 1;
      const assetId = lastAssetId + 1;
      const tassetId = api.createType("AssetId", assetId);
      const tnewCarbonCreditsHolder = api.createType(
        "AccountId",
        currentUserAddress,
      );
      const tminBalance = api.createType("Balance", MIN_BALANCE_CC);
      await api.tx.evercityCarbonCredits
        .releaseCarbonCredits(
          projectId,
          tassetId,
          tnewCarbonCreditsHolder,
          tminBalance,
        )
        .signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Release Carbon Credits", () => {
            fetchAssets();
          }),
        );
    },
    [api, injector, transactionCallback],
  );

  const burnCarbonCredits = useCallback(
    async ({ assetId, amount }) => {
      if (!api) {
        return;
      }
      const tasset_id = api.createType("AssetId", assetId);
      const tamount = api.createType("Balance", amount);
      const currentUserAddress = getCurrentUserAddress();

      await api.tx.evercityCarbonCredits
        .burnCarbonCredits(tasset_id, tamount)
        .signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Burn Carbon Credits", () => {
            fetchAssets();
          }),
        );
    },
    [api, transactionCallback, injector],
  );

  return {
    project: polkadotState.project,
    assets: polkadotState.assets || [],
    fetchAssets,
    createFile,
    createProject,
    assignRoleInProject,
    signProject,
    createReport,
    assignLastReportSigner,
    signLastReport,
    releaseCarbonCredits,
    burnCarbonCredits,
  };
};

export default useAssets;
