import { useCallback, useContext } from "react";
import { store } from "../components/PolkadotProvider";

const useAssets = () => {
  const { polkadotState, dispatch } = useContext(store);
  const { api } = polkadotState;
  const fetchAssets = useCallback(() => {
    if (api) {
      api.query.evercityCarbonCredits.carbonCreditPassportRegistry
        .entries()
        .then(assets => {
          dispatch({
            type: "setAssets",
            payload: assets,
          });
        });
    }
  }, [api]);

  return {
    assets: polkadotState.assets || [],
    fetchAssets,
  };
};

export default useAssets;
