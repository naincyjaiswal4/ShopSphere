import Product from '../models/Product.js';

export const SAMPLE_SEED_PRODUCTS = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Up to 30 hours of battery life and crystal-clear hands-free calling.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    stock: 25
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm Midnight',
    description: 'Powerful S9 SiP chip with double tap gesture, advanced health tracking sensors, ECG, and brighter always-on Retina display.',
    price: 399.00,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    stock: 18
  },
  {
    name: 'Vintage Italian Full-Grain Leather Bag',
    description: 'Handcrafted vegetable-tanned Italian leather with heavy-duty brass zippers, canvas lining, and cabin-approved dimensions.',
    price: 189.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    category: 'Fashion',
    stock: 14
  },
  {
    name: 'Designer Polarized UV400 Aviator Sunglasses',
    description: 'Ultra-lightweight titanium frame with scratch-resistant polarized TAC lenses offering 100% UV protection.',
    price: 89.50,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    category: 'Fashion',
    stock: 40
  },
  {
    name: 'Nordic Minimalist Dimmable LED Desk Lamp',
    description: 'Matte aluminum finish with 5 color temperatures, touch dimmer, eye-care diffusion, and integrated wireless charging base.',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    category: 'Home',
    stock: 30
  },
  {
    name: 'Ergonomic High-Back Mesh Office Chair',
    description: 'Dynamic adaptive lumbar support, 3D adjustable armrests, and high-elasticity breathable mesh for all-day posture comfort.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
    category: 'Home',
    stock: 12
  },
  {
    name: 'Pro Tour Carbon Fiber Tennis Racket',
    description: '100% Graphite carbon matrix engineered for tournament precision, speed, and vibration-dampening power.',
    price: 179.00,
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80',
    category: 'Sports',
    stock: 20
  },
  {
    name: 'Vacuum Insulated Smart Thermal Flask 1L',
    description: 'Double-walled stainless steel keeps drinks iced 24h or hot 12h. Built-in LED touch temperature display.',
    price: 38.50,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    category: 'Sports',
    stock: 55
  }
];

export async function seedProductsIfEmpty() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Database empty: Seeding sample products...');
      await Product.insertMany(SAMPLE_SEED_PRODUCTS);
      console.log(`Successfully seeded ${SAMPLE_SEED_PRODUCTS.length} products.`);
    }
  } catch (error) {
    console.error('Error auto-seeding products:', error.message);
  }
}
