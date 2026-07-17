import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Leaf, Building2, Tag, MapPin, Star, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import './FertilizerMarketplace.css';

const commercialProducts = [
  { id: 1, name: 'NPK 20:20:20 Complex', brand: 'IFFCO', price: 1350, unit: '50kg bag', rating: 4.5, stock: 250, image: 'https://image.pollinations.ai/prompt/NPK-fertilizer-bag-green-50kg?width=400&height=300&nologo=true', category: 'Complex', description: 'Balanced nutrition for all crops' },
  { id: 2, name: 'DAP (Di-Ammonium Phosphate)', brand: 'Coromandel', price: 1450, unit: '50kg bag', rating: 4.7, stock: 180, image: 'https://image.pollinations.ai/prompt/DAP-fertilizer-white-granules-bag?width=400&height=300&nologo=true', category: 'Phosphatic', description: 'High phosphorus for root development' },
  { id: 3, name: 'Urea (46% Nitrogen)', brand: 'NFL', price: 267, unit: '45kg bag', rating: 4.3, stock: 500, image: 'https://image.pollinations.ai/prompt/Urea-fertilizer-white-crystals-bag?width=400&height=300&nologo=true', category: 'Nitrogenous', description: 'Highest nitrogen content fertilizer' },
  { id: 4, name: 'MOP (Muriate of Potash)', brand: 'IPL', price: 1700, unit: '50kg bag', rating: 4.2, stock: 120, image: 'https://image.pollinations.ai/prompt/potash-fertilizer-red-granules?width=400&height=300&nologo=true', category: 'Potassic', description: 'Essential potassium for crop quality' },
  { id: 5, name: 'Organic Vermicompost', brand: 'GreenGold', price: 450, unit: '25kg bag', rating: 4.8, stock: 300, image: 'https://image.pollinations.ai/prompt/organic-vermicompost-dark-brown-bag?width=400&height=300&nologo=true', category: 'Organic', description: 'Premium quality organic manure' },
  { id: 6, name: 'Zinc Sulphate 33%', brand: 'Tata Rallis', price: 580, unit: '25kg bag', rating: 4.1, stock: 200, image: 'https://image.pollinations.ai/prompt/zinc-sulphate-powder-white-bag?width=400&height=300&nologo=true', category: 'Micronutrient', description: 'Corrects zinc deficiency in paddy' },
];

const govtProducts = [
  { id: 101, name: 'Subsidized Urea', brand: 'Govt of India', price: 242, mrp: 267, subsidy: '₹25 OFF', unit: '45kg bag', rating: 4.5, stock: 1000, image: 'https://image.pollinations.ai/prompt/indian-government-urea-bag-blue-label?width=400&height=300&nologo=true', category: 'Nitrogenous', description: 'Maximum retail price fixed by Govt.', govtScheme: 'Nutrient Based Subsidy (NBS)' },
  { id: 102, name: 'Subsidized DAP', brand: 'Govt of India', price: 1250, mrp: 1450, subsidy: '₹200 OFF', unit: '50kg bag', rating: 4.6, stock: 800, image: 'https://image.pollinations.ai/prompt/government-DAP-fertilizer-bag-with-emblem?width=400&height=300&nologo=true', category: 'Phosphatic', description: 'Subsidized under DBT scheme.', govtScheme: 'Direct Benefit Transfer (DBT)' },
  { id: 103, name: 'Neem Coated Urea', brand: 'KRIBHCO', price: 248, mrp: 280, subsidy: '₹32 OFF', unit: '45kg bag', rating: 4.4, stock: 600, image: 'https://image.pollinations.ai/prompt/neem-coated-urea-green-bag?width=400&height=300&nologo=true', category: 'Nitrogenous', description: 'Slow release, reduces leaching.', govtScheme: 'Neem Coating Policy' },
  { id: 104, name: 'SSP (Single Super Phosphate)', brand: 'Zuari Agro', price: 400, mrp: 500, subsidy: '₹100 OFF', unit: '50kg bag', rating: 4.0, stock: 400, image: 'https://image.pollinations.ai/prompt/SSP-fertilizer-grey-granules-bag?width=400&height=300&nologo=true', category: 'Phosphatic', description: 'Low cost phosphorus source.', govtScheme: 'NBS Scheme' },
];

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push(<Star key={i} size={13} className="fert-star filled" />);
    else if (i === full && half) stars.push(<Star key={i} size={13} className="fert-star half" />);
    else stars.push(<Star key={i} size={13} className="fert-star" />);
  }
  return stars;
};

export default function FertilizerMarketplace() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('commercial');
  const [search, setSearch] = useState('');
  const [quantities, setQuantities] = useState({});
  const { cart, addToCart } = useCart();

  const isGovt = activeTab === 'govt';
  const products = isGovt ? govtProducts : commercialProducts;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fert-marketplace-page">
      {/* Tab Switcher */}
      <div className="fert-tabs">
        <button
          className={`fert-tab ${activeTab === 'commercial' ? 'active' : ''}`}
          onClick={() => { setActiveTab('commercial'); setSearch(''); }}
        >
          <ShoppingBag size={16} />
          Commercial Fertilizers
        </button>
        <button
          className={`fert-tab govt-tab ${activeTab === 'govt' ? 'active' : ''}`}
          onClick={() => { setActiveTab('govt'); setSearch(''); }}
        >
          <Building2 size={16} />
          Govt Subsidized Fertilizers
        </button>
      </div>

      {/* Search */}
      <div className="fert-header-row">
        <div className="market-search">
          <Search size={18} />
          <input
            type="text"
            placeholder={isGovt ? 'Search govt fertilizers...' : 'Search fertilizers...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="seed-cart-btn" onClick={() => navigate('/cart')}>
            <ShoppingCart size={18} />
            Cart <span className="cart-badge">{cart.filter(item => item.type === 'Fertilizer').length}</span>
          </button>
          <div className="fert-result-count">
            <Leaf size={15} />
            <span>{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="market-grid">
        {filtered.map(product => {
          const selectedQty = quantities[product.id] || 1;
          const totalPrice = (selectedQty * product.price).toLocaleString();
          const stockLow = product.stock < 150;

          return (
            <div key={product.id} className={`market-card${isGovt ? ' govt-card' : ''}`}>
              {/* Govt Badge */}
              {isGovt && (
                <span className="fert-govt-badge">
                  <Building2 size={11} /> Govt Subsidized
                </span>
              )}

              {/* Image */}
              <div className="market-card-img">
                <img src={product.image} alt={product.name} loading="lazy" />
                <span className="market-rating">★ {product.rating}</span>
                <span className="fert-category-badge">{product.category}</span>
              </div>

              {/* Body */}
              <div className="market-card-body">
                <h4 className="market-card-title">{product.name}</h4>

                <p className="market-seller">
                  <Tag size={12} /> {product.brand}
                </p>

                <p className="fert-description">{product.description}</p>

                {/* Govt Scheme */}
                {isGovt && product.govtScheme && (
                  <div className="fert-scheme-tag">
                    <Leaf size={12} />
                    <span>{product.govtScheme}</span>
                  </div>
                )}

                {/* Rating Stars */}
                <div className="fert-stars-row">
                  {renderStars(product.rating)}
                  <span className="fert-rating-text">{product.rating}</span>
                </div>

                {/* Stock Indicator */}
                <div className="stock-container">
                  <div className="stock-info">
                    <span className="stock-label">Stock</span>
                    <span className={`stock-value${stockLow ? ' low' : ''}`}>
                      {product.stock.toLocaleString()} bags
                    </span>
                  </div>
                  <div className="stock-progress-bg">
                    <div
                      className="stock-progress-fill"
                      style={{
                        width: `${Math.min(100, (product.stock / 1000) * 100)}%`,
                        backgroundColor: stockLow ? 'var(--warning)' : 'var(--primary)',
                      }}
                    />
                  </div>
                </div>

                {/* Price Section */}
                <div className="fert-price-section">
                  <div className="fert-price-main">
                    <span className="fert-price">₹{product.price.toLocaleString()}</span>
                    <span className="fert-unit">/ {product.unit}</span>
                  </div>
                  {isGovt && product.mrp && (
                    <div className="fert-price-govt">
                      <span className="fert-mrp">MRP ₹{product.mrp.toLocaleString()}</span>
                      <span className="fert-subsidy-badge">{product.subsidy}</span>
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="qty-selector">
                  <label className="qty-label">Quantity (bags)</label>
                  <div className="qty-input-row">
                    <button
                      className="qty-btn"
                      onClick={() => setQuantities(q => ({ ...q, [product.id]: Math.max(1, (q[product.id] || 1) - 1) }))}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={selectedQty}
                      onChange={e => setQuantities(q => ({ ...q, [product.id]: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="qty-input"
                    />
                    <button
                      className="qty-btn"
                      onClick={() => setQuantities(q => ({ ...q, [product.id]: Math.min(product.stock, (q[product.id] || 1) + 1) }))}
                    >
                      +
                    </button>
                  </div>
                  <div className="qty-total">Total: <strong>₹{totalPrice}</strong></div>
                </div>

                {/* Buy Button */}
                <div className="market-footer" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    className={`seed-add-btn interactive-btn ${cart.some(item => item.uniqueId === `Fertilizer-${product.id}`) ? 'added' : ''}`}
                    style={{ flex: 1, minWidth: '100px', fontSize: '0.75rem', padding: '8px' }}
                    onClick={() => addToCart({ ...product, type: 'Fertilizer', name: product.name }, selectedQty)}
                  >
                    {cart.some(item => item.uniqueId === `Fertilizer-${product.id}`) ? (
                      <><Check size={12} /> Added</>
                    ) : (
                      <><ShoppingCart size={12} /> Add to Cart</>
                    )}
                  </button>
                  <button
                    className="market-buy-btn interactive-btn"
                    style={{ flex: 1, minWidth: '100px', fontSize: '0.75rem', padding: '8px' }}
                    onClick={() => navigate('/checkout', {
                      state: {
                        items: [{
                          ...product,
                          title: product.name,
                          qty: selectedQty,
                          type: 'Fertilizer',
                          name: product.name
                        }],
                      },
                    })}
                  >
                    <ShoppingBag size={12} /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="fert-empty">
          <Search size={40} />
          <h3>No fertilizers found</h3>
          <p>Try a different search term</p>
        </div>
      )}
    </div>
  );
}
