import React, { useState } from 'react';
import { ShoppingCart, Star, Check, Heart, Eye } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleAdd = () => {
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
      <div className="product-image-container">
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
            onClick={() => setIsLiked(!isLiked)}
            aria-label="Wishlist"
          >
            <Heart size={18} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'currentColor'} />
          </button>
          <button
            type="button"
            className="overlay-action-btn"
            onClick={() => alert(`Viewing details for ${product.name}`)}
            aria-label="Quick View"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

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

        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <div className="product-footer">
          <div className="product-pricing">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

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
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
