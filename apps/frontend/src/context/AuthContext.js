import React, { createContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../utils/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, role: null });

  useEffect(() => {
    const token = getToken();
    if (token) {
      setAuth({ token, role: localStorage.getItem('role') });
    }
  }, []);

  const login = (token, role) => {
    setToken(token);
    localStorage.setItem('role', role);
    setAuth({ token, role });
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem('role');
    setAuth({ token: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};