import React from 'react';
import BinCard from './BinCard.jsx';
import './BinMonitoringGrid.css';

export default function BinMonitoringGrid({ bins, showHeader = true }) {
  return (
    <div className="bin-grid-section">
      {showHeader && (
        <div className="bin-grid-header">
          <h3 className="bin-grid-title">Bin Monitoring</h3>
          <a href="/bin-monitoring" className="bin-grid-link">View All →</a>
        </div>
      )}
      <div className="bin-grid">
        {bins?.map((bin, i) => (
          <div key={bin.id || i} style={{ animationDelay: `${i * 0.08}s` }} className="bin-grid-item">
            <BinCard bin={bin} />
          </div>
        ))}
      </div>
    </div>
  );
}
