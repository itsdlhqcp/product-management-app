import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';

export const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ msg: "Category already exists" });

    const category = await Category.create({ name });
    res.status(201).json({ category });
  } catch (err) {
    res.status(500).json({ msg: "Failed to create category" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch categories" });
  }
};

export const createSubCategory = async (req, res) => {
  const { name, categoryId } = req.body;
  try {
    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ msg: "Category not found" });

    const subCategory = await SubCategory.create({ name, categoryId });
    res.status(201).json({ subCategory });
  } catch (err) {
    res.status(500).json({ msg: "Failed to create sub-category" });
  }
};

export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });
    res.json({ subCategories });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch sub-categories" });
  }
};