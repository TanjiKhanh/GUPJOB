import React, { useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
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
        // If refresh fails (401), api.ts redirects to login automatically
        // We just clear local state here to be safe
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
    // We cast 'as any' because api.ts interceptor returns raw data, not AxiosResponse
    const payload = await api.post('/auth/login', { email, password }) as any;

    if (!payload?.access_token) {
      throw new Error('Login failed: No access token received.');
    }

    setAccessToken(payload.access_token);
    setUser(payload.user);

    return payload.user;
  };

  // 3. Refresh Function
  const refresh = async () => {
    // This call will fail if the HttpOnly cookie is missing/expired
    const payload = await api.post('/auth/refresh', {}) as any;

    if (!payload?.access_token) {
      throw new Error('Refresh failed: No access token returned.');
    }

    setAccessToken(payload.access_token);

    if (payload.user) {
      setUser(payload.user);
    }
  };

  // 4. Logout Function
  const logout = async () => {
    try {
      await api.post('/auth/logout');
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