import React, { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; // Assuming you have this from previous steps
import '../styles/dashboard.css';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <Header title={title} subtitle={subtitle} />
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}