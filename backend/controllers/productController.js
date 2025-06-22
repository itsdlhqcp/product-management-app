import Product from '../models/Product.js';
import SubCategory from '../models/SubCategory.js';

export const createProduct = async (req, res) => {
  const { title, description, subCategoryId, variants, images } = req.body;
  try {
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) return res.status(400).json({ msg: "Sub-category not found" });

    if (!variants || variants.length === 0) {
      return res.status(400).json({ msg: "At least one variant is required" });
    }

    const product = await Product.create({ 
      title, 
      description, 
      subCategoryId, 
      variants, 
      images 
    });
    
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ msg: "Failed to create product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: 'subCategoryId',
        populate: {
          path: 'categoryId',
          model: 'Category'
        }
      })
      .sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch products" });
  }
};