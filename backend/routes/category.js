import express from 'express';
import { createCategory, getCategories, createSubCategory, getSubCategories } from '../controllers/categoryController.js';

const router = express.Router();

router.post('/category', createCategory);
router.get('/categories', getCategories);
router.post('/subcategory', createSubCategory);
router.get('/subcategories', getSubCategories);

export default router;