import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';

const TITLES = {
  '/': 'Клиенты и заказы',
  '/overview': 'Обзор',
  '/settings': 'Настройки',
};

export const DashboardLayout = () => {
  const location = useLocation();
  const title = TITLES[location.pathname] ?? 'Dashboard';

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title={title} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
