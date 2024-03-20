import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Global, css } from '@emotion/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Global
      styles={css`
        body {
          height: 100vh;
          background-color: #f7f7f7 !important;
        }
      `}
    />
    <App />
  </React.StrictMode>
);
