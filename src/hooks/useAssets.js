import { useCallback, useContext } from "react";
import { store } from "../components/PolkadotProvider";
import { getRandom16Id } from "../utils/id";
import { getCurrentUserAddress } from "../utils/storage";
import { transactionCallback } from "../utils/notify";

const useAssets = () => {
  const { polkadotState, dispatch } = useContext(store);
  const { api, injector } = polkadotState;

  const fetchAssets = useCallback(() => {
    if (!api) {
      return;
    }
    api.query.evercityCarbonCredits.carbonCreditPassportRegistry
      .entries()
      .then(async assets => {
        api.query.evercityCarbonCredits.projectById.entries().then(projects => {
          console.log(projects[0][1].toJSON());
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
          transactionCallback(() => {}),
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
      api.tx.evercityCarbonCredits
        .createProject(tstandard, tfileId)
        .signAndSend(
          currentUserAddress,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback(),
        );
    },
    [api, transactionCallback],
  );

  return {
    assets: polkadotState.assets || [],
    fetchAssets,
    createFile,
    createProject,
  };
};

export default useAssets;
