import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthChange, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } from '../lib/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Since we can't use Firestore, we check localStorage for a saved role
        const savedRole = localStorage.getItem('userRole') || 'customer';
        setUserProfile({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Demo User',
          role: savedRole,
          onboardingComplete: true,
        });
      } else {
        setUserProfile(null);
      }
      setNeedsRoleSelection(false);
      setLoading(false);
    });
    return unsub;
  }, []);

  /**
   * Email/Password Login
   */
  const login = async (email, password) => {
    const firebaseUser = await signInWithEmail(email, password);
    const savedRole = localStorage.getItem('userRole') || 'customer';
    setUserProfile({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || 'Demo User',
      role: savedRole,
      onboardingComplete: true,
    });
  };

  /**
   * Email/Password Signup — now accepts role.
   */
  const signup = async (email, password, displayName, role) => {
    localStorage.setItem('userRole', role);
    const newUser = await signUpWithEmail(email, password, displayName, role);
    
    setUserProfile({
      uid: newUser.uid,
      email,
      displayName,
      role,
      onboardingComplete: true,
    });
  };

  /**
   * Google Login — detects new users who need role selection.
   */
  const loginWithGoogle = async () => {
    const { user: googleUser, isNewUser } = await signInWithGoogle();
    if (isNewUser) {
      setNeedsRoleSelection(true);
    } else {
      const savedRole = localStorage.getItem('userRole') || 'customer';
      setUserProfile({
        uid: googleUser.uid,
        email: googleUser.email,
        displayName: googleUser.displayName || 'Demo User',
        role: savedRole,
        onboardingComplete: true,
      });
    }
  };

  /**
   * After Google sign-in, assign the selected role and create a profile.
   */
  const assignRole = async (role) => {
    if (!user) return;
    localStorage.setItem('userRole', role);
    setUserProfile({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email,
      role,
      onboardingComplete: true,
    });
    setNeedsRoleSelection(false);
  };

  /**
   * Refresh the profile.
   */
  const refreshProfile = async () => {
    // No-op for now since we don't have Firestore
  };

  const logout = async () => {
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
