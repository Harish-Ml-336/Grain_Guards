import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MapPin, Tag, ShoppingBag, X, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import './GrainMarketplace.css';

const grainTypes = ['Rice', 'Wheat', 'Ragi', 'Maize', 'Millets', 'Pulses', 'Barley', 'Oats', 'Sorghum', 'Soybean'];
const locations = ['Thanjavur', 'Trichy', 'Madurai', 'Salem', 'Coimbatore', 'Erode', 'Vellore', 'Tirunelveli', 'Kanchipuram', 'Dharmapuri'];
const sellers = ['Ponni Farms', 'Kaveri Co-op', 'Delta Growers', 'Vikas Agri', 'Greenfield Traders', 'Lotus Farms', 'Marutham Organic', 'Kongu Traders', 'Ananya Exports', 'Siva Agri Products'];
const varieties = {
  Rice: ['Basmati', 'Ponni', 'Sona Masuri', 'Jeera Samba', 'IR20', 'Ambasamudram'],
  Wheat: ['Durum', 'Sharbati', 'Lok-1', 'Kalyansona', 'Sonalika'],
  Ragi: ['GPU 28', 'Indaf 5', 'ML-365', 'KMR-301'],
  Maize: ['Ganga 5', 'Deccan Hybrid', 'Sartaj', 'HQPM-1'],
  Millets: ['Pearl Millet (Bajra)', 'Foxtail Millet', 'Kodo Millet', 'Barnyard Millet'],
  Pulses: ['Chana Dal', 'Toor Dal', 'Urad Dal', 'Moong Dal', 'Masoor Dal'],
  Barley: ['Hordeum', 'Alfa', 'Beta', 'Commander'],
  Oats: ['Kent', 'HJ 8', 'Sabzaar'],
  Sorghum: ['Jowar Chari', 'Moti', 'CSH-9'],
  Soybean: ['JS 335', 'JS 93-05', 'NRC 7']
};

const realImages = {
  Rice: [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1536304993881-a372c179924b?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594489573729-a4e0ef3fa635?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550828486-6148b9482ac4?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1602989930062-16f66dd88282?w=400&auto=format&fit=crop&q=80'
  ],
  Wheat: [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1499529112087-3cb3b73cca97?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1437252611977-07f74518abd7?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530364071892-4d9a89379b4c?w=400&auto=format&fit=crop&q=80'
  ],
  Ragi: [
    'https://images.unsplash.com/photo-1612358405627-3721a0f3e713?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1609780439050-7a25e0e65961?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515942661900-94b3d1972591?w=400&auto=format&fit=crop&q=80'
  ],
  Maize: [
    'https://images.unsplash.com/photo-1551754625-7fc3a9e7769d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601000938365-f182c5ec2c19?w=400&auto=format&fit=crop&q=80'
  ],
  Millets: [
    'https://images.unsplash.com/photo-1612358405627-3721a0f3e713?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1609780439050-7a25e0e65961?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&auto=format&fit=crop&q=80'
  ],
  Pulses: [
    'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585996905022-e6e62a695a9a?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515543904598-33b8110a28ee?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611070851637-8908fa7e849b?w=400&auto=format&fit=crop&q=80'
  ],
  Barley: [
    'https://images.unsplash.com/photo-1437252611977-07f74518abd7?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530364071892-4d9a89379b4c?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&auto=format&fit=crop&q=80'
  ],
  Oats: [
    'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515942661900-94b3d1972591?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1612358405627-3721a0f3e713?w=400&auto=format&fit=crop&q=80'
  ],
  Sorghum: [
    'https://images.unsplash.com/photo-1609780439050-7a25e0e65961?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515942661900-94b3d1972591?w=400&auto=format&fit=crop&q=80'
  ],
  Soybean: [
    'https://images.unsplash.com/photo-1585996905022-e6e62a695a9a?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611070851637-8908fa7e849b?w=400&auto=format&fit=crop&q=80'
  ]
};

const generateGrains = () => {
  const list = [];
  let id = 1;
  for (let i = 0; i < 110; i++) {
    const type = grainTypes[i % grainTypes.length];
    const vars = varieties[type];
    const varietyName = vars[i % vars.length];
    const seller = sellers[i % sellers.length];
    const loc = locations[i % locations.length];
    const price = Math.floor(20 + (i * 3.7) % 60);
    const qty = Math.floor(1000 + (i * 187) % 15000);
    const grade = String.fromCharCode(65 + (i % 3));
    
    const image = `https://image.pollinations.ai/prompt/${encodeURIComponent(`Realistic highly detailed photo of ${varietyName} ${type} grain crop raw`)}?width=400&height=400&nologo=true&seed=${id}`;

    list.push({
      id: id++,
      title: `Grade ${grade} ${varietyName} ${type}`,
      seller: `${seller} #${Math.floor(i / 10 + 1)}`,
      verified: i % 3 !== 0, // Mock verified status
      rating: (4.0 + (i * 0.11) % 1.0).toFixed(1),
      updatedAt: `${(i * 7) % 59 + 1} mins ago`,
      qty,
      maxQty: qty + 2000 + (i * 500) % 5000,
      price,
      location: loc,
      type,
      image
    });
  }
  return list;
};

const initialGrains = generateGrains();



export default function GrainMarketplace() {
  const navigate = useNavigate();
  const [grains, setGrains] = useState(initialGrains);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [quantities, setQuantities] = useState({}); // { [grainId]: qty }
  const [newGrain, setNewGrain] = useState({ title: '', seller: 'My Farm', qty: '', price: '', location: '', type: 'Rice', image: '' });
  const [isFetchingImages, setIsFetchingImages] = useState(false);
  const { cart, addToCart } = useCart();

    // Removed Unsplash fetching since we use unique AI images now

  const handleAddListing = (e) => {
    e.preventDefault();
    const listing = {
      ...newGrain,
      id: Date.now(),
      qty: parseFloat(newGrain.qty),
      price: parseFloat(newGrain.price),
      image: realImages[newGrain.type] || realImages.Rice
    };
    setGrains([listing, ...grains]);
    setShowModal(false);
    setNewGrain({ title: '', seller: 'My Farm', qty: '', price: '', location: '', type: 'Rice', image: '' });
  };

  const filtered = grains.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="marketplace-page">
      <div className="market-header-row">
        <div className="market-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search grain listings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="market-actions">
          {isFetchingImages && <span className="fetching-text" style={{ fontSize: '12px', color: 'var(--primary)', marginRight: '15px' }}>Loading real photos...</span>}
          <button className="seed-cart-btn" style={{ marginRight: '10px' }} onClick={() => navigate('/cart')}>
            <ShoppingCart size={18} />
            Cart <span className="cart-badge">{cart.filter(item => item.type === 'Grain').length}</span>
          </button>
          <button className="market-add-btn" onClick={() => setShowModal(true)}>
            <Plus size={16} /> List Grain for Sale
          </button>
        </div>
      </div>

      <div className="market-grid">
        {filtered.slice(0, visibleCount).map(grain => {
          const stockPercentage = Math.min(100, Math.round((grain.qty / grain.maxQty) * 100));
          const selectedQty = quantities[grain.id] || 50;
          const totalPrice = (selectedQty * grain.price).toLocaleString();
          return (
            <div key={grain.id} className="market-card">
              <div className="market-card-img">
                <img src={grain.image} alt={grain.title} loading="lazy" />
                <span className="market-rating">★ {grain.rating}</span>
              </div>
              <div className="market-card-body">
                <div className="market-card-header">
                  <span className="market-badge">{grain.type}</span>
                  <span className="market-updated">{grain.updatedAt}</span>
                </div>
                <h4 className="market-card-title">{grain.title}</h4>
                <p className="market-seller">
                  Seller: {grain.seller}
                  {grain.verified && <span className="verified-icon" title="Verified Seller">✔</span>}
                </p>

                <div className="stock-container">
                  <div className="stock-info">
                    <span className="stock-label">Available Stock</span>
                    <span className="stock-value">{grain.qty.toLocaleString()} kg</span>
                  </div>
                  <div className="stock-progress-bg">
                    <div className="stock-progress-fill" style={{ width: `${stockPercentage}%`, backgroundColor: stockPercentage > 20 ? 'var(--primary-lighter)' : 'var(--warning)' }}></div>
                  </div>
                </div>

                <div className="market-details">
                  <span className="market-detail-item"><MapPin size={12} /> {grain.location}</span>
                  <span className="market-detail-item"><Tag size={12} /> ₹{grain.price}/kg</span>
                </div>

                {/* Quantity Selector */}
                <div className="qty-selector">
                  <label className="qty-label">Quantity (kg)</label>
                  <div className="qty-input-row">
                    <button className="qty-btn" onClick={() => setQuantities(q => ({ ...q, [grain.id]: Math.max(1, (q[grain.id] || 50) - 10) }))}>−</button>
                    <input
                      type="number"
                      min="1"
                      max={grain.qty}
                      value={selectedQty}
                      onChange={e => setQuantities(q => ({ ...q, [grain.id]: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="qty-input"
                    />
                    <button className="qty-btn" onClick={() => setQuantities(q => ({ ...q, [grain.id]: Math.min(grain.qty, (q[grain.id] || 50) + 10) }))}>+</button>
                  </div>
                  <div className="qty-total">Total: <strong>₹{totalPrice}</strong></div>
                </div>

                <div className="market-footer" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <div className="price-tag" style={{ width: '100%', marginBottom: '4px' }}>
                    <strong>₹{grain.price}</strong><small>/kg</small>
                  </div>
                  <button 
                    className={`seed-add-btn interactive-btn ${cart.some(item => item.uniqueId === `Grain-${grain.id}`) ? 'added' : ''}`}
                    style={{ flex: 1, minWidth: '100px', fontSize: '0.75rem', padding: '8px' }}
                    onClick={() => addToCart({ ...grain, type: 'Grain' }, selectedQty)}
                  >
                    {cart.some(item => item.uniqueId === `Grain-${grain.id}`) ? (
                      <><Check size={12} /> Added</>
                    ) : (
                      <><ShoppingCart size={12} /> Add to Cart</>
                    )}
                  </button>
                  <button 
                    className="market-buy-btn interactive-btn" 
                    style={{ flex: 1, minWidth: '100px', fontSize: '0.75rem', padding: '8px' }}
                    onClick={() => navigate('/checkout', { state: { items: [{ ...grain, type: 'Grain', name: grain.title, qty: selectedQty }] } })}
                  >
                    <ShoppingBag size={12} /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < filtered.length && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={() => setVisibleCount(prev => prev + 12)}
            style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: '600' }}
          >
            Load More Grains
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="market-modal">
            <div className="modal-header">
              <h3>List Grain for Sale</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddListing} className="market-form">
              <div className="form-group">
                <label>Listing Title</label>
                <input
                  type="text"
                  placeholder="e.g. Premium White Rice"
                  value={newGrain.title}
                  onChange={e => setNewGrain({ ...newGrain, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Grain Type</label>
                  <select
                    value={newGrain.type}
                    onChange={e => setNewGrain({ ...newGrain, type: e.target.value })}
                  >
                    <option value="Rice">Rice</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Ragi">Ragi</option>
                    <option value="Maize">Maize</option>
                    <option value="Millets">Millets</option>
                    <option value="Pulses">Pulses</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹ per kg)</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={newGrain.price}
                    onChange={e => setNewGrain({ ...newGrain, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity (kg)</label>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newGrain.qty}
                    onChange={e => setNewGrain({ ...newGrain, qty: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Thanjavur"
                    value={newGrain.location}
                    onChange={e => setNewGrain({ ...newGrain, location: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-listing-btn">Submit Listing</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
