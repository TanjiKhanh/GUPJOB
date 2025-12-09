import React from 'react';
import '../styles/dashboard.css';
import logo from '../assets/images/logo-gupjob-primary.png';
import { useAuth } from '../auth/AuthProvider';
// import { useAuth } from '../context/AuthProvider'; // UNCOMMENT LOCALLY
// import '../styles/dashboard.css'; // UNCOMMENT LOCALLY


export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Embedded CSS for Preview - Move this to dashboard.css locally */}
      
      
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-brand">
            <img src={logo} alt="GubJob" style={{width: '24px', marginRight: '8px'}} />
            <span>Gub Job</span>
          </div>
          
          <nav className="sidebar-nav">
            <a href="#" className="active">🏠 Home</a>
            <a href="#">📚 My Courses</a>
            <a href="#">👥 Find mentors</a>
            <div className="pro-feature" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <a href="#">💬 Chat with mentors</a>
              <span style={{fontSize: '0.7rem', background: '#e0e0e0', padding: '2px 6px', borderRadius: '4px'}}>PRO</span>
            </div>
          </nav>

          <div className="sidebar-footer">
            <div className="pro-upsell">
              <p>Unlock verify features and get real-time guidance.</p>
              <button className="btn-upgrade">Update to Pro</button>
            </div>
            <button onClick={logout} className="btn-logout">↪ Logout</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <h1>Welcome back! 👋</h1>
              <p>Continue your learning journey</p>
            </div>
            <div className="user-profile">
              <span className="notification-bell">🔔</span>
              <div className="avatar">{user?.email?.[0]?.toUpperCase() || 'U'}</div>
            </div>
          </header>

          {/* Stats Grid */}
          <section className="stats-grid">
            <div className="stat-card">
              <h3>Roadmap Progress</h3>
              <div className="stat-value">45%</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '45%' }}></div>
              </div>
              <p className="stat-sub">5 of 11 skills verified</p>
            </div>

            <div className="stat-card">
              <h3>Verified Skills</h3>
              <div className="stat-value">✅ 5</div>
              <p className="stat-sub">3 more than last month</p>
            </div>

            <div className="stat-card">
              <h3>Learning Streak</h3>
              <div className="stat-value">🔥 12</div>
              <p className="stat-sub">days in a row</p>
            </div>

            <div className="stat-card">
              <h3>Mentorship Hours</h3>
              <div className="stat-value">📅 8</div>
              <p className="stat-sub">hours this month</p>
            </div>
          </section>

          <div className="content-split">
            {/* Left Column: Learning & Achievements */}
            <div className="content-left">
              <section className="continue-learning">
                <h2>Continue Learning</h2>
                <p style={{marginBottom: '20px', color: '#666'}}>Pick up where you left off</p>

                <div className="course-card">
                  <div className="course-header">
                    <h4>JavaScript Core</h4>
                    <span className="badge-progress">In Progress</span>
                  </div>
                  <p>Master async programming and closures</p>
                  <div className="progress-row">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '75%' }}></div>
                    </div>
                    <span>75% complete</span>
                    <button className="btn-continue">Continue</button>
                  </div>
                </div>

                <div className="course-card">
                  <div className="course-header">
                    <h4>React Basics</h4>
                    <span className="badge-available">Available</span>
                  </div>
                  <p>Build UIs with React components</p>
                  <p style={{fontSize: '0.9rem', color: '#888', marginTop: '10px'}}>Prerequisites: JavaScript Core, CSS Fundamentals</p>
                  <button className="btn-start" style={{marginTop: '15px'}}>Start Learning</button>
                </div>
              </section>

              <section className="recent-achievements">
                <h2 style={{marginTop: '40px'}}>Recent Achievements</h2>
                <p style={{marginBottom: '20px', color: '#666'}}>Your verified skills</p>
                <div className="achievement-card">
                  <div className="achievement-icon">🏅</div>
                  <div>
                    <h4>JavaScript Core</h4>
                    <p style={{color: '#666', fontSize: '0.9rem'}}>Verified on Dec 1</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Mentorship */}
            <div className="content-right">
              <section className="sidebar-widget">
                <h3>Upcoming Sessions</h3>
                <div className="session-card">
                  <div className="session-info">
                    <h4>Sarah Chen</h4>
                    <p style={{color: '#4f46e5', fontSize: '0.9rem'}}>React Best Practices</p>
                    <p style={{fontSize: '0.85rem', color: '#666', marginTop: '5px'}}>Dec 5, 2025 at 2:00 PM</p>
                  </div>
                  <button className="btn-join">Join Meeting</button>
                </div>
              </section>

              <section className="sidebar-widget">
                <h3>Recommended for You</h3>
                <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '15px'}}>Based on your progress</p>
                <div className="mentor-card">
                  <div className="mentor-info">
                    <img src="https://placehold.co/50x50" alt="Sarah" className="mentor-avatar"/>
                    <div>
                      <h4>Sarah Chen</h4>
                      <p style={{fontSize: '0.9rem', color: '#666'}}>React Expert</p>
                    </div>
                  </div>
                  <button className="btn-view-profile">View Profile</button>
                </div>
                <div style={{textAlign: 'center', marginTop: '15px'}}>
                  <a href="#" style={{color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem'}}>Browse All Mentors →</a>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}