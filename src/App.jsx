import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/admin/Login';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import HeroCMS from './pages/admin/HeroCMS';
import ProductsCMS from './pages/admin/ProductsCMS';
import AboutUsCMS from './pages/admin/AboutUsCMS';
import SocialLinksCMS from './pages/admin/SocialLinksCMS';

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import './App.css';

// Minimal Dashboard Placeholder for now
const Dashboard = () => <div className="cms-page"><h3>Welcome to Zensei Admin</h3><p>Select a module from the left to start editing content.</p></div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Landing />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="hero" element={<HeroCMS />} />
          <Route path="products" element={<ProductsCMS />} />
          <Route path="about" element={<AboutUsCMS />} />
          <Route path="social" element={<SocialLinksCMS />} />
        </Route>

        {/* Placeholder for wildcard/404 */}
        <Route path="*" element={<Landing />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </Router>
  );
}

export default App;
