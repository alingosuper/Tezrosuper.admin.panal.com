import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#000', color: '#FFD700', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '2px solid #FFD700', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>🛡️ TEZRO SECURITY ENGINE</h1>
        <button onClick={() => navigate('/login')} style={{ background: '#FFD700', border: 'none', padding: '5px 15px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
      </header>

      <main style={{ marginTop: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ border: '1px solid #333', padding: '20px', textAlign: 'center', background: '#111' }}>
            <h3 style={{ color: '#aaa' }}>سیکیورٹی اسٹیٹس</h3>
            <p style={{ fontSize: '2rem', color: '#00FF00' }}>ACTIVE</p>
          </div>
          <div style={{ border: '1px solid #333', padding: '20px', textAlign: 'center', background: '#111' }}>
            <h3 style={{ color: '#aaa' }}>لائیو ٹریفک</h3>
            <p style={{ fontSize: '2rem' }}>MONITORING</p>
          </div>
        </div>

        <section style={{ marginTop: '40px', background: '#050505', padding: '15px', border: '1px dotted #FFD700' }}>
          <h2 style={{ fontSize: '1rem' }}>📡 سسٹم لاگز (System Logs)</h2>
          <pre style={{ color: '#00FF00', fontSize: '0.8rem' }}>
            [OK] Security Shield Initialized...
            [OK] Anti-Fraud Engine Standby...
            [OK] No unauthorized access detected.
          </pre>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
