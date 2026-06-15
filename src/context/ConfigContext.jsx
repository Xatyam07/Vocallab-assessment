/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react';
import { NhostClient } from '@nhost/react';

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
  const [nhostSubdomain, setNhostSubdomain] = useState(
    localStorage.getItem('nhost_subdomain') || import.meta.env.VITE_NHOST_SUBDOMAIN || ''
  );
  const [nhostRegion, setNhostRegion] = useState(
    localStorage.getItem('nhost_region') || import.meta.env.VITE_NHOST_REGION || ''
  );
  const [deepgramApiKey, setDeepgramApiKey] = useState(
    localStorage.getItem('deepgram_key') || import.meta.env.VITE_DEEPGRAM_API_KEY || ''
  );

  // Initialize or re-initialize NhostClient whenever subdomain or region changes
  const nhostClient = useMemo(() => {
    if (nhostSubdomain && nhostRegion) {
      try {
        return new NhostClient({
          subdomain: nhostSubdomain.trim(),
          region: nhostRegion.trim(),
        });
      } catch (err) {
        console.error('Failed to initialize NhostClient:', err);
        return null;
      }
    }
    return null;
  }, [nhostSubdomain, nhostRegion]);

  const updateConfig = (newConfig) => {
    if (newConfig.subdomain !== undefined) {
      setNhostSubdomain(newConfig.subdomain);
      if (newConfig.subdomain) {
        localStorage.setItem('nhost_subdomain', newConfig.subdomain);
      } else {
        localStorage.removeItem('nhost_subdomain');
      }
    }
    if (newConfig.region !== undefined) {
      setNhostRegion(newConfig.region);
      if (newConfig.region) {
        localStorage.setItem('nhost_region', newConfig.region);
      } else {
        localStorage.removeItem('nhost_region');
      }
    }
    if (newConfig.deepgramKey !== undefined) {
      setDeepgramApiKey(newConfig.deepgramKey);
      if (newConfig.deepgramKey) {
        localStorage.setItem('deepgram_key', newConfig.deepgramKey);
      } else {
        localStorage.removeItem('deepgram_key');
      }
    }
  };

  const clearConfig = () => {
    setNhostSubdomain('');
    setNhostRegion('');
    setDeepgramApiKey('');
    localStorage.removeItem('nhost_subdomain');
    localStorage.removeItem('nhost_region');
    localStorage.removeItem('deepgram_key');
  };

  const isConfigured = !!(nhostSubdomain && nhostRegion);

  return (
    <ConfigContext.Provider
      value={{
        nhostSubdomain,
        nhostRegion,
        deepgramApiKey,
        nhostClient,
        updateConfig,
        clearConfig,
        isConfigured,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
