import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Shirt, Home as HomeIcon, Trophy, ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Smartphones, Audio, Wearables & Accessories',
    itemCount: '120+ Items',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    icon: Smartphone,
    color: '#4f46e5'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Apparel, Footwear, Designer Bags & Jewelry',
    itemCount: '350+ Items',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
    icon: Shirt,
    color: '#ec4899'
  },
  {
    id: 'home',
    name: 'Home & Living',
    description: 'Modern Decor, Lighting, Kitchen & Furniture',
    itemCount: '180+ Items',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    icon: HomeIcon,
    color: '#06b6d4'
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    description: 'Fitness Gear, Athletic Wear & Adventure Equipment',
    itemCount: '95+ Items',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    icon: Trophy,
    color: '#10b981'
  }
];

export default function Categories() {
  return (
    <section id="categories" className="categories-section">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="section-badge">Browse By Category</span>
            <h2 className="section-title">Explore Our Top Collections</h2>
          </div>
          <p className="section-subtitle">
            Find exactly what you are looking for across our carefully organized premium categories.
          </p>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div key={cat.id} className="category-card">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="category-img"
                  loading="lazy"
                />
                <div className="category-overlay"></div>
                <div className="category-content">
                  <div className="category-top">
                    <div className="category-icon-box" style={{ background: cat.color }}>
                      <IconComponent size={20} color="#ffffff" />
                    </div>
                    <span className="category-badge">{cat.itemCount}</span>
                  </div>
                  <div>
                    <h3 className="category-title">{cat.name}</h3>
                    <p className="category-desc">{cat.description}</p>
                  </div>
                  <Link to="/products" className="category-link">
                    <span>Shop Collection</span>
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
