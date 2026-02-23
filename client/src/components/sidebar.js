import React from 'react';
import './sidebar.css';

const Sidebar = ({ user, activeTab, onTabChange, isOpen, onClose }) => {
  if (!user) return null;

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? 'sidebar-backdrop--open' : ''}`}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close menu"
      />
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
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
    </>
  );
};

export default Sidebar;
