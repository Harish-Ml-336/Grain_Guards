import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Check, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import './SeedMarketplace.css';

const seedCategories = ['Cereals', 'Millets', 'Pulses', 'Oilseeds', 'Vegetables'];
const seedVarietyNames = {
  Cereals: ['CR Dhan 310 Paddy', 'GW 496 Wheat', 'Co-4 Hybrid Maize', 'Pusa Basmati 1121 Paddy', 'HD 2967 Wheat'],
  Millets: ['GPU 28 Ragi', 'ML-365 Ragi', 'CO-7 Pearl Millet', 'Foxtail Millet Local'],
  Pulses: ['Certified Chickpea', 'Organic Toor Dal Seed', 'Pusa 991 Mung Bean', 'Kabuli Chana Special'],
  Oilseeds: ['Pusa Bold Mustard', 'Certified Sunflower Hybrid', 'TMV-7 Groundnut', 'Sesame Black Organic'],
  Vegetables: ['Hybrid Tomato Seminis', 'Pusa Okra Special', 'Green Chilli G-4', 'Eggplant Purple Long']
};

const realSeedImages = {
  Cereals: [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1536304993881-a372c179924b?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594489573729-a4e0ef3fa635?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1602989930062-16f66dd88282?w=400&auto=format&fit=crop&q=80'
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
  Oilseeds: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530364071892-4d9a89379b4c?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1612358405627-3721a0f3e713?w=400&auto=format&fit=crop&q=80'
  ],
  Vegetables: [
    'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518977676601-b28d0d2a9575?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566385101042-1a0aa86c6c8b?w=400&auto=format&fit=crop&q=80'
  ]
};

const seedDescriptions = {
  Cereals: 'High germination rate cereal seeds, certified disease-free and graded.',
  Millets: 'Drought-tolerant high yield variety, perfect for arid and semi-arid soil blocks.',
  Pulses: 'Nitrogen-fixing organic seeds certified by the national seed bureau.',
  Oilseeds: 'High oil-content output variety with rapid early-stage vegetative growth.',
  Vegetables: 'Highly fertile hybrid F1 seeds for commercial nursery and field farming.'
};

const generateSeeds = () => {
  const list = [];
  let id = 1;
  for (let i = 0; i < 110; i++) {
    const category = seedCategories[i % seedCategories.length];
    const vars = seedVarietyNames[category];
    const name = vars[i % vars.length];
    const price = Math.floor(50 + (i * 7.3) % 200);
    const rating = (4.0 + (i * 0.07) % 1.0).toFixed(1);
    const description = seedDescriptions[category];
    const grade = String.fromCharCode(65 + (i % 3));
    const qty = Math.floor(100 + (i * 23) % 1000);
    const maxQty = qty + 100 + (i * 100) % 2000;
    
    const image = `https://image.pollinations.ai/prompt/${encodeURIComponent(`Realistic highly detailed photo of ${name} ${category} seeds close up macro`)}?width=400&height=400&nologo=true&seed=${id}`;
    
    list.push({
      id: id++,
      name: `${name} #${Math.floor(i / 5 + 1)}`,
      seller: `AgriSeeds Co #${(i % 5) + 1}`,
      verified: i % 3 !== 0,
      updatedAt: `${(i * 9) % 59 + 1} mins ago`,
      qty,
      maxQty,
      price,
      rating,
      category,
      image,
      description: `${description} Grade ${grade}.`
    });
  }
  return list;
};

const seedProducts = generateSeeds();


export default function SeedMarketplace() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [seeds, setSeeds] = useState(seedProducts);
  const [isFetchingImages, setIsFetchingImages] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [quantities, setQuantities] = useState({});
  const { cart, addToCart } = useCart();

  const filtered = seeds.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories = ['All', 'Cereals', 'Millets', 'Pulses', 'Oilseeds'];

  return (
    <div className="seed-marketplace">
      <div className="seed-header">
        <div className="seed-search-row">
          <div className="seed-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search certified seeds..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="seed-actions">
            {isFetchingImages && <span className="fetching-text" style={{ fontSize: '12px', color: 'var(--primary)', marginRight: '15px' }}>Loading real photos...</span>}
            <button className="seed-cart-btn" onClick={() => navigate('/cart')}>
              <ShoppingCart size={18} />
              Cart <span className="cart-badge">{cart.filter(item => item.type === 'Seed').length}</span>
            </button>
          </div>
        </div>

        <div className="seed-categories">
          {categories.map(c => (
            <button
              key={c}
              className={`seed-cat-btn ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="seed-grid">
        {filtered.slice(0, visibleCount).map(product => {
          const stockPercentage = Math.min(100, Math.round((product.qty / product.maxQty) * 100));
          const selectedQty = quantities[product.id] || 1;
          const totalPrice = (selectedQty * product.price).toLocaleString();
          return (
            <div key={product.id} className="seed-card">
              <div className="seed-card-media">
                <img src={product.image} alt={product.name} loading="lazy" />
                <span className="seed-rating">★ {product.rating}</span>
              </div>
              <div className="seed-card-content">
                <div className="seed-card-head">
                  <span className="seed-badge">{product.category}</span>
                  <span className="seed-updated">{product.updatedAt}</span>
                </div>
                <h4 className="seed-name">{product.name}</h4>
                <p className="seed-seller">
                  Seller: {product.seller} 
                  {product.verified && <span className="verified-icon" title="Verified Seller">✔</span>}
                </p>
                <p className="seed-desc">{product.description}</p>
                
                <div className="stock-container">
                  <div className="stock-info">
                    <span className="stock-label">Available Stock</span>
                    <span className="stock-value">{product.qty.toLocaleString()} packets</span>
                  </div>
                  <div className="stock-progress-bg">
                    <div className="stock-progress-fill" style={{ width: `${stockPercentage}%`, backgroundColor: stockPercentage > 20 ? 'var(--primary-lighter)' : 'var(--warning)' }}></div>
                  </div>
                </div>

                <div className="qty-selector">
                  <label className="qty-label">Quantity (packets)</label>
                  <div className="qty-input-row">
                    <button className="qty-btn" onClick={() => setQuantities(q => ({ ...q, [product.id]: Math.max(1, (q[product.id] || 1) - 1) }))}>−</button>
                    <input
                      type="number"
                      min="1"
                      max={product.qty}
                      value={selectedQty}
                      onChange={e => setQuantities(q => ({ ...q, [product.id]: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="qty-input"
                    />
                    <button className="qty-btn" onClick={() => setQuantities(q => ({ ...q, [product.id]: Math.min(product.qty, (q[product.id] || 1) + 1) }))}>+</button>
                  </div>
                  <div className="qty-total">Total: <strong>₹{totalPrice}</strong></div>
                </div>

                <div className="seed-footer">
                  <div className="price-tag">
                    <strong>₹{product.price}</strong><small>/kg</small>
                  </div>
                  <button
                    className={`seed-add-btn interactive-btn ${cart.some(item => item.uniqueId === `Seed-${product.id}`) ? 'added' : ''}`}
                    onClick={() => addToCart({ ...product, type: 'Seed' }, selectedQty)}
                  >
                    {cart.some(item => item.uniqueId === `Seed-${product.id}`) ? (
                      <>
                        <Check size={14} /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={14} /> Add to Cart
                      </>
                    )}
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
            Load More Seeds
          </button>
        </div>
      )}
    </div>
  );
}
