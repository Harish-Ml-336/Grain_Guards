import React, { useState, useEffect } from 'react';
import './StorageHealth.css';

const API = 'http://localhost:5000/api';

function getBarColor(score) {
  if (score >= 80) return '#4CAF50';
  if (score >= 60) return '#FFB300';
  if (score >= 40) return '#FF9800';
  return '#D32F2F';
}

export default function StorageHealth() {
  const [bins, setBins] = useState([]);

  useEffect(() => {
    fetch(`${API}/dashboard/storage-health`)
      .then(r => r.json())
      .then(setBins)
      .catch(() => {});
  }, []);

  return (
    <div className="storage-health-card">
      <h3 className="sh-title">Storage Health</h3>
      <div className="sh-bars">
        {bins.map((bin, i) => (
          <div key={bin.binId || i} className="sh-row" style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="sh-label">Bin {bin.binId || i + 1} – {bin.grainType}</span>
            <div className="sh-bar-track">
              <div
                className="sh-bar-fill"
                style={{
                  '--progress-width': `${bin.healthScore}%`,
                  background: getBarColor(bin.healthScore),
                }}
              ></div>
            </div>
            <span className="sh-percent">{bin.healthScore}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
