import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BinMonitoring from './pages/BinMonitoring.jsx';
import AlertCenter from './pages/AlertCenter.jsx';
import Statistics from './pages/Statistics.jsx';
import GrainMarketplace from './pages/GrainMarketplace.jsx';
import SeedMarketplace from './pages/SeedMarketplace.jsx';
import GovtProcurement from './pages/GovtProcurement.jsx';
import GovtSchemes from './pages/GovtSchemes.jsx';
import Warehouse from './pages/Warehouse.jsx';
import Reports from './pages/Reports.jsx';
import Community from './pages/Community.jsx';
import FertilizerMarketplace from './pages/FertilizerMarketplace.jsx';
import BinDetails from './pages/BinDetails.jsx';
import DeviceManagement from './pages/DeviceManagement.jsx';
import UserManagement from './pages/UserManagement.jsx';
import Settings from './pages/Settings.jsx';
import Checkout from './pages/Checkout.jsx';
import Cart from './pages/Cart.jsx';
import { CartProvider } from './context/CartContext.jsx';
import AnimatedBackground from './components/AnimatedBackground.jsx';
import './App.css';

const pageMap = {
  '/dashboard': 'Dashboard Overview',
  '/bin-monitoring': 'Bin Monitoring',
  '/statistics': 'Statistics & Analytics',
  '/alert-center': 'Alert Center',
  '/grain-marketplace': 'Grain Marketplace',
  '/seed-marketplace': 'Seed Marketplace',
  '/fertilizer-marketplace': 'Fertilizer Marketplace',
  '/community': 'Farmer Community',
  '/govt-procurement': 'Govt. Procurement',
  '/govt-schemes': 'Govt. Schemes',
  '/warehouse': 'Warehouse Storage Allocation',
  '/reports': 'Reports & Exports',
  '/device-management': 'IoT Device Management',
  '/user-management': 'User Management & Roles',
  '/settings': 'System Settings',
  '/checkout': 'Secure Checkout',
  '/cart': 'Shopping Cart',
};

function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activePage = location.pathname;

  return (
    <div className={`app-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <AnimatedBackground />
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activePage={activePage}
        onNavigate={(path) => navigate(path)}
      />
      <div className="main-area">
        <TopBar title={pageMap[activePage] || 'Dashboard Overview'} />
        <main className="main-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bin-monitoring" element={<BinMonitoring />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/alert-center" element={<AlertCenter />} />
            <Route path="/grain-marketplace" element={<GrainMarketplace />} />
            <Route path="/seed-marketplace" element={<SeedMarketplace />} />
            <Route path="/fertilizer-marketplace" element={<FertilizerMarketplace />} />
            <Route path="/community" element={<Community />} />
            <Route path="/bins/:id" element={<BinDetails />} />
            <Route path="/govt-procurement" element={<GovtProcurement />} />
            <Route path="/govt-schemes" element={<GovtSchemes />} />
            <Route path="/warehouse" element={<Warehouse />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/device-management" element={<DeviceManagement />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
