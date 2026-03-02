import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // persist immediately when changed to avoid race conditions
  const storeToken = (t) => {
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
  };
  const storeUser = (u) => {
    if (u) localStorage.setItem('user', JSON.stringify(u));
    else localStorage.removeItem('user');
  };


  const login = async (username, password) => {
    const res = await fetch('/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    setToken(data.token);
    storeToken(data.token);
    setUser(data.user);
    storeUser(data.user);
    return data;
  };

  const logout = async () => {
    if (token) {
      await fetch('/api/auth/logout/', {
        method: 'POST',
        headers: { Authorization: `Token ${token}` },
      });
    }
    setToken(null);
    storeToken(null);
    setUser(null);
    storeUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
