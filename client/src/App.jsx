import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ClientsOrdersPage } from '@/pages/ClientsOrdersPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { SettingsPage } from '@/pages/SettingsPage';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<ClientsOrdersPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
