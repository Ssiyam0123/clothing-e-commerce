import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from './wishlist.controller.js';
import { optionalAuth } from '../../middleware/auth.js';

const router = express.Router();

router.use(optionalAuth);

router.route('/')
  .get(getWishlist)
  .delete(clearWishlist);

router.post('/add', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);

export default router;