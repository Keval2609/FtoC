import { Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DiscoveryPage from './pages/DiscoveryPage';
import FarmerProfilePage from './pages/FarmerProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RoleSelectPage from './pages/RoleSelectPage';
import OnboardingPage from './pages/OnboardingPage';
import FarmerDashboardPage from './pages/FarmerDashboardPage';
import ChatListPage from './pages/ChatListPage';
import ChatPage from './pages/ChatPage';
import AddProductPage from './pages/AddProductPage';

export default function App() {
  return (
    <AppShell>
      <Routes>
        {/* ─── Public Routes ─── */}
        <Route path="/" element={<DiscoveryPage />} />
        <Route path="/farmer/:id" element={<FarmerProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ─── Google Sign-In Role Selection ─── */}
        <Route path="/role-select" element={<RoleSelectPage />} />

        {/* ─── Onboarding (any authenticated user) ─── */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* ─── Checkout (any authenticated user) ─── */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* ─── Messaging (any authenticated user) ─── */}
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

        {/* ─── Farmer Dashboard (farmer-only) ─── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="farmer">
              <FarmerDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* ─── Add Product (farmer-only) ─── */}
        <Route
          path="/dashboard/add-product"
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
