import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  bulkAddCart,
  changeSize
} from './cart.controller.js';
import { optionalAuth, protect } from '../../middleware/auth.js';

const router = express.Router();

router.use(optionalAuth);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.put('/change-size', changeSize);
router.delete('/remove/:productId/:sizeId', removeFromCart);
router.post('/bulk-add', protect, bulkAddCart);
export default router;