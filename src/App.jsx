import { useState } from 'react';
import { NhostProvider, useAuthenticationStatus } from '@nhost/react';
import { useConfig } from './context/ConfigContext';
import Setup from './components/Setup';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { CheckCircle } from 'lucide-react';

function AppContent() {
  const { isLoading, isAuthenticated } = useAuthenticationStatus();
  const [verifiedDismissed, setVerifiedDismissed] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const isVerifyEmail = searchParams.get('type') === 'verifyEmail';
  const isTokenPath = 
    window.location.pathname === '/token' || 
    window.location.pathname === '/token/' || 
    window.location.pathname.endsWith('/token.html');

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

  if (isTokenPath && isVerifyEmail && !verifiedDismissed) {
    const handleContinue = () => {
      window.history.replaceState({}, '', '/');
      setVerifiedDismissed(true);
    };

    return (
      <div className="auth-wrapper">
        <div className="glass-panel card text-center" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '440px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'hsl(var(--success))', marginBottom: '0.5rem' }}>
            <CheckCircle size={64} />
          </div>
          <div>
            <h2 style={{ marginBottom: '0.75rem', background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Email Verified!
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'hsl(var(--text-secondary))' }}>
              Your email has been verified successfully. Your account is now active.
            </p>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
            onClick={handleContinue}
          >
            {isAuthenticated ? 'Continue to Dashboard' : 'Proceed to Sign In'}
          </button>
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
