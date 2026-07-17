import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Trash2, ArrowLeft, ShoppingBag, CreditCard, Tag } from 'lucide-react';
import './Cart.css';

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate('/checkout', { state: { items: cart } });
  };

  return (
    <div className="cart-page">
      <div className="cart-header-row">
        <button className="cart-back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Continue Shopping
        </button>
        <h2 className="cart-title">Your Unified Cart ({cart.length} item{cart.length !== 1 ? 's' : ''})</h2>
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty-state card-box">
          <ShoppingBag size={64} className="empty-cart-icon" />
          <h3>Your cart is empty</h3>
          <p>Add seeds, grains, or fertilizers from the marketplaces to see them here.</p>
          <div className="cart-suggested-links">
            <button className="market-link-btn" onClick={() => navigate('/grain-marketplace')}>Grain Marketplace</button>
            <button className="market-link-btn" onClick={() => navigate('/seed-marketplace')}>Seed Marketplace</button>
            <button className="market-link-btn" onClick={() => navigate('/fertilizer-marketplace')}>Fertilizers</button>
          </div>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items List */}
          <div className="cart-items-section card-box">
            {cart.map((item) => {
              const itemTotal = item.price * item.qty;
              return (
                <div key={item.uniqueId} className="cart-item-row">
                  <div className="cart-item-info">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <span className="cart-item-badge">{item.type || 'Product'}</span>
                      <h4 className="cart-item-name">{item.name}</h4>
                      <span className="cart-item-seller">Seller: {item.seller || 'Verified Store'}</span>
                    </div>
                  </div>

                  <div className="cart-item-pricing">
                    <span className="cart-unit-price"><Tag size={12} /> ₹{item.price.toLocaleString()}</span>
                    
                    {/* Editable Quantity Selector */}
                    <div className="qty-selector">
                      <div className="qty-input-row">
                        <button className="qty-btn" onClick={() => updateQty(item.uniqueId, item.qty - 1)}>−</button>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateQty(item.uniqueId, parseInt(e.target.value) || 1)}
                          className="qty-input"
                        />
                        <button className="qty-btn" onClick={() => updateQty(item.uniqueId, item.qty + 1)}>+</button>
                      </div>
                    </div>

                    <span className="cart-total-price">₹{itemTotal.toLocaleString()}</span>

                    <button 
                      className="cart-delete-btn" 
                      onClick={() => removeFromCart(item.uniqueId)}
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Panel */}
          <div className="cart-summary-section card-box">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-row">
              <span>Items Total:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            
            <div className="summary-row">
              <span>GST (5%):</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row grand-total">
              <span>Grand Total:</span>
              <span className="grand-total-val">₹{total.toLocaleString()}</span>
            </div>

            <button className="cart-checkout-btn" onClick={handleCheckout}>
              <CreditCard size={16} /> Proceed to Secure Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
