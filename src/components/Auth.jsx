import { useState } from 'react';
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/react';
import { useConfig } from '../context/ConfigContext';
import { Mail, Lock, ChevronRight, LogIn, UserPlus, Settings } from 'lucide-react';

export default function Auth() {
  const { nhostSubdomain, clearConfig } = useConfig();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  
  // Auth Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { signInEmailPassword, isLoading: isSigningIn } = useSignInEmailPassword();
  const { signUpEmailPassword, isLoading: isSigningUp } = useSignUpEmailPassword();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setAuthError('Email and Password are required.');
      return;
    }

    // Sanitize email: Nhost requires a valid domain extension (e.g. .com).
    // If the user entered an email with '@' but no dot in the domain, append '.com'.
    let sanitizedEmail = email.trim();
    if (sanitizedEmail.includes('@')) {
      const lastAtIndex = sanitizedEmail.lastIndexOf('@');
      const local = sanitizedEmail.slice(0, lastAtIndex);
      const domain = sanitizedEmail.slice(lastAtIndex + 1);
      
      if (local && domain) {
        if (!domain.includes('.')) {
          sanitizedEmail = `${sanitizedEmail}.com`;
        }
      } else if (local) {
        sanitizedEmail = `${sanitizedEmail}temp.com`;
      }
    }

    console.log('Original email entered:', email);
    console.log('Sanitized email sent to Nhost:', sanitizedEmail);

    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
    const cleanFrontendUrl = frontendUrl.endsWith('/') ? frontendUrl.slice(0, -1) : frontendUrl;
    const options = { redirectTo: `${cleanFrontendUrl}/token` };

    try {
      if (activeTab === 'login') {
        const res = await signInEmailPassword(sanitizedEmail, password, options);
        console.log('SignIn Response:', res);
        
        if (res?.isError) {
          const errMsg = res?.error?.message || (res?.error ? JSON.stringify(res.error) : 'Unknown signin error');
          setAuthError(`Failed to sign in: ${errMsg} (attempted: ${sanitizedEmail})`);
        } else if (res?.needsEmailVerification) {
          setAuthError('Email verification is required by your Nhost project. Please verify your email before logging in, or disable "Require Verified Emails" in the Nhost dashboard Auth settings.');
        }
      } else {
        const res = await signUpEmailPassword(sanitizedEmail, password, options);
        console.log('SignUp Response:', res);
        
        if (res?.isError) {
          const errMsg = res?.error?.message || (res?.error ? JSON.stringify(res.error) : 'Unknown signup error');
          setAuthError(`Failed to sign up: ${errMsg} (attempted: ${sanitizedEmail})`);
        } else if (res?.needsEmailVerification) {
          setSuccessMsg(`Registration successful! A verification link has been sent to ${sanitizedEmail}. Please check your inbox/spam folder.`);
          setEmail('');
          setPassword('');
          setActiveTab('login');
        } else {
          setSuccessMsg(`Registration successful! Please sign in. (Sanitized Email: ${sanitizedEmail})`);
          setEmail('');
          setPassword('');
          setActiveTab('login');
        }
      }
    } catch (err) {
      console.error('Authentication Error:', err);
      setAuthError(`Network or connection problem: ${err.message || 'Please check your internet connection and Nhost project configuration.'}`);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-panel auth-card">
        <div className="auth-tabs">
          <div 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setAuthError(''); setSuccessMsg(''); }}
          >
            <LogIn size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Sign In
          </div>
          <div 
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => { setActiveTab('signup'); setAuthError(''); setSuccessMsg(''); }}
          >
            <UserPlus size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Sign Up
          </div>
        </div>

        <div className="auth-content">
          {authError && (
            <div className="alert alert-error">
              <div>{authError}</div>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success">
              <div>{successMsg}</div>
            </div>
          )}

          <form onSubmit={handleAuthSubmit}>
            <div className="auth-header">
              <h2>{activeTab === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p>
                {activeTab === 'login' 
                  ? 'Sign in to access your Speech-to-Text Dashboard' 
                  : 'Register with email and password to get started'}
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
                <input
                  id="email"
                  type="text"
                  className="input-field"
                  placeholder="you@example.com"
                  style={{ paddingLeft: '2.5rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSigningIn || isSigningUp}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
                <input
                  id="password"
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  style={{ paddingLeft: '2.5rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isSigningIn || isSigningUp}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={isSigningIn || isSigningUp}
            >
              {(isSigningIn || isSigningUp) ? (
                <span className="flex-row">
                  <span className="spinner"></span>
                  Loading...
                </span>
              ) : (
                <>
                  {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid hsl(var(--border-color))', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', margin: 0 }}>
              Using Nhost Subdomain:{' '}
              <code style={{ background: 'hsl(var(--bg-dark))', padding: '2px 6px', borderRadius: '4px', color: 'hsl(var(--primary))' }}>
                {nhostSubdomain}
              </code>
            </p>
            <button 
              onClick={clearConfig} 
              className="btn btn-secondary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', gap: '0.4rem' }}
            >
              <Settings size={12} />
              Change Nhost Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
