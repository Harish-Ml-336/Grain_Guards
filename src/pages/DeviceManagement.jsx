import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Wifi, Battery, RotateCw, Settings, Play } from 'lucide-react';
import './DeviceManagement.css';

const initialDevices = [
  { id: 'DEV-101', name: 'Temp Sensor Pro (Bin 1)', type: 'Sensor', status: 'Active', battery: 92, signal: 'Strong', lastActive: '2 min ago' },
  { id: 'DEV-102', name: 'Smart Fan Controller (Bin 2)', type: 'Actuator', status: 'Active', battery: 100, signal: 'Medium', lastActive: 'Just now' },
  { id: 'DEV-103', name: 'Moisture Probe B3', type: 'Sensor', status: 'Active', battery: 14, signal: 'Weak', lastActive: '12 min ago' },
  { id: 'DEV-104', name: 'UV Light Controller (Bin 2)', type: 'Actuator', status: 'Warning', battery: 85, signal: 'Strong', lastActive: '1 hour ago' },
  { id: 'DEV-105', name: 'Gateway Hub Central', type: 'Gateway', status: 'Active', battery: 100, signal: 'Strong', lastActive: 'Just now' },
];

export default function DeviceManagement() {
  const { t } = useTranslation();
  const [devices, setDevices] = useState(initialDevices);
  const [rebooting, setRebooting] = useState({});

  const handleReboot = (id) => {
    setRebooting(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setRebooting(prev => ({ ...prev, [id]: false }));
      alert(`Device ${id} has successfully rebooted and reconnected.`);
    }, 2000);
  };

  const getStatusClass = (status) => {
    if (status === 'Active') return 'status-active';
    if (status === 'Warning') return 'status-warn';
    return 'status-off';
  };

  const getBatteryColor = (lvl) => {
    if (lvl > 50) return '#2E7D32';
    if (lvl > 20) return '#F57C00';
    return '#D32F2F';
  };

  return (
    <div className="devices-page">
      <div className="devices-toolbar">
        <h3 className="devices-title">{t('device_management_title')}</h3>
        <button className="devices-action-btn" onClick={() => alert('Initiating scan for new devices...')}>
          {t('add_device')}
        </button>
      </div>

      <div className="devices-list-grid">
        {devices.map((dev, i) => (
          <div key={dev.id} className="device-item-card" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="dev-card-header">
              <div className="dev-title-block">
                <div className="dev-icon-wrapper">
                  <Cpu size={18} />
                </div>
                <div>
                  <strong>{dev.name}</strong>
                  <span className="dev-id-label">{dev.id} · {dev.type}</span>
                </div>
              </div>
              <span className={`status-dot-badge ${getStatusClass(dev.status)}`}>
                {dev.status}
              </span>
            </div>

            <div className="dev-card-metrics">
              <div className="dev-metric-item">
                <Wifi size={14} />
                <span>Signal: <strong>{dev.signal}</strong></span>
              </div>
              <div className="dev-metric-item">
                <Battery size={14} style={{ color: getBatteryColor(dev.battery) }} />
                <span>{t('battery')}: <strong>{dev.battery}%</strong></span>
              </div>
            </div>

            <div className="dev-card-footer">
              <span className="dev-last-active">{t('last_ping')}: {dev.lastActive}</span>
              <div className="dev-actions">
                <button
                  className={`dev-btn reboot-btn ${rebooting[dev.id] ? 'loading' : ''}`}
                  onClick={() => handleReboot(dev.id)}
                  disabled={rebooting[dev.id]}
                  title="Reboot Device"
                >
                  <RotateCw size={12} className={rebooting[dev.id] ? 'spin' : ''} />
                  {rebooting[dev.id] ? 'Rebooting' : t('restart')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
