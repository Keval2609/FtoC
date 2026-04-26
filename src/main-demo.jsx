/**
 * DEMO ENTRY POINT
 * 
 * This is the entry point for the demo build (terradirectf2c-demo.web.app).
 * - No Firebase SDK is initialized
 * - Pre-logged demo user (no login required)
 * - All data is in-memory mock data from mockData.js
 * - Writes update local state only (reset on reload)
 *
 * Build command: npm run build:demo
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

// Add a subtle demo banner
function DemoBanner() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #2d5a27 0%, #1b3022 100%)',
        color: '#fff',
        textAlign: 'center',
        padding: '6px 16px',
        fontSize: '13px',
        fontFamily: 'Work Sans, sans-serif',
        letterSpacing: '0.03em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      <span style={{ fontSize: '16px' }}>🌿</span>
      <span>
        <strong>Demo Mode</strong> — All data is simulated. Nothing persists on reload.
      </span>
      <a
        href="https://terradirectf2c.web.app"
        style={{
          color: '#a3d977',
          textDecoration: 'underline',
          marginLeft: '8px',
        }}
      >
        Go to Live Site →
      </a>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EnvironmentProvider environment="demo">
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ServiceProvider>
              <CartProvider>
                <App />
                <DemoBanner />
              </CartProvider>
            </ServiceProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </EnvironmentProvider>
  </React.StrictMode>
);
