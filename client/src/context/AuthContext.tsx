import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  bio?: string;
  role?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, phone?: string, company?: string, bio?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  loading: true
});

export function useAuth() {
  return useContext(AuthContext);
}

async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setCurrentUser(data.user);
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, phone?: string, company?: string, bio?: string) => {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName, phone, company, bio }),
    });
    setCurrentUser(data.user);
  };

  const logout = async () => {
    await apiRequest('/api/auth/logout', {
      method: 'POST',
    });
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const data = await apiRequest('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    setCurrentUser(data);
  };

  const checkAuth = async () => {
    try {
      const data = await apiRequest('/api/auth/me');
      setCurrentUser(data);
    } catch (error) {
      // Don't log auth check errors as they're expected when not logged in
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    currentUser,
    login,
    signup,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}