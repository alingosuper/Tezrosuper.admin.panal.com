import React from 'react';

const LivePerformance = ({ theme, stats }) => {
  // فرضی ڈیٹا اگر لائیو ڈیٹا دستیاب نہ ہو (Failsafe)
  const revenue = stats?.totalRevenue || 0;
  const drivers = stats?.activeDrivers || 0;
  const orders = stats?.totalOrders || 0;

  // گراف کی بلندی کیلکولیٹ کرنے کے لیے (Simple Logic)
  const maxBarHeight = 100; 

  return (
    <div style={styles.container}>
      <h3 style={{ color: theme.border, fontSize: '14px', marginBottom: '20px' }}>SYSTEM ANALYTICS</h3>

      {/* 📈 مانیٹرنگ کارڈز */}
      <div style={styles.grid}>
        <div style={{ ...styles.statBox, borderColor: `${theme.border}22` }}>
          <span style={styles.label}>LIVE ORDERS</span>
          <h2 style={{ color: theme.border }}>{orders}</h2>
          <div style={styles.miniGraph}>
            {[40, 70, 45, 90, 65].map((h, i) => (
              <div key={i} style={{ ...styles.bar, height: `${h}%`, background: theme.border }} />
            ))}
          </div>
        </div>

        <div style={{ ...styles.statBox, borderColor: '#00ff0022' }}>
          <span style={styles.label}>ACTIVE DRIVERS</span>
          <h2 style={{ color: '#00ff00' }}>{drivers}</h2>
          <div style={styles.miniGraph}>
            {[30, 50, 80, 60, 95].map((h, i) => (
              <div key={i} style={{ ...styles.bar, height: `${h}%`, background: '#00ff00' }} />
            ))}
          </div>
        </div>
      </div>

      {/* 💰 ریونیو ٹریکر (بڑا گراف) */}
      <div style={{ ...styles.revenueCard, background: `${theme.border}05`, borderColor: `${theme.border}22` }}>
        <div style={styles.revenueInfo}>
          <span style={styles.label}>TOTAL REVENUE (PKR)</span>
          <h1 style={{ color: theme.border, margin: '5px 0' }}>{revenue.toLocaleString()}</h1>
        </div>
        
        {/* بصری لہر (Visual Wave) */}
        <div style={styles.waveContainer}>
           <svg viewBox="0 0 1440 320" style={styles.svg}>
            <path 
              fill={`${theme.border}33`} 
              fillOpacity="1" 
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      <p style={styles.footerNote}>🛰️ Data synced with Firebase Cloud Repository</p>
    </div>
  );
};



const styles = {
  container: { width: '100%', animation: 'fadeIn 0.8s ease' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' },
  statBox: { 
    background: 'rgba(255,255,255,0.02)', 
    padding: '15px', 
    borderRadius: '20px', 
    border: '1px solid', 
    textAlign: 'center',
    overflow: 'hidden',
    position: 'relative'
  },
  label: { fontSize: '9px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase' },
  miniGraph: { display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px', height: '30px', marginTop: '10px' },
  bar: { width: '4px', borderRadius: '2px', opacity: 0.6 },
  revenueCard: { 
    padding: '20px', 
    borderRadius: '25px', 
    border: '1px solid', 
    position: 'relative', 
    overflow: 'hidden',
    minHeight: '150px'
  },
  revenueInfo: { position: 'relative', zIndex: 2 },
  waveContainer: { position: 'absolute', bottom: 0, left: 0, width: '100%', lineHeight: 0 },
  svg: { width: '100%', height: 'auto' },
  footerNote: { textAlign: 'center', fontSize: '8px', color: '#333', marginTop: '20px', letterSpacing: '1px' }
};

export default LivePerformance;
