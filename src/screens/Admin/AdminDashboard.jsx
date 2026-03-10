import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Shield, Zap, Globe, Cpu, Bell } from 'lucide-react';
import L from 'leaflet';

// مارکر آئیکن فکس
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const AdminDashboard = () => {
  return (
    <div style={{ backgroundColor: '#020202', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Golden Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px', marginBottom: '25px' }}>
        <div>
          <h1 style={{ color: '#FFD700', margin: 0, letterSpacing: '2px' }}>TEZRO COMMAND</h1>
          <span style={{ color: '#555', fontSize: '0.7rem' }}>V 1.0.4 - SECURE INSTANCE</span>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={badge}><span style={dot}></span> LIVE MONITORING</div>
        </div>
      </header>

      {/* Control Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '20px' }}>
        
        {/* Map Section */}
        <div style={{ borderRadius: '15px', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
          <div style={panelHeader}>🌐 GLOBAL FLEET TRACKER</div>
          <MapContainer center={[24.8607, 67.0011]} zoom={12} style={{ height: '500px', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(95%)' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[24.8607, 67.0011]}>
              <Popup>Command Center Karachi</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={statCard}><Zap size={16} color="#FFD700"/> <span>Drivers: 42 Active</span></div>
          <div style={statCard}><Shield size={16} color="#00FF00"/> <span>System: Locked</span></div>
          
          <div style={logBox}>
            <div style={panelHeader}><Bell size={12}/> SYSTEM LOGS</div>
            <div style={{ padding: '15px', fontSize: '0.7rem', color: '#888', fontFamily: 'monospace' }}>
              <p style={{color: '#00FF00'}}>[OK] Firebase Connected</p>
              <p>[INFO] Tezro-Web Repo Synced</p>
              <p>[INFO] GhostData Shield: ON</p>
              <p style={{color: '#FFD700'}}>[WARN] Map Instance Loaded</p>
            </div>
          </div>
          
          <button style={goldBtn}>Emergency Shutdown</button>
        </div>
      </div>
    </div>
  );
};

const badge = { background: '#111', padding: '5px 12px', borderRadius: '15px', fontSize: '0.7rem', border: '1px solid #222', display: 'flex', alignItems: 'center', gap: '8px' };
const dot = { width: '6px', height: '6px', borderRadius: '50%', background: '#00FF00' };
const statCard = { background: '#0a0a0a', padding: '15px', borderRadius: '10px', border: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' };
const logBox = { background: '#050505', border: '1px solid #1a1a1a', borderRadius: '10px', flex: 1 };
const panelHeader = { background: '#0a0a0a', padding: '10px 15px', fontSize: '0.7rem', color: '#FFD700', fontWeight: 'bold', borderBottom: '1px solid #1a1a1a' };
const goldBtn = { background: 'transparent', color: '#FF4444', border: '1px solid #FF4444', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

export default AdminDashboard;
