import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages - Public
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Pages - Learner
import LearnerDashboard from './pages/learner/LearnerDashboard';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageRoadmaps from './pages/admin/ManageRoadmap'; // 👈 Import List View
import RoadmapDesigner from './pages/admin/RoadmapDesign'; // 👈 Import Visual Editor

// Auth Components
import { AuthProvider } from './auth/AuthProvider';
import RequireAuth from './auth/RequireAuth';
import PublicOnly from './auth/PublicOnly';
import RequireRole from './auth/RequireRole';

// Layout
import AdminLayout from './components/layouts/AdminLayout';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <main style={{ minHeight: '100vh' }}>
          <Routes>
            {/* =========================================
                1. PUBLIC ROUTES
               ========================================= */}
            <Route path="/" element={<Landing />} />
            
            <Route 
              path="/login" 
              element={
                <PublicOnly>
                  <Login />
                </PublicOnly>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicOnly>
                  <Register />
                </PublicOnly>
              } 
            />

            {/* =========================================
                2. LEARNER ROUTES (Protected)
               ========================================= */}
            <Route
              path="/dashboard/*"
              element={
                <RequireAuth>
                  <RequireRole allowedRoles={['STUDENT', 'ADMIN']}>
                    <LearnerDashboard />
                  </RequireRole>
                </RequireAuth>
              }
            />

            {/* =========================================
                3. VISUAL DESIGNER (Full Screen)
               ========================================= */}
            {/* We place this OUTSIDE the AdminLayout so it has full screen space (No Sidebar) */}
            <Route 
              path="/admin/roadmaps/design/:slug" 
              element={
                <RequireAuth>
                  <RequireRole allowedRoles={['ADMIN']}>
                    <RoadmapDesigner />
                  </RequireRole>
                </RequireAuth>
              } 
            />

            {/* =========================================
                4. ADMIN DASHBOARD (With Sidebar)
               ========================================= */}
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <RequireRole allowedRoles={['ADMIN']}>
                    <AdminLayout /> 
                  </RequireRole>
                </RequireAuth>
              }
            >
              {/* Default Redirect */}
              <Route index element={<Navigate to="dashboard" replace />} />
              
              {/* Dashboard */}
              <Route path="dashboard" element={<AdminDashboard />} />
              
              {/* Management Pages */}
              <Route path="roadmaps" element={<ManageRoadmaps />} />
              <Route path="courses" element={<ManageCourses />} />
              <Route path="departments" element={<ManageDepartments />} />
              
              {/* Placeholder for Users */}
              <Route path="users" element={<div>🚧 Manage Users Component</div>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<div>Page Not Found</div>} />

          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}