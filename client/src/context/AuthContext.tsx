import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseEnabled } from '../firebase';

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
  firebaseUser: any;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  loading: true,
  firebaseUser: null
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
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!isFirebaseEnabled || !auth) {
        throw new Error('Firebase authentication is required but not configured. Please provide Firebase credentials.');
      }
      
      // Firebase authentication only
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Sync with backend
      const response = await apiRequest('/api/auth/sync-firebase', {
        method: 'POST',
        body: JSON.stringify({
          firebaseUid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName
        })
      });
      setCurrentUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, phone?: string, company?: string, bio?: string) => {
    try {
      if (isFirebaseEnabled && auth) {
        // Create user with Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Sync with backend
        const data = await apiRequest('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ 
            email, 
            password: '', // Not needed since Firebase handles auth
            firstName, 
            lastName, 
            phone, 
            company, 
            bio,
            firebaseUid: firebaseUser.uid
          }),
        });
        setCurrentUser(data.user);
      } else {
        // Direct backend registration (fallback)
        const data = await apiRequest('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ 
            email, 
            password,
            firstName, 
            lastName, 
            phone, 
            company, 
            bio,
            directAuth: true
          }),
        });
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (isFirebaseEnabled && auth) {
        // Sign out from Firebase
        await signOut(auth);
      }
      
      // Clear backend session
      await apiRequest('/api/auth/logout', {
        method: 'POST',
      });
      setCurrentUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if backend call fails
      setCurrentUser(null);
      setFirebaseUser(null);
    }
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
    if (isFirebaseEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setFirebaseUser(firebaseUser);
        if (firebaseUser) {
          try {
            // Sync Firebase user with backend
            const data = await apiRequest('/api/auth/sync-firebase', {
              method: 'POST',
              body: JSON.stringify({
                firebaseUid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName
              }),
            });
            setCurrentUser(data.user);
          } catch (error) {
            console.error('Firebase sync error:', error);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    } else {
      // Firebase not configured, check auth with backend directly
      checkAuth();
    }
  }, []);

  const value: AuthContextType = {
    currentUser,
    login,
    signup,
    logout,
    updateProfile,
    loading,
    firebaseUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}