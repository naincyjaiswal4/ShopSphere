import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="newsletter-banner">
        <div className="container newsletter-container">
          <div className="newsletter-text">
            <h3>Subscribe to Our Newsletter</h3>
            <p>Get exclusive early access to new releases, flash deals, and 15% off your first order.</p>
          </div>
          <form
            className="newsletter-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing to ShopSphere!');
            }}
          >
            <input
              type="email"
              placeholder="Enter your email address..."
              required
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">
              <span>Subscribe</span>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container footer-main">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">
                <ShoppingBag size={20} />
              </div>
              <span className="logo-text">
                Shop<span className="logo-accent">Sphere</span>
              </span>
            </Link>
            <p className="footer-desc">
              Your premier destination for high quality lifestyle, electronics, fashion, and everyday essentials. Delivered seamlessly to your doorstep.
            </p>
            <div className="contact-info">
              <p><MapPin size={16} /> 100 Commerce Boulevard, Suite 500, New York, NY</p>
              <p><Phone size={16} /> +1 (800) 555-0199</p>
              <p><Mail size={16} /> support@shopsphere.io</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Browse All Products</Link></li>
              <li><Link to="/cart">My Shopping Cart</Link></li>
              <li><Link to="/login">Account Login</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="footer-col">
            <h4 className="footer-col-title">Customer Service</h4>
            <ul className="footer-links-list">
              <li><Link to="/products">Track Order</Link></li>
              <li><Link to="/products">Shipping & Returns</Link></li>
              <li><Link to="/products">Payment Methods</Link></li>
              <li><Link to="/products">Help Center / FAQ</Link></li>
              <li><Link to="/products">Contact Support</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links-list">
              <li><Link to="/">About ShopSphere</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
              <li><Link to="/">Affiliate Program</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/">Privacy</Link>
            <span>•</span>
            <Link to="/">Terms</Link>
            <span>•</span>
            <Link to="/">Cookies</Link>
            <span>•</span>
            <Link to="/">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
