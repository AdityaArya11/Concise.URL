import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, apiErrorMessage } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('concise_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/api/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('concise_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('concise_token', res.data.token);
      setUser(res.data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: apiErrorMessage(err, 'Login failed.') };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      localStorage.setItem('concise_token', res.data.token);
      setUser(res.data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: apiErrorMessage(err, 'Registration failed.') };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('concise_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
