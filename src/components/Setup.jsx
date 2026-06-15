import { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Settings, ChevronRight, Key } from 'lucide-react';

export default function Setup() {
  const { nhostSubdomain, nhostRegion, deepgramApiKey, updateConfig } = useConfig();
  const [subdomainInput, setSubdomainInput] = useState(nhostSubdomain);
  const [regionInput, setRegionInput] = useState(nhostRegion);
  const [deepgramKeyInput, setDeepgramKeyInput] = useState(deepgramApiKey);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subdomainInput.trim() || !regionInput.trim()) {
      setErrorMsg('Subdomain and Region are required.');
      return;
    }
    updateConfig({
      subdomain: subdomainInput.trim(),
      region: regionInput.trim(),
      deepgramKey: deepgramKeyInput.trim()
    });
    setErrorMsg('');
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-panel auth-card">
        <div className="auth-tabs">
          <div className="auth-tab active" style={{ cursor: 'default' }}>
            <Settings size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Configuration Setup
          </div>
        </div>

        <div className="auth-content">
          <form onSubmit={handleSubmit}>
            <div className="auth-header">
              <h2>Setup Your Workspace</h2>
              <p>Connect your Nhost project (for Auth) and optionally your Deepgram API Key (for Live speech-to-text).</p>
            </div>

            {errorMsg && (
              <div className="alert alert-error">
                <div>{errorMsg}</div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="subdomain">Nhost Subdomain</label>
              <input
                id="subdomain"
                type="text"
                className="input-field"
                placeholder="e.g. abcd-efgh-ijkl"
                value={subdomainInput}
                onChange={(e) => setSubdomainInput(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="region">Nhost Region</label>
              <input
                id="region"
                type="text"
                className="input-field"
                placeholder="e.g. us-east-1"
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '1.5rem' }}>
              <label htmlFor="dgKey">Deepgram API Key (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Key size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
                <input
                  id="dgKey"
                  type="password"
                  className="input-field"
                  placeholder="Enter Deepgram Key (or add it later)..."
                  style={{ paddingLeft: '2.2rem' }}
                  value={deepgramKeyInput}
                  onChange={(e) => setDeepgramKeyInput(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
              Save Configuration
              <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
