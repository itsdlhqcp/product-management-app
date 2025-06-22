import express from 'express';
import { createProduct, getProducts, getProduct, deleteProduct } from '../controllers/productController.js';
import upload from '../config/multer.js';

const router = express.Router();

// Create product with multiple image uploads
router.post('/product', upload.array('images', 5), createProduct);

// Get all products
router.get('/products', getProducts);

// Get single product
router.get('/product/:id', getProduct);

// Delete product
router.delete('/product/:id', deleteProduct);

export default router;