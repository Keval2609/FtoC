import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } from '../lib/auth';

const AuthContext = createContext();

const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (useMock) {
      setLoading(false);
      return;
    }
    const unsub = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    if (useMock) {
      setUser({ uid: 'mock-user', email, displayName: 'Demo User' });
      return;
    }
    await signInWithEmail(email, password);
  };

  const signup = async (email, password, displayName) => {
    if (useMock) {
      setUser({ uid: 'mock-user', email, displayName });
      return;
    }
    await signUpWithEmail(email, password, displayName);
  };

  const loginWithGoogle = async () => {
    if (useMock) {
      setUser({ uid: 'mock-google', email: 'demo@google.com', displayName: 'Demo Google User' });
      return;
    }
    await signInWithGoogle();
  };

  const logout = async () => {
    if (useMock) {
      setUser(null);
      return;
    }
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
