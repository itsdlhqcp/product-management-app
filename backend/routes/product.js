// import express from 'express';
// import { createProduct, getProducts, getProduct, deleteProduct } from '../controllers/productController.js';
// import upload from '../config/multer.js';

// const router = express.Router();

// // Create product with multiple image uploads
// router.post('/product', upload.array('images', 5), createProduct);

// // Get all products
// router.get('/products', getProducts);

// // Get single product
// router.get('/product/:id', getProduct);

// // Delete product
// router.delete('/product/:id', deleteProduct);

// export default router;


import express from 'express';
import { createProduct, getProducts, getProduct, deleteProduct, updateProduct } from '../controllers/productController.js';
import Product from '../models/Product.js'; 
import upload from '../config/multer.js';

const router = express.Router();

router.post('/product', upload.array('images', 5), createProduct);

router.put('/product/:id', upload.array('images', 5), updateProduct);

router.get('/products', getProducts);

router.get('/products/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    console.log('Search query received:', query); 
    
    const searchRegex = new RegExp(query, 'i'); 
    
    const products = await Product.find({
      title: { $regex: searchRegex }
    }).populate({
      path: 'subCategoryId',
      populate: {
        path: 'categoryId'
      }
    });
    
    console.log('Search results:', products.length); 
    res.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ msg: 'Server error during search' });
  }
});

router.get('/product/:id', getProduct);

router.delete('/product/:id', deleteProduct);

export default router;