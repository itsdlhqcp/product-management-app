import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId; // From middleware

    console.log('Add to wishlist - User ID:', userId); // Debug log

    if (!productId) {
      return res.status(400).json({ msg: 'Product ID is required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check if already in wishlist
    const existingWishlistItem = await Wishlist.findOne({ userId, productId });
    if (existingWishlistItem) {
      return res.status(400).json({ msg: 'Product already in wishlist' });
    }

    // Create wishlist item
    const wishlistItem = new Wishlist({ userId, productId });
    await wishlistItem.save();

    res.status(201).json({ 
      msg: 'Product added to wishlist successfully',
      wishlistItem 
    });

  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ 
      msg: 'Server error', 
      error: error.message 
    });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId; // From middleware

    console.log('Remove from wishlist - User ID:', userId); // Debug log

    const wishlistItem = await Wishlist.findOneAndDelete({ userId, productId });
    
    if (!wishlistItem) {
      return res.status(404).json({ msg: 'Product not found in wishlist' });
    }

    res.status(200).json({ msg: 'Product removed from wishlist successfully' });

  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ 
      msg: 'Server error', 
      error: error.message 
    });
  }
};

// Get user's wishlist
export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.userId; // From middleware

    console.log('Get wishlist - User ID:', userId); // Debug log

    const wishlistItems = await Wishlist.find({ userId })
      .populate({
        path: 'productId',
        populate: {
          path: 'subCategoryId',
          populate: {
            path: 'categoryId',
            model: 'Category'
          }
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      wishlist: wishlistItems,
      count: wishlistItems.length 
    });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ 
      msg: 'Server error', 
      error: error.message 
    });
  }
};

// Check if product is in wishlist
export const isInWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId; // From middleware

    console.log('Check wishlist - User ID:', userId); // Debug log

    const wishlistItem = await Wishlist.findOne({ userId, productId });
    
    res.status(200).json({ 
      isInWishlist: !!wishlistItem 
    });

  } catch (error) {
    console.error('Error checking wishlist status:', error);
    res.status(500).json({ 
      msg: 'Server error', 
      error: error.message 
    });
  }
};

// Get wishlist count
export const getWishlistCount = async (req, res) => {
  try {
    const userId = req.userId; // From middleware

    console.log('Get wishlist count - User ID:', userId); // Debug log

    const count = await Wishlist.countDocuments({ userId });
    
    res.status(200).json({ count });

  } catch (error) {
    console.error('Error getting wishlist count:', error);
    res.status(500).json({ 
      msg: 'Server error', 
      error: error.message 
    });
  }
};