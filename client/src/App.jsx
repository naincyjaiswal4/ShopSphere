import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import { SAMPLE_PRODUCTS } from './data/products';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import './App.css';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];

  const filteredProducts = selectedCategory === 'All'
    ? SAMPLE_PRODUCTS
    : SAMPLE_PRODUCTS.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleAddToCart = (product) => {
    setCartCount(prev => prev + 1);
    setToastMessage(`Added "${product.name.slice(0, 24)}..." to your cart!`);
    
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="shopsphere-app">
      {/* 1. Header & Navigation */}
      <Navbar cartCount={cartCount} />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Categories Section */}
      <Categories />

      {/* 4. Featured Products Section */}
      <section id="products" className="products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-badge">Curated Catalog</span>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <p className="section-subtitle">
              Discover our top-rated trending selections with exclusive pricing and verified quality.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="products-filter-bar">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'All' ? 'All Products (8)' : cat}
              </button>
            ))}
          </div>

          {/* 8 Sample Products Grid */}
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Promotional Call-to-Action Banner */}
      <section id="deals" className="promo-section">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-content">
              <h2>Join ShopSphere Premium Club</h2>
              <p>
                Get unlimited free express delivery, early access to limited edition drops, and extra 10% cash rewards on every checkout.
              </p>
              <a href="#products" className="promo-btn">
                <span>Unlock Exclusive Member Perks</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <Footer />

      {/* Interactive Cart Notification Toast */}
      {toastMessage && (
        <div className="cart-toast">
          <CheckCircle2 size={20} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
