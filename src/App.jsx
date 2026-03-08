import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import { useTheme } from './context/ThemeContext'; 

// --- CORE SECURITY & DATA ---
import FinalSecurityShield from './security/FinalSecurityShield'; 
import { GhostData } from './security/GhostData'; // 🎭 گوسٹ ڈیٹا امپورٹ
import AppShell from './components/Navigation/AppShell'; 

// --- LAZY COMPONENTS ---
const HomePage = lazy(() => import('./website/pages/HomePage'));
const InvestPage = lazy(() => import('./website/pages/InvestPage'));
const FeaturesPage = lazy(() => import('./website/pages/FeaturesPage'));
const AdminDashboard = lazy(() => import('./screens/Admin/AdminDashboard'));
const InventoryManager = lazy(() => import('./components/Admin/InventoryManager'));
const Login = lazy(() => import('./screens/Auth/Login'));
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const OrderHistory = lazy(() => import('./components/OrderHistory'));
const TezroVaultLedger = lazy(() => import('./bank_core/TezroVaultLedger'));

const App = () => {
  const { user, role, loading } = useAuth();
  const { colors } = useTheme();
  const shieldRef = useRef(null); // شیلڈ کے فنکشنز استعمال کرنے کے لیے
  
  const [isDeviceSecure, setIsDeviceSecure] = useState(true);
  const [isDistressed, setIsDistressed] = useState(false); // 🚨 اسٹریس/گوسٹ موڈ سٹیٹ

  useEffect(() => {
    const lockStatus = localStorage.getItem('TEZRO_LOCAL_LOCK');
    if (lockStatus === 'TRUE') setIsDeviceSecure(false);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <FinalSecurityShield 
        ref={shieldRef}
        onThreatDetected={() => {
          setIsDeviceSecure(false);
          localStorage.setItem('TEZRO_LOCAL_LOCK', 'TRUE');
        }}
        // اگر شیلڈ اسٹریس ڈیٹیکٹ کرے تو اسے سٹیٹ میں سیٹ کریں
        onDistressDetected={(status) => setIsDistressed(status)}
      >
        <Suspense fallback={<LoadingScreen />}>
          <div style={{ background: colors?.bg || '#000', minHeight: '100vh', color: '#fff' }}>
            
            {isDeviceSecure ? (
              <Routes> 
{/* 🌐 پبلک زون کا درست طریقہ */}
<Route path="/" element={<WebsiteLayout />}>
  // HomePage کی جگہ یہ عارضی لائن لکھیں
  <Route index element={<div style={{padding: '100px', color: 'red'}}>ہیلو! یہ ہوم پیج ہے</div>} /> <Route path="invest" element={<InvestPage />} />
  <Route path="features" element={<FeaturesPage />} />
</Route>
                
                <Route path="/login" element={!user ? <Login /> : <Navigate to={role === 'admin' ? "/admin" : "/app"} />} />

                {/* 🛡️ ایڈمن زون - یہاں گوسٹ ڈیٹا کا سوئچ کام کرے گا */}
                <Route path="/admin/*" element={user && role === 'admin' ? (
                  <AppShell adminUser={user} isGhost={isDistressed}> 
                    <Routes>
                      <Route index element={<AdminDashboard isGhost={isDistressed} data={isDistressed ? GhostData.stats : null} />} />
                      <Route path="inventory" element={<InventoryManager theme={colors} isGhost={isDistressed} />} />
                      <Route path="finance" element={<TezroVaultLedger isGhost={isDistressed} ghostVault={GhostData.vault} />} />
                      <Route path="users" element={<div>System User Directory</div>} />
                    </Routes>
                  </AppShell>
                ) : <Navigate to="/login" />} />

                {/* 📱 سپر ایپ - کلائنٹ سائیڈ گوسٹ سوئچ */}
                <Route path="/app/*" element={user ? (
                  <Routes>
                    <Route index element={<HomeScreen isGhost={isDistressed} />} />
                    <Route path="banking" element={
                        <div>
                          {/* 🎭 گوسٹ بیلنس کا سوئچ */}
                          <h2>Balance: {isDistressed ? GhostData.vault.totalBalance : "PKR 1,250,000"}</h2>
                        </div>
                    } />
                    <Route path="orders" element={<OrderHistory isGhost={isDistressed} ghostOrders={GhostData.orders} />} />
                  </Routes>
                ) : <Navigate to="/login" />} />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            ) : (
              <SecurityBreachScreen onUnlock={() => setIsDeviceSecure(true)} />
            )}
          </div>
        </Suspense>
      </FinalSecurityShield>
    </Router>
  );
};

// --- باقی کمپوننٹس (Loading, SecurityBreach, Styles) وہی رہیں گے جو آپ نے فراہم کیے ہیں ---

const SecurityBreachScreen = ({ onUnlock }) => (
  <div style={styles.breachContainer}>
    <h1 style={{color: '#ff4444', fontSize: '24px'}}>🛡️ SECURITY LOCKOUT</h1>
    <p style={styles.breachText}>This device has been isolated due to suspicious activity.</p>
    <button style={styles.unlockBtn} onClick={() => {
       localStorage.removeItem('TEZRO_LOCAL_LOCK');
       window.location.reload();
    }}>Verify & Re-Authorize Device</button>
  </div>
);

const LoadingScreen = () => (
  <div style={styles.loaderContainer}>
    <div className="tezro-pulse-ring"></div>
    <p style={styles.loaderText}>🛡️ ESTABLISHING ENCRYPTED SESSION...</p>
  </div>
);

const styles = {
  loaderContainer: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#050505' },
  loaderText: { marginTop: '30px', color: '#D4AF37', fontSize: '10px', fontWeight: 'bold', letterSpacing: '3px' },
  breachContainer: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a', textAlign: 'center', padding: '20px' },
  breachText: { color: '#666', fontSize: '12px', marginTop: '10px', maxWidth: '300px', lineHeight: '1.6' },
  unlockBtn: { marginTop: '30px', background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }
};

export default App;
