import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthChange, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } from '../lib/auth';
import { getUserProfile, createUserProfile } from '../lib/firestore';

const AuthContext = createContext();

const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  // Fetch the Firestore profile for the current user
  const fetchProfile = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setUserProfile(null);
      return null;
    }
    try {
      const profile = await getUserProfile(firebaseUser.uid);
      if (profile) {
        setUserProfile(profile);
      } else {
        // Prevent overwriting an optimistically set profile with null
        // during the signup race condition.
        setUserProfile(prev => {
          if (prev && prev.uid === firebaseUser.uid) return prev;
          return null;
        });
      }
      return profile;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setUserProfile(prev => (prev && prev.uid === firebaseUser.uid ? prev : null));
      return null;
    }
  }, []);

  useEffect(() => {
    if (useMock) {
      setLoading(false);
      return;
    }
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }
      setNeedsRoleSelection(false);
      setLoading(false);
    });
    return unsub;
  }, [fetchProfile]);

  /**
   * Email/Password Login
   */
  const login = async (email, password) => {
    if (useMock) {
      setUser({ uid: 'mock-user', email, displayName: 'Demo User' });
      setUserProfile({
        uid: 'mock-user',
        email,
        displayName: 'Demo User',
        role: 'customer',
        onboardingComplete: true,
      });
      return;
    }
    await signInWithEmail(email, password);
  };

  /**
   * Email/Password Signup — now accepts role.
   */
  const signup = async (email, password, displayName, role) => {
    if (useMock) {
      setUser({ uid: 'mock-user', email, displayName });
      setUserProfile({
        uid: 'mock-user',
        email,
        displayName,
        role,
        onboardingComplete: false,
      });
      return;
    }
    const newUser = await signUpWithEmail(email, password, displayName, role);
    // Optimistically set the profile locally so there's no UI flicker or role mismatch
    // while the Firestore document is propagating.
    setUserProfile({
      uid: newUser.uid,
      email,
      displayName,
      role,
      onboardingComplete: false,
    });
  };

  /**
   * Google Login — detects new users who need role selection.
   */
  const loginWithGoogle = async () => {
    if (useMock) {
      setUser({ uid: 'mock-google', email: 'demo@google.com', displayName: 'Demo Google User' });
      setUserProfile({
        uid: 'mock-google',
        email: 'demo@google.com',
        displayName: 'Demo Google User',
        role: 'customer',
        onboardingComplete: true,
      });
      return;
    }
    const { user: googleUser, isNewUser } = await signInWithGoogle();
    if (isNewUser) {
      setNeedsRoleSelection(true);
    }
  };

  /**
   * After Google sign-in, assign the selected role and create a Firestore profile.
   */
  const assignRole = async (role) => {
    if (!user) return;

    if (useMock) {
      setUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role,
        onboardingComplete: false,
      });
      setNeedsRoleSelection(false);
      return;
    }

    const profile = await createUserProfile(user.uid, {
      email: user.email,
      displayName: user.displayName || user.email,
      role,
    });
    setUserProfile(profile);
    setNeedsRoleSelection(false);
  };

  /**
   * Refresh the profile from Firestore (e.g. after onboarding completes).
   */
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const logout = async () => {
    if (useMock) {
      setUser(null);
      setUserProfile(null);
      return;
    }
    await signOut();
    setUserProfile(null);
  };

  /** Helper: quick role checks */
  const isFarmer = userProfile?.role === 'farmer';
  const isCustomer = userProfile?.role === 'customer';
  const isOnboarded = userProfile?.onboardingComplete === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        needsRoleSelection,
        isFarmer,
        isCustomer,
        isOnboarded,
        login,
        signup,
        loginWithGoogle,
        assignRole,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
