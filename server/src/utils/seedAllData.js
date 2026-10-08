import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';

dotenv.config();

// 1. Admin + 15 Users Data
const usersData = [
  // 1 Admin
  {
    name: 'ShopSphere Admin',
    email: 'admin@shopsphere.com',
    password: 'AdminPassword123!',
    role: 'admin'
  },
  // 15 Users
  { name: 'Aarav Mehta', email: 'aarav.mehta@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Ananya Sharma', email: 'ananya.sharma@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Rohan Gupta', email: 'rohan.gupta@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Priya Nair', email: 'priya.nair@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Vikram Malhotra', email: 'vikram.malhotra@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Sneha Patel', email: 'sneha.patel@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Aditya Verma', email: 'aditya.verma@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Ishita Roy', email: 'ishita.roy@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Kabir Singh', email: 'kabir.singh@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Diya Sen', email: 'diya.sen@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Karan Joshi', email: 'karan.joshi@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Pooja Hegde', email: 'pooja.hegde@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Rahul Dravid', email: 'rahul.dravid@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Meera Deshmukh', email: 'meera.deshmukh@example.com', password: 'UserPassword123!', role: 'user' },
  { name: 'Arjun Kapoor', email: 'arjun.kapoor@example.com', password: 'UserPassword123!', role: 'user' }
];

// 2. 50 Diverse Products Data
const productsData = [
  // Electronics & Audio (1-10)
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling headphones with two processors and 8 microphones for exceptional call quality and immersion.',
    price: 29990,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    stock: 25
  },
  {
    name: 'Apple Watch Ultra 2 GPS + Cellular',
    description: 'Rugged titanium case, precision dual-frequency GPS, up to 36 hours of battery life, and brightest display.',
    price: 89900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
    stock: 18
  },
  {
    name: 'Bose QuietComfort 45 Headphones',
    description: 'Iconic quiet, comfort, and sound. World-class acoustic noise cancelling with high-fidelity audio.',
    price: 24900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=60',
    stock: 30
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Ergonomic performance mouse with 8K DPI tracking on glass and ultra-quiet Quiet Clicks.',
    price: 8995,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=60',
    stock: 45
  },
  {
    name: 'Keychron Q1 Pro Custom Mechanical Keyboard',
    description: 'Wireless custom mechanical keyboard with CNC aluminum body and hot-swappable switches.',
    price: 16999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60',
    stock: 20
  },
  {
    name: 'JBL Flip 6 Portable Bluetooth Speaker',
    description: 'Bold JBL Original Pro Sound with 2-way speaker system, IP67 waterproof and dustproof.',
    price: 8999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=60',
    stock: 60
  },
  {
    name: 'Samsung 32-inch 4K UHD Curved Monitor',
    description: 'Immersive 1500R curved screen with UHD resolution, HDR10 support, and ultra-slim bezels.',
    price: 31499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60',
    stock: 12
  },
  {
    name: 'Anker 737 Power Bank (PowerCore 24K)',
    description: 'Ultra-powerful 140W two-way fast charging power bank with smart digital display.',
    price: 11999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1609592426505-4c079f29107a?w=800&auto=format&fit=crop&q=60',
    stock: 50
  },
  {
    name: 'Fujifilm X-T5 Mirrorless Digital Camera',
    description: '40.2MP non-stacked X-Trans 5 HR sensor, 5-axis in-body image stabilization, and classic dial design.',
    price: 169990,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60',
    stock: 8
  },
  {
    name: 'Kindle Paperwhite (16 GB) 6.8-inch Display',
    description: 'Now with a 6.8 inch display and thinner borders, adjustable warm light, and up to 10 weeks of battery life.',
    price: 14999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60',
    stock: 40
  },

  // Footwear & Sneakers (11-20)
  {
    name: 'Nike Air Max 270 React Running Shoes',
    description: 'Nike Air cushioning delivers all-day comfort with a sleek, running-inspired design.',
    price: 11995,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
    stock: 35
  },
  {
    name: 'Adidas Ultraboost Light Running Shoes',
    description: 'Experience epic energy with the lightest Ultraboost ever made, with 30% lighter Boost material.',
    price: 14499,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=60',
    stock: 28
  },
  {
    name: 'Puma RS-X Triple White Sneakers',
    description: 'Chunky silhouette celebrating extreme reinvention with bold mesh and leather overlays.',
    price: 6999,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=60',
    stock: 42
  },
  {
    name: 'New Balance 574 Core Classic Sneakers',
    description: 'Unpretentious, versatile design blending trail and road capability with premium suede mesh.',
    price: 7999,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=60',
    stock: 38
  },
  {
    name: 'On Cloud 5 All-Black Running Shoes',
    description: 'Engineered for all-day performance with CloudTec in Zero-Gravity foam for soft, cushioned landings.',
    price: 13990,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=60',
    stock: 22
  },
  {
    name: 'Converse Chuck Taylor All Star High Top',
    description: 'The definitive sneaker. Canvas upper, diamond pattern outsole, and iconic ankle patch.',
    price: 3999,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop&q=60',
    stock: 65
  },
  {
    name: 'Vans Old Skool Suede Skate Shoes',
    description: 'Classic side-stripe skate shoe with durable suede and canvas uppers, reinforced toe caps.',
    price: 4499,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=60',
    stock: 50
  },
  {
    name: 'Timberland 6-Inch Premium Waterproof Boot',
    description: 'Rugged dependability with premium waterproof nubuck leather and anti-fatigue technology.',
    price: 17990,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=60',
    stock: 15
  },
  {
    name: 'Salomon XT-6 Trail Running Shoes',
    description: 'Originally launched in 2013, the preferred footwear of ultra-distance athletes under harsh conditions.',
    price: 18500,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=60',
    stock: 19
  },
  {
    name: 'Birkenstock Arizona Birko-Flor Sandals',
    description: 'Timeless two-strap design with anatomically shaped cork-latex footbed.',
    price: 5990,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=60',
    stock: 30
  },

  // Fashion & Apparel (21-30)
  {
    name: 'Levi\'s 501 Original Fit Denim Jeans',
    description: 'The iconic straight fit with the signature button fly. Crafted from durable non-stretch denim.',
    price: 3799,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856453?w=800&auto=format&fit=crop&q=60',
    stock: 55
  },
  {
    name: 'Uniqlo Ultra Light Down Puffer Jacket',
    description: 'Incredibly light, warm, and compact. Pocketable design with water-repellent coating.',
    price: 5990,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=60',
    stock: 40
  },
  {
    name: 'Patagonia Better Sweater Fleece Jacket',
    description: 'Warm, low-bulk full-zip jacket made of soft polyester sweater-knit fleece dyed with a low-impact process.',
    price: 12999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=60',
    stock: 20
  },
  {
    name: 'Ray-Ban Classic Aviator Polarized Sunglasses',
    description: 'Timeless tear-drop shape lenses with 100% UV protection and crystal green polarized glass.',
    price: 9490,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=60',
    stock: 33
  },
  {
    name: 'Fossil Grant Chronograph Leather Watch',
    description: 'Vintage-inspired chronograph with Roman numeral indexes and genuine brown leather strap.',
    price: 11995,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=60',
    stock: 25
  },
  {
    name: 'Ralph Lauren Slim Fit Oxford Cotton Shirt',
    description: 'A pillar of Polo style with washed cotton oxford and multi-colored signature embroidered pony.',
    price: 8500,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=60',
    stock: 32
  },
  {
    name: 'Herschel Little America Classic Backpack',
    description: 'Mountaineering-inspired backpack with contoured shoulder straps and fleece-lined 15-inch laptop sleeve.',
    price: 7999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60',
    stock: 45
  },
  {
    name: 'Bellroy Hide & Seek Slim Leather Wallet',
    description: 'Traditional look with progressive features. Holds 5-12 cards with hidden cash flap and RFID protection.',
    price: 6499,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=60',
    stock: 50
  },
  {
    name: 'Champion Reverse Weave Heavyweight Hoodie',
    description: 'Cut on the cross-grain to resist vertical shrinkage, featuring signature ribbed side panels.',
    price: 4999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=60',
    stock: 38
  },
  {
    name: 'The North Face Base Camp Duffel Bag (M)',
    description: 'Legendary durability with water-resistant material, extra bartacks, and double stitching.',
    price: 11499,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=60',
    stock: 20
  },

  // Home & Kitchen (31-40)
  {
    name: 'Nespresso VertuoPlus Coffee & Espresso Maker',
    description: 'Brews a wide range of coffees at the touch of a button with Centrifusion extraction technology.',
    price: 18990,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=60',
    stock: 16
  },
  {
    name: 'Dyson V12 Detect Slim Cordless Vacuum',
    description: 'Laser reveals invisible dust. Powerful suction with Piezo sensor that counts and measures particle size.',
    price: 49900,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=60',
    stock: 12
  },
  {
    name: 'Instant Pot Duo Plus 9-in-1 Pressure Cooker',
    description: 'Pressure cook, slow cook, rice cooker, yogurt maker, steamer, sauté pan, and food warmer all in one.',
    price: 9999,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=60',
    stock: 28
  },
  {
    name: 'Philips Airfryer XXL with Fat Removal Tech',
    description: 'The healthiest way to fry with little to no added oil. Twin TurboStar technology removes fat.',
    price: 16499,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=60',
    stock: 24
  },
  {
    name: 'Le Creuset Enameled Cast Iron Dutch Oven (5.5 Qt)',
    description: 'Unmatched in culinary versatility and heat retention. Handcrafted in France since 1925.',
    price: 32000,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1584990347449-3990666063b4?w=800&auto=format&fit=crop&q=60',
    stock: 10
  },
  {
    name: 'Fellow Stagg EKG Electric Gooseneck Kettle',
    description: 'Variable temperature control, 1200 watts for quick heating, and precision pour spout for pour-over coffee.',
    price: 14999,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=60',
    stock: 18
  },
  {
    name: 'Zwilling Pro 8-inch Chef\'s Knife',
    description: 'German stainless steel blade ice-hardened using FRIODUR technique for long-lasting edge retention.',
    price: 11999,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&auto=format&fit=crop&q=60',
    stock: 22
  },
  {
    name: 'NutriBullet Pro 900W High-Speed Blender',
    description: 'Compact personal countertop blender that pulverizes seeds, skins, and stems for nutrient extraction.',
    price: 6999,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=60',
    stock: 35
  },
  {
    name: 'Hydro Flask 32 oz Wide Mouth Water Bottle',
    description: 'TempShield double-wall vacuum insulation keeps beverages cold for up to 24 hours or hot for 12.',
    price: 3499,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=60',
    stock: 70
  },
  {
    name: 'Balmuda The Toaster Steam Oven',
    description: 'Revolutionary steam technology and precise heat management toast bread to crispy exterior and moist interior.',
    price: 26500,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=60',
    stock: 14
  },

  // Gaming & Accessories (41-50)
  {
    name: 'Sony PlayStation 5 DualSense Wireless Controller',
    description: 'Discover a deeper gaming experience with innovative haptic feedback and dynamic trigger effects.',
    price: 5990,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=800&auto=format&fit=crop&q=60',
    stock: 40
  },
  {
    name: 'Razer BlackShark V2 Pro Wireless Gaming Headset',
    description: 'TriForce Titanium 50mm Drivers with HyperClear Supercardioid Mic and ultra-soft breathable foam ear cushions.',
    price: 16999,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&auto=format&fit=crop&q=60',
    stock: 25
  },
  {
    name: 'Elgato Stream Deck MK.2 (15 LCD Keys)',
    description: '15 customizable LCD keys to control apps, tools, and platforms with one-touch tactile operation.',
    price: 13999,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=60',
    stock: 20
  },
  {
    name: 'Xbox Wireless Controller - Carbon Black',
    description: 'Experience modernized design featuring sculpted surfaces and refined geometry for enhanced comfort.',
    price: 5390,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
    stock: 45
  },
  {
    name: 'Secretlab TITAN Evo 2022 Gaming Chair',
    description: 'Proprietary sculpted pebble seat base with 4-way L-ADAPT lumbar support and magnetic memory foam head pillow.',
    price: 44990,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop&q=60',
    stock: 8
  },
  {
    name: 'SteelSeries QcK Heavy XXL Gaming Mousepad',
    description: 'Extra thick non-slip rubber base eliminates unwanted movement with legendary micro-woven cloth surface.',
    price: 2499,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=60',
    stock: 60
  },
  {
    name: 'Nintendo Switch OLED Model - White',
    description: 'Vibrant 7-inch OLED screen, wide adjustable stand, wired LAN port, and 64 GB of internal storage.',
    price: 31990,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&auto=format&fit=crop&q=60',
    stock: 18
  },
  {
    name: 'HyperX QuadCast S USB Condenser Mic',
    description: 'Full-featured standalone microphone with customizable RGB lighting and built-in anti-vibration shock mount.',
    price: 14490,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=60',
    stock: 22
  },
  {
    name: 'Corsair K70 RGB PRO Mechanical Gaming Keyboard',
    description: 'CHERRY MX mechanical key switches with durable aluminum frame and AXON hyper-processing technology.',
    price: 13999,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b909?w=800&auto=format&fit=crop&q=60',
    stock: 25
  },
  {
    name: 'Oculus Quest 3 128GB VR Headset',
    description: 'Breakthrough mixed reality with 4K+ Infinite Display and double the graphic processing power.',
    price: 52999,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800&auto=format&fit=crop&q=60',
    stock: 14
  }
];

// 3. Review Comments & Titles Bank
const reviewTemplates = [
  { rating: 5, title: 'Outstanding Quality & Fast Delivery!', comment: 'Absolutely blown away by the build quality and attention to detail. Arrived in just 2 days in pristine packaging. Highly recommended!' },
  { rating: 5, title: 'Exceeded all my expectations!', comment: 'Was skeptical at first, but this is one of the best purchases I have made this year. Premium feel and top notch performance.' },
  { rating: 4, title: 'Very good product, worth the price', comment: 'Solid construction and works exactly as described. Only minor gripe is the user manual could have been clearer, but otherwise great.' },
  { rating: 5, title: 'Must buy! Truly premium experience', comment: 'ShopSphere delivered this right on time. Authentic product, superb aesthetic and unmatched value in INR.' },
  { rating: 4, title: 'Satisfied with the purchase', comment: 'Good value for money. Fits into my daily routine seamlessly. Battery life / durability has been great so far.' },
  { rating: 3, title: 'Decent, but room for improvement', comment: 'The product does its job fine, but for the price I was expecting slightly better finishing on the edges.' },
  { rating: 5, title: 'Flawless! 10/10 recommendation', comment: 'Five stars without hesitation. The design is sleek, lightweight, and functions exceptionally well.' },
  { rating: 4, title: 'Happy customer! Great after-sales', comment: 'Arrived well protected with all genuine accessories. Smooth shopping experience on ShopSphere.' },
  { rating: 5, title: 'Game changer in its category!', comment: 'I have tried multiple alternatives in the market, but nothing comes close to this standard.' },
  { rating: 4, title: 'Looks awesome in person', comment: 'The photos don\'t do it justice. The texture, feel, and performance are fantastic.' }
];

const seedAllDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI is not set in server/.env');
      process.exit(1);
    }

    console.log('🍃 Connecting to MongoDB Database...');
    await mongoose.connect(uri);
    console.log(`✅ Connected to DB: ${mongoose.connection.name}`);
    console.log('------------------------------------------------------------');

    // 1. Clear Existing Collections
    console.log('🧹 Clearing previous collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Previous data cleared.');

    // 2. Seed 1 Admin & 15 Users
    console.log('\n👤 Seeding 1 Admin and 15 Users (with bcrypt hashing)...');
    const createdUsers = [];
    for (const u of usersData) {
      // Create user document (pre-save hook hashes password)
      const userDoc = await User.create(u);
      createdUsers.push(userDoc);
    }
    console.log(`✅ Created ${createdUsers.length} Users (1 Admin + 15 Customers).`);

    // 3. Seed 50 Products
    console.log('\n📦 Seeding 50 Products across Electronics, Footwear, Fashion, Home & Kitchen, and Gaming...');
    const createdProducts = await Product.insertMany(productsData);
    console.log(`✅ Created ${createdProducts.length} Products with Indian Rupee (₹) pricing.`);

    // 4. Seed 100 Reviews randomly across products & users with unique (user, product) pairs
    console.log('\n⭐ Seeding 100 Verified Customer Reviews...');
    const reviewsToInsert = [];
    const customerUsers = createdUsers.filter((u) => u.role === 'user');
    const usedPairs = new Set();

    while (reviewsToInsert.length < 100) {
      const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const randomUser = customerUsers[Math.floor(Math.random() * customerUsers.length)];
      const pairKey = `${randomUser._id.toString()}_${randomProduct._id.toString()}`;

      if (!usedPairs.has(pairKey)) {
        usedPairs.add(pairKey);
        const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];

        reviewsToInsert.push({
          product: randomProduct._id,
          productName: randomProduct.name,
          user: randomUser._id,
          userName: randomUser.name,
          rating: template.rating,
          title: template.title,
          comment: template.comment,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
        });
      }
    }

    await Review.insertMany(reviewsToInsert);
    console.log(`✅ Created ${reviewsToInsert.length} unique Reviews linked to Products & Users.`);

    // 5. Seed 3 Sample Orders tied to specific users
    console.log('\n🛒 Seeding Sample Orders with User Isolation...');
    const sampleOrders = [
      {
        orderId: 'ORD-892101',
        user: createdUsers[1]._id,
        userEmail: createdUsers[1].email,
        userName: createdUsers[1].name,
        items: [
          {
            id: createdProducts[0]._id.toString(),
            name: createdProducts[0].name,
            price: createdProducts[0].price,
            quantity: 1,
            image: createdProducts[0].image,
            category: createdProducts[0].category
          },
          {
            id: createdProducts[3]._id.toString(),
            name: createdProducts[3].name,
            price: createdProducts[3].price,
            quantity: 1,
            image: createdProducts[3].image,
            category: createdProducts[3].category
          }
        ],
        shippingAddress: {
          fullName: 'Aarav Mehta',
          phone: '+91 98765 43210',
          street: 'Flat 402, Lotus Residency, 12th Main Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038'
        },
        paymentMethod: 'UPI / QR Code (Paid Online)',
        subtotal: createdProducts[0].price + createdProducts[3].price,
        shippingFee: 0,
        tax: Math.round((createdProducts[0].price + createdProducts[3].price) * 0.05),
        totalAmount: Math.round((createdProducts[0].price + createdProducts[3].price) * 1.05),
        status: 'Delivered',
        estimatedDelivery: 'Oct 04, 2026'
      },
      {
        orderId: 'ORD-774920',
        user: createdUsers[2]._id,
        userEmail: createdUsers[2].email,
        userName: createdUsers[2].name,
        items: [
          {
            id: createdProducts[10]._id.toString(),
            name: createdProducts[10].name,
            price: createdProducts[10].price,
            quantity: 1,
            image: createdProducts[10].image,
            category: createdProducts[10].category
          }
        ],
        shippingAddress: {
          fullName: 'Ananya Sharma',
          phone: '+91 98112 33445',
          street: 'B-14, Green Park Extension',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110016'
        },
        paymentMethod: 'Cash on Delivery (COD)',
        subtotal: createdProducts[10].price,
        shippingFee: 0,
        tax: Math.round(createdProducts[10].price * 0.05),
        totalAmount: Math.round(createdProducts[10].price * 1.05),
        status: 'Shipped',
        estimatedDelivery: 'Oct 09, 2026'
      },
      {
        orderId: 'ORD-652194',
        user: createdUsers[3]._id,
        userEmail: createdUsers[3].email,
        userName: createdUsers[3].name,
        items: [
          {
            id: createdProducts[40]._id.toString(),
            name: createdProducts[40].name,
            price: createdProducts[40].price,
            quantity: 2,
            image: createdProducts[40].image,
            category: createdProducts[40].category
          }
        ],
        shippingAddress: {
          fullName: 'Rohan Gupta',
          phone: '+91 99201 88776',
          street: '7th Floor, Sea View Apartments, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050'
        },
        paymentMethod: 'UPI / QR Code (Paid Online)',
        subtotal: createdProducts[40].price * 2,
        shippingFee: 0,
        tax: Math.round(createdProducts[40].price * 2 * 0.05),
        totalAmount: Math.round(createdProducts[40].price * 2 * 1.05),
        status: 'Processing',
        estimatedDelivery: 'Oct 12, 2026'
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log(`✅ Created ${sampleOrders.length} User-Isolated Sample Orders in MongoDB.`);

    console.log('\n------------------------------------------------------------');
    console.log('🎉 ALL DUMMY DATA SEEDED SUCCESSFULLY INTO MONGOOSE MONGODB!');
    console.log('📊 Final Database Summary:');
    console.log(`   - 👥 Users: ${createdUsers.length} (1 Admin + 15 Users)`);
    console.log(`   - 📦 Products: ${createdProducts.length} Items (INR ₹)`);
    console.log(`   - ⭐ Reviews: ${reviewsToInsert.length} Verified Reviews`);
    console.log(`   - 🛒 Orders: ${sampleOrders.length} Orders with Delivery Tracking`);
    console.log('------------------------------------------------------------\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message || error);
    process.exit(1);
  }
};

seedAllDatabase();
