import { Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DiscoveryPage from './pages/DiscoveryPage';
import FarmerProfilePage from './pages/FarmerProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DiscoveryPage />} />
        <Route path="/farmer/:id" element={<FarmerProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppShell>
  );
}
