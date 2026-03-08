import React, { useState } from 'react';
import HomeHeader from './components/HomeHeader';
import SuperSearchBar from './components/SuperSearchBar';
import OrderHistory from './components/OrderHistory';
import ProfilePage from './components/ProfilePage'; // فرضی پروفائل پیج

const AppShell = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Home');

  // نیویگیشن کے مطابق سکرین کا انتخاب
  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeHeader />; // یہاں آپ کی مین ہوم اسکرین آئے گی
      case 'Search':
        return <SuperSearchBar />;
      case 'Orders':
        return <OrderHistory userId={user.uid} />;
      case 'Profile':
        return <ProfilePage user={user} />;
      default:
        return <HomeHeader />;
    }
  };

  const navItems = [
    { id: 'Home', icon: '🏠', label: 'Home' },
    { id: 'Search', icon: '🔍', label: 'Search' },
    { id: 'Orders', icon: '📜', label: 'Orders' },
    { id: 'Profile', icon: '👤', label: 'Profile' }
  ];

  return (
    <div style={styles.shellContainer}>
      {/* 📱 Main Content Area */}
      <div style={styles.mainScroll}>
        {renderContent()}
      </div>

      {/* 🧭 Professional Bottom Navigation Bar */}
      <nav style={styles.bottomNav}>
        {navItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            style={{
              ...styles.navItem,
              color: activeTab === item.id ? '#D4AF37' : '#888'
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: activeTab === item.id ? 'bold' : 'normal' }}>
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
    background: '#000',
    color: '#fff',
    fontFamily: 'sans-serif',
    overflow: 'hidden'
  },
  mainScroll: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: '80px' // نیویگیشن بار کے لیے جگہ چھوڑنا
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70px',
    background: 'rgba(26, 26, 26, 0.95)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '1px solid #333',
    zIndex: 2000
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.3s ease',
    width: '25%'
  },
  activeIndicator: {
    position: 'absolute',
    top: '-15px',
    width: '4px',
    height: '4px',
    background: '#D4AF37',
    borderRadius: '50%',
    boxShadow: '0 0 10px #D4AF37'
  }
};

export default AppShell;
