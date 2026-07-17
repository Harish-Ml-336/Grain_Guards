import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Filler, Tooltip, Legend
} from 'chart.js';
import './Statistics.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

const API = 'http://localhost:5000/api';

const binColors = ['#4CAF50', '#D32F2F', '#FFB300', '#1976D2', '#9C27B0', '#00897B'];

export default function Statistics() {
  const [bins, setBins] = useState([]);
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    fetch(`${API}/bins`).then(r => r.json()).then(setBins).catch(() => {});
    fetch(`${API}/dashboard/trends`).then(r => r.json()).then(setTrends).catch(() => {});
  }, []);

  const tempChartData = {
    labels: trends?.temperature?.labels || [],
    datasets: bins.map((bin, i) => ({
      label: `${bin.name} (${bin.grain_type})`,
      data: trends?.temperature?.data?.map(v => v + (Math.random() - 0.5) * (bin.temperature - 30)) || [],
      borderColor: binColors[i],
      backgroundColor: binColors[i] + '20',
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 1,
      fill: false,
    })),
  };

  const humidityChartData = {
    labels: trends?.humidity?.labels || [],
    datasets: bins.map((bin, i) => ({
      label: `${bin.name} (${bin.grain_type})`,
      data: trends?.humidity?.data?.map(v => v + (Math.random() - 0.5) * (bin.humidity - 60) * 0.5) || [],
      borderColor: binColors[i],
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 1,
      fill: false,
    })),
  };

  const capacityData = {
    labels: bins.map(b => b.name),
    datasets: [
      {
        label: 'Used (kg)',
        data: bins.map(b => b.current_qty_kg),
        backgroundColor: '#4CAF50cc',
        borderRadius: 6,
      },
      {
        label: 'Available (kg)',
        data: bins.map(b => b.capacity_kg - b.current_qty_kg),
        backgroundColor: '#E0E0E0',
        borderRadius: 6,
      },
    ],
  };

  const statusCounts = {
    Normal: bins.filter(b => b.status === 'normal').length,
    Warning: bins.filter(b => b.status === 'warning').length,
    Critical: bins.filter(b => b.status === 'critical').length,
  };

  const doughnutData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ['#4CAF50', '#FFB300', '#D32F2F'],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16, font: { size: 11 } } },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, maxTicksLimit: 12 } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 } } },
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16, font: { size: 11 } } },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, grid: { color: 'rgba(0,0,0,0.04)' } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16, font: { size: 12 } } },
    },
    cutout: '65%',
  };

  return (
    <div className="statistics-page">
      <div className="stats-chart-grid">
        <div className="stats-chart-card wide">
          <h3>Temperature Trends (24h)</h3>
          <div className="chart-container tall">
            <Line data={tempChartData} options={lineOptions} />
          </div>
        </div>

        <div className="stats-chart-card wide">
          <h3>Humidity Trends (24h)</h3>
          <div className="chart-container tall">
            <Line data={humidityChartData} options={lineOptions} />
          </div>
        </div>

        <div className="stats-chart-card">
          <h3>Storage Capacity Utilization</h3>
          <div className="chart-container tall">
            <Bar data={capacityData} options={barOptions} />
          </div>
        </div>

        <div className="stats-chart-card">
          <h3>Bin Status Distribution</h3>
          <div className="chart-container doughnut-container">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="doughnut-center-label">
            <span className="doughnut-total">{bins.length}</span>
            <span className="doughnut-sub">Total Bins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
