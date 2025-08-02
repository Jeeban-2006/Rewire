
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string | null; name: string | null } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string | null; name: string | null } | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setUser({ email: userEmail, name: userName });
    }
  }, []);
  

  const login = (email: string, password: string) => {
    // Mock login logic: any password works for demonstration
    // In a real app, you'd fetch user data here. We'll use a default name.
    const userName = localStorage.getItem('userName') || 'Cody Neat';
    if (email && password) {
      setIsAuthenticated(true);
      setUser({ email, name: userName });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', userName);
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string) => {
    // Mock signup logic
    if (name && email && password) {
      setIsAuthenticated(true);
      setUser({ email, name });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
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
