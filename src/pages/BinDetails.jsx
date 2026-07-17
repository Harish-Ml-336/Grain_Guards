import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Thermometer, Droplets, Sprout, Bug, Fan, Zap, ArrowLeft, RefreshCw, Activity, Clock } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import './BinDetails.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const API = 'http://localhost:5000/api';

const statusColors = {
  normal: { color: '#10B981', label: 'Normal' },
  warning: { color: '#FFB300', label: 'Warning' },
  critical: { color: '#FF2A55', label: 'Critical' },
};

export default function BinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bin, setBin] = useState(null);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState({});

  const fetchData = async () => {
    try {
      const [binRes, readingsRes] = await Promise.all([
        fetch(`${API}/bins/${id}`),
        fetch(`${API}/sensors/${id}/readings`)
      ]);
      const binData = await binRes.json();
      setBin(binData);
      try { const r = await readingsRes.json(); setReadings(Array.isArray(r) ? r : []); } catch { setReadings([]); }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); const interval = setInterval(fetchData, 10000); return () => clearInterval(interval); }, [id]);

  const toggleControl = async (field, currentValue) => {
    setToggling(t => ({ ...t, [field]: true }));
    try {
      const res = await fetch(`${API}/sensors/${id}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: currentValue ? 0 : 1 })
      });
      const updated = await res.json();
      setBin(prev => ({ ...prev, ...updated }));
    } catch (e) { console.error(e); }
    setToggling(t => ({ ...t, [field]: false }));
  };

  if (loading) return <div className="bin-details-page"><div className="bd-loading">Loading bin data...</div></div>;
  if (!bin) return <div className="bin-details-page"><div className="bd-loading">Bin not found.</div></div>;

  const sc = statusColors[bin.status] || statusColors.normal;
  const qtyPercent = Math.round((bin.current_qty_kg / bin.capacity_kg) * 100);
  const last24 = readings.slice(0, 24).reverse();

  const chartData = {
    labels: last24.map((r, i) => { const d = new Date(r.recorded_at); return `${d.getHours()}:${d.getMinutes().toString().padStart(2,'0')}`; }),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: last24.map(r => r.temperature),
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255,107,107,0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Humidity (%)',
        data: last24.map(r => r.humidity),
        borderColor: '#00E5FF',
        backgroundColor: 'rgba(0,229,255,0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#94A3B8' } } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8', maxTicksLimit: 12 } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8' } },
    }
  };

  return (
    <div className="bin-details-page">
      <button className="bd-back" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back to Monitoring</button>

      <div className="bd-header">
        <div>
          <h2 className="bd-title">{bin.name}</h2>
          <span className="bd-subtitle">{bin.grain_type} · {bin.block}</span>
        </div>
        <span className="bd-status" style={{ color: sc.color, borderColor: sc.color }}>{sc.label}</span>
      </div>

      {/* Sensor Metrics */}
      <div className="bd-metrics">
        <div className="bd-metric-card">
          <div className="bd-metric-icon" style={{ background: 'rgba(255,107,107,0.15)' }}><Thermometer size={22} color="#FF6B6B" /></div>
          <div className="bd-metric-info">
            <span className="bd-metric-label">Temperature</span>
            <strong className="bd-metric-value">{bin.temperature}°C</strong>
          </div>
        </div>
        <div className="bd-metric-card">
          <div className="bd-metric-icon" style={{ background: 'rgba(0,229,255,0.15)' }}><Droplets size={22} color="#00E5FF" /></div>
          <div className="bd-metric-info">
            <span className="bd-metric-label">Humidity</span>
            <strong className="bd-metric-value">{bin.humidity}%</strong>
          </div>
        </div>
        <div className="bd-metric-card">
          <div className="bd-metric-icon" style={{ background: 'rgba(16,185,129,0.15)' }}><Sprout size={22} color="#10B981" /></div>
          <div className="bd-metric-info">
            <span className="bd-metric-label">Moisture</span>
            <strong className="bd-metric-value">{bin.moisture}%</strong>
          </div>
        </div>
        <div className="bd-metric-card">
          <div className="bd-metric-icon" style={{ background: bin.pest_detected ? 'rgba(255,42,85,0.15)' : 'rgba(16,185,129,0.15)' }}>
            <Bug size={22} color={bin.pest_detected ? '#FF2A55' : '#10B981'} />
          </div>
          <div className="bd-metric-info">
            <span className="bd-metric-label">Pest Detection</span>
            <strong className="bd-metric-value" style={{ color: bin.pest_detected ? '#FF2A55' : '#10B981' }}>{bin.pest_detected ? 'DETECTED' : 'Clear'}</strong>
          </div>
        </div>
      </div>

      {/* Health & Quantity */}
      <div className="bd-bars-row">
        <div className="bd-bar-card">
          <div className="bd-bar-header"><span>Health Score</span><strong style={{ color: sc.color }}>{bin.health_score}%</strong></div>
          <div className="bd-bar-track"><div className="bd-bar-fill" style={{ width: `${bin.health_score}%`, background: sc.color }}></div></div>
        </div>
        <div className="bd-bar-card">
          <div className="bd-bar-header"><span>Current Quantity</span><strong>{bin.current_qty_kg?.toLocaleString()} / {bin.capacity_kg?.toLocaleString()} kg</strong></div>
          <div className="bd-bar-track"><div className="bd-bar-fill" style={{ width: `${qtyPercent}%`, background: '#3B82F6' }}></div></div>
        </div>
      </div>

      {/* Controls */}
      <div className="bd-controls">
        <h3 className="bd-section-title"><Activity size={16} /> Manual Device Control</h3>
        <div className="bd-control-row">
          <div className="bd-control-card">
            <div className="bd-control-info">
              <Fan size={24} className={bin.fan_on ? 'spinning' : ''} color={bin.fan_on ? '#00E5FF' : '#94A3B8'} />
              <div>
                <strong>Ventilation Fan</strong>
                <span className="bd-control-sub">Auto-activates when temp &gt; 35°C</span>
              </div>
            </div>
            <button className={`bd-toggle ${bin.fan_on ? 'on' : 'off'}`} onClick={() => toggleControl('fan_on', bin.fan_on)} disabled={toggling.fan_on}>
              <span className="bd-toggle-dot"></span>
              <span className="bd-toggle-label">{bin.fan_on ? 'ON' : 'OFF'}</span>
            </button>
          </div>
          <div className="bd-control-card">
            <div className="bd-control-info">
              <Zap size={24} color={bin.uv_on ? '#FFB300' : '#94A3B8'} />
              <div>
                <strong>UV Light Treatment</strong>
                <span className="bd-control-sub">Auto-activates when pests detected</span>
              </div>
            </div>
            <button className={`bd-toggle ${bin.uv_on ? 'on' : 'off'}`} onClick={() => toggleControl('uv_on', bin.uv_on)} disabled={toggling.uv_on}>
              <span className="bd-toggle-dot"></span>
              <span className="bd-toggle-label">{bin.uv_on ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      {last24.length > 0 && (
        <div className="bd-chart-card">
          <h3 className="bd-section-title"><RefreshCw size={16} /> Sensor Readings (Last 24 Hours)</h3>
          <div className="bd-chart-wrapper">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
