import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = Router();

// /api/products
router.route('/')
  .get(getProducts)
  .post(createProduct);

// /api/products/:id
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
