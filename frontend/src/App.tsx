import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  return (
      <BrowserRouter>
        <Header />
        <main style={{ minHeight: '70vh' }}>
          <Routes>
            <Route path="" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected dashboard route */}
            {/* <Route
              path="/dashboard/*"
              element={
                  <Dashboard />
              }
            /> */}  
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
  );
}