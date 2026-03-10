import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h1 style={{ color: '#FFD700' }}>مرکزی ڈیش بورڈ</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        {/* Repo 1: Tezro Web */}
        <div style={{ border: '1px solid #FFD700', padding: '20px', borderRadius: '10px', background: '#050505' }}>
          <h3>🌐 Tezro Website</h3>
          <p>اسٹیٹس: <span style={{ color: '#00FF00' }}>آن لائن</span></p>
          <button style={btnStyle}>ویب سائٹ میں ترمیم کریں</button>
        </div>

        {/* Repo 2: Tezro App */}
        <div style={{ border: '1px solid #FFD700', padding: '20px', borderRadius: '10px', background: '#050505' }}>
          <h3>📱 Tezro Super App</h3>
          <p>اسٹیٹس: <span style={{ color: '#00FF00' }}>فعال</span></p>
          <button style={btnStyle}>ایپ کنٹرولز دیکھیں</button>
        </div>
      </div>

      {/* Security Engine Notification */}
      <div style={{ marginTop: '30px', padding: '20px', border: '1px dashed #FFD700', background: '#111' }}>
        <h3 style={{ color: '#FFD700' }}>🛡️ سیکیورٹی الرٹ</h3>
        <p style={{ fontSize: '0.9rem', color: '#00FF00' }}>[System]: تمام سسٹمز نارمل کام کر رہے ہیں۔ کوئی غیر قانونی رسائی نہیں ملی۔</p>
      </div>
    </div>
  );
};

const btnStyle = { background: '#FFD700', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default AdminDashboard;
