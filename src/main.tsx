import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.ts';
import App from './App.tsx';
import './appVersion.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
