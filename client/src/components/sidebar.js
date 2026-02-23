import React from 'react';
import './sidebar.css';

const Sidebar = ({ user, activeTab, onTabChange }) => {
  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <h3 className="sidebar-title">Profile</h3>
        <div className="sidebar-username">{user.username}</div>
        <div className="sidebar-detail">Member</div>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`sidebar-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => onTabChange('home')}
        >
          Home
        </button>
        <button
          className={`sidebar-nav-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => onTabChange('history')}
        >
          History
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
