import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, updateDoc, onSnapshot, collection, query, where, addDoc, serverTimestamp } from "firebase/firestore";

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  
  // States for Database Control
  const [commissions, setCommissions] = useState({ RIDE: 0, FOOD: 0, SHOP: 0, HOTEL: 0 });
  const [fares, setFares] = useState({ base: 0, surge: 1.0 });
  const [systemStatus, setSystemStatus] = useState({ website: 'ONLINE', mobileApp: 'ONLINE', vault: 'LOCKED' });
  const [pendingApprovals, setPendingApprovals] = useState(0);

  const activeTheme = theme || { bg: '#0A0A0A', border: '#D4AF37', card: 'rgba(20,20,20,0.95)', text: '#F3E5AB' };

  // Sync Logic
  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, "settings", "global_config"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCommissions(data.commissions);
        setFares(data.fares);
        setSystemStatus(data.systemStatus || { website: 'ONLINE', mobileApp: 'ONLINE', vault: 'LOCKED' });
      }
      setLoading(false);
    });

    const unsubRequests = onSnapshot(query(collection(db, "businesses"), where("status", "==", "PENDING_VERIFICATION")), (snap) => {
      setPendingApprovals(snap.size);
    });

    return () => { unsubConfig(); unsubRequests(); };
  }, []);

  const toggleSystemPanic = async (platform) => {
    const newStatus = systemStatus[platform] === 'ONLINE' ? 'MAINTENANCE' : 'ONLINE';
    await updateDoc(doc(db, "settings", "global_config"), { [`systemStatus.${platform}`]: newStatus });
    alert(`⚠️ ${platform.toUpperCase()} Status Updated to ${newStatus}`);
  };

  if (loading) return <div style={{color: activeTheme.border, textAlign: 'center', marginTop: '100px', fontWeight: 'bold'}}>SYNCING GLOBAL REPOSITORY...</div>;

  return (
    <div style={{ ...styles.container, background: activeTheme.bg }}>
      
      {/* --- TOP BAR --- */}
      <div style={{ ...styles.topBar, borderBottom: `1px solid ${activeTheme.border}33` }}>
        <div>
          <h2 style={{ color: activeTheme.border, margin: 0, fontSize: '18px' }}>TEZRO COMMAND</h2>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
             <StatusPill label="Web" status={systemStatus.website} />
             <StatusPill label="App" status={systemStatus.mobileApp} />
          </div>
        </div>
        <div style={styles.headerActions}>
          <button onClick={() => toggleSystemPanic('mobileApp')} style={styles.emergencyBtn}>SOS LOCK</button>
          <button onClick={() => navigate('/')} style={styles.exitBtn}>LOGOUT</button>
        </div>
      </div>

      {/* --- NAVIGATION TABS --- */}
      <div style={styles.tabContainer}>
        {[
          { id: 'Overview', icon: '📊', label: 'Monitor' },
          { id: 'Inventory', icon: '📦', label: 'Products' },
          { id: 'Approvals', icon: '🛡️', label: `Pending (${pendingApprovals})` },
          { id: 'Control', icon: '⚙️', label: 'Rules' },
        ].map((item) => (
          <div key={item.id} onClick={() => setActiveTab(item.id)}
            style={{
              ...styles.tab,
              borderColor: activeTab === item.id ? activeTheme.border : '#222',
              color: activeTab === item.id ? activeTheme.border : '#666',
              background: activeTab === item.id ? `${activeTheme.border}11` : 'transparent'
            }}>
            {item.icon} <span style={{marginLeft: '5px'}}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* --- CONTENT AREA --- */}
      <div style={{ ...styles.contentArea, background: activeTheme.card, borderColor: `${activeTheme.border}22` }}>
        {activeTab === 'Overview' && <LiveStats theme={activeTheme} />}
        
        {activeTab === 'Inventory' && <InventoryManager theme={activeTheme} />}
        
        {activeTab === 'Approvals' && <PendingVerifications theme={activeTheme} />}

        {activeTab === 'Control' && (
          <GlobalRules 
            theme={activeTheme} 
            commissions={commissions} 
            setCommissions={setCommissions} 
            fares={fares} 
            setFares={setFares}
            onSave={async () => {
              await updateDoc(doc(db, "settings", "global_config"), { commissions, fares });
              alert("GLOBAL SYNC SUCCESSFUL");
            }}
          />
        )}
      </div>
    </div>
  );
};

// --- INTEGRATED COMPONENTS ---

const InventoryManager = ({ theme }) => {
  const [p, setP] = useState({ name: '', price: '', cat: 'food' });
  const pushProduct = async () => {
    if(!p.name || !p.price) return alert("Fill data!");
    await addDoc(collection(db, "products"), { ...p, status: 'active', time: serverTimestamp() });
    alert("✅ Product Live on App!");
    setP({ name: '', price: '', cat: 'food' });
  };

  return (
    <div style={{maxWidth: '400px', margin: '0 auto'}}>
      <h3 style={{color: theme.border, textAlign: 'center'}}>ADD NEW PRODUCT</h3>
      <input placeholder="Product Name" value={p.name} onChange={e=>setP({...p, name: e.target.value})} style={styles.masterInput} />
      <input placeholder="Price (PKR)" type="number" value={p.price} onChange={e=>setP({...p, price: e.target.value})} style={styles.masterInput} />
      <select value={p.cat} onChange={e=>setP({...p, cat: e.target.value})} style={styles.masterInput}>
        <option value="food">Food</option>
        <option value="grocery">Grocery</option>
      </select>
      <button onClick={pushProduct} style={styles.masterBtn}>PUSH TO APP</button>
    </div>
  );
};

const LiveStats = ({ theme }) => (
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
    <div style={styles.statBox}>
      <p style={{fontSize: '10px', color: '#888'}}>TOTAL REVENUE</p>
      <h2 style={{color: theme.border}}>PKR 85K</h2>
    </div>
    <div style={styles.statBox}>
      <p style={{fontSize: '10px', color: '#888'}}>ACTIVE DRIVERS</p>
      <h2 style={{color: '#00ff00'}}>42</h2>
    </div>
  </div>
);

// --- STYLES & SHARED ---

const StatusPill = ({ label, status }) => (
  <span style={{ fontSize: '9px', color: status === 'ONLINE' ? '#00ff00' : 'red', border: '1px solid #222', padding: '2px 6px', borderRadius: '10px' }}>
    {label}: {status}
  </span>
);

const GlobalRules = ({ theme, commissions, setCommissions, fares, setFares, onSave }) => (
  <div>
    <h3 style={{color: theme.border}}>Global Commission & Pricing</h3>
    <div style={styles.controlGrid}>
      <div>
        <label style={styles.label}>Ride Comm (%)</label>
        <input type="number" value={commissions.RIDE} onChange={e=>setCommissions({...commissions, RIDE: e.target.value})} style={styles.masterInput} />
      </div>
      <div>
        <label style={styles.label}>Base Fare</label>
        <input type="number" value={fares.base} onChange={e=>setFares({...fares, base: e.target.value})} style={styles.masterInput} />
      </div>
    </div>
    <button onClick={onSave} style={styles.masterBtn}>SYNC CHANGES</button>
  </div>
);

const styles = {
  container: { minHeight: '100vh', padding: '15px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', marginBottom: '15px' },
  headerActions: { display: 'flex', gap: '8px' },
  emergencyBtn: { background: '#ff0000', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' },
  exitBtn: { background: 'transparent', color: '#666', border: '1px solid #333', padding: '6px 12px', borderRadius: '8px', fontSize: '10px' },
  tabContainer: { display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '5px' },
  tab: { padding: '10px 16px', borderRadius: '12px', border: '1px solid', fontSize: '11px', whiteSpace: 'nowrap', cursor: 'pointer' },
  contentArea: { padding: '20px', borderRadius: '25px', border: '1px solid', minHeight: '450px' },
  statBox: { background: '#111', padding: '15px', borderRadius: '15px', textAlign: 'center', border: '1px solid #222' },
  controlGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  masterInput: { width: '100%', background: '#000', border: '1px solid #333', color: '#D4AF37', padding: '12px', borderRadius: '10px', marginBottom: '10px' },
  masterBtn: { width: '100%', background: '#D4AF37', color: 'black', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold' },
  label: { fontSize: '10px', color: '#888', marginLeft: '5px' }
};

export default AdminDashboard;
