import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // یہ آپ کی نئی تحقیق والی App فائل ہے
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
