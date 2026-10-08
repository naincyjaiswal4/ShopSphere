import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  ArrowRight,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  Database,
  Activity
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, orders, showToast } = useCart();
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  // If Admin is logged in, show dedicated Admin Header (Locking out customer storefront navigation)
  if (isAdmin || currentUser?.role === 'admin') {
    return (
      <header className="navbar-wrapper admin-navbar-wrapper">
        <div className="announcement-bar admin-announcement-bar">
          <div className="container announcement-content" style={{ justifyContent: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', fontWeight: '700' }}>
              <ShieldCheck size={16} /> ShopSphere Administrator Management Console • Connected to MongoDB Live
            </span>
          </div>
        </div>

        <nav className="navbar admin-navbar">
          <div className="container nav-container">
            {/* Logo linked strictly to /admin */}
            <Link to="/admin" className="nav-logo">
              <div className="logo-icon admin-logo-icon">
                <ShieldCheck size={22} />
              </div>
              <span className="logo-text">
                Shop<span className="logo-accent">Sphere</span> <span style={{ fontSize: '0.85rem', color: '#606C38', fontWeight: '800', marginLeft: '4px' }}>ADMIN</span>
              </span>
            </Link>

            {/* Admin Console Badges */}
            <div className="admin-nav-center" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="admin-status-indicator" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', padding: '4px 12px', borderRadius: '100px', background: '#FEFAE0', color: '#283618', border: '1px solid #DDA15E' }}>
                <Activity size={14} color="#606C38" /> Admin Portal Active
              </span>
            </div>

            {/* Admin User Profile & Logout */}
            <div className="nav-actions">
              <div className="nav-user-profile-box admin-user-box" style={{ background: '#FEFAE0', borderColor: '#DDA15E' }}>
                <div className="nav-user-info">
                  <div className="nav-user-avatar" style={{ background: '#283618', color: '#FEFAE0' }}>
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="nav-user-meta">
                    <span className="nav-user-name" style={{ color: '#283618' }}>{currentUser?.name || 'Administrator'}</span>
                    <span className="nav-badge-admin" style={{ background: '#606C38', color: '#ffffff' }}>👑 Super Admin</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="nav-logout-btn"
                  onClick={handleLogout}
                  title="Logout from Admin Console"
                  aria-label="Logout"
                >
                  <LogOut size={16} color="#BC6C25" />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  // Standard Customer Storefront Navbar
  return (
    <header className="navbar-wrapper">
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="container announcement-content">
          <span>⚡ Free Express Shipping across India on all orders above ₹999!</span>
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
            {currentUser && (
              <>
                <li>
                  <NavLink
                    to="/orders"
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    Orders {orders.length > 0 && <span className="nav-orders-pill">{orders.length}</span>}
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
              </>
            )}
          </ul>

          {/* Right Actions */}
          <div className="nav-actions">
            <Link to="/products" className="icon-btn search-btn" aria-label="Search Products">
              <Search size={20} />
            </Link>

            {/* Cart Button (Only visible for logged in user) */}
            {currentUser && (
              <Link to="/cart" className="cart-btn" aria-label="Shopping Cart">
                <div className="cart-icon-wrap">
                  <ShoppingBag size={20} />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </div>
                <span className="cart-label">Cart</span>
              </Link>
            )}

            {/* Auth User Section */}
            {currentUser ? (
              <div className="nav-user-profile-box">
                <div className="nav-user-info">
                  <div className="nav-user-avatar">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="nav-user-meta">
                    <span className="nav-user-name">{currentUser.name?.split(' ')[0]}</span>
                    <span className="nav-badge-user">User</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="nav-logout-btn"
                  onClick={handleLogout}
                  title="Logout from account"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                <User size={18} />
                <span>Login</span>
              </Link>
            )}

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
                  Home Storefront
                </Link>
              </li>
              <li>
                <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                  Products Catalog
                </Link>
              </li>
              {currentUser && (
                <>
                  <li>
                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                      My Orders ({orders.length})
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                      Cart ({cartCount})
                    </Link>
                  </li>
                </>
              )}
              <li className="mobile-menu-action">
                {currentUser ? (
                  <button
                    type="button"
                    className="login-btn w-full"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut size={18} />
                    <span>Logout ({currentUser.name})</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="login-btn w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Login / Register</span>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
