import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, Check, Lock, ChevronLeft } from 'lucide-react';
import { jsPDF } from 'jspdf';
import './Checkout.css';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const items = location.state?.items || [];
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });

  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + tax;

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 1500);
  };

  const finishCheckout = () => {
    setShowSuccess(false);
    navigate('/dashboard');
  };

  const downloadReceipt = () => {
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
    doc.text("OFFICIAL PAYMENT RECEIPT", 14, 32);

    // Invoice Meta Info
    const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 46);
    doc.setFont("helvetica", "bold");
    doc.text(`Receipt ID: ${txnId}`, 14, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Payment Date: ${new Date().toLocaleString()}`, 14, 62);
    doc.text(`Payment Method: ${paymentMethod.toUpperCase()}`, 14, 67);
    doc.text("Status: SUCCESSFUL / PAID", 14, 72);

    // Draw Separator line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, 78, 196, 78);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 26, 46);
    doc.text("Order Summary", 14, 90);

    let y = 102;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Item Name", 14, y);
    doc.text("Qty", 120, y);
    doc.text("Unit Price", 145, y);
    doc.text("Total", 175, y);

    doc.line(14, y + 3, 196, y + 3);
    y += 12;

    items.forEach(item => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(26, 26, 46);
      doc.text(item.name || item.title || "Product", 14, y);
      doc.text(`${item.qty || 1}`, 120, y);
      doc.text(`INR ${item.price.toLocaleString()}`, 145, y);
      doc.text(`INR ${(item.price * (item.qty || 1)).toLocaleString()}`, 175, y);
      y += 10;
    });

    doc.line(14, y, 196, y);
    y += 10;

    // Subtotal, Tax, Total
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Subtotal:", 135, y);
    doc.text(`INR ${subtotal.toLocaleString()}`, 175, y);
    
    y += 7;
    doc.text("GST (5%):", 135, y);
    doc.text(`INR ${tax.toLocaleString()}`, 175, y);

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(27, 94, 32); // Green for total paid
    doc.setFontSize(12);
    doc.text("Total Paid:", 135, y);
    doc.text(`INR ${total.toLocaleString()}`, 175, y);

    y += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for choosing Grain Guards Smart Storage Monitor!", 14, y);
    doc.text("For any support queries, contact support@grainguards.com", 14, y + 6);

    doc.save(`GrainGuards_Receipt_${Date.now()}.pdf`);
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>You haven't selected any products to purchase.</p>
        <button className="back-btn" onClick={() => navigate('/seed-marketplace')}>Back to Marketplace</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px', fontWeight: '500' }}>
          <ChevronLeft size={16} /> Back
        </button>
        <h2>Secure Checkout</h2>
      </div>

      <div className="checkout-container">
        {/* Order Summary */}
        <div className="checkout-section">
          <h3>Order Summary</h3>
          <div className="checkout-items">
            {items.map((item, idx) => (
              <div key={idx} className="checkout-item">
                <img src={item.image} alt={item.name || item.title} className="checkout-item-img" />
                <div className="checkout-item-details">
                  <h4>{item.name || item.title}</h4>
                  <p>Seller: {item.seller}</p>
                  <p>Qty: {item.qty || 1} kg/packets</p>
                </div>
                <div className="checkout-item-price">
                  ₹{(item.price * (item.qty || 1)).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="total-row">
              <span>Tax (GST 5%)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="checkout-section">
          <h3>Payment Method</h3>
          
          <div className="payment-methods">
            <button 
              className={`payment-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCard size={24} />
              <span>Card</span>
            </button>
            <button 
              className={`payment-method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
              <Smartphone size={24} />
              <span>UPI</span>
            </button>
            <button 
              className={`payment-method-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('netbanking')}
            >
              <Building2 size={24} />
              <span>Net Banking</span>
            </button>
          </div>

          <form onSubmit={handlePayment}>
            {paymentMethod === 'card' && (
              <>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input type="text" placeholder="John Doe" required onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" placeholder="XXXX XXXX XXXX XXXX" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" required />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="password" placeholder="XXX" required maxLength="3" />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'upi' && (
              <div className="form-group">
                <label>UPI ID / VPA</label>
                <input type="text" placeholder="username@upi" required onChange={e => setFormData({...formData, upiId: e.target.value})} />
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="form-group">
                <label>Select Bank</label>
                <select style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--radius-md)' }}>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            <button type="submit" className="pay-btn" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : (
                <>
                  <Lock size={18} /> Pay ₹{total.toLocaleString()} Securely
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="success-modal">
          <div className="success-content">
            <div className="success-icon">
              <Check size={32} />
            </div>
            <h3>Payment Successful!</h3>
            <p>Your order has been placed and is being processed. An invoice has been sent to your email.</p>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button onClick={downloadReceipt} style={{ background: '#10B981' }}>Download Receipt (PDF)</button>
              <button onClick={finishCheckout}>Go to Dashboard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
