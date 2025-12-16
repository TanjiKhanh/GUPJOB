import React, { ReactNode } from 'react';
import Sidebar from '../layouts/Sidebar';
import Header from '../layouts/Header';
import '../../styles/dashboard.css';

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