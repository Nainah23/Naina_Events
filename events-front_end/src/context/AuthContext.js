// context/AuthContext.jsx
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem('token');
  const [authData, setAuthData] = useState(initialToken ? { token: initialToken } : null);

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthData({ token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthData(null);
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
