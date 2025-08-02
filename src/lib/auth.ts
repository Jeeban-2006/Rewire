
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string | null; name: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signup: (email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string | null; name: string } | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userEmail = localStorage.getItem('userEmail');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setUser({ email: userEmail, name: 'Cody Neat' });
    }
  }, []);
  

  const login = (email: string, password: string) => {
    // Mock login logic: any password works for demonstration
    if (email && password) {
      setIsAuthenticated(true);
      setUser({ email, name: 'Cody Neat' });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      return true;
    }
    return false;
  };

  const signup = (email: string, password: string) => {
    // Mock signup logic
    if (email && password) {
      setIsAuthenticated(true);
      setUser({ email, name: 'Cody Neat' });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
  };

  return React.createElement(AuthContext.Provider, { value: { isAuthenticated, user, login, logout, signup } }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
