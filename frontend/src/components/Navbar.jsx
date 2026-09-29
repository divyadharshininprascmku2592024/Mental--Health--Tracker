import React, { useState, useEffect } from 'react';
import { HeartPulse, Calendar, Server, Menu, X } from 'lucide-react';
import { getActiveBackend, setActiveBackend } from '../services/api';

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const [currentBackend, setCurrentBackend] = useState(getActiveBackend());
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    setTodayDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  const handleBackendChange = (e) => {
    const val = e.target.value;
    setCurrentBackend(val);
    setActiveBackend(val);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="brand-badge">
          <HeartPulse size={24} className="brand-icon" />
          <span className="brand-title">MindPulse</span>
        </div>
        <span className="brand-subtitle">Mental Health & Wellness Monitor</span>
      </div>

      <div className="navbar-right">
        <div className="date-chip">
          <Calendar size={15} />
          <span>{todayDate}</span>
        </div>

        <div className="backend-selector">
          <Server size={15} className="backend-icon" />
          <select value={currentBackend} onChange={handleBackendChange} className="backend-select">
            <option value="django">Django REST API (8000)</option>
            <option value="node">Node.js Express API (5000)</option>
          </select>
        </div>
      </div>

      <style>{`
        .navbar-container {
          height: 70px;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--text-main);
          cursor: pointer;
        }
        .brand-badge {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-md);
        }
        .brand-icon {
          color: var(--primary);
        }
        .brand-title {
          font-weight: 700;
          font-size: 1.15rem;
          color: #ffffff;
        }
        .brand-subtitle {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .date-chip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .backend-selector {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-md);
        }
        .backend-icon {
          color: var(--accent-blue);
        }
        .backend-select {
          background: transparent;
          border: none;
          color: #93c5fd;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          outline: none;
          font-family: inherit;
        }
        .backend-select option {
          background: #1e293b;
          color: #ffffff;
        }
        @media (max-width: 768px) {
          .navbar-container { padding: 0 1rem; }
          .mobile-menu-btn { display: block; }
          .brand-subtitle, .date-chip { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
