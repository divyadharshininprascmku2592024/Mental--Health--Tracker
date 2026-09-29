import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Smile,
  BookOpen,
  Moon,
  Activity as ActivityIcon,
  BarChart3,
  ShieldAlert
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/moods', label: 'Mood Tracker', icon: Smile },
    { path: '/journal', label: 'Journal', icon: BookOpen },
    { path: '/sleep', label: 'Sleep Tracker', icon: Moon },
    { path: '/activities', label: 'Activities', icon: ActivityIcon },
    { path: '/reports', label: 'Reports & Analytics', icon: BarChart3 }
  ];

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <div className="nav-section-title">MAIN MODULES</div>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <IconComponent size={20} className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="educational-badge">
            <ShieldAlert size={16} className="edu-icon" />
            <div className="edu-text">
              <strong>UG College Project</strong>
              <span>General Wellness Monitor</span>
            </div>
          </div>
        </div>

        <style>{`
          .sidebar-container {
            width: 250px;
            background: rgba(15, 23, 42, 0.95);
            border-right: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1.5rem 1rem;
            transition: transform var(--transition-normal);
            z-index: 90;
          }
          .sidebar-nav {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
          }
          .nav-section-title {
            font-size: 0.72rem;
            font-weight: 700;
            color: var(--text-muted);
            letter-spacing: 0.08em;
            padding: 0.5rem 0.75rem;
            margin-bottom: 0.25rem;
          }
          .nav-link {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 0.75rem 1rem;
            border-radius: var(--radius-md);
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.92rem;
            font-weight: 500;
            transition: all var(--transition-fast);
          }
          .nav-link:hover {
            color: var(--text-main);
            background: rgba(255, 255, 255, 0.04);
          }
          .nav-link.active {
            color: var(--primary);
            background: var(--primary-light);
            font-weight: 600;
          }
          .nav-link.active .nav-icon {
            color: var(--primary);
          }
          .sidebar-footer {
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
          }
          .educational-badge {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid rgba(245, 158, 11, 0.25);
            padding: 0.6rem 0.75rem;
            border-radius: var(--radius-md);
          }
          .edu-icon { color: var(--accent-amber); flex-shrink: 0; }
          .edu-text { display: flex; flex-direction: column; }
          .edu-text strong { font-size: 0.75rem; color: #fde047; }
          .edu-text span { font-size: 0.68rem; color: var(--text-muted); }

          @media (max-width: 768px) {
            .sidebar-container {
              position: fixed;
              top: 70px;
              left: 0;
              bottom: 0;
              transform: translateX(-100%);
            }
            .sidebar-container.open {
              transform: translateX(0);
            }
            .sidebar-backdrop {
              position: fixed;
              top: 70px;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0,0,0,0.6);
              backdrop-filter: blur(2px);
              z-index: 80;
            }
          }
        `}</style>
      </aside>
    </>
  );
};

export default Sidebar;
