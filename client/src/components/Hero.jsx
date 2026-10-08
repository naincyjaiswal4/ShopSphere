import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Sparkles, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        {/* Hero Left Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} className="badge-icon" />
            <span>Spring & Summer Collection 2026</span>
          </div>

          <h1 className="hero-title">
            Discover <span className="gradient-text">Amazing Products</span> for Modern Living
          </h1>

          <p className="hero-subtitle">
            Explore our handpicked curation of premium electronics, signature fashion, curated home decor, and high-performance sports equipment.
          </p>

          <div className="hero-cta-group">
            <Link to="/products" className="btn-primary hero-btn">
              <span>Shop Now</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#categories" className="btn-secondary">
              <span>Explore Categories</span>
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">1.2k+</span>
              <span className="stat-label">Verified Products</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">4.9 ★</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>

        {/* Hero Right Visual / Banner */}
        <div className="hero-visual">
          <div className="hero-card-wrapper">
            <div className="hero-image-box">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80"
                alt="ShopSphere Lifestyle Collection"
                className="hero-main-img"
                onError={handleImageError}
              />
              <div className="hero-overlay-badge">
                <span className="badge-tag">Hot Deal</span>
                <p className="badge-title">Up to 50% Off</p>
              </div>
            </div>

            {/* Floating Card 1 */}
            <div className="floating-card floating-card-left">
              <div className="floating-card-icon">
                <ShoppingCart size={20} />
              </div>
              <div>
                <p className="floating-card-title">Best Seller</p>
                <p className="floating-card-subtitle">Sony WH-1000XM5</p>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="floating-card floating-card-right">
              <div className="floating-star-badge">★★★★★</div>
              <p className="floating-card-title">Top Rated Store</p>
              <p className="floating-card-subtitle">100% Genuine Items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Highlights Bar */}
      <div className="trust-bar">
        <div className="container trust-grid">
          <div className="trust-item">
            <div className="trust-icon-box">
              <Truck size={22} />
            </div>
            <div>
              <h4>Free Express Delivery</h4>
              <p>On orders above ₹999</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4>Secure Payment</h4>
              <p>100% encrypted checkout</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <RotateCcw size={22} />
            </div>
            <div>
              <h4>30 Days Return</h4>
              <p>Hassle-free guarantee</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <Headphones size={22} />
            </div>
            <div>
              <h4>24/7 Support</h4>
              <p>Dedicated customer care</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
