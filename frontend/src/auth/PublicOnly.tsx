import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function PublicOnly({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  // If user is ALREADY logged in, kick them to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, let them see the Login/Register page
  return children;
}