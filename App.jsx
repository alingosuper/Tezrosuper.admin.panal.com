import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import { useTheme } from './context/ThemeContext'; 

// --- LAYOUTS ---
import WebsiteLayout from './website/WebsiteLayout'; // ویب سائٹ کا ڈھانچہ
import Layout from './components/Layout';           // سپر ایپ کا ڈھانچہ

// --- WEBSITE PAGES (Lazy Loaded) ---
const HomePage = lazy(() => import('./website/pages/HomePage'));
const InvestPage = lazy(() => import('./website/pages/InvestPage'));
const AdsPage = lazy(() => import('./website/pages/AdsPage'));
const FeaturesPage = lazy(() => import('./website/pages/FeaturesPage'));

// --- APP SCREENS (Lazy Loaded) ---
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const AdminDashboard = lazy(() => import('./screens/Admin/AdminDashboard'));
const Login = lazy(() => import('./screens/Auth/Login'));

// لوڈنگ اسکرین
const LoadingScreen = () => (
  <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505', color: '#D4AF37' }}>
    <div className="tezro-spinner"></div>
    <p style={{ marginLeft: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>TEZRO SECURE LOADING...</p>
  </div>
);

const App = () => {
  const { user, role, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <div style={{ background: colors?.bg || '#050505', minHeight: '100vh' }}>
          <Routes>
            
            {/* 🌐 SECTION 1: MAIN WEBSITE (Public) */}
            {/* یہ تمام صفحات tezro.com/ پر براہ راست نظر آئیں گے */}
            <Route element={<WebsiteLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/invest" element={<InvestPage />} />
              <Route path="/ads" element={<AdsPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<div>About Tezro</div>} />
              <Route path="/contact" element={<div>Contact Us</div>} />
            </Route>

            {/* 🔐 SECTION 2: AUTHENTICATION */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/app" />} />

            {/* 📱 SECTION 3: SUPER APP (Private/Protected) */}
            {/* یہ حصہ صرف لاگ ان صارفین کے لیے tezro.com/app پر ہوگا */}
            <Route 
              path="/app/*" 
              element={user ? (
                <Layout>
                  <Routes>
                    <Route index element={<HomeScreen />} />
                    {/* ایپ کے دیگر صفحات یہاں آئیں گے */}
                    <Route path="profile" element={<div>User Profile</div>} />
                    <Route path="banking" element={<div>Tezro Vault</div>} />
                    
                    {/* ایڈمن پینل (صرف ایڈمن کے لیے) */}
                    <Route 
                      path="admin" 
                      element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/app" />} 
                    />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" />
              )} 
            />

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </div>
      </Suspense>
    </Router>
  );
};

export default App;
