import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';

export default function Cart({ cartCount = 0 }) {
  return (
    <div className="cart-page">
      <div className="container cart-container">
        {/* Empty Cart View */}
        <div className="empty-cart-card">
          <div className="empty-cart-icon-wrap">
            <ShoppingBag size={48} className="empty-cart-icon" />
          </div>

          <h1 className="empty-cart-title">Your cart is empty</h1>
          <p className="empty-cart-text">
            Looks like you haven't added anything to your cart yet. Explore our curated collections to find premium items!
          </p>

          <Link to="/products" className="btn-primary start-shopping-btn">
            <span>Start Shopping</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Benefits Grid */}
        <div className="cart-benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <Truck size={24} />
            </div>
            <h3>Free Express Delivery</h3>
            <p>On all domestic orders over $50 with real-time tracking.</p>
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
    </div>
  );
}
