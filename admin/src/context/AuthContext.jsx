'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('kln_admin_user');
    if (saved) {
      try {
        setAdminUser(JSON.parse(saved));
      } catch (e) {}
    }

    const checkAuth = async () => {
      const token = localStorage.getItem('kln_admin_token');
      if (!token) {
        setAdminUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await axiosClient.get('/auth/me');
        if (res.success && res.data.role === 'ADMIN') {
          setAdminUser(res.data);
          localStorage.setItem('kln_admin_user', JSON.stringify(res.data));
        } else {
          logout();
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    if (res.success) {
      const user = res.data.user;
      if (user.role !== 'ADMIN') {
        throw new Error('Access denied. Administrator privileges required.');
      }
      const token = res.data.tokens.accessToken;
      localStorage.setItem('kln_admin_token', token);
      localStorage.setItem('kln_admin_user', JSON.stringify(user));
      setAdminUser(user);
      return user;
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kln_admin_token');
      localStorage.removeItem('kln_admin_user');
    }
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ adminUser, login, logout, loading, setAdminUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
