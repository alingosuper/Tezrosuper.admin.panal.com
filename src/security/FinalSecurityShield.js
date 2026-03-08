import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';

const FinalSecurityShield = forwardRef(({ children, onThreatDetected }, ref) => {
  const [isLocked, setIsLocked] = useState(false);
  const [mode, setMode] = useState('PRIMARY'); // PRIMARY یا GHOST

  // 🚨 لوکل لاک آؤٹ پروٹوکول
  const triggerLocalLockdown = () => {
    setIsLocked(true);
    localStorage.setItem('TEZRO_LOCAL_LOCK', 'TRUE');
    if (onThreatDetected) onThreatDetected();
  };

  // 🎤 وائس اور سٹریس انٹیلیجنس (باہر سے ایکسیس کے لیے)
  useImperativeHandle(ref, () => ({
    async authorizeVoiceAccess(audioData) {
      // یہاں آپ کا سٹریس ڈیٹیکشن لاجک چلے گا
      const isDistressed = false; // مثال کے طور پر

      if (isDistressed) {
        console.warn("🚨 Distress Detected! Activating Ghost Vault...");
        setMode('GHOST');
        this.triggerEmergencyProtocol();
        return "GHOST_VAULT_ACTIVE";
      }
      setMode('PRIMARY');
      return "PRIMARY_VAULT_OPEN";
    },
    triggerEmergencyProtocol() {
      // خاموش الرٹ بھیجنا
      console.log("🛰️ SOS Signal Dispatched to Admin Tower.");
    }
  }));

  useEffect(() => {
    // ڈیوائس لاک چیک
    if (localStorage.getItem('TEZRO_LOCAL_LOCK') === 'TRUE') {
      setIsLocked(true);
    }

    // 🕵️ انٹیلیجنٹ ڈیٹیکشن
    const blockIntrusion = (e) => {
      // F12, Ctrl+Shift+I/J, Ctrl+U
      if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && [73, 74].includes(e.keyCode)) || (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
        triggerLocalLockdown(); 
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        console.log("🛡️ Background Monitoring Active...");
      }
    };

    document.addEventListener('keydown', blockIntrusion);
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      document.removeEventListener('keydown', blockIntrusion);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // 🔒 اگر ڈیوائس لاک ہو چکی ہے
  if (isLocked) return <LockdownScreen />;

  return (
    <div style={styles.shieldWrapper}>
      {/* بصری سیکیورٹی اوورلے */}
      <div style={styles.secureOverlay} />
      
      {/* اگر موڈ GHOST ہے تو یہاں ہم مخصوص فلٹر لگا سکتے ہیں */}
      <div style={{ ...styles.content, filter: mode === 'GHOST' ? 'grayscale(0.5)' : 'none' }}>
        {children}
      </div>
    </div>
  );
});

// --- 🔒 لاک آؤٹ انٹرفیس ---
const LockdownScreen = () => (
  <div style={styles.lockScreen}>
    <h1 style={{color: '#D4AF37', letterSpacing: '4px'}}>🛡️ ACCESS REVOKED</h1>
    <p style={{color: '#666', fontSize: '10px', marginTop: '10px'}}>UNAUTHORIZED SYSTEM INTERFERENCE DETECTED</p>
    <button onClick={() => {
       localStorage.removeItem('TEZRO_LOCAL_LOCK');
       window.location.reload();
    }} style={styles.unlockBtn}>EMERGENCY RE-AUTHORIZE</button>
  </div>
);

const styles = {
  shieldWrapper: { position: 'relative', minHeight: '100vh', background: '#000', userSelect: 'none', overflow: 'hidden' },
  secureOverlay: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.15) 100%)' },
  content: { position: 'relative', zIndex: 1, transition: '0.5s' },
  lockScreen: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#050505', textAlign: 'center' },
  unlockBtn: { marginTop: '40px', background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', padding: '12px 30px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }
};

export default FinalSecurityShield;
