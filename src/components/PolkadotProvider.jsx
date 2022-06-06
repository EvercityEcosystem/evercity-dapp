import React, { createContext, useReducer } from "react";

const initialState = {
  bonds: [],
};
const store = createContext(initialState);
const { Provider } = store;

const reducer = (state, action) => {
  switch (action.type) {
    case "setAPI":
      return {
        ...state,
        api: action?.payload,
      };
    case "setInjector":
      return {
        ...state,
        injector: action?.payload,
      };
    case "setBonds":
      return {
        ...state,
        bonds: action?.payload,
      };
    case "setTimeStep":
      return {
        ...state,
        timeStep: action?.payload,
      };
    case "setAssets":
      return {
        ...state,
        assets: action?.payload,
      };
    default:
      throw new Error("Action not found");
  }
};
// eslint-disable-next-line react/prop-types
const PolkadotProvider = ({ children }) => {
  const [polkadotState, dispatch] = useReducer(reducer, initialState);

  return <Provider value={{ polkadotState, dispatch }}>{children}</Provider>;
};

export { store, PolkadotProvider };
