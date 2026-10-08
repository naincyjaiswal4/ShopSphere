import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Star, Check, Heart, Eye, ArrowRight } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

export default function ProductCard({ product, onAddToCart }) {
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart, showToast } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const productId = product._id || product.id;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      showToast('Please log in to add items to your cart', 'info');
      navigate('/login');
      return;
    }

    setIsAdded(true);

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1);
    }

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="product-card">
      {/* Product Image Container */}
      <Link to={`/product/${productId}`} className="product-image-container">
        {product.discount && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
        {product.isFeatured && (
          <span className="featured-badge">Featured</span>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={handleImageError}
        />

        {/* Quick Actions Hover Overlay */}
        <div className="product-overlay-actions">
          <button
            type="button"
            className={`overlay-action-btn ${isLiked ? 'liked' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            aria-label="Wishlist"
          >
            <Heart size={18} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'currentColor'} />
          </button>
          <span className="overlay-action-btn" aria-label="View Details">
            <Eye size={18} />
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="product-details">
        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          <div className="product-rating">
            <Star size={14} fill="#F4A261" color="#F4A261" />
            <span>{product.rating || 4.8}</span>
            <span className="rating-count">({product.reviews || 24})</span>
          </div>
        </div>

        <Link to={`/product/${productId}`}>
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* Pricing in INR */}
        <div className="product-pricing">
          <span className="current-price">₹{product.price?.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Action Buttons: View Details + Add to Cart */}
        <div className="product-actions-group">
          <Link
            to={`/product/${productId}`}
            className="view-details-btn"
          >
            <span>View Details</span>
            <ArrowRight size={14} />
          </Link>

          <button
            type="button"
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <Check size={16} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
