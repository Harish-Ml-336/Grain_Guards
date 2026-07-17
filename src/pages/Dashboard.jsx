import React, { useState, useEffect } from 'react';
import StatsCards from '../components/StatsCards.jsx';
import WeatherWidget from '../components/WeatherWidget.jsx';
import TrendChart from '../components/TrendChart.jsx';
import StorageHealth from '../components/StorageHealth.jsx';
import QuickActions from '../components/QuickActions.jsx';
import RecentActivity from '../components/RecentActivity.jsx';
import AIRecommendations from '../components/AIRecommendations.jsx';
import BinMonitoringGrid from '../components/BinMonitoringGrid.jsx';
import './Dashboard.css';

const API = 'http://localhost:5000/api';

export default function Dashboard() {
  const [bins, setBins] = useState([]);
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    fetch(`${API}/bins`).then(r => r.json()).then(setBins).catch(() => {});
    fetch(`${API}/dashboard/trends`).then(r => r.json()).then(setTrends).catch(() => {});

    // SSE for live updates
    let eventSource;
    try {
      eventSource = new EventSource(`${API}/events`);
      eventSource.addEventListener('sensor-update', (e) => {
        const update = JSON.parse(e.data);
        setBins(prev => prev.map(b => b.id === update.binId ? { ...b, ...update } : b));
      });
    } catch (err) {
      // SSE not supported or failed
    }
    return () => eventSource?.close();
  }, []);

  return (
    <div className="dashboard">
      <section className="dash-section">
        <StatsCards />
      </section>

      <section className="dash-row-3">
        <div className="dash-weather">
          <WeatherWidget />
        </div>
        <div className="dash-trend">
          <TrendChart
            title="Temperature Trend"
            icon="🌡️"
            value={trends?.temperature?.current || '31.2'}
            unit="°C"
            data={trends?.temperature}
            color="#E65100"
          />
        </div>
        <div className="dash-trend">
          <TrendChart
            title="Humidity Trend"
            icon="💧"
            value={trends?.humidity?.current || '63.0'}
            unit="%"
            data={trends?.humidity}
            color="#1565C0"
          />
        </div>
      </section>

      <section className="dash-row-main">
        <div className="dash-left">
          <StorageHealth />
          
          <div className="card" style={{ padding: '20px', marginTop: '16px' }}>
            <p className="dash-section-title">📈 Live Market Prices (per kg)</p>
            <div>
              <div className="market-price-row">
                <span style={{ color: 'var(--text)' }}>Premium Basmati Rice</span>
                <span className="price-up">₹45.00 ▲</span>
              </div>
              <div className="market-price-row">
                <span style={{ color: 'var(--text)' }}>Sharbati Wheat</span>
                <span className="price-down">₹28.50 ▼</span>
              </div>
              <div className="market-price-row">
                <span style={{ color: 'var(--text)' }}>Organic Ragi</span>
                <span className="price-up">₹32.00 ▲</span>
              </div>
              <div className="market-price-row">
                <span style={{ color: 'var(--text)' }}>Pearl Millet (Bajra)</span>
                <span className="price-up">₹22.50 ▲</span>
              </div>
              <div className="market-price-row">
                <span style={{ color: 'var(--text)' }}>Toor Dal</span>
                <span className="price-down">₹95.00 ▼</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px', marginTop: '16px' }}>
            <p className="dash-section-title">🧾 Transaction & Payment History</p>
            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
              <div className="txn-row">
                <div className="txn-info">
                  <strong>TXN-99812</strong>
                  <span>100kg Basmati Rice · Paid via UPI</span>
                </div>
                <div className="txn-right">
                  <span className="txn-amount">₹4,500</span>
                  <span className="badge badge-success">Completed</span>
                </div>
              </div>
              <div className="txn-row">
                <div className="txn-info">
                  <strong>TXN-99813</strong>
                  <span>50kg CO-4 Maize · Credit Card</span>
                </div>
                <div className="txn-right">
                  <span className="txn-amount">₹1,850</span>
                  <span className="badge badge-warning">Processing</span>
                </div>
              </div>
              <div className="txn-row">
                <div className="txn-info">
                  <strong>TXN-99810</strong>
                  <span>200kg Sharbati Wheat · Net Banking</span>
                </div>
                <div className="txn-right">
                  <span className="txn-amount">₹5,700</span>
                  <span className="badge badge-success">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dash-right">
          <QuickActions />
          <RecentActivity />

          <div className="card" style={{ padding: '20px', marginTop: '0', background: 'linear-gradient(135deg, var(--primary-bg), #f0f4ff)', border: '1px solid var(--primary-lighter)' }}>
            <p className="dash-section-title" style={{ color: 'var(--primary)' }}>ℹ️ System Information</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', lineHeight: '1.6' }}>
              All sensory IoT devices are currently <strong>online</strong> and syncing data every 10 seconds.
              Automated ventilation in Block A is scheduled for maintenance next week.
            </p>
          </div>
        </div>
      </section>

      <section className="dash-section">
        <AIRecommendations />
      </section>

      <section className="dash-section">
        <BinMonitoringGrid bins={bins} />
      </section>
    </div>
  );
}
