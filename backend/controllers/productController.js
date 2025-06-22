import Product from '../models/Product.js';
import SubCategory from '../models/SubCategory.js';
import fs from 'fs';
import path from 'path';

// Create Product with Images
export const createProduct = async (req, res) => {
  try {
    console.log('=== CREATE PRODUCT REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Content-Type:', req.headers['content-type']);
    
    const { title, description, subCategoryId, variants } = req.body;
    
    // Validate required fields
    if (!title || !subCategoryId) {
      console.log('Validation failed: Missing title or subCategoryId');
      return res.status(400).json({ 
        msg: 'Title and sub-category are required',
        received: { title, subCategoryId }
      });
    }

    // Check if sub-category exists
    console.log('Checking subcategory:', subCategoryId);
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      console.log('SubCategory not found');
      return res.status(404).json({ 
        msg: 'Sub-category not found' 
      });
    }
    console.log('SubCategory found:', subCategory.name);

    // Parse variants if it's a string (from FormData)
    let parsedVariants = [];
    if (variants) {
      try {
        console.log('Raw variants:', variants);
        parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
        console.log('Parsed variants:', parsedVariants);
      } catch (error) {
        console.log('Variants parsing error:', error);
        return res.status(400).json({ 
          msg: 'Invalid variants format',
          error: error.message
        });
      }
    }

    // Get uploaded image filenames
    const images = req.files ? req.files.map(file => file.filename) : [];
    console.log('Processed images:', images);

    // Create product
    const productData = {
      title,
      description,
      subCategoryId,
      variants: parsedVariants,
      images
    };
    
    console.log('Creating product with data:', productData);
    const product = new Product(productData);

    await product.save();
    console.log('Product saved successfully');

    // Populate the response
    await product.populate('subCategoryId');

    res.status(201).json({
      msg: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error stack:', error.stack);
    
    // Clean up uploaded files if product creation fails
    if (req.files && req.files.length > 0) {
      console.log('Cleaning up uploaded files...');
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    
    res.status(500).json({ 
      msg: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    console.log('=== GET PRODUCTS REQUEST ===');
    const products = await Product.find()
      .populate({
        path: 'subCategoryId',
        populate: {
          path: 'categoryId',
          model: 'Category'
        }
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${products.length} products`);
    res.status(200).json({
      products
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      msg: 'Server error', 
      error: error.message 
    });
  }
};

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('=== GET SINGLE PRODUCT REQUEST ===');
    console.log('Product ID:', id);
    
    const product = await Product.findById(id)
      .populate({
        path: 'subCategoryId',
        populate: {
          path: 'categoryId',
          model: 'Category'
        }
      });

    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ 
        msg: 'Product not found' 
      });
    }

    console.log('Product found:', product.title);
    res.status(200).json({
      product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      msg: 'Server error', 
      error: error.message 
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, subCategoryId, variants, existingImages } = req.body;

    // Find the existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Parse variants if it's a string (from FormData)
    let parsedVariants = variants;
    if (typeof variants === 'string') {
      parsedVariants = JSON.parse(variants);
    }

    // Handle images
    let imageFilenames = [];
    
    // Keep existing images if specified
    if (existingImages) {
      const existingImagesList = typeof existingImages === 'string' 
        ? JSON.parse(existingImages) 
        : existingImages;
      imageFilenames = [...existingImagesList];
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      imageFilenames = [...imageFilenames, ...newImages];
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        subCategoryId,
        variants: parsedVariants,
        images: imageFilenames,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate({
      path: 'subCategoryId',
      populate: { path: 'categoryId' }
    });

    res.json({
      msg: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Delete Product (with image cleanup)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('=== DELETE PRODUCT REQUEST ===');
    console.log('Product ID:', id);
    
    const product = await Product.findById(id);
    if (!product) {
      console.log('Product not found for deletion');
      return res.status(404).json({ 
        msg: 'Product not found' 
      });
    }

    // Delete associated images
    if (product.images && product.images.length > 0) {
      console.log('Deleting product images:', product.images);
      product.images.forEach(filename => {
        const filePath = path.join('uploads/products', filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting image file:', err);
          else console.log('Deleted image:', filename);
        });
      });
    }

    await Product.findByIdAndDelete(id);
    console.log('Product deleted successfully');

    res.status(200).json({
      msg: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      msg: 'Server error', 
      error: error.message 
    });
  }
};