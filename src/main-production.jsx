/**
 * PRODUCTION ENTRY POINT
 * 
 * This is the entry point for the production build (terradirectf2c.web.app).
 * - Real Firebase Auth (email/password + Google SSO)
 * - Real Firestore data persistence
 * - Real Cloudinary image uploads
 * - Real-time messaging via Firestore snapshots
 *
 * Build command: npm run build:production
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { EnvironmentProvider } from './context/EnvironmentContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ServiceProvider } from './context/ServiceContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EnvironmentProvider environment="production">
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ServiceProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </ServiceProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </EnvironmentProvider>
  </React.StrictMode>
);
