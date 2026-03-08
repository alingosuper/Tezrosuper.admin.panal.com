import React, { useState, useMemo } from 'react';
import AdminDashboard from '../../screens/Admin/AdminDashboard';
import OrderHistory from '../OrderHistory'; 
import SuperSearchBar from '../SuperSearchBar'; 
import TezroVaultLedger from '../../bank_core/TezroVaultLedger';
import FinalSecurityShield from '../../security/FinalSecurityShield';
import TezroDiagnostics from '../../utils/TezroDiagnostics';

const AppShell = ({ adminUser }) => {
  const [activeTab, setActiveTab] = useState('Monitor');

  // سیکیورٹی اور آسانی: مخصوص فیچرز کا انتخاب
  const renderContent = () => {
    switch (activeTab) {
      case 'Monitor':
        return <AdminDashboard />; // بزنس اوور ویو اور لائیو گراف
      case 'Orders':
        return <OrderHistory />; // لائیو آرڈرز اور ڈیلیوری مانیٹرنگ
      case 'Vault':
        return <TezroVaultLedger />; // فنانشل ٹرانزیکشنز اور کمیشن کنٹرول
      case 'Security':
        return (
          <FinalSecurityShield isAdmin={true}>
            <TezroDiagnostics /> {/* سسٹم ہیلتھ اور فائر وال کنٹرول */}
          </FinalSecurityShield>
        );
      case 'Search':
        return <SuperSearchBar />; // ڈرائیور، وینڈر یا کسٹمر کی فوری تلاش
      default:
        return <AdminDashboard />;
    }
  };

  const navItems = [
    { id: 'Monitor', icon: '📊', label: 'Home' },
    { id: 'Orders', icon: '📜', label: 'Orders' },
    { id: 'Search', icon: '🔍', label: 'Search' },
    { id: 'Vault', icon: '💰', label: 'Vault' },
    { id: 'Security', icon: '🛡️', label: 'System' }
  ];

  return (
    <div style={styles.shellContainer}>
      {/* 🏛️ Master Status Header */}
      <header style={styles.header}>
        <div style={styles.logoGroup}>
          <span style={styles.brandIcon}>⚡</span>
          <div>
            <h1 style={styles.brandName}>TEZRO <span style={{color: '#D4AF37'}}>MASTER</span></h1>
            <p style={styles.versionTag}>V3.0 SECURE CORE</p>
          </div>
        </div>
        <div style={styles.liveIndicator}>
          <div style={styles.pulseDot} />
          SYSTEM LIVE
        </div>
      </header>

      {/* 📱 Dynamic Command Area */}
      <main style={styles.mainScroll}>
        {renderContent()}
      </main>

      {/* 🧭 Tactical Bottom Navigation */}
      <nav style={styles.bottomNav}>
        {navItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            style={{
              ...styles.navItem,
              color: activeTab === item.id ? '#D4AF37' : '#666'
            }}
          >
            <div style={{
              ...styles.iconWrapper,
              background: activeTab === item.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
            }}>
              {item.icon}
            </div>
            <span style={{ 
              fontSize: '9px', 
              fontWeight: activeTab === item.id ? '900' : '500',
              marginTop: '4px' 
            }}>{item.label}</span>
            {activeTab === item.id && <div style={styles.activeLine} />}
          </div>
        ))}
      </nav>
    </div>
  );
};

const styles = {
  shellContainer: { height: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#F3E5AB', overflow: 'hidden' },
  header: { 
    height: '70px', 
    background: '#0A0A0A', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '0 20px', 
    borderBottom: '1px solid #1A1A1A' 
  },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  brandIcon: { fontSize: '24px' },
  brandName: { fontSize: '14px', fontWeight: '900', letterSpacing: '2px', margin: 0 },
  versionTag: { fontSize: '7px', color: '#555', letterSpacing: '1px', margin: 0 },
  liveIndicator: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px', 
    fontSize: '9px', 
    color: '#00FF00', 
    background: 'rgba(0,255,0,0.05)', 
    padding: '5px 10px', 
    borderRadius: '20px',
    border: '1px solid rgba(0,255,0,0.2)'
  },
  pulseDot: { width: '6px', height: '6px', background: '#00FF00', borderRadius: '50%', boxShadow: '0 0 10px #00FF00' },
  mainScroll: { flex: 1, overflowY: 'auto', paddingBottom: '90px' },
  bottomNav: { 
    position: 'fixed', 
    bottom: 0, 
    width: '100%', 
    height: '80px', 
    background: 'rgba(10, 10, 10, 0.98)', 
    backdropFilter: 'blur(15px)', 
    display: 'flex', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    borderTop: '1px solid #1A1A1A',
    zIndex: 1000 
  },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', position: 'relative', width: '20%' },
  iconWrapper: { padding: '8px', borderRadius: '12px', transition: '0.3s' },
  activeLine: { position: 'absolute', bottom: '-15px', width: '20px', height: '2px', background: '#D4AF37', boxShadow: '0 0 10px #D4AF37' }
};

export default AppShell;
