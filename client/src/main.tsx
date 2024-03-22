import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Global, css } from '@emotion/react';
import { UserProvider } from './provider/userProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <Global
        styles={css`
          body {
            height: 100vh;
            background-color: #f7f7f7 !important;
          }
        `}
      />
      <App />
    </UserProvider>
  </React.StrictMode>
);
