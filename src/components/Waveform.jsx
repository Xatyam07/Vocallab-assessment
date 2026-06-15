import { useEffect, useRef } from 'react';

export default function Waveform({ stream, isRecording }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight || 50;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Audio Analysis Setup
    if (isRecording && stream) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64; // Small size for responsive block wave

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        sourceRef.current = source;
      } catch (err) {
        console.error('Failed to initialize AudioContext visualizer:', err);
      }
    }

    // Animation Loop
    const bufferLength = analyserRef.current ? analyserRef.current.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (isRecording && analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);

        // Draw frequency bars
        const barWidth = (width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          // Normalise volume amplitude (value ranges 0 - 255)
          const amplitude = dataArray[i] / 255;
          barHeight = amplitude * (height * 0.85);

          if (barHeight < 4) barHeight = 4; // minimum height

          // Draw double-sided bars centered vertically
          const y = (height - barHeight) / 2;

          // Create a premium gradient for active audio
          const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
          gradient.addColorStop(0, 'hsl(270, 95%, 60%)'); // Purple
          gradient.addColorStop(1, 'hsl(190, 95%, 50%)'); // Cyan

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth - 2, barHeight, 2);
          ctx.fill();

          x += barWidth;
        }
      } else {
        // Draw idle wave (simple wave animation)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const time = Date.now() * 0.004;
        for (let i = 0; i < width; i++) {
          const y = height / 2 + Math.sin(i * 0.05 + time) * 3;
          if (i === 0) {
            ctx.moveTo(i, y);
          } else {
            ctx.lineTo(i, y);
          }
        }
        ctx.stroke();
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(err => console.log('AudioContext clean up error:', err));
      }
    };
  }, [stream, isRecording]);

  return (
    <div style={{ width: '100%', height: '50px', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
