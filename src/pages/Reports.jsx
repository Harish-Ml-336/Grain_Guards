import React, { useState } from 'react';
import { FileText, Download, Play, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import './Reports.css';

const initialReports = [
  { id: 1, name: 'Monthly Quality Analysis (June 2026)', type: 'PDF', size: '2.4 MB', date: '2026-06-30' },
  { id: 2, name: 'Temperature & Humidity Logs (Q2)', type: 'CSV', size: '4.8 MB', date: '2026-06-15' },
  { id: 3, name: 'Inventory Valuation Report', type: 'PDF', size: '1.2 MB', date: '2026-06-01' },
];

export default function Reports() {
  const [reports, setReports] = useState(initialReports);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({ type: 'quality', format: 'PDF' });

  const handleGenerate = (e) => {
    e.preventDefault();
    setGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newReport = {
              id: Date.now(),
              name: `${formData.type === 'quality' ? 'Quality Analysis' : 'Sensor Log'} (${new Date().toLocaleDateString()})`,
              type: formData.format,
              size: formData.format === 'PDF' ? '1.5 MB' : '3.2 MB',
              date: new Date().toISOString().split('T')[0]
            };
            setReports([newReport, ...reports]);
            setGenerating(false);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownload = (report) => {
    let blob;
    let filename;

    if (report.type === 'CSV') {
      const csvContent = [
        'Bin ID,Grain Type,Block,Temperature (°C),Humidity (%),Moisture (%),Health Score,Status',
        '1,Rice,Block A,28,58,12,92,Normal',
        '2,Wheat,Block A,36,72,16,43,Critical',
        '3,Ragi,Block B,30,64,13,78,Warning',
        '4,Maize,Block B,31,61,13.5,85,Normal',
        '5,Millets,Block C,33,68,14.8,65,Warning',
        '6,Pulses,Block C,29,55,11,95,Normal',
      ].join('\n');
      blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      filename = `${report.name.replace(/ /g, '_')}.csv`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const doc = new jsPDF();
      doc.setFont("helvetica");

      // Header Banner
      doc.setFillColor(20, 25, 35);
      doc.rect(0, 0, 210, 40, "F");

      // Title
      doc.setFontSize(22);
      doc.setTextColor(0, 229, 255); // Cyan color matching dashboard
      doc.text("GRAIN GUARDS", 14, 25);

      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text("SMART STORAGE MONITOR", 14, 32);

      // Report Header Info
      doc.setFontSize(14);
      doc.setTextColor(26, 26, 46);
      doc.setFont("helvetica", "bold");
      doc.text(`Report: ${report.name}`, 14, 55);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 62);
      doc.text("System: Active & Monitoring", 14, 67);

      // Draw Separator line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(14, 73, 196, 73);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(26, 26, 46);
      doc.text("Bin Status Summary", 14, 85);

      let y = 97;
      const binData = [
        { id: 1, name: 'Bin 1 - Rice', block: 'Block A', temp: '28°C', hum: '58%', moist: '12%', health: '92%', status: 'Normal' },
        { id: 2, name: 'Bin 2 - Wheat', block: 'Block A', temp: '36°C', hum: '72%', moist: '16%', health: '43%', status: 'CRITICAL' },
        { id: 3, name: 'Bin 3 - Ragi', block: 'Block B', temp: '30°C', hum: '64%', moist: '13%', health: '78%', status: 'Warning' },
        { id: 4, name: 'Bin 4 - Maize', block: 'Block B', temp: '31°C', hum: '61%', moist: '13.5%', health: '85%', status: 'Normal' },
        { id: 5, name: 'Bin 5 - Millets', block: 'Block C', temp: '33°C', hum: '68%', moist: '14.8%', health: '65%', status: 'Warning' },
        { id: 6, name: 'Bin 6 - Pulses', block: 'Block C', temp: '29°C', hum: '55%', moist: '11%', health: '95%', status: 'Normal' },
      ];

      binData.forEach(bin => {
        // Small colored block indicator for status
        if (bin.status === 'CRITICAL') {
          doc.setFillColor(255, 42, 85); // Red
        } else if (bin.status === 'Warning') {
          doc.setFillColor(255, 179, 0); // Yellow/Orange
        } else {
          doc.setFillColor(16, 185, 129); // Green
        }
        doc.rect(14, y - 4, 3, 3, "F");

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(26, 26, 46);
        doc.text(`${bin.name} (${bin.block})  -  Health: ${bin.health}  -  Status: ${bin.status}`, 20, y);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(`Temperature: ${bin.temp}  |  Humidity: ${bin.hum}  |  Moisture: ${bin.moist}`, 20, y + 6);
        y += 18;
      });

      y += 5;
      doc.setDrawColor(226, 232, 240);
      doc.line(14, y, 196, y);
      y += 10;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(26, 26, 46);
      doc.text("AI Recommendations & Maintenance Actions", 14, y);
      
      y += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text("1. Bin 2 (Wheat): Activate UV treatment and schedule fumigation within 24 hours.", 14, y);
      doc.text("2. Bin 3 (Ragi): Turn on fan to prevent mold formation.", 14, y + 6);
      doc.text("3. Bin 5 (Millets): Monitor temperature closely, activate cooling if > 34°C.", 14, y + 12);

      doc.save(`${report.name.replace(/ /g, '_')}_report.pdf`);
    }
  };

  return (
    <div className="reports-page">
      <div className="reports-layout">
        <div className="reports-left card-box">
          <h3 className="reports-title">Generate Custom Report</h3>
          <form onSubmit={handleGenerate} className="reports-form">
            <div className="form-group">
              <label>Report Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="quality">Quality Analysis Report</option>
                <option value="sensor">Sensor readings Log</option>
                <option value="alerts">Alert history Audit</option>
              </select>
            </div>
            <div className="form-group">
              <label>File Format</label>
              <div className="format-options">
                {['PDF', 'CSV'].map(fmt => (
                  <button
                    key={fmt}
                    type="button"
                    className={`format-btn ${formData.format === fmt ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, format: fmt })}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="generate-btn" disabled={generating}>
              <Play size={14} /> {generating ? 'Generating...' : 'Start Report Generation'}
            </button>
          </form>

          {generating && (
            <div className="generation-progress-box">
              <div className="progress-labels">
                <span>Generating files...</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
        </div>

        <div className="reports-right card-box">
          <h3 className="reports-title">Available Downloads</h3>
          <div className="reports-list-items">
            {reports.map((r, i) => (
              <div key={r.id} className="report-item-row" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="report-item-info">
                  <div className="report-icon-box">
                    <FileText size={18} />
                  </div>
                  <div className="report-text-details">
                    <strong>{r.name}</strong>
                    <span>{r.date} · {r.size} · {r.type}</span>
                  </div>
                </div>
                <button
                  className="report-dl-btn"
                  onClick={() => handleDownload(r)}
                  title="Download File"
                >
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
