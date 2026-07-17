import React, { useState } from 'react';
import { ShieldAlert, MapPin, Calendar, Clock, Check } from 'lucide-react';
import './GovtProcurement.css';

const mspRates = [
  { crop: 'Paddy (Common)', msp: 2183, increase: '+₹143' },
  { crop: 'Wheat', msp: 2275, increase: '+₹150' },
  { crop: 'Ragi', msp: 3846, increase: '+₹268' },
  { crop: 'Maize', msp: 2090, increase: '+₹128' },
];

const centers = [
  { name: 'Thanjavur Co-operative Center', location: 'Pillaiyarpatti, Thanjavur', distance: '2.5 km', slots: 12 },
  { name: 'Delta Agri Procurement Hub', location: 'Nanjikottai Road, Thanjavur', distance: '4.8 km', slots: 8 },
];

export default function GovtProcurement() {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({ center: centers[0].name, crop: mspRates[0].crop, date: '', qty: '' });

  const handleBooking = (e) => {
    e.preventDefault();
    const newBooking = {
      ...formData,
      id: Date.now(),
      status: 'Approved',
      ref: `GP-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setBookings([newBooking, ...bookings]);
    setFormData({ center: centers[0].name, crop: mspRates[0].crop, date: '', qty: '' });
  };

  return (
    <div className="procurement-page">
      <div className="procurement-grid">
        <div className="msp-section card-box">
          <h3 className="section-title">Government MSP Rates (2026-27)</h3>
          <div className="msp-list">
            {mspRates.map((item, i) => (
              <div key={i} className="msp-item">
                <span className="msp-crop">{item.crop}</span>
                <div className="msp-values">
                  <span className="msp-rate">₹{item.msp} <small>/ quintal</small></span>
                  <span className="msp-increase">{item.increase}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="booking-section card-box">
          <h3 className="section-title">Book Procurement Slot</h3>
          <form onSubmit={handleBooking} className="procurement-form">
            <div className="form-group">
              <label>Procurement Center</label>
              <select
                value={formData.center}
                onChange={e => setFormData({ ...formData, center: e.target.value })}
              >
                {centers.map((c, i) => <option key={i} value={c.name}>{c.name} ({c.distance})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Select Crop</label>
              <select
                value={formData.crop}
                onChange={e => setFormData({ ...formData, crop: e.target.value })}
              >
                {mspRates.map((r, i) => <option key={i} value={r.crop}>{r.crop}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Estimated Quantity (Quintals)</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={formData.qty}
                  onChange={e => setFormData({ ...formData, qty: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Preferred Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="book-btn">Confirm Slot Booking</button>
          </form>
        </div>
      </div>

      <div className="procurement-bottom">
        <div className="centers-list card-box">
          <h3 className="section-title">Active Procurement Centers</h3>
          <div className="centers-grid">
            {centers.map((c, i) => (
              <div key={i} className="center-card">
                <div className="center-header">
                  <strong>{c.name}</strong>
                  <span className="distance-badge">{c.distance}</span>
                </div>
                <p className="center-address"><MapPin size={12} /> {c.location}</p>
                <span className="slots-badge">{c.slots} slots available today</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bookings-list card-box">
          <h3 className="section-title">Your Booked Slots</h3>
          <div className="bookings-table-wrapper">
            {bookings.length === 0 ? (
              <p className="no-bookings">No booked slots yet. Fill out the form above to book.</p>
            ) : (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Center</th>
                    <th>Crop</th>
                    <th>Qty</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.ref}</strong></td>
                      <td>{b.center}</td>
                      <td>{b.crop}</td>
                      <td>{b.qty} Qtl</td>
                      <td>{b.date}</td>
                      <td><span className="status-badge-approved"><Check size={12} /> Approved</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
