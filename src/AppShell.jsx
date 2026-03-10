import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const AppShell = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "🖥️ مین ڈیش بورڈ", path: "/" },
    { label: "🛡️ سیکیورٹی انجن", path: "/security" },
    { label: "🌐 ویب سائٹ کنٹرول", path: "/web-manager" },
    { label: "📱 ایپ مانیٹرنگ", path: "/app-manager" },
    { label: "⚙️ سیٹنگز", path: "/settings" }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      {/* SideBar */}
      <div style={{ width: '250px', borderRight: '1px solid #FFD700', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#FFD700', fontSize: '1.5rem', marginBottom: '30px' }}>TEZRO ADMIN</h2>
        {menuItems.map((item, index) => (
          <button 
            key={index}
            onClick={() => navigate(item.path)}
            style={{ 
              background: 'none', border: '1px solid #222', color: '#ccc', 
              padding: '12px', textAlign: 'right', marginBottom: '10px', 
              cursor: 'pointer', borderRadius: '5px', transition: '0.3s'
            }}
            onMouseOver={(e) => e.target.style.borderColor = '#FFD700'}
            onMouseOut={(e) => e.target.style.borderColor = '#222'}
          >
            {item.label}
          </button>
        ))}
        <button onClick={() => navigate('/login')} style={{ marginTop: 'auto', background: '#FF0000', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px' }}>لاگ آؤٹ</button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '30px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AppShell;
