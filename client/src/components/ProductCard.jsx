import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Check, Heart, Eye, ArrowRight } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    if (onAddToCart) {
      onAddToCart(product);
    }
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="product-card">
      {/* Product Image Container */}
      <Link to={`/product/${product.id}`} className="product-image-container">
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
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>{product.rating}</span>
            <span className="rating-count">({product.reviews})</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <div className="product-pricing">
          <span className="current-price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Action Buttons: View Details + Add to Cart */}
        <div className="product-actions-group">
          <Link
            to={`/product/${product.id}`}
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
