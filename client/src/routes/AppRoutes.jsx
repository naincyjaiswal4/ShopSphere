import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import Register from '../pages/Register';

export default function AppRoutes({ onAddToCart, cartCount }) {
  return (
    <Routes>
      <Route path="/" element={<Home onAddToCart={onAddToCart} />} />
      <Route path="/products" element={<Products onAddToCart={onAddToCart} />} />
      <Route path="/product/:id" element={<ProductDetails onAddToCart={onAddToCart} />} />
      <Route path="/cart" element={<Cart cartCount={cartCount} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
