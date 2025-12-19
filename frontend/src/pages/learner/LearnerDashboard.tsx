import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, UserRoadmapSummary } from '../../services/user.service'; // Adjust path if needed
import '../../styles/userDashboard.css'; // Ensure CSS is imported

export default function LearnerDashboard() {
  const [roadmaps, setRoadmaps] = useState<UserRoadmapSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const data = await userService.getMyRoadmaps();
        if (Array.isArray(data)) {
          setRoadmaps(data);
        } else {
          setRoadmaps([]);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  // --- Statistics Logic ---
  const safeRoadmaps = roadmaps || [];
  
  // 1. Roadmap Progress (Global Average)
  const totalProgress = safeRoadmaps.length > 0 
    ? Math.round(safeRoadmaps.reduce((acc, r) => acc + (r.progressPercent || 0), 0) / safeRoadmaps.length)
    : 0;

  // 2. Verified Skills (Sum of completed nodes)
  const totalCompletedNodes = safeRoadmaps.reduce((acc, r) => acc + (r.completedNodes || 0), 0);
  const totalNodesAllMaps = safeRoadmaps.reduce((acc, r) => acc + (r.totalNodes || 0), 0);

  if (loading) {
    return <div className="p-4 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      
      {/* 🟢 HEADER: Added because MainLayout no longer renders titles for us */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
          Welcome back! 👋
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
          Continue your learning journey
        </p>
      </div>

      {/* =======================
          TOP SECTION: STATS ROW
         ======================= */}
      <section className="stats-row">
        
        {/* Card 1: Roadmap Progress (Real Data) */}
        <div className="stat-card">
          <h3>Roadmap Progress</h3>
          <div>
            <div className="stat-main">
              <span className="stat-value">{totalProgress}%</span>
            </div>
            <div className="progress-mini-bar">
              <div className="progress-mini-fill" style={{ width: `${totalProgress}%` }}></div>
            </div>
            <p className="stat-sub" style={{ marginTop: '0.5rem' }}>
              {totalCompletedNodes} of {totalNodesAllMaps} skills verified
            </p>
          </div>
        </div>

        {/* Card 2: Verified Skills (Real Data) */}
        <div className="stat-card">
          <h3>Verified Skills</h3>
          <div className="stat-main">
            <span className="stat-icon">✅</span>
            <span className="stat-value">{totalCompletedNodes}</span>
          </div>
          <p className="stat-sub">Skills verified across all maps</p>
        </div>

        {/* Card 3: Learning Streak (Static Mock) */}
        <div className="stat-card">
          <h3>Learning Streak</h3>
          <div className="stat-main">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">12</span>
          </div>
          <p className="stat-sub">Days in a row</p>
        </div>

        {/* Card 4: Mentorship Hours (Static Mock) */}
        <div className="stat-card">
          <h3>Mentorship Hours</h3>
          <div className="stat-main">
            <span className="stat-icon">📅</span>
            <span className="stat-value">8</span>
          </div>
          <p className="stat-sub">Hours this month</p>
        </div>

      </section>

      {/* =======================
          MAIN CONTENT SPLIT
         ======================= */}
      <div className="content-split">
        
        {/* --- LEFT: ACTIVE ROADMAPS (Real Data) --- */}
        <div className="content-left">
          <h2 className="section-header">Continue Learning</h2>
          <span className="section-sub">Pick up where you left off</span>

          {safeRoadmaps.length === 0 ? (
            <div className="roadmap-card">
              <p>No active courses. Start one today!</p>
              <button onClick={() => navigate('/explore')} className="btn-continue">Explore</button>
            </div>
          ) : (
            safeRoadmaps.map((roadmap) => (
              <div key={roadmap.id} className="roadmap-card">
                <div className="roadmap-header">
                  <div>
                    <h4>{roadmap.title}</h4>
                    <p className="roadmap-desc">Master the fundamentals of {roadmap.title}</p>
                  </div>
                  <span className={`status-badge ${roadmap.progressPercent >= 100 ? 'completed' : ''}`}>
                    {roadmap.progressPercent >= 100 ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                <div className="roadmap-footer">
                  <div className="progress-container">
                    <div className="progress-track">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${roadmap.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="progress-text">{roadmap.progressPercent}% complete</span>
                  
                  <button 
                    className="btn-continue"
                    onClick={() => navigate(`/dashboard/roadmap/${roadmap.id}`)}
                  >
                    {roadmap.progressPercent > 0 ? 'Continue' : 'Start'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- RIGHT: SIDEBAR (Static Mock) --- */}
        <div className="content-right">
          
          {/* Widget 1: Upcoming Sessions */}
          <div className="sidebar-widget">
            <h3 className="widget-title">Upcoming Sessions</h3>
            <div className="session-card">
              <span className="mentor-name">Sarah Chen</span>
              <p className="session-topic">React Best Practices</p>
              <span className="session-time">Dec 5, 2025 at 2:00 PM</span>
              <button className="btn-join">Join Meeting</button>
            </div>
          </div>

          {/* Widget 2: Recommended Mentor */}
          <div className="sidebar-widget">
            <h3 className="widget-title">Recommended for You</h3>
            <p className="stat-sub" style={{ marginBottom: '1rem' }}>Based on your progress</p>
            
            <div className="mentor-profile-card">
              <div className="mentor-avatar">SC</div>
              <div>
                <div style={{ fontWeight: 600 }}>Sarah Chen</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>React Expert</div>
              </div>
            </div>
            
            <button className="btn-view-profile">View Profile</button>
            
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <a href="#" style={{ fontSize: '0.875rem', color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}>
                Browse All Mentors →
              </a>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}