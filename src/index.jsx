import React from 'react';
import { render } from 'react-dom';

import App from './App';
import { PolkadotProvider } from './components/PolkadotProvider';
import { BrowserRouter } from "react-router-dom";

render(
  <PolkadotProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PolkadotProvider>,
  document.getElementById('root'),
);
