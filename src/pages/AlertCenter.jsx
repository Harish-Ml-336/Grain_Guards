import React, { useState, useEffect } from 'react';
import { AlertTriangle, XCircle, Info, CheckCircle, Bell, Clock, Eye } from 'lucide-react';
import './AlertCenter.css';

const API = 'http://localhost:5000/api';

const severityIcons = {
  critical: { icon: XCircle, color: '#D32F2F', bg: '#FFEBEE' },
  warning: { icon: AlertTriangle, color: '#F57C00', bg: '#FFF3E0' },
  info: { icon: Info, color: '#1976D2', bg: '#E3F2FD' },
};

export default function AlertCenter() {
  const [alerts, setAlerts] = useState([]);
  const [counts, setCounts] = useState({});
  const [filter, setFilter] = useState('all');

  const fetchAlerts = () => {
    const url = filter === 'all' ? `${API}/alerts` : `${API}/alerts?severity=${filter}`;
    fetch(url).then(r => r.json()).then(setAlerts).catch(() => {});
  };

  const fetchCounts = () => {
    fetch(`${API}/alerts/count`).then(r => r.json()).then(setCounts).catch(() => {});
  };

  useEffect(() => { fetchAlerts(); fetchCounts(); }, [filter]);

  const markRead = async (id) => {
    await fetch(`${API}/alerts/${id}/read`, { method: 'PUT' });
    fetchAlerts();
    fetchCounts();
  };

  const markAllRead = async () => {
    await fetch(`${API}/alerts/read-all`, { method: 'PUT' });
    fetchAlerts();
    fetchCounts();
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    const h = d.getHours() % 12 || 12;
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${min} ${ampm}`;
  };

  return (
    <div className="alert-center-page">
      <div className="ac-stats">
        <div className="ac-stat-card">
          <Bell size={20} color="#1976D2" />
          <div><span className="ac-stat-val">{counts.total || 0}</span><span className="ac-stat-label">Total</span></div>
        </div>
        <div className="ac-stat-card">
          <Eye size={20} color="#F57C00" />
          <div><span className="ac-stat-val">{counts.unread || 0}</span><span className="ac-stat-label">Unread</span></div>
        </div>
        <div className="ac-stat-card">
          <XCircle size={20} color="#D32F2F" />
          <div><span className="ac-stat-val">{counts.critical || 0}</span><span className="ac-stat-label">Critical</span></div>
        </div>
        <div className="ac-stat-card">
          <AlertTriangle size={20} color="#F57C00" />
          <div><span className="ac-stat-val">{counts.warning || 0}</span><span className="ac-stat-label">Warning</span></div>
        </div>
      </div>

      <div className="ac-toolbar">
        <div className="ac-filters">
          {['all', 'critical', 'warning', 'info'].map(f => (
            <button
              key={f}
              className={`ac-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button className="ac-mark-all" onClick={markAllRead}>
          <CheckCircle size={14} /> Mark All Read
        </button>
      </div>

      <div className="ac-list">
        {alerts.map((alert, i) => {
          const config = severityIcons[alert.severity] || severityIcons.info;
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={`ac-alert-card ${alert.is_read ? 'read' : 'unread'}`}
              style={{ animationDelay: `${i * 0.05}s`, borderLeftColor: config.color }}
              onClick={() => !alert.is_read && markRead(alert.id)}
            >
              <div className="ac-alert-icon" style={{ background: config.bg }}>
                <Icon size={20} color={config.color} />
              </div>
              <div className="ac-alert-content">
                <div className="ac-alert-header">
                  <span className="ac-alert-type">{alert.type}</span>
                  <span className={`ac-severity-badge severity-${alert.severity}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="ac-alert-message">{alert.message}</p>
                <div className="ac-alert-footer">
                  <span className="ac-alert-time"><Clock size={12} /> {formatTime(alert.created_at)}</span>
                  {alert.bin_id && <span className="ac-alert-bin">Bin {alert.bin_id}</span>}
                </div>
              </div>
              {!alert.is_read && <span className="ac-unread-dot"></span>}
            </div>
          );
        })}
        {alerts.length === 0 && (
          <div className="ac-empty">
            <CheckCircle size={48} color="#4CAF50" />
            <p>No alerts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
