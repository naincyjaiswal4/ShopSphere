import React from 'react';
import { ShoppingBag, Mail, Phone, MapPin, Send, Heart, ArrowRight } from 'lucide-react';

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
            <a href="#" className="footer-logo">
              <div className="logo-icon">
                <ShoppingBag size={20} />
              </div>
              <span className="logo-text">
                Shop<span className="logo-accent">Sphere</span>
              </span>
            </a>
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
              <li><a href="#">Home</a></li>
              <li><a href="#categories">Shop Categories</a></li>
              <li><a href="#products">Featured Products</a></li>
              <li><a href="#deals">Special Offers</a></li>
              <li><a href="#">Trending Now</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="footer-col">
            <h4 className="footer-col-title">Customer Service</h4>
            <ul className="footer-links-list">
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Shipping & Returns</a></li>
              <li><a href="#">Payment Methods</a></li>
              <li><a href="#">Help Center / FAQ</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links-list">
              <li><a href="#">About ShopSphere</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Affiliate Program</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <span>•</span>
            <a href="#">Terms</a>
            <span>•</span>
            <a href="#">Cookies</a>
            <span>•</span>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
