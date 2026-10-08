import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price must be a positive number']
    },
    image: {
      type: String,
      required: [true, 'Please provide a product image URL']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true
    },
    stock: {
      type: Number,
      required: [true, 'Please provide available stock quantity'],
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
