import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, ArrowRight } from 'lucide-react';

export default function Navbar({ cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="container announcement-content">
          <span>⚡ Spring Sale: Enjoy up to 25% off across featured collections!</span>
          <Link to="/products" className="announcement-link">
            Shop Catalog <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="navbar">
        <div className="container nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="logo-icon">
              <ShoppingBag size={22} />
            </div>
            <span className="logo-text">
              Shop<span className="logo-accent">Sphere</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/cart"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Cart
              </NavLink>
            </li>
          </ul>

          {/* Right Actions */}
          <div className="nav-actions">
            <Link to="/products" className="icon-btn search-btn" aria-label="Search Products">
              <Search size={20} />
            </Link>

            {/* Cart Button */}
            <Link to="/cart" className="cart-btn" aria-label="Shopping Cart">
              <div className="cart-icon-wrap">
                <ShoppingBag size={20} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <span className="cart-label">Cart</span>
            </Link>

            {/* Login Button */}
            <Link to="/login" className="login-btn">
              <User size={18} />
              <span>Login</span>
            </Link>

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
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                  Cart ({cartCount})
                </Link>
              </li>
              <li className="mobile-menu-action">
                <Link
                  to="/login"
                  className="login-btn w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Login / Register</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
