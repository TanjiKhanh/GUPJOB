import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar'; // 👈 Ensure this path points to your smart Sidebar
import '../../styles/dashboard.css';

export default function AdminLayout() {
  // NO PROPS are passed here anymore.
  // The pages (Dashboard, Courses, etc.) are responsible for their own titles.
  return (
    <div className="dashboard-container">
      {/* 1. Sidebar is persistent */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="dashboard-main">
        {/* 3. React Router injects the active page here */}
        <Outlet />
      </main>
    </div>
  );
}