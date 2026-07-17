import React, { useState, useEffect } from 'react';
import './RecentActivity.css';

const API = 'http://localhost:5000/api';

const dotColors = { critical: '#D32F2F', warning: '#F57C00', info: '#1976D2' };
const textColors = { critical: '#D32F2F', warning: '#F57C00', info: 'inherit' };

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch(`${API}/activity`)
      .then(r => r.json())
      .then(setActivities)
      .catch(() => {});
  }, []);

  const formatTime = (ts) => {
    const d = new Date(ts);
    const h = d.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 || 12;
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${hr}:${min} ${ampm}`;
  };

  return (
    <div className="recent-activity-card">
      <h3 className="ra-title">Recent Activity</h3>
      <div className="ra-list">
        {activities.map((a, i) => (
          <div key={a.id || i} className="ra-item" style={{ animationDelay: `${i * 0.05}s` }}>
            <span className="ra-dot" style={{ background: dotColors[a.severity] || dotColors.info }}></span>
            <div className="ra-content">
              <span className="ra-action" style={{ color: textColors[a.severity] || 'inherit' }}>{a.action}</span>
              <span className="ra-time">{formatTime(a.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
