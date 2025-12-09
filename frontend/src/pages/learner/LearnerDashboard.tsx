import React from 'react';
import MainLayout from '../../layouts/MainLayout';

export default function LearnerDashboard() {
  return (
    <MainLayout title="Welcome back! 👋" subtitle="Continue your learning journey">
      {/* KPI Stats */}
      <section className="stats-grid">
        <div className="stat-card">
          <h3>Roadmap Progress</h3>
          <div className="stat-value">45%</div>
          <div className="progress-bar"><div className="progress-fill" style={{width: '45%'}}></div></div>
          <p className="stat-sub">5 of 11 skills verified</p>
        </div>
        <div className="stat-card">
          <h3>Verified Skills</h3>
          <div className="stat-value">✅ 5</div>
          <p className="stat-sub">Blockchain verified</p>
        </div>
        <div className="stat-card">
          <h3>Streak</h3>
          <div className="stat-value">🔥 12</div>
          <p className="stat-sub">Days active</p>
        </div>
      </section>

      <div className="content-split">
        {/* Active Courses */}
        <div className="content-left">
          <section className="continue-learning">
            <h2>Active Roadmaps</h2>
            <div className="course-card">
              <div className="course-header">
                <h4>Frontend Developer</h4>
                <span className="badge-progress">In Progress</span>
              </div>
              <p>Next Topic: <strong>React State Management</strong></p>
              <div className="progress-row">
                <div className="progress-bar"><div className="progress-fill" style={{width: '75%'}}></div></div>
                <button className="btn-continue">Resume</button>
              </div>
            </div>
          </section>
        </div>

        {/* Mentorship Recommendations */}
        <div className="content-right">
          <section className="sidebar-widget">
            <h3>Recommended Mentors</h3>
            <div className="mentor-card">
              <div className="mentor-info">
                <div className="avatar">SC</div>
                <div>
                  <h4>Sarah Chen</h4>
                  <p className="text-sm">Senior React Dev</p>
                </div>
              </div>
              <button className="btn-view-profile">View Profile</button>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}