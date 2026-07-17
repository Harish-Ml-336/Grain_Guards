import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import './TrendChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function TrendChart({ title, icon, value, unit, data, color }) {
  const chartRef = useRef(null);

  const chartData = {
    labels: data?.labels || [],
    datasets: [{
      data: data?.data || [],
      borderColor: color,
      backgroundColor: (ctx) => {
        const chart = ctx.chart;
        const { ctx: c, chartArea } = chart;
        if (!chartArea) return color + '20';
        const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, color + '40');
        gradient.addColorStop(1, color + '05');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: color,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
  };

  return (
    <div className="trend-chart-card">
      <div className="trend-header">
        <span className="trend-icon">{icon}</span>
        <span className="trend-title">{title}</span>
      </div>
      <div className="trend-value">{value}{unit}</div>
      <div className="trend-chart-area">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
}
