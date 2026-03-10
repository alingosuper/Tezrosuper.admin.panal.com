import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ShieldCheck, Activity, Globe, Smartphone } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState(["System Booting...", "Shield Active..."]);

  return (
    <div style={{ color: '#FFD700', fontFamily: 'monospace' }}>
      <h1 style={{ borderBottom: '2px solid #FFD700', paddingBottom: '10px' }}>🛰️ TEZRO COMMAND CENTER</h1>

      {/* Top Stats - ملٹی ریپو اسٹیٹس */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <Globe size={20} /> <h3>Tezro Web</h3>
          <p style={{ color: '#00FF00' }}>CONNECTED</p>
          <button style={miniBtn}>Manage Repo</button>
        </div>
        <div style={cardStyle}>
          <Smartphone size={20} /> <h3>Tezro App</h3>
          <p style={{ color: '#00FF00' }}>STABLE</p>
          <button style={miniBtn}>Sync Assets</button>
        </div>
        <div style={cardStyle}>
          <ShieldCheck size={20} /> <h3>Anti-Fraud</h3>
          <p style={{ color: '#00FF00' }}>ENFORCING</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Visual Map Area - لائیو لوکیشن مانیٹرنگ کا خاکہ */}
        <div style={{ height: '300px', backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ padding: '10px', background: '#111', borderBottom: '1px solid #333' }}>📍 Live Activity Map (Real-time)</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#333', fontSize: '5rem' }}>
            🗺️
          </div>
          {/* میپ پر فرضی لائیو الرٹ */}
          <div style={{ position: 'absolute', top: '50%', left: '40%', color: '#00FF00', fontSize: '0.7rem' }}>● User_Active</div>
        </div>

        {/* Alerting System - الرٹ سسٹم */}
        <div style={{ backgroundColor: '#050505', border: '1px solid #FF4444', borderRadius: '10px', padding: '15px' }}>
          <h3 style={{ color: '#FF4444', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} /> Alert Logs
          </h3>
          <div style={{ fontSize: '0.8rem', color: '#ccc', maxHeight: '200px', overflowY: 'auto' }}>
            <p style={{ borderLeft: '2px solid #FF4444', paddingLeft: '5px' }}>[11:45] Security: Unauthorized IP blocked.</p>
            <p style={{ borderLeft: '2px solid #00FF00', paddingLeft: '5px' }}>[11:50] WebRepo: Sync completed.</p>
            <p style={{ borderLeft: '2px solid #FFD700', paddingLeft: '5px' }}>[11:52] AppRepo: New build detected.</p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
        <button onClick={() => navigate('/live')} style={actionBtn}>View Performance</button>
        <button style={actionBtn}>GhostData Shield</button>
        <button style={actionBtn}>Vault Ledger</button>
      </div>
    </div>
  );
};

const cardStyle = { background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #222', textAlign: 'center' };
const miniBtn = { background: '#FFD700', border: 'none', padding: '5px 10px', fontSize: '0.7rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' };
const actionBtn = { flex: 1, background: '#111', color: '#FFD700', border: '1px solid #FFD700', padding: '15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default AdminDashboard;
