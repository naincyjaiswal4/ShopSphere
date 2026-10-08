import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Mail,
  Lock,
  LogIn,
  ShoppingBag,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  UserCheck,
  Sparkles
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, loading, currentUser } = useAuth();
  const { showToast } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const result = await login(email, password);

    if (result.success) {
      showToast(
        `👋 Welcome back, ${result.user.name}! (${result.user.role === 'admin' ? 'Admin' : 'Customer'})`,
        'success'
      );
      if (result.user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/products');
      }
    } else {
      setErrorMsg(result.message || 'Invalid email or password');
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-box">
            <ShoppingBag size={24} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to your account authenticated via MongoDB database
          </p>
        </div>

        {/* Quick Demo Credentials Pill Selector */}
        <div className="quick-demo-auth-box">
          <span className="quick-demo-label">
            <Sparkles size={13} /> Quick Login with Seeded MongoDB Accounts:
          </span>
          <div className="quick-demo-btns">
            <button
              type="button"
              className="quick-demo-pill admin"
              onClick={() => handleQuickFill('admin@shopsphere.com', 'AdminPassword123!')}
            >
              👑 Admin (admin@shopsphere.com)
            </button>
            <button
              type="button"
              className="quick-demo-pill user"
              onClick={() => handleQuickFill('aarav.mehta@example.com', 'UserPassword123!')}
            >
              👤 Customer (aarav.mehta@example.com)
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrap">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password" className="form-label">
                Password
              </label>
            </div>
            <div className="input-wrap">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? (
              <span>Authenticating with MongoDB...</span>
            ) : (
              <>
                <span>Sign In with MongoDB</span>
                <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Redirect */}
        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <Link to="/register" className="auth-link">
              Create an account <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

