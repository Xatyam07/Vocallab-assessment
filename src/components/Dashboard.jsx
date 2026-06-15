import { useState, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { useNhostClient } from '@nhost/react';
import Waveform from './Waveform';
import { 
  Mic, MicOff, Copy, Check, Trash2, LogOut, Settings, 
  Sparkles, Key, Layout, Info, BarChart2, Activity
} from 'lucide-react';

export default function Dashboard() {
  const { deepgramApiKey, updateConfig } = useConfig();
  const nhost = useNhostClient();
  
  // Settings Panel State
  const [showSettings, setShowSettings] = useState(false);
  const [dgKeyInput, setDgKeyInput] = useState(deepgramApiKey);
  const [model, setModel] = useState('nova-2');
  const [language, setLanguage] = useState('en-US');
  const [smartFormat, setSmartFormat] = useState(true);

  // App States
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'connecting' | 'listening' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  
  // Transcripts State
  const [finalizedTranscripts, setFinalizedTranscripts] = useState([]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [copied, setCopied] = useState(false);

  // Stats Counters
  const [duration, setDuration] = useState(0);
  const [audioStream, setAudioStream] = useState(null);

  // References for Web API persistence
  const websocketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const durationIntervalRef = useRef(null);



  // Recalculate word count whenever transcripts change dynamically
  const fullText = [...finalizedTranscripts, interimTranscript].join(' ').trim();
  const wordCount = fullText ? fullText.split(/\s+/).filter(w => w.length > 0).length : 0;

  // Handle logout
  const handleLogout = async () => {
    stopRecording();
    await nhost.auth.signOut();
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateConfig({ deepgramKey: dgKeyInput.trim() });
    setShowSettings(false);
    setErrorMsg('');
  };

  // Start recording voice and stream to Deepgram
  const startRecording = async () => {
    setErrorMsg('');
    setInterimTranscript('');
    
    const keyToUse = deepgramApiKey || dgKeyInput;
    if (!keyToUse) {
      setErrorMsg('Deepgram API Key is required. Please add it in settings.');
      setShowSettings(true);
      return;
    }

    setStatus('connecting');

    try {
      // 1. Get browser media stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setAudioStream(stream);

      // 2. Build WebSocket URL
      // Construct WebSocket options
      const queryParams = new URLSearchParams({
        model: model,
        language: language,
        smart_format: smartFormat ? 'true' : 'false',
        interim_results: 'true'
      });

      const wsUrl = `wss://api.deepgram.com/v1/listen?${queryParams.toString()}`;
      
      // 3. Establish WebSocket connection with Token Protocol
      const socket = new WebSocket(wsUrl, ['token', keyToUse.trim()]);
      websocketRef.current = socket;

      socket.onopen = () => {
        setStatus('listening');
        setIsRecording(true);

        // Start duration counter
        setDuration(0);
        durationIntervalRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);

        // Initialize MediaRecorder
        // We use audio/webm as it is widely supported and has a low latency overhead.
        // If webm is not supported, browser falls back.
        let options = { mimeType: 'audio/webm' };
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          options = {}; // browser default
        }

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        });

        // Collect and stream data chunks every 250 milliseconds
        mediaRecorder.start(250);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const channel = data?.channel;
          const alternative = channel?.alternatives?.[0];
          const transcript = alternative?.transcript || '';

          if (data.is_final) {
            if (transcript) {
              setFinalizedTranscripts(prev => [...prev, transcript]);
            }
            setInterimTranscript('');
          } else {
            if (transcript) {
              setInterimTranscript(transcript);
            }
          }
        } catch (err) {
          console.error('Failed to parse Deepgram message:', err);
        }
      };

      socket.onerror = (err) => {
        console.error('WebSocket Error:', err);
        setErrorMsg('Deepgram WebSocket connection failed. Please check your API Key and network.');
        stopRecording();
      };

      socket.onclose = (event) => {
        console.log('WebSocket closed:', event);
        if (event.code === 4001) {
          setErrorMsg('Authentication failed: Invalid Deepgram API key.');
        }
        stopRecording();
      };

    } catch (err) {
      console.error('Failed to capture audio stream:', err);
      setErrorMsg('Microphone access denied or audio device not found.');
      setStatus('error');
      setIsRecording(false);
    }
  };

  // Stop recording and close connections cleanly
  const stopRecording = () => {
    setIsRecording(false);
    setStatus('idle');

    // Stop recording interval timer
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.log('Error stopping media recorder:', e);
      }
    }
    mediaRecorderRef.current = null;

    // Stop microphone media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setAudioStream(null);

    // Close WebSocket
    if (websocketRef.current) {
      if (websocketRef.current.readyState === WebSocket.OPEN) {
        // Send Deepgram close command to receive final transcripts
        try {
          websocketRef.current.send(JSON.stringify({ type: 'CloseStream' }));
        } catch {
          // Ignore connection closure errors
        }
      }
      websocketRef.current.close();
      websocketRef.current = null;
    }

    setInterimTranscript('');
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Clear Transcripts
  const handleClear = () => {
    setFinalizedTranscripts([]);
    setInterimTranscript('');
    setDuration(0);
  };

  // Copy to Clipboard
  const handleCopy = () => {
    const fullText = [...finalizedTranscripts, interimTranscript].join(' ').trim();
    if (!fullText) return;
    
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatDuration = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="dashboard-grid">
      {/* Left Settings Sidebar */}
      <div className="glass-panel card settings-panel">
        <div>
          <div className="logo-container" style={{ marginBottom: '1.5rem' }}>
            <div className="logo-icon">V</div>
            <h2>VocalLab</h2>
          </div>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Real-time high-fidelity speech recognition powered by Deepgram.
          </p>
        </div>

        {/* Configuration settings toggle */}
        <div>
          <div className="settings-toggle" onClick={() => setShowSettings(!showSettings)}>
            <span>Deepgram Credentials</span>
            <Settings size={14} style={{ transform: showSettings ? 'rotate(90deg)' : 'rotate(0)', transition: 'var(--transition-fast)' }} />
          </div>

          {(showSettings || !deepgramApiKey) && (
            <form onSubmit={handleSaveSettings} style={{ marginBottom: '1.5rem' }}>
              {!deepgramApiKey && (
                <div className="alert alert-warning" style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', marginBottom: '1rem' }}>
                  Please enter your Deepgram API Key.
                </div>
              )}
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label htmlFor="dgKey" style={{ fontSize: '0.75rem' }}>API Key</label>
                <div style={{ position: 'relative' }}>
                  <Key size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
                  <input
                    id="dgKey"
                    type="password"
                    className="input-field"
                    placeholder="Enter Deepgram Key..."
                    style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                    value={dgKeyInput}
                    onChange={(e) => setDgKeyInput(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>
                Save Key
              </button>
            </form>
          )}

          {/* Model Options */}
          <div className="form-group">
            <label htmlFor="model">Transcription Model</label>
            <select 
              id="model" 
              className="input-field" 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              disabled={isRecording}
            >
              <option value="nova-2">Nova 2 (Fastest & Accurate)</option>
              <option value="enhanced">Enhanced (Universal)</option>
              <option value="base">Base (Standard)</option>
            </select>
          </div>

          {/* Language Options */}
          <div className="form-group">
            <label htmlFor="lang">Target Language</label>
            <div style={{ position: 'relative' }}>
              <select 
                id="lang" 
                className="input-field" 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isRecording}
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="pt">Portuguese (Português)</option>
                <option value="it">Italian (Italiano)</option>
                <option value="zh">Chinese (Mandarin)</option>
              </select>
            </div>
          </div>

          {/* Smart Formatting Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
            <input 
              id="formatting" 
              type="checkbox" 
              checked={smartFormat} 
              onChange={(e) => setSmartFormat(e.target.checked)}
              disabled={isRecording}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="formatting" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', cursor: 'pointer', userSelect: 'none' }}>
              Enable Smart Formatting
            </label>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid hsl(var(--border-color))' }}>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', gap: '0.75rem' }}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Right Core Console */}
      <div className="console-panel">
        {errorMsg && (
          <div className="alert alert-error">
            <div>{errorMsg}</div>
          </div>
        )}

        {/* Record Trigger Panel */}
        <div className="glass-panel card text-center" style={{ padding: '2rem' }}>
          <div className="record-trigger-container">
            <button 
              onClick={toggleRecording} 
              className={`record-btn ${isRecording ? 'recording' : ''}`}
              title={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
              {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span className={`status-badge ${status}`}>
                  <Activity size={12} className={status === 'connecting' ? 'spinner' : ''} />
                  {status}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {isRecording 
                  ? 'Click to stop transcribing' 
                  : 'Click the button and allow mic access to begin streaming'}
              </p>
            </div>

            {/* Audio Waveform Canvas */}
            <div className="waveform-canvas-container" style={{ width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
              <Waveform stream={audioStream} isRecording={isRecording} />
            </div>
          </div>
        </div>

        {/* Live Transcription Box */}
        <div className="transcript-box">
          <div className="transcript-toolbar">
            <div className="flex-row">
              <Sparkles size={16} style={{ color: 'hsl(var(--primary))' }} />
              <span style={{ fontStyle: 'normal', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Transcript</span>
            </div>
            <div className="flex-row">
              <button 
                onClick={handleCopy} 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                disabled={finalizedTranscripts.length === 0 && !interimTranscript}
                title="Copy Transcript"
              >
                {copied ? <Check size={14} style={{ color: 'hsl(var(--success))' }} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button 
                onClick={handleClear} 
                className="btn btn-danger" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                disabled={finalizedTranscripts.length === 0 && !interimTranscript}
                title="Clear Text"
              >
                <Trash2 size={14} />
                Clear
              </button>
            </div>
          </div>

          <div className="transcript-body">
            {finalizedTranscripts.length === 0 && !interimTranscript ? (
              <div className="transcript-placeholder">
                <Info size={24} />
                <p>Your transcription will appear here in real time as soon as you start speaking.</p>
              </div>
            ) : (
              <div className="transcript-text">
                {finalizedTranscripts.map((text, idx) => (
                  <span key={idx} className="transcript-final">
                    {text}{' '}
                  </span>
                ))}
                {interimTranscript && (
                  <span className="transcript-interim">
                    {interimTranscript}...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Real-time stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-label">
              <BarChart2 size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Duration
            </span>
            <span className="stat-value">{formatDuration(duration)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">
              <Layout size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Word Count
            </span>
            <span className="stat-value">{wordCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
