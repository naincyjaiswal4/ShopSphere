import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_USER_KEY = 'shopsphere_auth_user';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [currentUser]);

  // Login via MongoDB Express API
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoading(false);
        return {
          success: false,
          message: data.message || 'Invalid email or password'
        };
      }

      setCurrentUser(data.user);
      setLoading(false);
      return { success: true, user: data.user };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: 'Could not connect to authentication server. Ensure backend is running.'
      };
    }
  };

  // Register via MongoDB Express API
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoading(false);
        return {
          success: false,
          message: data.message || 'Registration failed'
        };
      }

      setCurrentUser(data.user);
      setLoading(false);
      return { success: true, user: data.user };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: 'Could not connect to authentication server. Ensure backend is running.'
      };
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.role === 'admin';

  const value = {
    currentUser,
    isAdmin,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
