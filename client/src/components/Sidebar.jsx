import { NavLink } from 'react-router-dom';
import { DashboardIcon, LogoIcon, SettingsIcon, TableIcon } from './Icons';

export const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-header">
      <LogoIcon className="sidebar-logo" />
      <h2>Dashboard</h2>
    </div>
    <ul className="sidebar-menu">
      <li>
        <NavLink to="/">
          <TableIcon className="sidebar-icon" />
          Клиенты и заказы
        </NavLink>
      </li>
      <li>
        <NavLink to="/overview">
          <DashboardIcon className="sidebar-icon" />
          Обзор
        </NavLink>
      </li>
      <li>
        <NavLink to="/settings">
          <SettingsIcon className="sidebar-icon" />
          Настройки
        </NavLink>
      </li>
    </ul>
  </aside>
);
