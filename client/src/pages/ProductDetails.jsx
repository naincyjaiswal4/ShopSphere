import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_PRODUCTS } from '../data/products';
import { handleImageError } from '../utils/imageFallback';
import {
  Star,
  ShoppingCart,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle2,
  MessageSquareQuote,
  UserCheck,
  Minus,
  Plus
} from 'lucide-react';

export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart, showToast } = useCart();
  const { currentUser } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.product && isMounted) {
            setProduct(data.product);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch product from MongoDB API, checking static fallback:', err);
      }

      // Fallback search in static products
      if (isMounted) {
        const fallback = SAMPLE_PRODUCTS.find(
          (p) => String(p.id) === String(id) || String(p._id) === String(id)
        );
        setProduct(fallback || null);
        setLoading(false);
      }
    };

    fetchProductDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container details-loading-state" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', color: '#2D6A4F', fontWeight: 600 }}>
          Retrieving product specifications from MongoDB...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container not-found-container">
        <div className="not-found-card">
          <h2>Product Not Found</h2>
          <p>We couldn't find the product you're looking for with ID #{id}.</p>
          <Link to="/products" className="btn-primary">
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!currentUser) {
      showToast('Please log in to add items to your cart and checkout', 'info');
      navigate('/login');
      return;
    }
    setIsAdded(true);
    if (onAddToCart) {
      onAddToCart(product, quantity);
    } else {
      addToCart(product, quantity);
    }
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="product-details-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb">
          <Link to="/">Dashboard</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/home">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/products">Products</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Product Details Main Grid */}
        <div className="product-details-grid">
          {/* Left: Product Image */}
          <div className="product-gallery">
            <div className="main-image-wrapper">
              {product.discount && (
                <span className="details-discount-badge">-{product.discount}% OFF</span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="details-main-img"
                onError={handleImageError}
              />
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="product-info-panel">
            <div className="details-category-tag">{product.category}</div>
            <h1 className="details-title">{product.name}</h1>

            {/* Ratings & Reviews */}
            <div className="details-rating-row">
              <div className="stars-wrapper">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    fill={index < Math.floor(product.rating) ? '#f59e0b' : '#e2e8f0'}
                    color={index < Math.floor(product.rating) ? '#f59e0b' : '#e2e8f0'}
                  />
                ))}
                <span className="rating-score">{product.rating}</span>
              </div>
              <span className="rating-dot">•</span>
              <span className="reviews-count">{product.reviews} verified customer reviews</span>
              <span className="rating-dot">•</span>
              <span className="stock-badge">
                <CheckCircle2 size={14} color="#10b981" /> In Stock
              </span>
            </div>

            {/* Pricing Section in INR */}
            <div className="details-price-row">
              <span className="details-price">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <span className="details-orig-price">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
              )}
              {product.discount && (
                <span className="save-badge">Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}</span>
              )}
            </div>

            {/* Description */}
            <div className="details-desc-box">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Highlights / Features List */}
            {product.features && product.features.length > 0 && (
              <div className="details-features-box">
                <h3>Key Features</h3>
                <ul className="features-list">
                  {product.features.map((feat, idx) => (
                    <li key={idx}>
                      <Check size={16} className="feature-check" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="details-actions">
              <div className="quantity-control">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="qty-number">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                className={`details-add-cart-btn ${isAdded ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                {isAdded ? (
                  <>
                    <Check size={20} />
                    <span>Added {quantity} to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className={`details-icon-action ${isLiked ? 'liked' : ''}`}
                onClick={() => setIsLiked(!isLiked)}
                aria-label="Save to Wishlist"
              >
                <Heart size={20} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'currentColor'} />
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="details-trust-grid">
              <div className="trust-card">
                <Truck size={18} color="#2D6A4F" />
                <div>
                  <span className="trust-title">Free Express Shipping</span>
                  <span className="trust-sub">Orders above ₹999</span>
                </div>
              </div>

              <div className="trust-card">
                <RotateCcw size={18} color="#2D6A4F" />
                <div>
                  <span className="trust-title">30 Days Returns</span>
                  <span className="trust-sub">Hassle-free guarantee</span>
                </div>
              </div>

              <div className="trust-card">
                <ShieldCheck size={18} color="#2D6A4F" />
                <div>
                  <span className="trust-title">1-Year Warranty</span>
                  <span className="trust-sub">100% Genuine product</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section from MongoDB */}
        {product.customerReviews && product.customerReviews.length > 0 && (
          <section className="product-reviews-section mt-5" style={{ marginTop: '3rem' }}>
            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
              <div>
                <span className="section-badge">Verified Customer Feedback</span>
                <h2 className="section-title">Customer Reviews ({product.customerReviews.length})</h2>
              </div>
            </div>

            <div className="reviews-list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {product.customerReviews.map((rev, idx) => (
                <div key={rev._id || idx} className="review-card" style={{ background: '#FAFDFB', padding: '1.25rem', borderRadius: '12px', border: '1px solid #D8F3DC' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#D8F3DC', color: '#1B4332', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        {rev.userName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#1B4332' }}>{rev.userName}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#2D6A4F' }}>
                          <CheckCircle2 size={12} />
                          <span>Verified Buyer</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill={i < rev.rating ? '#F4A261' : '#e2e8f0'} color={i < rev.rating ? '#F4A261' : '#e2e8f0'} />
                      ))}
                    </div>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#102A1F', margin: '0.5rem 0 0.25rem' }}>
                    {rev.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#405B4E', lineHeight: '1.4' }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
