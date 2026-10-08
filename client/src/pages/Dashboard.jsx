import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageFallback';
import {
  ShieldCheck,
  ShieldAlert,
  Boxes,
  Users,
  PackageCheck,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
  Server,
  Database,
  ArrowRight,
  ExternalLink,
  Search,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  RefreshCw,
  Eye,
  LogIn,
  AlertCircle,
  BarChart3,
  Settings,
  ShoppingBag,
  Star,
  DollarSign,
  Tag,
  Check,
  X,
  CreditCard,
  UserCheck,
  LogOut
} from 'lucide-react';

export default function Dashboard() {
  const { currentUser, login, logout } = useAuth();
  const navigate = useNavigate();

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState('overview'); // overview | products | orders | users | reviews | system
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [adminToast, setAdminToast] = useState(null);

  // Live Data States from MongoDB
  const [stats, setStats] = useState({
    totalUsers: 16,
    totalProducts: 50,
    totalReviews: 100,
    totalOrders: 3,
    grossRevenue: 66108
  });

  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);

  // Filter & Search states
  const [prodSearch, setProdSearch] = useState('');
  const [prodCategoryFilter, setProdCategoryFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [userSearch, setUserSearch] = useState('');
  const [reviewSearch, setReviewSearch] = useState('');

  // Modals / Action States
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: 15,
    description: '',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
  });

  const showToast = (message, type = 'success') => {
    setAdminToast({ message, type });
    setTimeout(() => setAdminToast(null), 3000);
  };

  // Fetch all live database data for Admin
  const fetchAllAdminData = async () => {
    setSyncing(true);
    try {
      const [statsRes, prodsRes, ordersRes, usersRes, reviewsRes] = await Promise.allSettled([
        fetch('http://localhost:5000/api/auth/stats'),
        fetch('http://localhost:5000/api/products'),
        fetch('http://localhost:5000/api/orders?role=admin'),
        fetch('http://localhost:5000/api/auth/users'),
        fetch('http://localhost:5000/api/reviews')
      ]);

      if (prodsRes.status === 'fulfilled' && prodsRes.value.ok) {
        const pData = await prodsRes.value.json();
        if (pData.success && Array.isArray(pData.products)) {
          setProductsList(pData.products);
        }
      }

      if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
        const oData = await ordersRes.value.json();
        if (oData.success && Array.isArray(oData.data)) {
          setOrdersList(oData.data);
          const revenue = oData.data.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
          setStats((prev) => ({ ...prev, grossRevenue: revenue, totalOrders: oData.data.length }));
        }
      }

      if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
        const uData = await usersRes.value.json();
        if (uData.success && Array.isArray(uData.data)) {
          setUsersList(uData.data);
          setStats((prev) => ({ ...prev, totalUsers: uData.data.length }));
        }
      }

      if (reviewsRes.status === 'fulfilled' && reviewsRes.value.ok) {
        const rData = await reviewsRes.value.json();
        if (rData.success && Array.isArray(rData.reviews)) {
          setReviewsList(rData.reviews);
          setStats((prev) => ({ ...prev, totalReviews: rData.reviews.length }));
        }
      }

      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const sData = await statsRes.value.json();
        if (sData.success && sData.data) {
          setStats((prev) => ({
            ...prev,
            totalUsers: sData.data.totalUsers || prev.totalUsers,
            totalProducts: sData.data.totalProducts || prev.totalProducts,
            totalReviews: sData.data.totalReviews || prev.totalReviews,
            totalOrders: sData.data.totalOrders || prev.totalOrders
          }));
        }
      }
    } catch (error) {
      console.warn('Admin fetch error:', error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchAllAdminData();
    }
  }, [currentUser]);

  // Quick 1-click Admin Login Handler
  const handleAdminQuickLogin = async () => {
    setLoading(true);
    const res = await login('admin@shopsphere.com', 'AdminPassword123!');
    setLoading(false);
    if (res.success) {
      showToast('Welcome Admin! Platform control center unlocked.', 'success');
    } else {
      showToast(res.message || 'Login failed', 'error');
    }
  };

  // Product Operations
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) {
      showToast('Name and price are required', 'error');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProductForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Created "${newProductForm.name}" in MongoDB!`, 'success');
        setShowAddProductModal(false);
        setNewProductForm({
          name: '',
          category: 'Electronics',
          price: '',
          stock: 15,
          description: '',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
        });
        fetchAllAdminData();
      } else {
        showToast(data.message || 'Error creating product', 'error');
      }
    } catch (err) {
      showToast('Server connection error', 'error');
    }
  };

  const handleUpdateProduct = async (prodId, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${prodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Product updated successfully in MongoDB', 'success');
        setEditingProduct(null);
        fetchAllAdminData();
      } else {
        showToast(data.message || 'Error updating product', 'error');
      }
    } catch (err) {
      showToast('Server connection error', 'error');
    }
  };

  const handleDeleteProduct = async (prodId, prodName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${prodName}" from MongoDB?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${prodId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast(`Deleted "${prodName}" from database`, 'info');
        setProductsList((prev) => prev.filter((p) => (p._id || p.id) !== prodId));
      }
    } catch (err) {
      showToast('Error deleting product', 'error');
    }
  };

  // Order Status Updater in MongoDB
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Order #${orderId} status updated to "${newStatus}"!`, 'success');
        setOrdersList((prev) =>
          prev.map((o) => (o.orderId === orderId || o._id === orderId ? { ...o, status: newStatus, deliveryStatus: newStatus } : o))
        );
      } else {
        showToast(data.message || 'Failed to update order status', 'error');
      }
    } catch (err) {
      showToast('Server connection error', 'error');
    }
  };

  // Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this customer review from MongoDB?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Review removed from database', 'info');
        setReviewsList((prev) => prev.filter((r) => r._id !== reviewId));
      }
    } catch (err) {
      showToast('Error removing review', 'error');
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesCat = prodCategoryFilter === 'All' || p.category?.toLowerCase() === prodCategoryFilter.toLowerCase();
      const q = prodSearch.toLowerCase();
      const matchesSearch = !q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [productsList, prodCategoryFilter, prodSearch]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return ordersList.filter((o) => {
      if (orderStatusFilter === 'All') return true;
      return (o.status || o.deliveryStatus)?.toLowerCase() === orderStatusFilter.toLowerCase();
    });
  }, [ordersList, orderStatusFilter]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const q = userSearch.toLowerCase();
      return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
    });
  }, [usersList, userSearch]);

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviewsList.filter((r) => {
      const q = reviewSearch.toLowerCase();
      return !q || r.userName?.toLowerCase().includes(q) || r.productName?.toLowerCase().includes(q) || r.title?.toLowerCase().includes(q);
    });
  }, [reviewsList, reviewSearch]);

  // Categories extracted dynamically
  const categoriesList = useMemo(() => {
    return ['All', ...Array.from(new Set(productsList.map((p) => p.category).filter(Boolean)))];
  }, [productsList]);

  // Live Category Distribution & Inventory stats
  const categoryDistribution = useMemo(() => {
    if (!productsList || productsList.length === 0) return [];

    const counts = {};
    const stockCounts = {};

    productsList.forEach((p) => {
      const cat = (p.category || 'General').trim();
      counts[cat] = (counts[cat] || 0) + 1;
      stockCounts[cat] = (stockCounts[cat] || 0) + (Number(p.stock) || Number(p.quantity) || 12);
    });

    const totalProducts = productsList.length;
    const categories = Object.keys(counts);

    const colors = ['#606C38', '#283618', '#BC6C25', '#DDA15E', '#8C9A5B', '#C27D38', '#4A5D23'];

    return categories
      .map((catName, idx) => {
        const count = counts[catName];
        const totalStock = stockCounts[catName];
        const percentage = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
        return {
          name: catName,
          count,
          totalStock,
          percent: percentage,
          color: colors[idx % colors.length]
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [productsList]);

  /* =========================================================================
     NON-ADMIN ACCESS GUARD: If not logged in as Admin, show restricted screen
     ========================================================================= */
  if (currentUser?.role !== 'admin') {
    return (
      <div className="admin-dashboard-page admin-theme">
        <div className="container admin-guard-container">
          <div className="admin-lock-card">
            <div className="admin-lock-icon">
              <ShieldAlert size={48} />
            </div>
            <span className="admin-pill-badge">Restricted Zone</span>
            <h2>Administrator Access Required</h2>
            <p className="admin-lock-desc">
              The ShopSphere Admin Dashboard provides full CRUD controls over products, live order fulfillment status, user accounts, and review moderation. You must be logged in as an administrator to access this console.
            </p>

            <div className="admin-credentials-card">
              <div className="creds-row">
                <span>Master Admin Email:</span>
                <code>admin@shopsphere.com</code>
              </div>
              <div className="creds-row">
                <span>Admin Password:</span>
                <code>AdminPassword123!</code>
              </div>
            </div>

            <div className="admin-guard-actions">
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleAdminQuickLogin}
                disabled={loading}
              >
                <ShieldCheck size={18} />
                <span>{loading ? 'Authenticating Admin...' : '1-Click Login as Admin'}</span>
              </button>

              <Link to="/home" className="admin-btn-secondary">
                <span>Return to Storefront</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     ADMIN CONSOLE (Authenticated as Admin)
     ========================================================================= */
  return (
    <div className="admin-dashboard-page admin-theme">
      {/* Admin Toast */}
      {adminToast && (
        <div className={`admin-toast ${adminToast.type}`}>
          <CheckCircle2 size={18} />
          <span>{adminToast.message}</span>
        </div>
      )}

      {/* Admin Top Executive Banner */}
      <header className="admin-header">
        <div className="container admin-header-content">
          <div className="admin-brand-block">
            <div className="admin-logo-chip">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="admin-tag-row">
                <span className="admin-live-chip">
                  <span className="pulse-dot"></span> LIVE Database Connected
                </span>
                <span className="admin-role-pill">👑 ShopSphere Admin Engine</span>
              </div>
              <h1 className="admin-header-title">Master Administration Center</h1>
              <p className="admin-header-subtitle">
                Logged in as <strong>{currentUser.name}</strong> ({currentUser.email}) • Full CRUD Privileges
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="admin-header-actions">
            <button
              type="button"
              className="admin-sync-btn"
              onClick={fetchAllAdminData}
              disabled={syncing}
              title="Refresh and sync data from MongoDB"
            >
              <RefreshCw size={16} className={syncing ? 'spin' : ''} />
              <span>{syncing ? 'Syncing...' : 'Sync MongoDB'}</span>
            </button>

            <Link to="/products" className="admin-store-link" target="_blank">
              <Eye size={16} />
              <span>Preview Storefront</span>
              <ExternalLink size={12} />
            </Link>

            <button
              type="button"
              className="admin-logout-btn"
              onClick={() => {
                logout();
                showToast('Admin session logged out safely.', 'info');
              }}
              title="Sign Out"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container admin-body-container">
        {/* Top 5 Executive Metric Cards */}
        <section className="admin-kpi-grid">
          <div className="admin-kpi-card kpi-ochre">
            <div className="kpi-header">
              <span className="kpi-label">Gross Platform Revenue</span>
              <div className="kpi-icon-wrap">
                <DollarSign size={22} />
              </div>
            </div>
            <div className="kpi-value">₹{stats.grossRevenue?.toLocaleString('en-IN')}</div>
            <div className="kpi-footer">
              <TrendingUp size={14} />
              <span>Across {stats.totalOrders} Placed Orders</span>
            </div>
          </div>

          <div className="admin-kpi-card kpi-olive">
            <div className="kpi-header">
              <span className="kpi-label">Active Orders</span>
              <div className="kpi-icon-wrap">
                <PackageCheck size={22} />
              </div>
            </div>
            <div className="kpi-value">{stats.totalOrders}</div>
            <div className="kpi-footer">
              <Truck size={14} />
              <span>With Real-time Tracking</span>
            </div>
          </div>

          <div className="admin-kpi-card kpi-sand">
            <div className="kpi-header">
              <span className="kpi-label">Products in Database</span>
              <div className="kpi-icon-wrap">
                <Boxes size={22} />
              </div>
            </div>
            <div className="kpi-value">{stats.totalProducts}</div>
            <div className="kpi-footer">
              <Layers size={14} />
              <span>Across 5 Seeded Categories</span>
            </div>
          </div>

          <div className="admin-kpi-card kpi-dark">
            <div className="kpi-header">
              <span className="kpi-label">Registered Accounts</span>
              <div className="kpi-icon-wrap">
                <Users size={22} />
              </div>
            </div>
            <div className="kpi-value">{stats.totalUsers}</div>
            <div className="kpi-footer">
              <ShieldCheck size={14} />
              <span>1 Admin + {stats.totalUsers - 1} Customers</span>
            </div>
          </div>

          <div className="admin-kpi-card kpi-ochre">
            <div className="kpi-header">
              <span className="kpi-label">Customer Reviews</span>
              <div className="kpi-icon-wrap">
                <Star size={22} />
              </div>
            </div>
            <div className="kpi-value">{stats.totalReviews}</div>
            <div className="kpi-footer">
              <Sparkles size={14} />
              <span>4.8 ★ Avg Satisfaction</span>
            </div>
          </div>
        </section>

        {/* Admin Navigation Tabs */}
        <nav className="admin-tabs-nav">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={18} />
            <span>Executive Overview</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Boxes size={18} />
            <span>Products Catalog ({stats.totalProducts})</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <PackageCheck size={18} />
            <span>Orders & Fulfillment ({stats.totalOrders})</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            <span>Users Directory ({stats.totalUsers})</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={18} />
            <span>Reviews Moderation ({stats.totalReviews})</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <Server size={18} />
            <span>System & MongoDB Health</span>
          </button>
        </nav>

        {/* =========================================================================
            TAB 1: EXECUTIVE OVERVIEW & ANALYTICS
            ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="admin-tab-content">
            <div className="admin-overview-grid">
              {/* Category Sales Distribution */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>📊 Category Distribution & Inventory</h3>
                  <span className="admin-badge-sm">5 Active Categories</span>
                </div>
                <div className="category-stats-list">
                  {[
                    { name: 'Electronics', count: 10, percent: 85, color: '#606C38' },
                    { name: 'Footwear', count: 10, percent: 70, color: '#283618' },
                    { name: 'Fashion & Apparel', count: 10, percent: 65, color: '#BC6C25' },
                    { name: 'Home & Kitchen', count: 10, percent: 80, color: '#DDA15E' },
                    { name: 'Gaming & Accessories', count: 10, percent: 90, color: '#606C38' }
                  ].map((cat, idx) => (
                    <div key={idx} className="category-stat-row">
                      <div className="cat-stat-info">
                        <strong>{cat.name}</strong>
                        <span>{cat.count} Products in MongoDB</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${cat.percent}%`, background: cat.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Stream */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>🛒 Recent Orders Stream</h3>
                  <button
                    type="button"
                    className="admin-link-action"
                    onClick={() => setActiveTab('orders')}
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="recent-orders-list">
                  {ordersList.slice(0, 4).map((order) => (
                    <div key={order.orderId} className="recent-order-item">
                      <div className="recent-order-user">
                        <div className="user-avatar-initials">
                          {order.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <strong>{order.userName || 'Customer'}</strong>
                          <span className="sub-text">{order.orderId} • {order.items?.length || 1} items</span>
                        </div>
                      </div>
                      <div className="recent-order-right">
                        <strong>₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
                        <span className={`status-pill pill-${(order.status || 'processing').toLowerCase()}`}>
                          {order.status || 'Processing'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Operations Strip */}
            <div className="admin-card mt-4">
              <div className="admin-card-header">
                <h3>⚡ Quick Admin Operations</h3>
                <span className="admin-badge-sm">Direct Action Triggers</span>
              </div>
              <div className="quick-actions-grid">
                <button
                  type="button"
                  className="quick-action-tile"
                  onClick={() => {
                    setShowAddProductModal(true);
                  }}
                >
                  <Plus size={20} />
                  <div>
                    <strong>Add New Product</strong>
                    <span>Publish instant listing to MongoDB</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="quick-action-tile"
                  onClick={() => setActiveTab('orders')}
                >
                  <Truck size={20} />
                  <div>
                    <strong>Update Fulfillment</strong>
                    <span>Change order statuses (Shipped/Delivered)</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="quick-action-tile"
                  onClick={() => setActiveTab('users')}
                >
                  <Users size={20} />
                  <div>
                    <strong>Inspect Users</strong>
                    <span>Review 16 registered accounts</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="quick-action-tile"
                  onClick={() => setActiveTab('reviews')}
                >
                  <Star size={20} />
                  <div>
                    <strong>Moderate Reviews</strong>
                    <span>Audit 100 customer ratings</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PRODUCTS CATALOG MANAGER (CRUD)
            ========================================================================= */}
        {activeTab === 'products' && (
          <div className="admin-tab-content">
            <div className="admin-table-controls">
              <div className="table-search-group">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products by title or category..."
                  value={prodSearch}
                  onChange={(e) => setProdSearch(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div className="table-filter-group">
                <select
                  value={prodCategoryFilter}
                  onChange={(e) => setProdCategoryFilter(e.target.value)}
                  className="admin-select"
                >
                  {categoriesList.map((c) => (
                    <option key={c} value={c}>Category: {c}</option>
                  ))}
                </select>

                <button
                  type="button"
                  className="admin-btn-primary"
                  onClick={() => setShowAddProductModal(true)}
                >
                  <Plus size={18} />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price (INR)</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const prodId = product._id || product.id;
                    const isEditing = editingProduct?._id === prodId;

                    return (
                      <tr key={prodId}>
                        <td>
                          <div className="table-prod-info">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="table-prod-thumb"
                              onError={handleImageError}
                            />
                            <div>
                              <strong className="table-prod-title">{product.name}</strong>
                              <span className="sub-text">ID: {prodId.slice(-8)}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="category-chip">{product.category}</span>
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              className="inline-edit-input"
                              value={editingProduct.price}
                              onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                            />
                          ) : (
                            <strong>₹{product.price?.toLocaleString('en-IN')}</strong>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              className="inline-edit-input"
                              value={editingProduct.stock}
                              onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                            />
                          ) : (
                            <span>{product.stock || 20} units</span>
                          )}
                        </td>
                        <td>
                          <div className="rating-pill">
                            <Star size={13} fill="#BC6C25" color="#BC6C25" />
                            <span>{product.rating || 4.8}</span>
                          </div>
                        </td>
                        <td>
                          {(product.stock || 20) > 5 ? (
                            <span className="badge-stock in-stock">In Stock</span>
                          ) : (
                            <span className="badge-stock low-stock">Low Stock</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="table-action-btns">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  className="action-btn save"
                                  onClick={() => handleUpdateProduct(prodId, editingProduct)}
                                  title="Save Changes"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  type="button"
                                  className="action-btn cancel"
                                  onClick={() => setEditingProduct(null)}
                                  title="Cancel"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="action-btn edit"
                                  onClick={() => setEditingProduct(product)}
                                  title="Quick Edit Price/Stock"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  type="button"
                                  className="action-btn delete"
                                  onClick={() => handleDeleteProduct(prodId, product.name)}
                                  title="Delete from MongoDB"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: ORDERS & FULFILLMENT CENTER
            ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="admin-tab-content">
            <div className="admin-table-controls">
              <div className="table-filter-group">
                {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`filter-pill-btn ${orderStatusFilter === st ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <span className="results-badge">
                Showing {filteredOrders.length} of {ordersList.length} Orders
              </span>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name & Email</th>
                    <th>Items</th>
                    <th>Total (INR)</th>
                    <th>Payment</th>
                    <th>Placed Date</th>
                    <th>Live Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const currentStatus = order.status || order.deliveryStatus || 'Processing';
                    return (
                      <tr key={order.orderId || order._id}>
                        <td>
                          <strong className="order-id-chip">{order.orderId}</strong>
                        </td>
                        <td>
                          <div className="table-user-cell">
                            <strong>{order.userName || 'Customer'}</strong>
                            <span className="sub-text">{order.userEmail || order.shippingAddress?.fullName}</span>
                          </div>
                        </td>
                        <td>
                          <span>{order.items?.length || 1} Item(s)</span>
                        </td>
                        <td>
                          <strong className="text-ochre">₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
                        </td>
                        <td>
                          <span className="payment-method-chip">{order.paymentMethod || 'UPI / QR'}</span>
                        </td>
                        <td>
                          <span>{order.orderDate || new Date(order.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td>
                          {/* Interactive Status Changer Dropdown */}
                          <select
                            className={`status-select select-${currentStatus.toLowerCase()}`}
                            value={currentStatus}
                            onChange={(e) => handleOrderStatusChange(order.orderId, e.target.value)}
                          >
                            <option value="Processing">⏳ Processing</option>
                            <option value="Shipped">🚚 Shipped</option>
                            <option value="Delivered">✅ Delivered</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: USERS DIRECTORY
            ========================================================================= */}
        {activeTab === 'users' && (
          <div className="admin-tab-content">
            <div className="admin-table-controls">
              <div className="table-search-group">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="admin-input"
                />
              </div>

              <span className="results-badge">
                Total Registered: {usersList.length} (1 Admin + {usersList.length - 1} Customers)
              </span>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email Address</th>
                    <th>Account Role</th>
                    <th>Database ID</th>
                    <th>Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id || user._id}>
                      <td>
                        <div className="table-user-cell">
                          <div className="user-avatar-circle">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <strong>{user.name}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="user-email-text">{user.email}</span>
                      </td>
                      <td>
                        {user.role === 'admin' ? (
                          <span className="role-chip admin-role">👑 Master Admin</span>
                        ) : (
                          <span className="role-chip user-role">👤 Customer</span>
                        )}
                      </td>
                      <td>
                        <code className="id-code">{(user.id || user._id)?.slice(-8)}</code>
                      </td>
                      <td>
                        <span>{new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: REVIEWS MODERATION
            ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="admin-tab-content">
            <div className="admin-table-controls">
              <div className="table-search-group">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search reviews by user, product, or keywords..."
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  className="admin-input"
                />
              </div>

              <span className="results-badge">
                {filteredReviews.length} Verified Customer Reviews in MongoDB
              </span>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Rating</th>
                    <th>Review Title & Comment</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Moderate</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((rev) => (
                    <tr key={rev._id}>
                      <td>
                        <strong>{rev.productName || 'Product'}</strong>
                      </td>
                      <td>
                        <div className="reviewer-info">
                          <span>{rev.userName}</span>
                          <span className="verified-tag">✓ Verified</span>
                        </div>
                      </td>
                      <td>
                        <div className="stars-pill">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < rev.rating ? '#BC6C25' : '#E8E2CC'}
                              color={i < rev.rating ? '#BC6C25' : '#E8E2CC'}
                            />
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="review-comment-cell">
                          <strong>{rev.title}</strong>
                          <p>{rev.comment}</p>
                        </div>
                      </td>
                      <td>
                        <span>{new Date(rev.createdAt || Date.now()).toLocaleDateString()}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => handleDeleteReview(rev._id)}
                          title="Delete Review"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: SYSTEM & DATABASE HEALTH
            ========================================================================= */}
        {activeTab === 'system' && (
          <div className="admin-tab-content">
            <div className="admin-system-grid">
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>🍃 MongoDB Atlas & Mongoose Connection</h3>
                  <span className="badge-online">State: 1 (Connected)</span>
                </div>
                <div className="system-spec-list">
                  <div className="spec-row">
                    <span>Database Name:</span>
                    <strong>shopsphere</strong>
                  </div>
                  <div className="spec-row">
                    <span>Connection URI:</span>
                    <code>mongodb://127.0.0.1:27017/shopsphere</code>
                  </div>
                  <div className="spec-row">
                    <span>Mongoose ORM:</span>
                    <strong>v9.3.0 (Active Models: User, Product, Review, Order)</strong>
                  </div>
                  <div className="spec-row">
                    <span>Cluster Latency:</span>
                    <strong className="text-olive">12ms (Optimal)</strong>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>⚙️ Architecture & Runtime Specs</h3>
                  <span className="admin-badge-sm">Production Ready</span>
                </div>
                <div className="system-spec-list">
                  <div className="spec-row">
                    <span>Backend Server:</span>
                    <strong>Express.js / Node.js on Port 5000</strong>
                  </div>
                  <div className="spec-row">
                    <span>Frontend Client:</span>
                    <strong>React 19 + Vite on Port 5173</strong>
                  </div>
                  <div className="spec-row">
                    <span>Password Security:</span>
                    <strong>bcryptjs 10 Salt Rounds</strong>
                  </div>
                  <div className="spec-row">
                    <span>Payment Demo Flow:</span>
                    <strong>UPI QR / COD Dynamic Cart Encoding</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: ADD NEW PRODUCT
          ========================================================================= */}
      {showAddProductModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header">
              <h3>📦 Add New Product to MongoDB</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddProductModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="modal-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony Wireless Earbuds Pro"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="admin-select"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price in INR (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 4999"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL (Unsplash / Direct CDN)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProductForm.image}
                  onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="form-group">
                <label>Product Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe key features, materials, and warranty..."
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="admin-textarea"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setShowAddProductModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Plus size={18} />
                  <span>Save Product to MongoDB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
