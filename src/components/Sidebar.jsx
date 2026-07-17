import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Container, BarChart3, Bell, ShoppingCart, Sprout,
  Building, FileText, Warehouse, ClipboardList, Cpu, Users, Settings,
  ChevronLeft, ChevronRight, Shield, FlaskConical
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/bin-monitoring', label: 'Bin Monitoring', icon: Container },
  { path: '/statistics', label: 'Statistics', icon: BarChart3 },
  { path: '/alert-center', label: 'Alert Center', icon: Bell, hasBadge: true },
  { divider: true },
  { path: '/grain-marketplace', label: 'Grain Marketplace', icon: ShoppingCart },
  { path: '/seed-marketplace', label: 'Seed Marketplace', icon: Sprout },
  { path: '/fertilizer-marketplace', label: 'Fertilizers & Subsidies', icon: FlaskConical },
  { path: '/community', label: 'Farmer Community', icon: Users },
  { path: '/govt-procurement', label: 'Govt. Procurement', icon: Building },
  { path: '/govt-schemes', label: 'Govt. Schemes', icon: FileText },
  { divider: true },
  { path: '/warehouse', label: 'Warehouse', icon: Warehouse },
  { path: '/reports', label: 'Reports', icon: ClipboardList },
  { path: '/device-management', label: 'Device Management', icon: Cpu },
  { path: '/user-management', label: 'User Management', icon: Users },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const API = 'http://localhost:5000/api';

export default function Sidebar({ collapsed, onToggle, activePage, onNavigate }) {
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    fetch(`${API}/alerts/count`)
      .then(r => r.json())
      .then(d => setAlertCount(d.unread || 0))
      .catch(() => {});
  }, []);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-icon">
          <Shield size={28} strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="logo-text">
            <h1>Grain Guards</h1>
            <span>Smart Storage Monitor</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.divider) return <div key={i} className="nav-divider" />;
          const Icon = item.icon;
          const isActive = activePage === item.path;
          return (
            <button
              key={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.path)}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
              {item.hasBadge && alertCount > 0 && (
                <span className="nav-badge">{alertCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      <button className="sidebar-toggle" onClick={onToggle}>
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
