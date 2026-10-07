import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SAMPLE_PRODUCTS } from '../data/products';
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
  CheckCircle2
} from 'lucide-react';

export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Find product by id from SAMPLE_PRODUCTS
  const product = SAMPLE_PRODUCTS.find((p) => p.id === parseInt(id, 10));

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
    setIsAdded(true);
    if (onAddToCart) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart(product);
      }
    }
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="product-details-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
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

            {/* Pricing Section */}
            <div className="details-price-row">
              <span className="details-price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="details-orig-price">${product.originalPrice.toFixed(2)}</span>
              )}
              {product.discount && (
                <span className="save-badge">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
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
                >
                  -
                </button>
                <span className="qty-number">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
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
                <Truck size={18} color="#4f46e5" />
                <div>
                  <span className="trust-title">Free Express Shipping</span>
                  <span className="trust-sub">Estimated delivery 2-4 days</span>
                </div>
              </div>

              <div className="trust-card">
                <RotateCcw size={18} color="#4f46e5" />
                <div>
                  <span className="trust-title">30 Days Returns</span>
                  <span className="trust-sub">Hassle-free guarantee</span>
                </div>
              </div>

              <div className="trust-card">
                <ShieldCheck size={18} color="#4f46e5" />
                <div>
                  <span className="trust-title">2-Year Warranty</span>
                  <span className="trust-sub">100% Genuine product</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
