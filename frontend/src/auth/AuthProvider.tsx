import React, { useState, useEffect, ReactNode } from 'react';
import { authService, RegisterPayload } from '../services/auth.service'; // Import service
import { setAccessToken, getAccessToken } from './tokenStore';
import { AuthContext, User } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Check session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getAccessToken();
        if (token) {
          await refresh();
        }
      } catch (err) {
        console.log("Session init failed", err);
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Login Function
  const login = async (email: string, password: string) => {
    // Use authService
    const payload = await authService.login({ email, password }) as any;

    if (!payload?.access_token) {
      throw new Error('Login failed: No access token received.');
    }

    setAccessToken(payload.access_token);
    setUser(payload.user);

    return payload.user;
  };

  // 3. Register Function (New)
  const register = async (data: RegisterPayload) => {
    // We just call the service. 
    // Usually, registration doesn't auto-login in this specific flow (redirects to login),
    // but if your backend returns a token on register, you can set it here like in login().
    await authService.register(data);
  };

  // 4. Refresh Function
  const refresh = async () => {
    const payload = await authService.refresh() as any;

    if (!payload?.access_token) {
      throw new Error('Refresh failed: No access token returned.');
    }

    setAccessToken(payload.access_token);

    if (payload.user) {
      setUser(payload.user);
    }
  };

  // 5. Logout Function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout failed on server', err);
    } finally {
      setAccessToken(null);
      setUser(null);
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    login,
    register, // Expose register
    logout,
    refresh,
    accessToken: getAccessToken(),
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div className="auth-loading">Loading session...</div>}
    </AuthContext.Provider>
  );
};