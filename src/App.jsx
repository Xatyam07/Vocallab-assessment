import { NhostProvider, useAuthenticationStatus } from '@nhost/react';
import { useConfig } from './context/ConfigContext';
import Setup from './components/Setup';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { isLoading, isAuthenticated } = useAuthenticationStatus();

  if (isLoading) {
    return (
      <div className="auth-wrapper">
        <div className="glass-panel card text-center" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '440px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Authenticating</h3>
            <p style={{ fontSize: '0.9rem' }}>Validating secure session with Nhost...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <Auth />;
}

export default function App() {
  const { nhostClient } = useConfig();

  return (
    <div className="app-container">
      {nhostClient ? (
        <NhostProvider nhost={nhostClient}>
          <AppContent />
        </NhostProvider>
      ) : (
        <Setup />
      )}
    </div>
  );
}
