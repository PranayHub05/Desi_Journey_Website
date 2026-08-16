import React, { createContext, useState, useEffect } from 'react';
import { loginAdmin } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [isAdmin, setIsAdmin] = useState(!!token);

  useEffect(() => {
    setIsAdmin(!!token);
  }, [token]);

  const login = async (password) => {
    try {
      const data = await loginAdmin(password);
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
