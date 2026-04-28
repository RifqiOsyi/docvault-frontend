import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('docvault_token');
    const savedUser = sessionStorage.getItem('docvault_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        sessionStorage.removeItem('docvault_token');
        sessionStorage.removeItem('docvault_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: userData } = res.data;
    sessionStorage.setItem('docvault_token', token);
    sessionStorage.setItem('docvault_user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token, user: userData } = res.data;
    sessionStorage.setItem('docvault_token', token);
    sessionStorage.setItem('docvault_user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('docvault_token');
    sessionStorage.removeItem('docvault_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
