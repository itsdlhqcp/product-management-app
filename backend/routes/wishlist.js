import express from 'express';
import { 
  addToWishlist, 
  removeFromWishlist, 
  getUserWishlist, 
  isInWishlist,
  getWishlistCount 
} from '../controllers/wisglistController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Wishlist routes - all protected with authentication middleware
router.post('/wishlist', authenticateToken, addToWishlist);
router.delete('/wishlist/:productId', authenticateToken, removeFromWishlist);
router.get('/wishlist', authenticateToken, getUserWishlist);
router.get('/wishlist/check/:productId', authenticateToken, isInWishlist);
router.get('/wishlist/count', authenticateToken, getWishlistCount);

export default router;