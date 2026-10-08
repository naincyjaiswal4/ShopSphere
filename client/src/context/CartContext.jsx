import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { currentUser } = useAuth();

  // Helper to compute user-isolated storage key
  const getUserKey = (user) => {
    if (!user) return 'guest';
    return String(user.id || user._id || user.email || 'guest').toLowerCase();
  };

  const currentKey = getUserKey(currentUser);

  // Initialize cart items from user-isolated localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(`shopsphere_cart_${currentKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Initialize placed orders from user-isolated localStorage
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(`shopsphere_orders_${currentKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState(null);
  const activeUserKeyRef = useRef(currentKey);

  // When user logs in, logs out, or switches accounts: switch cart and orders immediately
  useEffect(() => {
    activeUserKeyRef.current = currentKey;

    // 1. Load this specific user's cart from their isolated localStorage key
    try {
      const savedCart = localStorage.getItem(`shopsphere_cart_${currentKey}`);
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    } catch {
      setCartItems([]);
    }

    // 2. Fetch this specific user's orders from MongoDB (or local storage for guest)
    fetchUserOrders();
  }, [currentKey, currentUser?.email, currentUser?.role]);

  const fetchUserOrders = async () => {
    try {
      let url = 'http://localhost:5000/api/orders';

      if (currentUser?.role === 'admin') {
        // Admin sees all system orders
        url += '?role=admin';
      } else if (currentUser?.email) {
        // Regular user gets ONLY their own orders
        url += `?userEmail=${encodeURIComponent(currentUser.email.toLowerCase())}`;
      } else {
        // Guest: read from guest local storage
        const savedGuestOrders = localStorage.getItem('shopsphere_orders_guest');
        setOrders(savedGuestOrders ? JSON.parse(savedGuestOrders) : []);
        return;
      }

      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const formatted = json.data.map((order) => ({
            ...order,
            orderDate:
              order.orderDate ||
              new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
            deliveryStatus: order.status || order.deliveryStatus || 'Processing'
          }));
          setOrders(formatted);
          localStorage.setItem(`shopsphere_orders_${currentKey}`, JSON.stringify(formatted));
          return;
        }
      }
    } catch (err) {
      console.warn('Could not sync orders from MongoDB, reading from user localStorage:', err);
    }

    // Fallback to user-isolated localStorage
    try {
      const localSaved = localStorage.getItem(`shopsphere_orders_${currentKey}`);
      setOrders(localSaved ? JSON.parse(localSaved) : []);
    } catch {
      setOrders([]);
    }
  };

  // Synchronize cart changes strictly to the current active user's storage key
  useEffect(() => {
    try {
      localStorage.setItem(`shopsphere_cart_${currentKey}`, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save user cart items:', error);
    }
  }, [cartItems, currentKey]);

  // Synchronize orders changes strictly to the current active user's storage key
  useEffect(() => {
    try {
      localStorage.setItem(`shopsphere_orders_${currentKey}`, JSON.stringify(orders));
    } catch (error) {
      console.error('Failed to save user orders:', error);
    }
  }, [orders, currentKey]);

  // Show top-right toast notification for 2 seconds
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  // Add product to cart (isolated to current user)
  const addToCart = (product, quantityToAdd = 1) => {
    if (!product) return;
    const itemId = String(product._id || product.id || '');
    if (!itemId) return;

    const normalizedProduct = {
      ...product,
      id: itemId,
      _id: itemId
    };

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => String(item.id || item._id) === itemId
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantityToAdd
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            ...normalizedProduct,
            quantity: quantityToAdd
          }
        ];
      }
    });

    showToast(`Added "${product.name?.slice(0, 22)}..." to your cart!`, 'success');
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    const targetId = String(productId);
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        String(item.id || item._id) === targetId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const targetId = String(productId);
    const itemToRemove = cartItems.find((item) => String(item.id || item._id) === targetId);
    setCartItems((prevItems) =>
      prevItems.filter((item) => String(item.id || item._id) !== targetId)
    );
    showToast(
      itemToRemove ? `Removed "${itemToRemove.name?.slice(0, 20)}..." from cart` : 'Item removed from cart',
      'info'
    );
  };

  // Clear all items in current user's cart
  const clearCart = () => {
    setCartItems([]);
    showToast('Cart has been cleared', 'info');
  };

  // Place Order flow (attached strictly to the logged-in user in MongoDB)
  const placeOrder = async (customerDetails) => {
    if (cartItems.length === 0) return null;

    const subtotal = cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
    const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + shipping + tax;

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const userEmail = currentUser?.email || customerDetails?.email || 'guest@shopsphere.com';
    const userName = currentUser?.name || customerDetails?.fullName || 'Valued Customer';
    const userId = currentUser?.id || currentUser?._id || null;

    const newOrder = {
      orderId,
      user: userId,
      userEmail: userEmail.toLowerCase(),
      userName,
      createdAt: new Date().toISOString(),
      orderDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: [...cartItems],
      totalItems: cartItems.reduce((total, item) => total + (item.quantity || 1), 0),
      subtotal,
      shippingFee: shipping,
      shipping,
      tax,
      totalAmount,
      status: 'Processing',
      deliveryStatus: 'Processing',
      estimatedDelivery,
      shippingAddress: customerDetails?.address || {
        fullName: userName,
        phone: customerDetails?.phone || '+91 98765 43210',
        street: '124 MG Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038'
      },
      paymentMethod: customerDetails?.paymentMethod || 'UPI / QR Code (Paid Online)'
    };

    // 1. Save order to backend MongoDB API with user linkage
    try {
      fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      }).catch((err) => console.log('Order saved locally (backend sync skipped)', err));
    } catch (e) {
      console.log('Order API error', e);
    }

    // 2. Save order in current user's state & user-isolated localStorage
    setOrders((prev) => [newOrder, ...prev]);

    // 3. Empty only this user's cart immediately
    setCartItems([]);

    // 4. Show toast for 2 seconds
    showToast(`🎉 Order Placed Successfully! Order #${orderId}`, 'success');

    return newOrder;
  };

  // Computed properties
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  const value = {
    cartItems,
    cartCount,
    cartSubtotal,
    orders,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    refreshOrders: fetchUserOrders,
    toast,
    showToast,
    currentUser
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
