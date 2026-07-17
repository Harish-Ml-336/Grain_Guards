import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertTriangle, XCircle, Shield, Bell, Thermometer, Droplets } from 'lucide-react';
import './StatsCards.css';

const API = 'http://localhost:5000/api';

const cardConfig = [
  { key: 'totalBins', label: 'Total Storage Bins', sub: 'All locations', icon: Database, color: '#1976D2', bg: '#E3F2FD' },
  { key: 'healthyBins', label: 'Healthy Bins', badge: '+1', icon: CheckCircle, color: '#2E7D32', bg: '#E8F5E9' },
  { key: 'warningBins', label: 'Warning Bins', icon: AlertTriangle, color: '#F57C00', bg: '#FFF3E0' },
  { key: 'criticalBins', label: 'Critical Bins', badge: 'High', icon: XCircle, color: '#D32F2F', bg: '#FFEBEE' },
  { key: 'totalGrainStored', label: 'Total Grain Stored', icon: Shield, color: '#00897B', bg: '#E0F2F1', format: (v) => `${(v / 1000).toFixed(1)}t`, sub2: (v) => `${v.toLocaleString()} kg` },
  { key: 'activeAlerts', label: 'Active Alerts', badge: (v) => `${v} new`, icon: Bell, color: '#7B1FA2', bg: '#F3E5F5' },
  { key: 'avgTemperature', label: "Today's Avg Temp", icon: Thermometer, color: '#E65100', bg: '#FFF3E0', format: (v) => `${v}°C`, sub: 'Across all bins' },
  { key: 'avgHumidity', label: "Today's Avg Humidity", icon: Droplets, color: '#1565C0', bg: '#E3F2FD', format: (v) => `${v}%`, sub: 'Across all bins' },
];

export default function StatsCards() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API}/dashboard/stats`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="stats-grid">
        {cardConfig.map((_, i) => (
          <div key={i} className="stat-card skeleton">
            <div className="skeleton-icon"></div>
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-grid">
      {cardConfig.map((card, i) => {
        const Icon = card.icon;
        const value = stats[card.key];
        const displayValue = card.format ? card.format(value) : value;
        const badge = typeof card.badge === 'function' ? card.badge(value) : card.badge;
        const subtitle = card.sub2 ? card.sub2(value) : card.sub;

        return (
          <div key={card.key} className="stat-card" style={{ animationDelay: `${i * 0.06}s` }}>
            {badge && <span className="stat-badge" style={{ background: card.bg, color: card.color }}>{badge}</span>}
            <div className="stat-icon" style={{ background: card.bg }}>
              <Icon size={22} color={card.color} />
            </div>
            <span className="stat-label">{card.label}</span>
            <span className="stat-value">{displayValue}</span>
            {subtitle && <span className="stat-sub">{subtitle}</span>}
          </div>
        );
      })}
    </div>
  );
}
