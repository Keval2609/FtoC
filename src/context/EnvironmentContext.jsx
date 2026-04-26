import { createContext, useContext } from 'react';

const EnvironmentContext = createContext('production');

/**
 * Returns 'demo' or 'production'.
 * Value is set at build-time via Vite's --mode flag
 * and injected through the entry point provider.
 */
export function useEnvironment() {
  return useContext(EnvironmentContext);
}

export function EnvironmentProvider({ environment, children }) {
  return (
    <EnvironmentContext.Provider value={environment}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function isDemo() {
  return import.meta.env.VITE_ENVIRONMENT === 'demo';
}

export function isProduction() {
  return import.meta.env.VITE_ENVIRONMENT === 'production';
}
