import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider'; // Adjust path if needed

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path) ? 'active' : '';

  // --- 1. Learner Navigation (B2C) ---
  const LearnerNav = () => (
    <>
      <div className="nav-section-label">Learning</div>
      <Link to="/dashboard" className={isActive('/dashboard')}>
        📊 Dashboard
      </Link>
      <Link to="/roadmaps" className={isActive('/roadmaps')}>
        🗺️ My Roadmaps
      </Link>
      <Link to="/progress" className={isActive('/progress')}>
        🚀 My Progress
      </Link>
      
      <div className="nav-section-label">Community</div>
      <Link to="/mentors" className={isActive('/mentors')}>
        👥 Find Mentors
      </Link>
    </>
  );

  // --- 2. Mentor Navigation (B2B) ---
  const MentorNav = () => (
    <>
      <div className="nav-section-label">Mentorship</div>
      <Link to="/mentor/dashboard" className={isActive('/mentor/dashboard')}>
        🎛️ Mentor Hub
      </Link>
      <Link to="/mentor/requests" className={isActive('/mentor/requests')}>
        ✅ Verification Requests
      </Link>
      <Link to="/mentor/sessions" className={isActive('/mentor/sessions')}>
        📅 Upcoming Sessions
      </Link>
    </>
  );

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        {/* Make sure logo-small.png is in public folder */}
        <img src="/logo-small.png" alt="Gub Job" className="brand-icon" />
        <span>Gub Job</span>
      </div>
      
      <nav className="sidebar-nav">
        {user?.role === 'MENTOR' ? <MentorNav /> : <LearnerNav />}
      </nav>

      <div className="sidebar-footer">
        {user?.role === 'LEARNER' && (
          <div className="pro-upsell">
            <p><strong>GUPJOB Pro</strong></p>
            <p style={{fontSize: '0.75rem', marginTop: '4px'}}>Get verified badges & unlimited chats.</p>
            <button className="btn-upgrade">Upgrade Plan</button>
          </div>
        )}
        
        <div className="user-mini-profile">
          <div className="avatar-small">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <span className="user-email" title={user?.email}>{user?.email}</span>
            <span className="user-role-badge">{user?.role || 'Guest'}</span>
          </div>
        </div>

        <button onClick={logout} className="btn-logout">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}