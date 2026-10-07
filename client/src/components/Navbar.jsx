import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, User, ArrowRight } from 'lucide-react';

export default function Navbar({ cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      {/* Top Notification Bar */}
      <div className="announcement-bar">
        <div className="container announcement-content">
          <span>⚡ Flash Sale: Get up to 40% off on all trending products this week!</span>
          <a href="#products" className="announcement-link">
            Shop Now <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="navbar">
        <div className="container nav-container">
          {/* Logo */}
          <a href="#" className="nav-logo">
            <div className="logo-icon">
              <ShoppingBag size={22} />
            </div>
            <span className="logo-text">
              Shop<span className="logo-accent">Sphere</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            <li>
              <a href="#" className="nav-link active">Home</a>
            </li>
            <li>
              <a href="#categories" className="nav-link">Categories</a>
            </li>
            <li>
              <a href="#products" className="nav-link">Products</a>
            </li>
            <li>
              <a href="#deals" className="nav-link">Deals</a>
            </li>
          </ul>

          {/* Right Actions */}
          <div className="nav-actions">
            <a href="#products" className="icon-btn search-btn" aria-label="Search">
              <Search size={20} />
            </a>

            {/* Cart Button */}
            <a href="#products" className="cart-btn" aria-label="Shopping Cart">
              <div className="cart-icon-wrap">
                <ShoppingBag size={20} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <span className="cart-label">Cart</span>
            </a>

            {/* Login Button */}
            <button className="login-btn" type="button" onClick={() => alert('Login feature coming soon!')}>
              <User size={18} />
              <span>Login</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <ul className="mobile-nav-links">
              <li>
                <a href="#" onClick={() => setMobileMenuOpen(false)}>Home</a>
              </li>
              <li>
                <a href="#categories" onClick={() => setMobileMenuOpen(false)}>Categories</a>
              </li>
              <li>
                <a href="#products" onClick={() => setMobileMenuOpen(false)}>Products</a>
              </li>
              <li>
                <a href="#deals" onClick={() => setMobileMenuOpen(false)}>Deals</a>
              </li>
              <li className="mobile-menu-action">
                <button
                  className="login-btn w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    alert('Login feature coming soon!');
                  }}
                >
                  <User size={18} />
                  <span>Login / Register</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
