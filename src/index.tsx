import React from 'react';
import ReactDOM from 'react-dom/client';
import SuperTokens from 'supertokens-auth-react';
import { SuperTokensConfig } from './config/supertokens';
import './index.css';
import App from './App';

// Initialize SuperTokens with error handling
try {
  SuperTokens.init(SuperTokensConfig);
  console.log('✅ SuperTokens initialized successfully');
} catch (error) {
  console.error('❌ SuperTokens initialization failed:', error);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
