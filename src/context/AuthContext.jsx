import { createContext, useContext, useEffect, useState } from 'react';
import { useEnvironment } from './EnvironmentContext';

const AuthContext = createContext();

// ═══════════════════════════════════════════════════
//  DEMO AUTH PROVIDER (no Firebase)
// ═══════════════════════════════════════════════════

function DemoAuthProvider({ children }) {
  // Import the demo user from mock service
  const [demoProfile] = useState(() => ({
    uid: 'demo-customer-001',
    email: 'demo@terradirect.app',
    displayName: 'Alex Demo',
    role: 'customer',
    onboardingComplete: true,
    createdAt: Date.now(),
    deliveryAddress: '123 Demo Street, Portland, OR 97201',
    phone: '(555) 123-4567',
  }));

  const demoUser = {
    uid: demoProfile.uid,
    email: demoProfile.email,
    displayName: demoProfile.displayName,
    photoURL: null,
  };

  const value = {
    user: demoUser,
    userProfile: demoProfile,
    loading: false,
    needsRoleSelection: false,
    isFarmer: demoProfile.role === 'farmer',
    isCustomer: demoProfile.role === 'customer',
    isOnboarded: true,
    // Demo auth stubs — all resolve instantly
    login: async () => {},
    signup: async () => {},
    loginWithGoogle: async () => {},
    assignRole: async (role) => {
      demoProfile.role = role;
    },
    refreshProfile: async () => {},
    logout: async () => {
      // In demo mode, logout just reloads (re-logs the demo user)
      window.location.reload();
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ═══════════════════════════════════════════════════
//  PRODUCTION AUTH PROVIDER (real Firebase)
// ═══════════════════════════════════════════════════

function ProductionAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  useEffect(() => {
    // Lazy-import Firebase auth to avoid loading SDK in demo builds
    let unsub;
    (async () => {
      const { onAuthChange } = await import('../lib/auth');
      const { getUserProfile } = await import('../lib/firestore');

      unsub = onAuthChange((firebaseUser) => {
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
    })();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  /**
   * Email/Password Login
   */
  const login = async (email, password) => {
    const { signInWithEmail } = await import('../lib/auth');
    const { getUserProfile } = await import('../lib/firestore');
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
    const { signUpWithEmail } = await import('../lib/auth');
    const { createUserProfile } = await import('../lib/firestore');
    localStorage.setItem('userRole', role);
    const newUser = await signUpWithEmail(email, password, displayName, role);

    const profile = await createUserProfile(newUser.uid, {
      email,
      displayName,
      role,
    });

    setUserProfile(profile);
  };

  /**
   * Google Login — detects new users who need role selection.
   */
  const loginWithGoogle = async () => {
    const { signInWithGoogle } = await import('../lib/auth');
    const { getUserProfile } = await import('../lib/firestore');
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
    const { createUserProfile } = await import('../lib/firestore');
    localStorage.setItem('userRole', role);
    const profile = await createUserProfile(user.uid, {
      email: user.email,
      displayName: user.displayName || user.email,
      role,
    });
    setUserProfile(profile);
    setNeedsRoleSelection(false);
  };

  /**
   * Refresh the profile.
   */
  const refreshProfile = async () => {
    if (user) {
      const { getUserProfile } = await import('../lib/firestore');
      const profile = await getUserProfile(user.uid);
      if (profile) setUserProfile(profile);
    }
  };

  const logout = async () => {
    const { signOut } = await import('../lib/auth');
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

// ═══════════════════════════════════════════════════
//  UNIFIED PROVIDER (routes based on environment)
// ═══════════════════════════════════════════════════

export function AuthProvider({ children }) {
  const environment = useEnvironment();

  if (environment === 'demo') {
    return <DemoAuthProvider>{children}</DemoAuthProvider>;
  }

  return <ProductionAuthProvider>{children}</ProductionAuthProvider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
