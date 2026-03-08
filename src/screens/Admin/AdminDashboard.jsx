import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, updateDoc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  
  // 1. Global Platform States
  const [commissions, setCommissions] = useState({ RIDE: 0, FOOD: 0, SHOP: 0, HOTEL: 0 });
  const [fares, setFares] = useState({ base: 0, surge: 1.0 });
  const [systemStatus, setSystemStatus] = useState({ website: 'ONLINE', mobileApp: 'ONLINE', vault: 'LOCKED' });
  const [pendingApprovals, setPendingApprovals] = useState(0);

  const activeTheme = theme || { bg: '#0A0A0A', border: '#D4AF37', card: 'rgba(20,20,20,0.95)', text: '#F3E5AB' };

  // 2. Real-time Cross-Platform Sync
  useEffect(() => {
    // Global Config Sync
    const unsubConfig = onSnapshot(doc(db, "settings", "global_config"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCommissions(data.commissions);
        setFares(data.fares);
        setSystemStatus(data.systemStatus || { website: 'ONLINE', mobileApp: 'ONLINE', vault: 'LOCKED' });
      }
      setLoading(false);
    });

    // Monitor Pending Registrations (from Website)
    const unsubRequests = onSnapshot(query(collection(db, "businesses"), where("status", "==", "PENDING_VERIFICATION")), (snap) => {
      setPendingApprovals(snap.size);
    });

    return () => { unsubConfig(); unsubRequests(); };
  }, []);

  // 3. Global Lockdown Trigger (Mobile & Web Control)
  const toggleSystemPanic = async (platform) => {
    const newStatus = systemStatus[platform] === 'ONLINE' ? 'MAINTENANCE' : 'ONLINE';
    const configRef = doc(db, "settings", "global_config");
    await updateDoc(configRef, { [`systemStatus.${platform}`]: newStatus });
    alert(`⚠️ ${platform.toUpperCase()} is now ${newStatus}`);
  };

  if (loading) return <div style={{color: activeTheme.border, textAlign: 'center', marginTop: '100px', fontWeight: 'bold'}}>INITIALIZING MASTER COMMAND...</div>;

  return (
    <div style={{ ...styles.container, background: activeTheme.bg }}>
      
      {/* --- MASTER TOP BAR --- */}
      <div style={{ ...styles.topBar, borderBottom: `2px solid ${activeTheme.border}` }}>
        <div>
          <h2 style={{ color: activeTheme.border, margin: 0 }}>🛡️ TEZRO COMMAND</h2>
          <small style={{ color: '#00ff00', fontSize: '10px' }}>ENCRYPTED VAULT SESSION ACTIVE</small>
        </div>
        <div style={styles.headerActions}>
          <button onClick={() => toggleSystemPanic('mobileApp')} style={styles.emergencyBtn}>
            {systemStatus.mobileApp === 'ONLINE' ? 'PANIC: APP LOCK' : 'RESUME APP'}
          </button>
          <button onClick={() => navigate('/')} style={styles.exitBtn}>LOGOUT</button>
        </div>
      </div>

      {/* --- SYSTEM MONITORING BAR --- */}
      <div style={styles.monitorBar}>
        <StatusPill label="Web" status={systemStatus.website} />
        <StatusPill label="App" status={systemStatus.mobileApp} />
        <StatusPill label="Pending" count={pendingApprovals} color="#D4AF37" />
      </div>

      {/* --- MENU TABS --- */}
      <div style={styles.tabContainer}>
        {[
          { id: 'Overview', icon: '📊', label: 'Monitor' },
          { id: 'Approvals', icon: '📝', label: 'Verifications' },
          { id: 'Finance', icon: '💰', label: 'Payouts' },
          { id: 'Control', icon: '⚙️', label: 'Global Rules' },
        ].map((item) => (
          <div key={item.id} onClick={() => setActiveTab(item.id)}
            style={{
              ...styles.tab,
              borderColor: activeTab === item.id ? activeTheme.border : '#333',
              color: activeTab === item.id ? activeTheme.border : '#888',
              background: activeTab === item.id ? 'rgba(212,175,55,0.1)' : 'transparent'
            }}>
            {item.icon} {item.label}
          </div>
        ))}
      </div>

      {/* --- DYNAMIC CONTENT AREA --- */}
      <div style={{ ...styles.contentArea, background: activeTheme.card, borderColor: `${activeTheme.border}33` }}>
        {activeTab === 'Overview' && <LivePerformance theme={activeTheme} />}
        {activeTab === 'Approvals' && <PendingVerifications theme={activeTheme} />}
        {activeTab === 'Control' && (
          <GlobalControl 
            theme={activeTheme} 
            commissions={commissions} 
            setCommissions={setCommissions} 
            fares={fares} 
            setFares={setFares}
            onSave={async () => {
              await updateDoc(doc(db, "settings", "global_config"), { commissions, fares });
              alert("GLOBAL SYNC COMPLETE");
            }}
          />
        )}
      </div>
    </div>
  );
};

// --- SUBSYSTEM COMPONENTS ---

const StatusPill = ({ label, status, count, color }) => (
  <div style={{ background: '#111', padding: '5px 12px', borderRadius: '20px', fontSize: '10px', border: '1px solid #333', display: 'flex', gap: '5px' }}>
    <span style={{ color: '#888' }}>{label}:</span>
    <span style={{ color: count > 0 ? color : (status === 'ONLINE' ? '#00ff00' : '#ff0000'), fontWeight: 'bold' }}>
      {count !== undefined ? count : status}
    </span>
  </div>
);

const GlobalControl = ({ theme, commissions, setCommissions, fares, setFares, onSave }) => (
  <div style={{ spaceY: '20px' }}>
    <h3 style={{ color: theme.border, fontSize: '16px' }}>🌍 Global Routing & Pricing</h3>
    <div style={styles.controlGrid}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Ride Commission (%)</label>
        <input type="number" value={commissions.RIDE} onChange={(e) => setCommissions({...commissions, RIDE: e.target.value})} style={styles.masterInput} />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Surge Multiplier (x)</label>
        <input type="number" step="0.1" value={fares.surge} onChange={(e) => setFares({...fares, surge: e.target.value})} style={styles.masterInput} />
      </div>
    </div>
    <button onClick={onSave} style={styles.masterBtn}>PUSH UPDATES TO ALL PLATFORMS</button>
  </div>
);

// (باقی اسمالر کمپوننٹس LivePerformance اور PendingVerifications یہاں شامل ہوں گے)

const styles = {
  container: { minHeight: '100vh', padding: '15px', paddingTop: '20px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px' },
  headerActions: { display: 'flex', gap: '10px' },
  emergencyBtn: { background: '#ff0000', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '900', boxShadow: '0 0 15px rgba(255,0,0,0.4)' },
  exitBtn: { background: 'transparent', color: '#888', border: '1px solid #333', padding: '8px 12px', borderRadius: '8px', fontSize: '10px' },
  monitorBar: { display: 'flex', gap: '10px', marginBottom: '20px' },
  tabContainer: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' },
  tab: { padding: '12px 20px', borderRadius: '15px', border: '1px solid', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', whiteSpace: 'nowrap' },
  contentArea: { padding: '20px', borderRadius: '25px', border: '1px solid', minHeight: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' },
  controlGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { color: '#888', fontSize: '10px', fontWeight: 'bold' },
  masterInput: { background: '#000', border: '1px solid #333', color: '#D4AF37', padding: '12px', borderRadius: '10px', textAlign: 'center', fontSize: '14px' },
  masterBtn: { width: '100%', padding: '15px', background: '#D4AF37', color: '#000', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', letterSpacing: '1px' }
};

export default AdminDashboard;
