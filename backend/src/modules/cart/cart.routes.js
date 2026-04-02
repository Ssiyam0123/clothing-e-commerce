import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from './cart.controller.js';
import { optionalAuth } from '../../middleware/auth.js';

const router = express.Router();

router.use(optionalAuth);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId/:sizeId', removeFromCart);

export default router;