import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import ProductCard from '../components/ProductCard';
import { SAMPLE_PRODUCTS } from '../data/products';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

export default function Home({ onAddToCart }) {
  // Show first 8 featured products on Home page
  const featuredProducts = SAMPLE_PRODUCTS.slice(0, 8);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <Categories />

      {/* Featured Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-badge">Trending Selections</span>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/products" className="view-all-link">
              <span>View All 12 Products</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-content">
              <h2>Join ShopSphere Premium Club</h2>
              <p>
                Get unlimited free express delivery, early access to limited edition drops, and extra 10% rewards on every checkout.
              </p>
              <Link to="/products" className="promo-btn">
                <span>Explore Catalog</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
