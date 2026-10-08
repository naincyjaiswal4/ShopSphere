import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageFallback';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShoppingBag,
  MapPin,
  CreditCard,
  Calendar,
  AlertCircle,
  ExternalLink,
  UserCheck,
  ShieldCheck,
  LogIn,
  RotateCcw,
  RefreshCw
} from 'lucide-react';

export default function Orders() {
  const { orders, refreshOrders } = useCart();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (refreshOrders) {
      refreshOrders();
    }
  }, [currentUser?.email]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to cancel Order #${orderId}? If already paid, the full refund will be initiated immediately.`)) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' })
      });
      if (res.ok) {
        if (refreshOrders) {
          await refreshOrders();
        }
      }
    } catch (err) {
      console.error('Failed to cancel order:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="order-badge status-delivered"><CheckCircle2 size={14} /> Delivered</span>;
      case 'shipped':
        return <span className="order-badge status-shipped"><Truck size={14} /> Shipped</span>;
      case 'out for delivery':
        return <span className="order-badge status-out"><Truck size={14} /> Out for Delivery</span>;
      case 'cancelled':
        return <span className="order-badge status-cancelled"><XCircle size={14} /> Cancelled</span>;
      case 'processing':
      default:
        return <span className="order-badge status-processing"><Clock size={14} /> Processing</span>;
    }
  };

  return (
    <div className="orders-page">
      <div className="container orders-container">
        {/* Page Header */}
        <div className="orders-header">
          <div>
            <span className="section-badge">
              {currentUser?.role === 'admin'
                ? '👑 Admin Order Management'
                : currentUser
                ? `👤 Account: ${currentUser.name}`
                : '📦 Guest Order Tracking'}
            </span>
            <h1 className="orders-title">
              {currentUser?.role === 'admin'
                ? 'All Customer Orders (Admin View)'
                : 'My Orders & Delivery History'}
            </h1>
          </div>
          <p className="orders-subtitle">
            {currentUser
              ? `Showing orders associated strictly with ${currentUser.email}. Track real-time shipment status and delivery details.`
              : 'Showing orders placed in this session. Log in to permanently sync orders with your profile.'}
          </p>
        </div>

        {orders.length === 0 ? (
          /* Empty Orders View */
          <div className="empty-orders-card">
            <div className="empty-orders-icon-wrap">
              <Package size={48} />
            </div>
            <h2>No Orders Placed For This Account</h2>
            <p>
              {currentUser
                ? `No orders found for ${currentUser.email}. Browse our catalog to place your first order!`
                : 'You have not placed any orders yet in this session.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '1rem' }}>
              <Link to="/products" className="btn-primary">
                <span>Start Shopping</span>
                <ArrowRight size={18} />
              </Link>
              {!currentUser && (
                <Link to="/login" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <LogIn size={16} />
                  <span>Log In to View Saved Orders</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* Orders List */
          <div className="orders-list">
            {orders.map((order) => {
              const currentStatus = (order.status || order.deliveryStatus || 'Processing').toLowerCase();
              const isCancelled = currentStatus === 'cancelled';
              const isDelivered = currentStatus === 'delivered';
              const isShipped = currentStatus === 'shipped' || isDelivered;
              const isProcessing = (currentStatus === 'processing' || isShipped) && !isCancelled;

              return (
                <div key={order.orderId || order._id} className={`order-card ${isCancelled ? 'order-card-cancelled' : ''}`}>
                  {/* Order Top Bar */}
                  <div className="order-top-bar">
                    <div className="order-meta-group">
                      <div className="order-id-block">
                        <span className="order-label">Order ID</span>
                        <strong className="order-id-val">{order.orderId}</strong>
                      </div>
                      <div className="order-date-block">
                        <span className="order-label">Placed On</span>
                        <span>{order.orderDate}</span>
                      </div>
                      {order.userName && (
                        <div className="order-user-block">
                          <span className="order-label">Customer</span>
                          <strong style={{ color: '#1B4332' }}>{order.userName}</strong>
                        </div>
                      )}
                      <div className="order-total-block">
                        <span className="order-label">Total Amount</span>
                        <strong className="order-total-val">₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    <div className="order-status-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {getStatusBadge(order.status || order.deliveryStatus)}

                      {!isCancelled && !isDelivered && currentStatus !== 'shipped' && (
                        <button
                          type="button"
                          className="btn-cancel-order"
                          onClick={() => handleCancelOrder(order.orderId || order._id)}
                          title="Cancel this order"
                        >
                          <XCircle size={14} />
                          <span>Cancel Order</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cancelled Order Notice Banner */}
                  {isCancelled && (
                    <div className="order-cancelled-banner">
                      <div className="cancelled-banner-icon">
                        <XCircle size={22} />
                      </div>
                      <div className="cancelled-banner-text">
                        <strong>Order Cancelled</strong>
                        <p>This order was cancelled. If payment was made online (UPI/Card/Net Banking), a full refund of ₹{order.totalAmount?.toLocaleString('en-IN')} is initiated back to your source account.</p>
                      </div>
                    </div>
                  )}

                  {/* Delivery Progress Bar */}
                  <div className="order-tracking-bar">
                    <div className="tracking-header">
                      <span className="est-delivery-text">
                        {isCancelled ? (
                          <span style={{ color: '#DC2626', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <XCircle size={16} /> Order Cancelled
                          </span>
                        ) : isDelivered ? (
                          <span style={{ color: '#2D6A4F', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle2 size={16} /> Package Successfully Delivered
                          </span>
                        ) : (
                          <>
                            <Truck size={16} className="truck-icon" /> Estimated Delivery by: <strong>{order.estimatedDelivery}</strong>
                          </>
                        )}
                      </span>
                      <span className={`tracking-live-tag ${isCancelled ? 'tag-cancelled' : ''}`}>
                        {isCancelled ? 'Status: Cancelled' : 'Live Tracking'}
                      </span>
                    </div>

                    {isCancelled ? (
                      /* Cancelled Order Timeline */
                      <div className="tracking-steps cancelled-steps">
                        <div className="step-item step-completed">
                          <div className="step-bullet"><CheckCircle2 size={16} /></div>
                          <span className="step-label">Order Placed</span>
                        </div>
                        <div className="step-line step-line-cancelled"></div>
                        <div className="step-item step-cancelled-node">
                          <div className="step-bullet"><XCircle size={16} /></div>
                          <span className="step-label step-label-cancelled">Cancelled</span>
                        </div>
                        <div className="step-line step-line-disabled"></div>
                        <div className="step-item step-disabled">
                          <div className="step-bullet">—</div>
                          <span className="step-label">Shipped</span>
                        </div>
                        <div className="step-line step-line-disabled"></div>
                        <div className="step-item step-disabled">
                          <div className="step-bullet">—</div>
                          <span className="step-label">Delivered</span>
                        </div>
                      </div>
                    ) : (
                      /* Active In-Progress Timeline */
                      <div className="tracking-steps">
                        {/* Step 1: Placed */}
                        <div className="step-item step-completed">
                          <div className="step-bullet"><CheckCircle2 size={16} /></div>
                          <span className="step-label">Order Placed</span>
                        </div>
                        <div className={`step-line ${isProcessing || isShipped ? 'step-line-active' : ''}`}></div>

                        {/* Step 2: Processing */}
                        <div className={`step-item ${isShipped ? 'step-completed' : 'step-active'}`}>
                          <div className="step-bullet">
                            {isShipped ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                          </div>
                          <span className="step-label">Processing</span>
                        </div>
                        <div className={`step-line ${isShipped ? 'step-line-active' : ''}`}></div>

                        {/* Step 3: Shipped */}
                        <div className={`step-item ${isDelivered ? 'step-completed' : currentStatus === 'shipped' ? 'step-active' : ''}`}>
                          <div className="step-bullet">
                            {isDelivered ? <CheckCircle2 size={16} /> : currentStatus === 'shipped' ? <Truck size={16} /> : '3'}
                          </div>
                          <span className="step-label">Shipped</span>
                        </div>
                        <div className={`step-line ${isDelivered ? 'step-line-active' : ''}`}></div>

                        {/* Step 4: Delivered */}
                        <div className={`step-item ${isDelivered ? 'step-completed' : ''}`}>
                          <div className="step-bullet">
                            {isDelivered ? <CheckCircle2 size={16} /> : '4'}
                          </div>
                          <span className="step-label">Delivered</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="order-items-section">
                    <h4 className="order-section-heading">Items in this shipment ({order.totalItems || order.items?.length || 1})</h4>
                    <div className="order-items-grid">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item-tile">
                          <Link to={`/product/${item.id || item._id}`} className="order-item-img-link">
                            <img src={item.image} alt={item.name} className="order-item-img" onError={handleImageError} />
                          </Link>
                          <div className="order-item-details">
                            <Link to={`/product/${item.id || item._id}`} className="order-item-title">
                              {item.name}
                            </Link>
                            <div className="order-item-price-qty">
                              <span>₹{item.price?.toLocaleString('en-IN')} × {item.quantity}</span>
                              <strong className="order-item-subtotal">
                                ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                              </strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer: Address & Payment Info */}
                  <div className="order-footer-details">
                    <div className="order-info-col">
                      <span className="info-label"><MapPin size={14} /> Shipping Address</span>
                      <p className="info-val">
                        {order.shippingAddress?.fullName} ({order.shippingAddress?.phone})<br />
                        {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </p>
                    </div>

                    <div className="order-info-col">
                      <span className="info-label"><CreditCard size={14} /> Payment Method</span>
                      <p className="info-val">{order.paymentMethod} (Paid ₹{order.totalAmount?.toLocaleString('en-IN')})</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
