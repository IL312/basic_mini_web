import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { App } from '@/App';
import '@/styles/dashboard.css';
import '@/styles/ag-grid.css';

ModuleRegistry.registerModules([AllCommunityModule]);
console.log(import.meta.API_PROXY_TARGET);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
