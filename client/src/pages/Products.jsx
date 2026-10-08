import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { SAMPLE_PRODUCTS } from '../data/products';
import { Search, SlidersHorizontal, ArrowUpDown, Database, RefreshCw } from 'lucide-react';

export default function Products({ onAddToCart }) {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [isFromDB, setIsFromDB] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Fetch all 50 products from MongoDB backend API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          setIsFromDB(true);
        }
      }
    } catch (error) {
      console.warn('Could not fetch from MongoDB API, using static products fallback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Compute unique categories dynamically from the loaded products
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    );
    return ['All', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b._id || b.id || '').localeCompare?.(a._id || a.id || '') || 0; // default featured/latest
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="products-page">
      {/* Header Banner */}
      <div className="page-banner">
        <div className="container">
          <div className="banner-badge-row">
            <span className="section-badge">
              <Database size={14} style={{ marginRight: '6px' }} />
              {isFromDB ? `MongoDB Connected (${products.length} Products)` : 'Product Catalog'}
            </span>
          </div>
          <h1 className="page-title">Explore All Products</h1>
          <p className="page-subtitle">
            Browse our complete collection of {products.length} premium products fetched directly from MongoDB with verified user reviews.
          </p>
        </div>
      </div>

      <div className="container products-page-container">
        {/* Filter and Search Controls */}
        <div className="products-controls">
          {/* Category Tabs */}
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Bar */}
          <div className="search-sort-group">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search products by title, category, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="sort-box">
              <ArrowUpDown size={16} className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
                aria-label="Sort products"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="results-header">
          <p className="results-count">
            Showing <strong>{filteredProducts.length}</strong> of {products.length} products
            {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          </p>

          <button
            type="button"
            className="refresh-btn"
            onClick={fetchProducts}
            title="Refresh from MongoDB"
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Sync MongoDB</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && products.length === 0 ? (
          <div className="products-loading-state">
            <div className="spinner"></div>
            <p>Fetching 50 products from MongoDB database...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="empty-results">
            <h3>No products found</h3>
            <p>Try changing your search term or select another category filter.</p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
