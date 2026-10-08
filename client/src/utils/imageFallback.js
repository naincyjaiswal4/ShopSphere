// Fallback image utility for reliable rendering across all components
export const FALLBACK_PRODUCT_IMAGE = 
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

export const handleImageError = (e, fallbackUrl = FALLBACK_PRODUCT_IMAGE) => {
  if (e?.target && e.target.src !== fallbackUrl) {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = fallbackUrl;
  }
};
