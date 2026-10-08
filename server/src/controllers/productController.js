import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { SAMPLE_SEED_PRODUCTS } from '../utils/seedProducts.js';

// @desc    Get all products from MongoDB with review stats
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    let products = [];
    if (mongoose.connection.readyState === 1) {
      // Fetch all products
      const dbProducts = await Product.find({}).sort({ createdAt: -1 }).lean();

      if (dbProducts && dbProducts.length > 0) {
        // Fetch all reviews to calculate rating & review counts per product
        const reviews = await Review.find({}).lean();
        const reviewStats = {};

        reviews.forEach((r) => {
          const prodId = r.product?.toString();
          if (!prodId) return;
          if (!reviewStats[prodId]) {
            reviewStats[prodId] = { count: 0, totalRating: 0 };
          }
          reviewStats[prodId].count += 1;
          reviewStats[prodId].totalRating += r.rating || 5;
        });

        products = dbProducts.map((p) => {
          const stats = reviewStats[p._id.toString()] || { count: Math.floor(Math.random() * 20) + 15, totalRating: 0 };
          const avgRating = stats.count > 0 && stats.totalRating > 0
            ? Number((stats.totalRating / stats.count).toFixed(1))
            : Number((4.5 + ((p.price % 5) * 0.1)).toFixed(1));
          
          const discount = 10 + (p.price % 20);
          const originalPrice = Math.round(p.price * (1 + discount / 100));

          return {
            ...p,
            id: p._id.toString(),
            rating: avgRating,
            reviews: stats.count || 24,
            discount,
            originalPrice,
            isFeatured: p.price > 10000 || p.stock < 20,
            inStock: p.stock > 0
          };
        });
      }
    }

    // Fallback if DB has 0 items
    if (!products || products.length === 0) {
      products = SAMPLE_SEED_PRODUCTS.map((p, index) => ({
        _id: `seed_prod_${index + 1}`,
        id: `seed_prod_${index + 1}`,
        ...p,
        rating: 4.8,
        reviews: 42,
        discount: 15,
        originalPrice: Math.round(p.price * 1.18),
        isFeatured: index < 4,
        inStock: true,
        createdAt: new Date().toISOString()
      }));
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID with reviews
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = null;
    let productReviews = [];

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const dbProd = await Product.findById(id).lean();
      if (dbProd) {
        productReviews = await Review.find({ product: dbProd._id }).sort({ createdAt: -1 }).lean();
        const totalRating = productReviews.reduce((sum, r) => sum + (r.rating || 5), 0);
        const avgRating = productReviews.length > 0 ? Number((totalRating / productReviews.length).toFixed(1)) : 4.8;
        const discount = 15;
        const originalPrice = Math.round(dbProd.price * 1.18);

        product = {
          ...dbProd,
          id: dbProd._id.toString(),
          rating: avgRating,
          reviews: productReviews.length || 38,
          customerReviews: productReviews,
          discount,
          originalPrice,
          isFeatured: true,
          inStock: dbProd.stock > 0,
          features: [
            '100% Authentic Genuine Product',
            'Full 1-Year Official Manufacturer Warranty',
            'Express 2-Day Delivery across India',
            '7-Day Hassle-Free Return / Replacement'
          ]
        };
      }
    }

    // Fallback search in seed products by ID or seed identifier
    if (!product) {
      const fallback = SAMPLE_SEED_PRODUCTS.find(
        (p, index) =>
          `seed_prod_${index + 1}` === id ||
          String(index + 1) === id
      );
      if (fallback) {
        product = {
          _id: id,
          id,
          ...fallback,
          rating: 4.9,
          reviews: 52,
          discount: 18,
          originalPrice: Math.round(fallback.price * 1.2),
          isFeatured: true,
          inStock: true,
          features: [
            '100% Authentic Genuine Product',
            'Full 1-Year Official Manufacturer Warranty',
            'Express 2-Day Delivery across India',
            '7-Day Hassle-Free Return / Replacement'
          ],
          createdAt: new Date().toISOString()
        };
      }
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product in MongoDB (Admin)
// @route   POST /api/products
// @access  Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required'
      });
    }

    const newProduct = await Product.create({
      name: name.trim(),
      description: description || 'Premium product curated by ShopSphere.',
      price: Number(price),
      category: category.trim(),
      stock: Number(stock) || 10,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully in MongoDB',
      product: newProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product in MongoDB (Admin)
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category, description, image } = req.body;

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        ...(name && { name: name.trim() }),
        ...(price !== undefined && { price: Number(price) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(category && { category: category.trim() }),
        ...(description && { description: description.trim() }),
        ...(image && { image })
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product from MongoDB (Admin)
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted from MongoDB'
    });
  } catch (error) {
    next(error);
  }
};
