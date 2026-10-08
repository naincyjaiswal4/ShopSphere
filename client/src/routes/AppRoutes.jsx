import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import Login from '../pages/Login';
import Register from '../pages/Register';

export default function AppRoutes() {
  const { currentUser, isAdmin } = useAuth();

  // Case 1: Admin is logged in -> Lock out client storefront views, only allow /admin
  if (isAdmin || currentUser?.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // Case 2: Guest (Not logged in) -> Only allow Home, Products, Product Details, Login, Register
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Disallow Cart & Orders when not logged in - redirect to login */}
        <Route path="/cart" element={<Navigate to="/login" replace />} />
        <Route path="/orders" element={<Navigate to="/login" replace />} />
        <Route path="/admin" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Case 3: Regular Logged-In Customer -> Full access to storefront, cart, orders
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders />} />
      {/* If already logged in, redirect auth pages to products */}
      <Route path="/login" element={<Navigate to="/products" replace />} />
      <Route path="/register" element={<Navigate to="/products" replace />} />
      <Route path="/admin" element={<Navigate to="/" replace />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
