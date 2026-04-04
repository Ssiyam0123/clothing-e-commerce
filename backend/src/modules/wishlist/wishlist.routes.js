import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  bulkAddWishlist,
} from './wishlist.controller.js';
import { optionalAuth, protect } from '../../middleware/auth.js';

const router = express.Router();


router.post('/bulk-add', optionalAuth, bulkAddWishlist); 

router.use(optionalAuth);

router.route('/')
  .get(getWishlist)
  .delete(clearWishlist);

router.post('/add', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);

export default router;