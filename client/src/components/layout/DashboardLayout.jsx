import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, ShieldCheck, LogOut, Briefcase, FileText } from 'lucide-react';
import ThreeBackground from '../ThreeBackground';

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app-layout">
      {/* Background stays global but behind the layout */}
      <ThreeBackground />
      
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Briefcase size={28} color="var(--primary-color)" />
          <h2>Zorvyn Fin</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <LayoutDashboard size={20} />
            <span>Home</span>
          </NavLink>

          <NavLink to="/records" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <FileText size={20} />
            <span>Transactions</span>
          </NavLink>

          {user?.role === 'ADMIN' && (
            <>
              <div className="nav-section">Administration</div>
              <NavLink to="/users" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                <Users size={20} />
                <span>User Management</span>
              </NavLink>
              <NavLink to="/audit" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                <ShieldCheck size={20} />
                <span>Audit Logs</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">{user?.email?.[0].toUpperCase()}</div>
            <div className="user-info">
              <span className="user-email">{user?.email}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
