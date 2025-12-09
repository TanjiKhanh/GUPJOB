import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';

import { AuthProvider } from './auth/AuthProvider';
import RequireAuth from './auth/RequireAuth';
import PublicOnly from './auth/publicOnly'; // <--- Import this

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <main style={{ minHeight: '70vh' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* WRAP THESE: Logged-in users shouldn't see these pages */}
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

            {/* Protected dashboard route */}
            <Route
              path="/dashboard/*"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}