// src/App.jsx
// Key Google Sign-In routes:
//   /role-select  — shown to NEW Google users (needsRoleSelection === true)
//   /farmer-setup — farmer onboarding (profile + payout)
//   /onboarding   — customer onboarding (delivery address)
//
// AuthContext.loginWithGoogle sets needsRoleSelection = true for new Google users,
// which makes ProtectedRoute redirect them to /role-select automatically.

import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/auth/ProtectedRoute';

import DiscoveryPage from './pages/DiscoveryPage';
import FarmerProfilePage from './pages/FarmerProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RoleSelectPage from './pages/RoleSelectPage';   // ← Google new-user flow
import OnboardingPage from './pages/OnboardingPage';
import FarmerSetupPage from './pages/FarmerSetupPage';
import FarmerDashboardPage from './pages/FarmerDashboardPage';
import ChatListPage from './pages/ChatListPage';
import ChatPage from './pages/ChatPage';
import AddProductPage from './pages/AddProductPage';

import { useAuth } from './context/AuthContext';

// ── Root route: farmers → dashboard, everyone else → discovery ────────────
function RootRoute() {
  const { user, isFarmer, loading } = useAuth();
  if (loading) return null;
  if (user && isFarmer) return <Navigate to="/dashboard" replace />;
  return <DiscoveryPage />;
}

export default function App() {
  return (
    <AppShell>
      <Routes>

        {/* ── Public ─────────────────────────────────────────────────── */}
        <Route path="/" element={<RootRoute />} />
        <Route path="/farmer/:id" element={<FarmerProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ── Google Sign-In: role selection for brand-new Google users ─ */}
        {/* needsRoleSelection flag (set in AuthContext) drives users here  */}
        <Route path="/role-select" element={<RoleSelectPage />} />

        {/* ── Onboarding (any authenticated user) ─────────────────────── */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer-setup"
          element={
            <ProtectedRoute>
              <FarmerSetupPage />
            </ProtectedRoute>
          }
        />

        {/* ── Checkout (any authenticated user) ───────────────────────── */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* ── Messaging (any authenticated user) ──────────────────────── */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <ChatListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:farmerId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* ── Farmer Dashboard (farmer-only) ──────────────────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="farmer">
              <FarmerDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* ── Product management (farmer-only) ────────────────────────── */}
        <Route
          path="/dashboard/add-product"
          element={
            <ProtectedRoute requiredRole="farmer">
              <AddProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/edit-product/:id"
          element={
            <ProtectedRoute requiredRole="farmer">
              <AddProductPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </AppShell>
  );
}
