import React, { useState } from 'react';
import AdminDashboard from '../../screens/Admin/AdminDashboard';
import InventoryManager from '../Admin/InventoryManager'; // آپ کا بنایا ہوا انوینٹری فارم
import TezroVaultLedger from '../../bank_core/TezroVaultLedger';
import FinalSecurityShield from '../../security/FinalSecurityShield';

const AppShell = ({ adminUser }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  // ایڈمن کنٹرول کے مطابق سکرین کا انتخاب
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <AdminDashboard />;
      case 'Inventory':
        return <InventoryManager theme={premiumTheme} />;
      case 'Vault':
        return <TezroVaultLedger />;
      case 'Security':
        return <FinalSecurityShield isAdmin={true} />;
      default:
        return <AdminDashboard />;
    }
  };

  const navItems = [
    { id: 'Dashboard', icon: '📊', label: 'Monitor' },
    { id: 'Inventory', icon: '📦', label: 'Products' },
    { id: 'Vault', icon: '💰', label: 'Finance' },
    { id: 'Security', icon: '🛡️', label: 'Security' }
  ];

  const premiumTheme = { bg: '#0A0A0A', border: '#D4AF37', card: 'rgba(20,20,20,0.95)', text: '#F3E5AB' };

  return (
    <div style={styles.shellContainer}>
      {/* 🏛️ Master Command Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>⚡</span>
          <h1 style={styles.logoText}>TEZRO <span style={{color: '#D4AF37'}}>MASTER</span></h1>
        </div>
        <div style={styles.statusDot}>LIVE CONTROL</div>
      </header>

      {/* 📱 Main Dynamic Content Area */}
      <main style={styles.mainScroll}>
        {renderContent()}
      </main>

      {/* 🧭 Professional Admin Bottom Navigation */}
      <nav style={styles.bottomNav}>
        {navItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            style={{
              ...styles.navItem,
              color: activeTab === item.id ? '#D4AF37' : '#555'
            }}
          >
            <span style={{ fontSize: '22px', filter: activeTab === item.id ? 'drop-shadow(0 0 5px #D4AF37)' : 'none' }}>
              {item.icon}
            </span>
            <span style={{ 
              fontSize: '10px', 
              marginTop: '5px', 
              fontWeight: '900', 
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              {item.label}
            </span>
            {activeTab === item.id && <div style={styles.activeIndicator} />}
          </div>
        ))}
      </nav>
    </div>
  );
};

const styles = {
  shellContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#050505',
    color: '#F3E5AB',
    overflow: 'hidden'
  },
  header: {
    height: '60px',
    background: '#000',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    borderBottom: '1px solid #1A1A1A'
  },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
  logoIcon: { fontSize: '20px' },
  logoText: { fontSize: '16px', fontWeight: '900', letterSpacing: '2px' },
  statusDot: { fontSize: '9px', background: 'rgba(0,255,0,0.1)', color: '#00ff00', padding: '4px 8px', borderRadius: '10px', border: '1px solid #00ff00' },
  mainScroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    paddingBottom: '90px'
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75px',
    background: 'rgba(0, 0, 0, 0.98)',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '2px solid #1A1A1A',
    zIndex: 9999
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    width: '25%',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  activeIndicator: {
    position: 'absolute',
    bottom: '-10px',
    width: '30px',
    height: '2px',
    background: '#D4AF37',
    boxShadow: '0 0 15px #D4AF37'
  }
};

export default AppShell;
