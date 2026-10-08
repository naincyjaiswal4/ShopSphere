import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AppRoutes from './routes/AppRoutes';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import './App.css';

function AppContent() {
  const { toast } = useCart();

  return (
    <div className="shopsphere-app">
      <ScrollToTop />

      {/* Global Navigation */}
      <Navbar />

      {/* Dynamic Route Content */}
      <main className="main-content">
        <AppRoutes />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Top-Right 2-Second Action Toast */}
      {toast && (
        <div className={`top-right-toast ${toast.type || 'success'}`}>
          <div className="toast-icon-box">
            {toast.type === 'info' ? (
              <Info size={18} />
            ) : toast.type === 'danger' ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
          </div>
          <span className="toast-text">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
