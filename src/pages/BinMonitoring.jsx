import React, { useState, useEffect } from 'react';
import BinCard from '../components/BinCard.jsx';
import { Search, Filter } from 'lucide-react';
import './BinMonitoring.css';

const API = 'http://localhost:5000/api';

export default function BinMonitoring() {
  const [bins, setBins] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API}/bins`).then(r => r.json()).then(setBins).catch(() => {});
  }, []);

  const filtered = bins.filter(b => {
    const matchFilter = filter === 'all' || b.status === filter;
    const matchSearch = !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.grain_type.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: bins.length,
    normal: bins.filter(b => b.status === 'normal').length,
    warning: bins.filter(b => b.status === 'warning').length,
    critical: bins.filter(b => b.status === 'critical').length,
  };

  return (
    <div className="bin-monitoring-page">
      <div className="bm-toolbar">
        <div className="bm-filters">
          {['all', 'normal', 'warning', 'critical'].map(f => (
            <button
              key={f}
              className={`bm-filter-btn ${filter === f ? `active-${f}` : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="filter-count">{counts[f]}</span>
            </button>
          ))}
        </div>
        <div className="bm-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search bins or grain type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bm-grid">
        {filtered.map((bin, i) => (
          <div key={bin.id} style={{ animationDelay: `${i * 0.08}s` }} className="bm-grid-item">
            <BinCard bin={bin} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bm-empty">
            <Filter size={48} />
            <p>No bins match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
