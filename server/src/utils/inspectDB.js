import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

import Review from '../models/Review.js';

dotenv.config();

const inspectDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI is not set in server/.env');
      process.exit(1);
    }

    console.log('🍃 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Database:', mongoose.connection.name);
    console.log('------------------------------------------------------------');

    // 1. Fetch Users
    const users = await User.find().select('-password');
    console.log(`\n👤 USERS COLLECTION (${users.length} documents):`);
    if (users.length === 0) {
      console.log('   (No users found yet. Register a user to see it here)');
    } else {
      console.table(
        users.map((u) => ({
          ID: u._id.toString(),
          Name: u.name,
          Email: u.email,
          Role: u.role,
          Created: u.createdAt?.toISOString().slice(0, 10)
        }))
      );
    }

    // 2. Fetch Products
    const products = await Product.find();
    console.log(`\n📦 PRODUCTS COLLECTION (${products.length} documents):`);
    if (products.length === 0) {
      console.log('   (No products found in DB)');
    } else {
      console.table(
        products.slice(0, 8).map((p) => ({
          ID: p._id.toString(),
          Name: p.name.slice(0, 24),
          Category: p.category,
          Price: `₹${p.price?.toLocaleString('en-IN')}`,
          Stock: p.stock
        }))
      );
      if (products.length > 8) {
        console.log(`   ...and ${products.length - 8} more products.`);
      }
    }

    // 3. Fetch Reviews
    const reviews = await Review.find().sort({ createdAt: -1 });
    console.log(`\n⭐ REVIEWS COLLECTION (${reviews.length} documents):`);
    if (reviews.length === 0) {
      console.log('   (No reviews found in DB)');
    } else {
      console.table(
        reviews.slice(0, 6).map((r) => ({
          Product: r.productName?.slice(0, 22),
          User: r.userName,
          Rating: '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating),
          Title: r.title?.slice(0, 25),
          Date: r.createdAt?.toISOString().slice(0, 10)
        }))
      );
      if (reviews.length > 6) {
        console.log(`   ...and ${reviews.length - 6} more reviews.`);
      }
    }

    // 4. Fetch Orders
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log(`\n🛒 ORDERS COLLECTION (${orders.length} documents):`);
    if (orders.length === 0) {
      console.log('   (No orders placed yet. Place an order to see it here)');
    } else {
      console.table(
        orders.map((o) => ({
          'Order ID': o.orderId,
          Customer: o.shippingAddress?.fullName || 'N/A',
          Items: o.items?.length || 0,
          Total: `₹${o.totalAmount?.toLocaleString('en-IN')}`,
          Payment: o.paymentMethod?.slice(0, 15),
          Status: o.status,
          Date: o.createdAt?.toISOString().slice(0, 10)
        }))
      );
    }

    console.log('\n------------------------------------------------------------');
    console.log('✨ Inspection complete.\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inspecting MongoDB:', error.message);
    process.exit(1);
  }
};

inspectDatabase();
