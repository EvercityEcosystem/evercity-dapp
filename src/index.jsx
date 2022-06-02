import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { PolkadotProvider } from './components/PolkadotProvider';
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <PolkadotProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PolkadotProvider>
);
