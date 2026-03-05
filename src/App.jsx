import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Login from './pages/admin/Login';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import HeroCMS from './pages/admin/HeroCMS';
import ProductsCMS from './pages/admin/ProductsCMS';
import AboutUsCMS from './pages/admin/AboutUsCMS';
import SocialLinksCMS from './pages/admin/SocialLinksCMS';
import PromoCMS from './pages/admin/PromoCMS';
import PromoSectionCMS from './pages/admin/PromoSectionCMS';
import ActionButtonsCMS from './pages/admin/ActionButtonsCMS';
import ThemeSettingsCMS from './pages/admin/ThemeSettingsCMS';

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import './App.css';

import DashboardCMS from './pages/admin/DashboardCMS';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Landing />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardCMS />} />
          <Route path="hero" element={<HeroCMS />} />
          <Route path="products" element={<ProductsCMS />} />
          <Route path="about" element={<AboutUsCMS />} />
          <Route path="social" element={<SocialLinksCMS />} />
          <Route path="promo" element={<PromoCMS />} />
          <Route path="promo-section" element={<PromoSectionCMS />} />
          <Route path="actions" element={<ActionButtonsCMS />} />
          <Route path="theme" element={<ThemeSettingsCMS />} />
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
