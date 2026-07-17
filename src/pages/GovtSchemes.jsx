import React, { useState } from 'react';
import { Award, FileText, CheckCircle, Clock, X, ChevronRight } from 'lucide-react';
import './GovtSchemes.css';

const schemes = [
  {
    id: 1,
    name: 'PM-KISAN (Kisan Samman Nidhi)',
    description: 'Income support of ₹6,000 per year in three equal installments to all landholding farmer families.',
    benefit: '₹6,000 / year',
    eligibility: 'All Landholder Farmers',
    authority: 'Ministry of Agriculture',
    link: 'https://pmkisan.gov.in/',
  },
  {
    id: 2,
    name: 'PM Fasal Bima Yojana (Crop Insurance)',
    description: 'Financial support to farmers suffering crop loss/damage arising out of natural calamities.',
    benefit: 'Low premium crop cover',
    eligibility: 'All Farmers growing notified crops',
    authority: 'Govt of India',
    link: 'https://pmfby.gov.in/',
  },
  {
    id: 3,
    name: 'Subsidized Smart Grain Warehousing Scheme',
    description: 'Get up to 50% subsidy on warehousing rental fees for storage periods exceeding 3 months.',
    benefit: '50% Rental Subsidy',
    eligibility: 'Registered Grain Guards Users',
    authority: 'State Warehousing Board',
    link: 'https://wdra.gov.in/',
  },
  {
    id: 4,
    name: 'Agricultural Mechanization Subsidy',
    description: 'Get subsidy up to 40% on procurement of advanced IoT sensory systems and UV grain guards.',
    benefit: '40% IoT Hardware Subsidy',
    eligibility: 'Small & Marginal Farmers',
    authority: 'Department of Agriculture',
    link: 'https://agrimachinery.nic.in/',
  },
  {
    id: 5,
    name: 'Kisan Credit Card (KCC)',
    description: 'Short-term credit for cultivation, post-harvest expenses, and farm maintenance at subsidized interest rates (4% p.a.). Loan up to ₹3 lakhs with interest subvention.',
    benefit: '4% Interest Rate Loan',
    eligibility: 'All Farmers, Sharecroppers, Tenants',
    authority: 'RBI / NABARD',
    link: 'https://www.nabard.org/'
  },
  {
    id: 6,
    name: 'PM Kisan MaanDhan Yojana',
    description: 'Pension scheme for small & marginal farmers aged 18-40. Get ₹3,000/month pension after age 60. Govt contributes equal share.',
    benefit: '₹3,000/month Pension',
    eligibility: 'Small & Marginal Farmers (18-40 yrs)',
    authority: 'Ministry of Agriculture',
    link: 'https://maandhan.in/'
  },
  {
    id: 7,
    name: 'Agriculture Infrastructure Fund (AIF)',
    description: '₹1 Lakh Crore financing facility for post-harvest infrastructure. 3% interest subvention and CGCL credit guarantee up to ₹2 Crore.',
    benefit: '3% Interest Subvention',
    eligibility: 'FPOs, PACS, Agri-entrepreneurs',
    authority: 'Ministry of Agriculture',
    link: 'https://agriinfra.dac.gov.in/'
  },
  {
    id: 8,
    name: 'Minimum Support Price (MSP) Procurement',
    description: 'Government procures 23 crops at guaranteed MSP. Current MSP for Paddy: ₹2,300/quintal, Wheat: ₹2,275/quintal. Procurement through FCI and state agencies.',
    benefit: 'Guaranteed Price',
    eligibility: 'All Farmers growing MSP crops',
    authority: 'CACP / FCI',
    link: 'https://farmer.gov.in/'
  },
  {
    id: 9,
    name: 'Soil Health Card Scheme',
    description: 'Free soil testing and nutrient-based fertilizer recommendations. Card issued every 2 years with crop-wise recommendations.',
    benefit: 'Free Soil Testing',
    eligibility: 'All Farmers',
    authority: 'Dept of Agriculture',
    link: 'https://soilhealth.dac.gov.in/'
  },
  {
    id: 10,
    name: 'e-NAM (National Agriculture Market)',
    description: 'Online trading platform for agricultural commodities. Transparent price discovery. Connected to 1,000+ mandis across India.',
    benefit: 'Better Market Price',
    eligibility: 'All Farmers, Traders',
    authority: 'Ministry of Agriculture',
    link: 'https://enam.gov.in/'
  }
];

export default function GovtSchemes() {
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applied, setApplied] = useState({});

  const applyScheme = (scheme) => {
    const newApp = {
      id: scheme.id,
      name: scheme.name,
      ref: `SCH-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'In Review',
    };
    setApplications([newApp, ...applications]);
    setApplied({ ...applied, [scheme.id]: true });
    setSelectedScheme(null);
  };

  return (
    <div className="schemes-page">
      <div className="schemes-layout">
        <div className="schemes-left">
          <h3 className="schemes-subtitle">Available Government Schemes</h3>
          <div className="schemes-list">
            {schemes.map(s => (
              <div key={s.id} className="scheme-item-card">
                <div className="scheme-item-icon">
                  <Award size={20} />
                </div>
                <div className="scheme-item-content">
                  <h4>{s.name}</h4>
                  <p>{s.description}</p>
                  <div className="scheme-tags">
                    <span className="scheme-tag">Benefit: <strong>{s.benefit}</strong></span>
                    <span className="scheme-tag">Eligibility: <strong>{s.eligibility}</strong></span>
                  </div>
                  <button
                    className={`scheme-action-btn ${applied[s.id] ? 'applied' : ''}`}
                    onClick={() => {
                      window.open(s.link, '_blank');
                      setApplied({ ...applied, [s.id]: true });
                      const newApp = {
                        id: s.id,
                        name: s.name,
                        ref: `EXT-${Math.floor(100000 + Math.random() * 900000)}`,
                        date: new Date().toISOString().split('T')[0],
                        status: 'Redirected',
                      };
                      setApplications([newApp, ...applications]);
                    }}
                  >
                    {applied[s.id] ? 'Portal Opened' : 'Apply Online'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="schemes-right">
          <div className="schemes-box-card">
            <h3 className="schemes-subtitle">Application Status</h3>
            {applications.length === 0 ? (
              <p className="no-app-text">No active applications. Apply for a scheme on the left to see status updates.</p>
            ) : (
              <div className="app-timeline">
                {applications.map(app => (
                  <div key={app.id} className="app-timeline-item">
                    <div className="app-timeline-dot"></div>
                    <div className="app-timeline-content">
                      <div className="app-timeline-header">
                        <strong>{app.name}</strong>
                        <span className="app-timeline-status"><Clock size={12} /> {app.status}</span>
                      </div>
                      <span className="app-timeline-ref">Ref: {app.ref} · Date: {app.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedScheme && (
        <div className="modal-backdrop">
          <div className="schemes-modal">
            <div className="modal-header">
              <h3>Scheme Application Form</h3>
              <button className="close-btn" onClick={() => setSelectedScheme(null)}><X size={18} /></button>
            </div>
            <div className="scheme-form-content">
              <h4 className="modal-scheme-name">{selectedScheme.name}</h4>
              <p className="modal-scheme-desc">{selectedScheme.description}</p>
              <div className="scheme-inputs">
                <div className="form-group">
                  <label>Aadhaar Number / Farmer ID</label>
                  <input type="text" placeholder="xxxx-xxxx-xxxx" required />
                </div>
                <div className="form-group">
                  <label>Landholding Size (Acres)</label>
                  <input type="number" placeholder="e.g. 3.5" required />
                </div>
                <div className="form-group">
                  <label>Bank Account Number</label>
                  <input type="text" placeholder="IFSC & Account details" required />
                </div>
              </div>
              <button className="scheme-submit-btn" onClick={() => applyScheme(selectedScheme)}>
                Confirm & Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
