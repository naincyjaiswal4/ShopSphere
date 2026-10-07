import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AppRoutes from './routes/AppRoutes';
import { CheckCircle2 } from 'lucide-react';
import './App.css';

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
    setToastMessage(`Added "${product.name.slice(0, 24)}..." to your cart!`);

    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <BrowserRouter>
      <div className="shopsphere-app">
        <ScrollToTop />

        {/* Global Navigation */}
        <Navbar cartCount={cartCount} />

        {/* Dynamic Route Content */}
        <main className="main-content">
          <AppRoutes onAddToCart={handleAddToCart} cartCount={cartCount} />
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="cart-toast">
            <CheckCircle2 size={20} color="#10b981" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}
