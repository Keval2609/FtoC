import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } from '../lib/auth';
import { createUserProfile, getUserProfile } from '../lib/firestore';

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
        getUserProfile(firebaseUser.uid)
          .then((profile) => {
            if (profile) {
              setUserProfile(profile);
              setNeedsRoleSelection(false);
            } else {
              setNeedsRoleSelection(true);
            }
          })
          .catch((err) => {
            console.error('Failed to load user profile', err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setUserProfile(null);
        setNeedsRoleSelection(false);
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  /**
   * Email/Password Login
   */
  const login = async (email, password) => {
    const firebaseUser = await signInWithEmail(email, password);
    const profile = await getUserProfile(firebaseUser.uid);
    if (profile) {
      setUserProfile(profile);
    } else {
      setNeedsRoleSelection(true);
    }
  };

  /**
   * Email/Password Signup — now accepts role.
   */
  const signup = async (email, password, displayName, role) => {
    localStorage.setItem('userRole', role);
    const newUser = await signUpWithEmail(email, password, displayName, role);
    
    const profile = await createUserProfile(newUser.uid, {
      email,
      displayName,
      role
    });
    
    setUserProfile(profile);
  };

  /**
   * Google Login — detects new users who need role selection.
   */
  const loginWithGoogle = async () => {
    const { user: googleUser, isNewUser } = await signInWithGoogle();
    if (isNewUser) {
      setNeedsRoleSelection(true);
    } else {
      const profile = await getUserProfile(googleUser.uid);
      if (profile) {
        setUserProfile(profile);
      } else {
        setNeedsRoleSelection(true);
      }
    }
  };

  /**
   * After Google sign-in, assign the selected role and create a profile.
   */
  const assignRole = async (role) => {
    if (!user) return;
    localStorage.setItem('userRole', role);
    const profile = await createUserProfile(user.uid, {
      email: user.email,
      displayName: user.displayName || user.email,
      role
    });
    setUserProfile(profile);
    setNeedsRoleSelection(false);
  };

  /**
   * Refresh the profile.
   */
  const refreshProfile = async () => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      if (profile) setUserProfile(profile);
    }
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
