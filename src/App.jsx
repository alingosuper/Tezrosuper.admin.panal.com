import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import { useTheme } from './context/ThemeContext'; 

// --- SECURITY & ARCHITECTURE ---
import FinalSecurityShield from './security/FinalSecurityShield'; 
import AppShell from './AppShell'; // ماسٹر کمانڈ سینٹر لے آؤٹ

// --- LAYOUTS ---
const WebsiteLayout = lazy(() => import('./website/WebsiteLayout')); 

// --- LAZY LOADED MODULES (Performance Optimization) ---
const HomePage = lazy(() => import('./website/pages/HomePage'));
const AdminDashboard = lazy(() => import('./screens/Admin/AdminDashboard'));
const InventoryManager = lazy(() => import('./components/Admin/InventoryManager'));
const Login = lazy(() => import('./screens/Auth/Login'));
const HomeScreen = lazy(() => import('./screens/HomeScreen'));

// 🛡️ پریمیم انکرپٹڈ لوڈنگ اسکرین
const LoadingScreen = () => (
  <div style={styles.loaderContainer}>
    <div className="tezro-pulse-ring"></div>
    <p style={styles.loaderText}>🛡️ TEZRO SECURE SESSION INITIALIZING...</p>
    <style>{`
      .tezro-pulse-ring {
        width: 60px; height: 60px;
        border: 2px solid #D4AF37;
        border-radius: 50%;
        animation: pulse 1.5s infinite ease-in-out;
      }
      @keyframes pulse {
        0% { transform: scale(0.8); opacity: 0.5; }
        50% { transform: scale(1.2); opacity: 1; border-width: 4px; }
        100% { transform: scale(0.8); opacity: 0.5; }
      }
    `}</style>
  </div>
);

const App = () => {
  const { user, role, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <FinalSecurityShield> {/* 🛡️ ہیکنگ اور غیر قانونی رسائی کے خلاف پہلی دیوار */}
        <Suspense fallback={<LoadingScreen />}>
          <div style={{ background: colors?.bg || '#000', minHeight: '100vh', color: '#fff' }}>
            <Routes>
              
              {/* 🌐 عوامی ویب سائٹ (Tezro Landing) */}
              <Route element={<WebsiteLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/invest" element={lazy(() => import('./website/pages/InvestPage'))} />
                <Route path="/features" element={lazy(() => import('./website/pages/FeaturesPage'))} />
              </Route>

              {/* 🔐 انٹری پوائنٹ (Authentication) */}
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />

              {/* 🛡️ ماسٹر ایڈمن پینل (Strict Access) */}
              <Route 
                path="/dashboard/*" 
                element={user && role === 'admin' ? (
                  <AppShell adminUser={user}> 
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="inventory" element={<InventoryManager theme={colors} />} />
                      <Route path="finance" element={lazy(() => import('./bank_core/TezroVaultLedger'))} />
                      <Route path="users" element={<div>System User Directory</div>} />
                    </Routes>
                  </AppShell>
                ) : (
                  <Navigate to="/login" />
                )} 
              </Route>

              {/* 📱 سپر ایپ انٹرفیس (Client Side) */}
              <Route 
                path="/app/*" 
                element={user ? (
                  <Routes>
                    <Route index element={<HomeScreen />} />
                    <Route path="banking" element={<div>Tezro Pay Core</div>} />
                    <Route path="orders" element={lazy(() => import('./components/OrderHistory'))} />
                  </Routes>
                ) : (
                  <Navigate to="/login" />
                )} 
              </Route>

              {/* 🛰️ عالمی ری ڈائریکشن */}
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </div>
        </Suspense>
      </FinalSecurityShield>
    </Router>
  );
};

const styles = {
  loaderContainer: { 
    height: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    background: '#050505' 
  },
  loaderText: { 
    marginTop: '30px', 
    color: '#D4AF37', 
    fontSize: '10px', 
    fontWeight: 'bold', 
    letterSpacing: '3px',
    textTransform: 'uppercase'
  }
};

export default App;
