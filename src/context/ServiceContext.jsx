/**
 * ServiceContext — provides a unified data service API to the entire app.
 *
 * In demo mode: routes to mock.service.js (in-memory state).
 * In production mode: routes to firebase.service.js (real Firestore + Cloudinary).
 *
 * Usage in components:
 *   const { getFarmers, createOrder, uploadProductImages } = useService();
 */

import { createContext, useContext, useMemo } from 'react';
import { useEnvironment } from './EnvironmentContext';

const ServiceContext = createContext(null);

export function ServiceProvider({ children }) {
  const environment = useEnvironment();

  const service = useMemo(() => {
    // Lazy-load the appropriate service based on environment.
    // Both modules export identical function signatures.
    if (environment === 'demo') {
      return import('../lib/services/mock.service.js');
    }
    return import('../lib/services/firebase.service.js');
  }, [environment]);

  return (
    <ServiceContext.Provider value={{ service, environment }}>
      {children}
    </ServiceContext.Provider>
  );
}

/**
 * Hook to access the service layer.
 * Returns a Promise<module> that resolves to the service module.
 * 
 * For synchronous access, prefer the direct imports in firestore.js
 * which already handle mock/production branching via VITE_USE_MOCK_DATA.
 */
export function useService() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('useService must be inside ServiceProvider');
  return ctx;
}
