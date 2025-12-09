import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../api/axios';
import { setAccessToken, getAccessToken } from './tokenStore';

type User = { id: number; email: string; role: string } | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  accessToken: string | null;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // On mount, attempt a refresh to restore session (optional)
  useEffect(() => {
    (async () => {
      try {
        await refresh();
      } catch {
        // no session
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const resp = await api.post('/auth/login', { email, password });
    
    // FIX: Check if the response is wrapped in a 'data' property
    // If your interceptor wraps it, use resp.data.data. 
    // If not, fall back to resp.data.
    const payload = resp.data.data ; 

    const { access_token, user } = payload;
    
    // Safety check to see if it worked this time
    if (!user) {
        console.error("Still undefined! Full response was:", resp.data);
        return;
    }

    setAccessToken(access_token);
    setUser(user);
  };

  const refresh = async () => {
    const resp = await api.post('/auth/refresh', {}); 
    
    const payload = resp.data.data;
    
    const { access_token, user } = payload;
    setAccessToken(access_token);
    setUser(user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  // expose context
  return (
    <AuthContext.Provider value={{ user, login, logout, accessToken: getAccessToken(), refresh }}>
      {/* optionally render a loading state while restoring session */}
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};