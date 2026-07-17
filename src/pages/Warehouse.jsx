import React, { useState } from 'react';
import { Warehouse as WhIcon, Thermometer, Box, Calendar, CheckCircle } from 'lucide-react';
import './Warehouse.css';

const blocks = [
  { id: 'A', name: 'Cold Block A (Rice/Wheat)', temp: '14°C', humidity: '55%', capacity: 500, booked: 380, color: '#1E88E5' },
  { id: 'B', name: 'Dry Block B (Millet/Ragi)', temp: '22°C', humidity: '42%', capacity: 400, booked: 210, color: '#43A047' },
  { id: 'C', name: 'Silo Block C (Maize/Pulses)', temp: '18°C', humidity: '48%', capacity: 600, booked: 470, color: '#E53935' },
];

export default function Warehouse() {
  const [selectedBlock, setSelectedBlock] = useState('A');
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({ qty: '', startDate: '', endDate: '' });

  const activeBlock = blocks.find(b => b.id === selectedBlock);

  const handleBooking = (e) => {
    e.preventDefault();
    const newBooking = {
      ...formData,
      id: Date.now(),
      block: activeBlock.name,
      ref: `WH-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Confirmed'
    };
    setBookings([newBooking, ...bookings]);
    setFormData({ qty: '', startDate: '', endDate: '' });
  };

  return (
    <div className="warehouse-page">
      <div className="warehouse-layout">
        <div className="wh-left">
          <h3 className="wh-subtitle">Warehouse Storage Blocks</h3>
          <div className="wh-blocks">
            {blocks.map(b => {
              const pct = Math.round((b.booked / b.capacity) * 100);
              const isSel = selectedBlock === b.id;
              return (
                <div
                  key={b.id}
                  className={`wh-block-card ${isSel ? 'selected' : ''}`}
                  onClick={() => setSelectedBlock(b.id)}
                >
                  <div className="wh-block-header">
                    <div className="wh-block-title-row">
                      <WhIcon size={20} style={{ color: b.color }} />
                      <strong>Block {b.id}</strong>
                    </div>
                    <span className="wh-temp-badge"><Thermometer size={12} /> {b.temp}</span>
                  </div>
                  <span className="wh-block-name">{b.name}</span>
                  <div className="wh-block-capacity">
                    <div className="wh-cap-labels">
                      <span>Utilization</span>
                      <strong>{pct}% ({b.booked}/{b.capacity} Tons)</strong>
                    </div>
                    <div className="wh-cap-track">
                      <div className="wh-cap-fill" style={{ width: `${pct}%`, background: b.color }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="wh-right">
          <div className="wh-booking-box card-box">
            <h3 className="wh-subtitle">Book Storage Space</h3>
            <span className="wh-selected-indicator">Booking in: <strong>{activeBlock.name}</strong></span>
            <form onSubmit={handleBooking} className="wh-booking-form">
              <div className="form-group">
                <label>Storage Qty (Tons)</label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  value={formData.qty}
                  onChange={e => setFormData({ ...formData, qty: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="wh-book-btn">Confirm Storage Booking</button>
            </form>
          </div>
        </div>
      </div>

      <div className="wh-bookings-section card-box">
        <h3 className="wh-subtitle">Active Storage Bookings</h3>
        <div className="wh-bookings-table-wrapper">
          {bookings.length === 0 ? (
            <p className="no-bookings">No active bookings yet. Select a block and use the form above to book space.</p>
          ) : (
            <table className="wh-bookings-table">
              <thead>
                <tr>
                  <th>Booking Ref</th>
                  <th>Storage Block</th>
                  <th>Quantity</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.ref}</strong></td>
                    <td>{b.block}</td>
                    <td>{b.qty} Tons</td>
                    <td>{b.startDate}</td>
                    <td>{b.endDate}</td>
                    <td><span className="wh-status-badge"><CheckCircle size={12} /> {b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
