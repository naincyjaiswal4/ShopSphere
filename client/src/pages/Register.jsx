import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ShoppingBag, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check again.');
      return;
    }
    setError('');
    alert(`Demo Registration submitted for: ${name} (${email})\n(Backend authentication will be integrated in future phases)`);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-box">
            <ShoppingBag size={24} />
          </div>
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Join ShopSphere to enjoy personalized recommendations and fast checkout</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <div className="input-wrap">
              <User size={18} className="input-icon" />
              <input
                id="name"
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">
              Email Address
            </label>
            <div className="input-wrap">
              <Mail size={18} className="input-icon" />
              <input
                id="reg-email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">
              Password
            </label>
            <div className="input-wrap">
              <Lock size={18} className="input-icon" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Create a strong password"
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

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">
              Confirm Password
            </label>
            <div className="input-wrap">
              <Lock size={18} className="input-icon" />
              <input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-submit-btn">
            <span>Register Now</span>
            <UserPlus size={18} />
          </button>
        </form>

        {/* Footer Redirect */}
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
