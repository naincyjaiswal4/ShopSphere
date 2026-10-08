import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageFallback';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Sparkles,
  QrCode,
  Smartphone,
  Banknote,
  Building2,
  Copy,
  Check,
  Info,
  X
} from 'lucide-react';

export default function Cart() {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    placeOrder
  } = useCart();

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState('any');

  const [formData, setFormData] = useState({
    fullName: currentUser?.name || 'Valued Customer',
    phone: '+91 98765 43210',
    street: 'Flat 402, Lotus Residency, 12th Main Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    paymentMethod: 'UPI' // 'UPI', 'COD', 'Card', 'NetBanking'
  });

  const [cardData, setCardData] = useState({
    number: '4532 8920 1284 9201',
    name: currentUser?.name || 'Valued Customer',
    expiry: '08/29',
    cvv: '849'
  });

  // Automatically sync customer name from logged in user
  useEffect(() => {
    if (currentUser?.name) {
      setFormData((prev) => ({
        ...prev,
        fullName: currentUser.name
      }));
      setCardData((prev) => ({
        ...prev,
        name: currentUser.name
      }));
    }
  }, [currentUser]);

  const freeShippingThreshold = 999;
  const shippingCost = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 99;
  const estimatedTax = Math.round(cartSubtotal * 0.05); // 5% GST
  const orderTotal = cartSubtotal + shippingCost + estimatedTax;

  // Real UPI deep-link URI format that standard UPI scanner apps parse
  const upiUri = `upi://pay?pa=shopsphere@upi&pn=ShopSphere%20Store&am=${orderTotal}&cu=INR&tn=ShopSphere%20Order%20Payment`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiUri
  )}&bgcolor=ffffff&color=0f172a&margin=6`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('shopsphere@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    const newOrder = placeOrder({
      address: {
        fullName: formData.fullName,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      },
      paymentMethod:
        formData.paymentMethod === 'UPI'
          ? 'UPI / QR Code (Paid Online)'
          : formData.paymentMethod === 'COD'
          ? 'Cash on Delivery (COD)'
          : formData.paymentMethod === 'Card'
          ? 'Credit / Debit Card'
          : 'Net Banking'
    });

    setIsCheckoutOpen(false);

    // Redirect to Order History page after placing order
    if (newOrder) {
      navigate('/orders');
    }
  };

  return (
    <div className="cart-page">
      <div className="container cart-container">
        {/* Page Header */}
        <div className="cart-header-row">
          <div>
            <span className="section-badge">Shopping Bag</span>
            <h1 className="cart-main-heading">Your Cart ({cartCount} items)</h1>
            <p className="cart-subheading">
              {cartCount > 0
                ? 'Review your selected products, adjust quantities, and proceed to secure checkout.'
                : 'Your shopping cart is currently empty.'}
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              type="button"
              className="clear-cart-text-btn"
              onClick={clearCart}
            >
              <Trash2 size={16} />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart View */
          <div className="empty-cart-card">
            <div className="empty-cart-icon-wrap">
              <ShoppingBag size={48} className="empty-cart-icon" />
            </div>

            <h2 className="empty-cart-title">Your cart is empty</h2>
            <p className="empty-cart-text">
              Looks like you haven't added anything to your cart yet. Explore our curated collections to find premium items!
            </p>

            <div className="empty-cart-actions">
              <Link to="/products" className="btn-primary start-shopping-btn">
                <span>Start Shopping</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/orders" className="btn-secondary">
                <span>View Order History</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Filled Cart Layout */
          <div className="cart-layout-grid">
            {/* Left: Cart Items List */}
            <div className="cart-items-column">
              <div className="cart-items-card">
                <div className="cart-items-table-header">
                  <span>Product</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span></span>
                </div>

                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item-row">
                      {/* Product Details */}
                      <div className="cart-item-info">
                        <Link to={`/product/${item.id}`} className="cart-item-img-link">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="cart-item-thumbnail"
                            onError={handleImageError}
                          />
                        </Link>
                        <div className="cart-item-meta">
                          <span className="cart-item-category">{item.category}</span>
                          <Link to={`/product/${item.id}`} className="cart-item-name">
                            {item.name}
                          </Link>
                          <span className="cart-item-unit-price">
                            ₹{item.price?.toLocaleString('en-IN')} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="cart-item-quantity">
                        <div className="cart-qty-control">
                          <button
                            type="button"
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="cart-qty-val">{item.quantity}</span>
                          <button
                            type="button"
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Item Total Price in INR */}
                      <div className="cart-item-total">
                        <span className="cart-item-total-price">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <div className="cart-item-actions">
                        <button
                          type="button"
                          className="cart-remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name}`}
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-footer-nav">
                  <Link to="/products" className="continue-shopping-link">
                    <ArrowLeft size={16} />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="cart-summary-column">
              <div className="order-summary-card">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                    <span className="summary-val">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="summary-row">
                    <span>Delivery Charges</span>
                    <span className="summary-val">
                      {shippingCost === 0 ? (
                        <span className="text-free-ship">FREE</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span>Estimated GST (5%)</span>
                    <span className="summary-val">₹{estimatedTax.toLocaleString('en-IN')}</span>
                  </div>

                  {shippingCost === 0 ? (
                    <div className="free-shipping-qualifier">
                      <CheckCircle2 size={14} color="#10b981" />
                      <span>Free Express Delivery Applied!</span>
                    </div>
                  ) : (
                    <div className="free-shipping-banner-alert">
                      <span>Add ₹{(freeShippingThreshold - cartSubtotal).toLocaleString('en-IN')} more for Free Delivery!</span>
                    </div>
                  )}

                  <div className="summary-divider"></div>

                  <div className="summary-total-row">
                    <span>Total Amount</span>
                    <span className="summary-total-val">₹{orderTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  type="button"
                  className="btn-primary checkout-btn"
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </button>

                <div className="checkout-security-tag">
                  <ShieldCheck size={16} color="#2D6A4F" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Benefits Grid */}
        <div className="cart-benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <Truck size={24} />
            </div>
            <h3>Free Express Delivery</h3>
            <p>On all domestic orders over ₹999 with real-time tracking.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">
              <ShieldCheck size={24} />
            </div>
            <h3>100% Secure Checkout</h3>
            <p>Encrypted 256-bit payment processing with full buyer protection.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">
              <RotateCcw size={24} />
            </div>
            <h3>30-Day Easy Returns</h3>
            <p>Not completely satisfied? Return any item hassle-free within 30 days.</p>
          </div>
        </div>
      </div>

      {/* Checkout Modal with Dynamic Payment Options Demo */}
      {isCheckoutOpen && (
        <div className="modal-backdrop">
          <div className="checkout-modal-card checkout-modal-wide">
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="section-badge">Fast & Secure</span>
                <h2>Complete Your Order</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCheckoutOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="checkout-form">
              {/* Shipping Address Inputs */}
              <div className="checkout-section-box">
                <h4 className="form-section-title"><MapPin size={16} /> Delivery Address</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      className="auth-input"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      required
                      className="auth-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">Street Address / Flat No.</label>
                  <input
                    type="text"
                    required
                    className="auth-input"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  />
                </div>

                <div className="form-grid-3 mt-2">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      required
                      className="auth-input"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      required
                      className="auth-input"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      required
                      className="auth-input"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="checkout-section-box mt-3">
                <h4 className="form-section-title"><CreditCard size={16} /> Choose Payment Option</h4>
                
                {/* Payment Tabs / Selector Grid */}
                <div className="payment-method-tabs">
                  <button
                    type="button"
                    className={`payment-tab-btn ${formData.paymentMethod === 'UPI' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                  >
                    <QrCode size={18} />
                    <span>UPI / QR Code</span>
                    <span className="payment-badge-popular">Instant</span>
                  </button>

                  <button
                    type="button"
                    className={`payment-tab-btn ${formData.paymentMethod === 'COD' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                  >
                    <Banknote size={18} />
                    <span>Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    className={`payment-tab-btn ${formData.paymentMethod === 'Card' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Card' })}
                  >
                    <CreditCard size={18} />
                    <span>Credit / Debit Card</span>
                  </button>

                  <button
                    type="button"
                    className={`payment-tab-btn ${formData.paymentMethod === 'NetBanking' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, paymentMethod: 'NetBanking' })}
                  >
                    <Building2 size={18} />
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* Dynamic Payment Option Body Demo */}
                <div className="payment-detail-container mt-3">
                  {/* OPTION 1: UPI / QR CODE */}
                  {formData.paymentMethod === 'UPI' && (
                    <div className="upi-payment-demo-card">
                      <div className="upi-qr-display-row">
                        {/* Dynamic QR Code */}
                        <div className="upi-qr-box">
                          <img
                            src={qrCodeImageUrl}
                            alt="Scan UPI QR Code to pay"
                            className="upi-qr-img"
                          />
                          <div className="upi-qr-badge">
                            <span>Scan with any UPI App</span>
                          </div>
                        </div>

                        {/* QR Instructions & Cart Value to be paid */}
                        <div className="upi-qr-details">
                          <div className="upi-amount-pill">
                            <span className="upi-amount-label">Payable Cart Amount:</span>
                            <span className="upi-amount-value">₹{orderTotal.toLocaleString('en-IN')}</span>
                          </div>

                          <div className="upi-steps-list">
                            <div className="upi-step-item">
                              <span className="upi-step-num">1</span>
                              <span>Open <strong>GPay, PhonePe, Paytm</strong> or any UPI App</span>
                            </div>
                            <div className="upi-step-item">
                              <span className="upi-step-num">2</span>
                              <span>Scan this QR code to load <strong>₹{orderTotal.toLocaleString('en-IN')}</strong> automatically</span>
                            </div>
                            <div className="upi-step-item">
                              <span className="upi-step-num">3</span>
                              <span>Approve payment & click <strong>Place Order</strong> below</span>
                            </div>
                          </div>

                          {/* Copy UPI ID alternative */}
                          <div className="upi-id-copy-row">
                            <div className="upi-id-info">
                              <span className="upi-id-label">UPI ID:</span>
                              <code className="upi-id-code">shopsphere@upi</code>
                            </div>
                            <button
                              type="button"
                              className="copy-upi-btn"
                              onClick={handleCopyUpi}
                            >
                              {copiedUpi ? (
                                <>
                                  <Check size={14} color="#10b981" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={14} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Supported UPI Apps logos */}
                      <div className="upi-apps-strip">
                        <span className="upi-apps-title">Supported Apps:</span>
                        <div className="upi-apps-badges">
                          <span className="upi-badge gpay">Google Pay</span>
                          <span className="upi-badge phonepe">PhonePe</span>
                          <span className="upi-badge paytm">Paytm</span>
                          <span className="upi-badge bhim">BHIM UPI</span>
                          <span className="upi-badge cred">CRED</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OPTION 2: CASH ON DELIVERY */}
                  {formData.paymentMethod === 'COD' && (
                    <div className="cod-demo-card">
                      <div className="cod-header-icon">
                        <Banknote size={32} className="text-primary" />
                        <div>
                          <h5>Cash / UPI on Delivery</h5>
                          <p>Pay cash or scan QR with delivery agent at your doorstep.</p>
                        </div>
                      </div>

                      <div className="cod-details-box">
                        <div className="cod-row">
                          <span>Amount to Pay upon Delivery:</span>
                          <strong>₹{orderTotal.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="cod-row">
                          <span>COD Handling Fee:</span>
                          <strong className="text-free-ship">FREE (₹0)</strong>
                        </div>
                      </div>

                      <div className="cod-safety-note">
                        <ShieldCheck size={16} color="#10b981" />
                        <span>Contactless delivery available. You can also pay via UPI on delivery!</span>
                      </div>
                    </div>
                  )}

                  {/* OPTION 3: CREDIT / DEBIT CARD */}
                  {formData.paymentMethod === 'Card' && (
                    <div className="card-demo-card">
                      <div className="card-input-grid">
                        <div className="form-group">
                          <label className="form-label">Card Number</label>
                          <input
                            type="text"
                            className="auth-input font-mono"
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            placeholder="4532 0000 0000 0000"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Cardholder Name</label>
                          <input
                            type="text"
                            className="auth-input"
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                            placeholder="Full Name as on Card"
                          />
                        </div>
                        <div className="form-grid-2">
                          <div className="form-group">
                            <label className="form-label">Valid Thru (MM/YY)</label>
                            <input
                              type="text"
                              className="auth-input font-mono"
                              value={cardData.expiry}
                              onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                              placeholder="MM/YY"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">CVV</label>
                            <input
                              type="password"
                              maxLength={4}
                              className="auth-input font-mono"
                              value={cardData.cvv}
                              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                              placeholder="•••"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-badges-row">
                        <span className="card-type-tag">Visa</span>
                        <span className="card-type-tag">Mastercard</span>
                        <span className="card-type-tag">RuPay</span>
                        <span className="card-type-tag">Amex</span>
                      </div>
                    </div>
                  )}

                  {/* OPTION 4: NET BANKING */}
                  {formData.paymentMethod === 'NetBanking' && (
                    <div className="netbanking-demo-card">
                      <p className="netbanking-hint">Select your preferred bank to proceed:</p>
                      <div className="bank-options-grid">
                        {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank, index) => (
                          <label key={bank} className={`bank-radio-label ${index === 0 ? 'selected' : ''}`}>
                            <input type="radio" name="bankSelect" defaultChecked={index === 0} />
                            <span>{bank}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Quick Summary */}
              <div className="modal-summary-pill">
                <span>Total Amount to Pay:</span>
                <strong className="modal-total-price">₹{orderTotal.toLocaleString('en-IN')}</strong>
              </div>

              {/* Submit Order Button */}
              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsCheckoutOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  <span>Confirm & Place Order (₹{orderTotal.toLocaleString('en-IN')})</span>
                  <CheckCircle2 size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

