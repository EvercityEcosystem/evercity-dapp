import React, { createContext, useReducer } from 'react';

const initialState = {};
const store = createContext(initialState);
const { Provider } = store;

// eslint-disable-next-line react/prop-types
const PolkadotProvider = ({ children }) => {
  const [polkadotState, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'setAPI':
        return {
          api: action?.payload,
          injector: state?.injector,
        };
      case 'setInjector':
        return {
          injector: action?.payload,
          api: state?.api,
        };
      default:
        throw new Error();
    }
  }, initialState);

  return (
    <Provider value={{ polkadotState, dispatch }}>
      {children}
    </Provider>
  );
};

export { store, PolkadotProvider };
