import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext'; // Updated import
import logo from '../../assets/images/logo-gupjob-primary.png';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => 
    location.pathname.startsWith(path) ? 'active' : '';

  // --- 1. ADMIN Navigation ---
  const AdminNav = () => (
    <>
      <div className="nav-section-label">Administration</div>
      <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
        🧠 Dashboard
      </Link>
      <Link to="/admin/roadmaps" className={isActive('/admin/roadmaps')}>
        🗺️ Roadmaps
      </Link>
      <Link to="/admin/courses" className={isActive('/admin/courses')}>
        📚 Courses
      </Link>
      <Link to="/admin/departments" className={isActive('/admin/departments')}>
        📂 Departments
      </Link>

      <div className="nav-section-label">System</div>
      <Link to="/admin/users" className={isActive('/admin/users')}>
        👥 Users
      </Link>
    </>
  );

  // --- 2. MENTOR Navigation ---
  const MentorNav = () => (
    <>
      <div className="nav-section-label">Mentorship</div>
      <Link to="/mentor/dashboard" className={isActive('/mentor/dashboard')}>
        🎛️ Mentor Hub
      </Link>
      <Link to="/mentor/requests" className={isActive('/mentor/requests')}>
        ✅ Requests
      </Link>
      <Link to="/mentor/sessions" className={isActive('/mentor/sessions')}>
        📅 Sessions
      </Link>
    </>
  );

  // --- 3. LEARNER Navigation (Default) ---
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
        🚀 Progress
      </Link>
      
      <div className="nav-section-label">Community</div>
      <Link to="/mentors" className={isActive('/mentors')}>
        👥 Find Mentors
      </Link>
    </>
  );

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="Gub Job" className="brand-icon" style={{width: '24px', marginRight: '8px'}} />
        <span>Gub Job</span>
      </div>
      
      <nav className="sidebar-nav">
        {/* Dynamic Rendering based on Role */}
        {user?.role === 'ADMIN' && <AdminNav />}
        {user?.role === 'MENTOR' && <MentorNav />}
        {(!user?.role || user?.role === 'USER' || user?.role === 'STUDENT') && <LearnerNav />}
      </nav>

      <div className="sidebar-footer">
        {/* Pro Upsell (Only for Learners) */}
        {(user?.role === 'USER' || user?.role === 'STUDENT') && (
          <div className="pro-upsell">
            <p><strong>GUPJOB Pro</strong></p>
            <p style={{fontSize: '0.75rem', marginTop: '4px', color: '#64748b'}}>Get verified badges & unlimited chats.</p>
            <button className="btn-upgrade">Upgrade Plan</button>
          </div>
        )}
        
        <div className="user-mini-profile">
          <div className="avatar-small">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <span className="user-email" title={user?.email}>{user?.email}</span>
            <span className={`badge ${user?.role?.toLowerCase() || 'basic'}`} style={{fontSize: '0.7rem'}}>
              {user?.role || 'GUEST'}
            </span>
          </div>
        </div>

        <button onClick={logout} className="btn-logout">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}