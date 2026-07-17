import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Download, Settings } from 'lucide-react';
import './QuickActions.css';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: 'Add New Bin', icon: Plus, className: 'qa-green', action: () => alert("Add New Bin modal coming soon!") },
    { label: 'Refresh Data', icon: RefreshCw, className: 'qa-blue', action: () => window.location.reload() },
    { label: 'Download Report', icon: Download, className: 'qa-purple', action: () => navigate('/reports') },
    { label: 'Settings', icon: Settings, className: 'qa-gray', action: () => navigate('/settings') },
  ];

  return (
    <div className="quick-actions-card">
      <h3 className="qa-title">Quick Actions</h3>
      <div className="qa-grid">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <button key={i} className={`qa-btn ${a.className}`} onClick={a.action}>
              <Icon size={16} />
              <span>{a.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
