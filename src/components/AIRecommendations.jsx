import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, Wind, Thermometer, CheckCircle, TrendingUp } from 'lucide-react';
import './AIRecommendations.css';

const API = 'http://localhost:5000/api';

const severityConfig = {
  critical: { border: '#D32F2F', bg: '#FFEBEE', icon: AlertTriangle, iconColor: '#D32F2F' },
  warning: { border: '#F57C00', bg: '#FFF8E1', icon: Wind, iconColor: '#F57C00' },
  safe: { border: '#2E7D32', bg: '#E8F5E9', icon: CheckCircle, iconColor: '#2E7D32' },
  info: { border: '#1976D2', bg: '#E3F2FD', icon: TrendingUp, iconColor: '#1976D2' },
};

export default function AIRecommendations() {
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    fetch(`${API}/recommendations`)
      .then(r => r.json())
      .then(setRecs)
      .catch(() => {});
  }, []);

  return (
    <div className="ai-rec-card">
      <div className="ai-rec-header">
        <div className="ai-rec-title-group">
          <div className="ai-brain-icon">
            <Brain size={22} />
          </div>
          <div>
            <h3 className="ai-rec-title">AI Recommendations</h3>
            <span className="ai-rec-sub">AI-powered analysis</span>
          </div>
        </div>
        <span className="live-badge">
          <span className="live-dot"></span>
          Live
        </span>
      </div>
      <div className="ai-rec-list">
        {recs.map((rec, i) => {
          const config = severityConfig[rec.severity] || severityConfig.info;
          const Icon = config.icon;
          return (
            <div
              key={rec.id || i}
              className="ai-rec-item"
              style={{
                borderLeftColor: config.border,
                background: config.bg,
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <div className="ai-rec-item-header">
                <Icon size={18} color={config.iconColor} />
                <strong>{rec.title}</strong>
              </div>
              <p className="ai-rec-desc">{rec.description}</p>
              <span className="ai-rec-bins">
                {rec.bin_ids === 'all' ? 'All Bins' : `Bin ${rec.bin_ids}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
