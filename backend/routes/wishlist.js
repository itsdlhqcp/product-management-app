import express from 'express';
import { 
  addToWishlist, 
  removeFromWishlist, 
  getUserWishlist, 
  isInWishlist,
  getWishlistCount 
} from '../controllers/wisglistController.js';

const router = express.Router();

// Wishlist routes
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);
router.get('/wishlist', getUserWishlist);
router.get('/wishlist/check/:productId', isInWishlist);
router.get('/wishlist/count', getWishlistCount);

export default router;