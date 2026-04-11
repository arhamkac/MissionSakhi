import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, MapPin, Users, CheckCircle2, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function SOSButton() {
  const [mode, setMode] = useState('idle'); // idle, holding, cancel-window, simulating, sent
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
  const [cancelCountdown, setCancelCountdown] = useState(5);
  const [simStep, setSimStep] = useState(0);

  const holdTimerRef = useRef(null);
  const cancelTimerRef = useRef(null);
  const simTimerRef = useRef(null);
  const startTimeRef = useRef(0);

  const HOLD_DURATION = 3000;

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(holdTimerRef.current);
      clearInterval(cancelTimerRef.current);
      clearTimeout(simTimerRef.current);
    };
  }, []);

  // --- HOLD LOGIC ---
  const startHold = (e) => {
    // Prevent default to avoid selection/magnifier on mobile
    if (e.type === 'touchstart' && e.cancelable) {
      // It's a best practice to only `preventDefault` if needed, but for custom touch we rely on the events
      // e.preventDefault(); 
    }
    
    if (mode !== 'idle') return;
    setMode('holding');
    setHoldProgress(0);
    startTimeRef.current = performance.now();

    const updateHold = (time) => {
      const elapsed = time - startTimeRef.current;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);

      // Haptic feedback every ~500ms
      if (elapsed % 500 < 20) {
        if ('vibrate' in navigator) navigator.vibrate(30);
      }

      if (progress >= 100) {
        triggerSOS();
      } else {
        holdTimerRef.current = requestAnimationFrame(updateHold);
      }
    };
    holdTimerRef.current = requestAnimationFrame(updateHold);
  };

  const cancelHold = () => {
    if (mode === 'holding') {
      cancelAnimationFrame(holdTimerRef.current);
      setMode('idle');
      setHoldProgress(0);
    }
  };

  const triggerSOS = () => {
    cancelAnimationFrame(holdTimerRef.current);
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100, 50, 200]); // stronger burst
    setMode('cancel-window');
    setCancelCountdown(5);
    
    // Start countdown
    cancelTimerRef.current = setInterval(() => {
      // Haptic feedback each second during countdown
      if ('vibrate' in navigator) navigator.vibrate(50);
      
      setCancelCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(cancelTimerRef.current);
          startSimulation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetAll = () => {
    cancelAnimationFrame(holdTimerRef.current);
    clearInterval(cancelTimerRef.current);
    clearTimeout(simTimerRef.current);
    setMode('idle');
    setHoldProgress(0);
    setCancelCountdown(5);
    setSimStep(0);
  };

  const startSimulation = () => {
    setMode('simulating');
    setSimStep(0);
    
    // Simulate steps
    simTimerRef.current = setTimeout(() => {
      setSimStep(1); // Notifying contacts
      simTimerRef.current = setTimeout(() => {
        setSimStep(2); // Sent
        simTimerRef.current = setTimeout(() => {
          setMode('sent');
        }, 1000);
      }, 1500);
    }, 1500);
  };

  // Prevent context menu during long press
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {/* THE BUTTON */}
      <div className="relative flex items-center justify-center">
        {/* Expanding wave/ripple effect while holding */}
        <AnimatePresence>
          {mode === 'holding' && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full"
              style={{ background: 'linear-gradient(to right, #ec4899, #ef4444)' }}
            />
          )}
        </AnimatePresence>

        <motion.button
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onContextMenu={handleContextMenu}
          animate={{
            scale: mode === 'holding' ? 1.05 + holdProgress / 500 : 1, // subtle scale up
            boxShadow: mode === 'holding' 
              ? `0 0 ${10 + (holdProgress / 100) * 30}px rgba(239, 68, 68, ${0.5 + (holdProgress / 200)})` 
              : '0 4px 14px rgba(239, 68, 68, 0.4)',
          }}
          whileHover={mode === 'idle' ? { scale: 1.05 } : {}}
          whileTap={mode === 'idle' ? { scale: 0.95 } : {}}
          className="relative overflow-hidden w-10 md:w-12 h-10 md:h-12 rounded-full flex items-center justify-center select-none touch-none"
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
            border: '2px solid rgba(255,255,255,0.2)',
            zIndex: 10
          }}
          aria-label="SOS Emergency Button"
        >
          {/* Progress Circular Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              fill="transparent"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
            />
            {mode === 'holding' && (
              <circle
                cx="50%"
                cy="50%"
                r="46%"
                fill="transparent"
                stroke="#ffffff"
                strokeWidth="3"
                strokeDasharray="290" // approximate config, we will use pathLength instead
                strokeDashoffset={290 - (290 * holdProgress) / 100}
                pathLength="100"
                style={{
                  strokeDasharray: '100',
                  strokeDashoffset: 100 - holdProgress,
                  transition: 'stroke-dashoffset 0.1s linear',
                }}
                strokeLinecap="round"
              />
            )}
          </svg>

          {/* Icon or Timer */}
          {mode === 'holding' ? (
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white font-bold text-sm md:text-base font-mono z-10"
            >
              {Math.ceil(3 - (holdProgress / 100) * 3)}
            </motion.span>
          ) : (
            <ShieldAlert size={20} className="text-white z-10" />
          )}
        </motion.button>
      </div>

      {/* FULL SCREEN OVERLAY */}
      {typeof document !== 'undefined' ? createPortal(
        <AnimatePresence>
          {mode !== 'idle' && mode !== 'holding' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 select-none"
            style={{
              backdropFilter: 'blur(40px)',
              background: 'rgba(50, 0, 0, 0.4)', // dark red tint
            }}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl p-8 flex flex-col items-center text-center"
              style={{
                background: 'linear-gradient(180deg, rgba(30,30,30,0.9) 0%, rgba(15,15,15,0.95) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.25)',
              }}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #ef4444, #ec4899)' }} />

              {/* STATES */}
              {mode === 'cancel-window' && (
                <>
                  <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 relative">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-red-500"
                    />
                    <ShieldAlert size={40} className="text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Emergency Alert</h2>
                  <p className="text-white/70 mb-8">
                    Your alert will be sent to trusted contacts and authorities in{' '}
                    <span className="text-white font-bold text-lg">{cancelCountdown}</span> seconds.
                  </p>

                  <button
                    onClick={resetAll}
                    className="w-full py-4 rounded-xl font-bold text-white uppercase tracking-wider text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    Cancel Alert
                  </button>
                </>
              )}

              {mode === 'simulating' && (
                <>
                  <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mb-6 relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border-2 border-orange-500/30 border-t-orange-500"
                    />
                    <ShieldAlert size={40} className="text-orange-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-6">Sending SOS...</h2>
                  
                  <div className="w-full space-y-4 text-left">
                    <div className="flex items-center gap-4">
                      {simStep > 0 ? <CheckCircle2 className="text-green-500 w-6 h-6" /> : <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}><MapPin className="text-white/40 w-6 h-6" /></motion.div>}
                      <span className={simStep > 0 ? "text-white" : "text-white/60"}>Fetching location...</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {simStep > 1 ? <CheckCircle2 className="text-green-500 w-6 h-6" /> : <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}><Users className="text-white/40 w-6 h-6" /></motion.div>}
                      <span className={simStep > 1 ? "text-white" : "text-white/60"}>Notifying trusted contacts...</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {simStep > 2 ? <CheckCircle2 className="text-green-500 w-6 h-6" /> : <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}><ShieldAlert className="text-white/40 w-6 h-6" /></motion.div>}
                      <span className={simStep > 2 ? "text-white" : "text-white/60"}>Contacting authorities...</span>
                    </div>
                  </div>
                </>
              )}

              {mode === 'sent' && (
                <>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 size={50} className="text-green-500" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">Alert Sent</h2>
                  <p className="text-green-400 font-medium mb-6">Help is on the way.</p>
                  <p className="text-white/60 text-sm mb-8">
                    Your location has been shared. Please stay safe and try to stay calm.
                  </p>

                  <button
                    onClick={resetAll}
                    className="w-full py-4 rounded-xl font-bold text-white uppercase tracking-wider text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    I am Safe / Close
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    ) : null}
    </>
  );
}
