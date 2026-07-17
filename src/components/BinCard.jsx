import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Thermometer, Droplets, Sprout, Bug, Fan, Zap, Clock } from 'lucide-react';
import './BinCard.css';

const statusColors = {
  normal: { border: '#4CAF50', bg: '#F1F8E9', badge: '#2E7D32', badgeBg: '#E8F5E9', dot: '#4CAF50' },
  warning: { border: '#FFB300', bg: '#FFFDE7', badge: '#F57C00', badgeBg: '#FFF3E0', dot: '#FFB300' },
  critical: { border: '#D32F2F', bg: '#FFF5F5', badge: '#D32F2F', badgeBg: '#FFEBEE', dot: '#D32F2F' },
};

export default function BinCard({ bin }) {
  const navigate = useNavigate();
  const colors = statusColors[bin.status] || statusColors.normal;
  const qtyPercent = Math.round((bin.current_qty_kg / bin.capacity_kg) * 100);

  const formatTime = () => {
    const d = new Date(bin.updated_at || Date.now());
    const h = d.getHours();
    const ampm = h >= 12 ? 'pm' : 'am';
    const hr = h % 12 || 12;
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${hr}:${min} ${ampm}`;
  };

  return (
    <div className="bin-card" style={{ borderLeftColor: colors.border, background: colors.bg }}>
      <div className="bin-card-header">
        <div className="bin-name-row">
          <span className="bin-dot" style={{ background: colors.dot }}></span>
          <h4 className="bin-name">{bin.name}</h4>
        </div>
        <span className="bin-status-badge" style={{ color: colors.badge, background: colors.badgeBg }}>
          {bin.status.charAt(0).toUpperCase() + bin.status.slice(1)}
        </span>
      </div>

      <span className="bin-subtitle">{bin.grain_type} · {bin.block}</span>

      <div className="bin-metric">
        <div className="bin-metric-header">
          <span>Health Score</span>
          <span className="bin-metric-value">{bin.health_score}%</span>
        </div>
        <div className="bin-bar-track">
          <div className="bin-bar-fill" style={{ '--progress-width': `${bin.health_score}%`, background: colors.border }}></div>
        </div>
      </div>

      <div className="bin-metric">
        <div className="bin-metric-header">
          <span>Current Quantity</span>
          <span className="bin-metric-value">{bin.current_qty_kg?.toLocaleString()} / {bin.capacity_kg?.toLocaleString()} kg ({qtyPercent}%)</span>
        </div>
        <div className="bin-bar-track">
          <div className="bin-bar-fill" style={{ '--progress-width': `${qtyPercent}%`, background: '#1976D2' }}></div>
        </div>
      </div>

      <div className="bin-sensors">
        <div className="bin-sensor">
          <Thermometer size={16} color="#E65100" />
          <span className="sensor-label">Temperature</span>
          <strong>{bin.temperature}°C</strong>
        </div>
        <div className="bin-sensor">
          <Droplets size={16} color="#1565C0" />
          <span className="sensor-label">Humidity</span>
          <strong>{bin.humidity}%</strong>
        </div>
        <div className="bin-sensor">
          <Sprout size={16} color="#2E7D32" />
          <span className="sensor-label">Moisture</span>
          <strong>{bin.moisture}%</strong>
        </div>
      </div>

      <div className="bin-devices">
        <span className={`bin-device ${bin.pest_detected ? 'active-danger' : ''}`}>
          <Bug size={13} /> Pest Detection: {bin.pest_detected ? 'Yes' : 'No'}
        </span>
        <span className={`bin-device ${bin.fan_on ? 'active-info' : ''}`}>
          <Fan size={13} /> Fan: {bin.fan_on ? 'ON' : 'OFF'}
        </span>
        <span className={`bin-device ${bin.uv_on ? 'active-warning' : ''}`}>
          <Zap size={13} /> UV: {bin.uv_on ? 'ON' : 'OFF'}
        </span>
      </div>

      <div className="bin-footer">
        <span className="bin-updated"><Clock size={12} /> Last Updated: {formatTime()}</span>
        <button className="bin-details-link" onClick={() => navigate(`/bins/${bin.id}`)}>View Details →</button>
      </div>
    </div>
  );
}
