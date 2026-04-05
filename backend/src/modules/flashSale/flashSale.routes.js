import express from 'express';
import {
  createFlashSale,
  getAllFlashSales,
  getActiveFlashSales,
  getFlashSaleById,
  updateFlashSale,
  deleteFlashSale,
  getFlashSaleProducts,
  getFlashSaleBySlug,
} from './flashSale.controller.js';
import { protect, admin } from '../../middleware/auth.js';

const router = express.Router();

router.get('/active', getActiveFlashSales);
router.get('/products', getFlashSaleProducts);
router.get('/:id', getFlashSaleById); 


router.use(protect, admin);
router.post('/', createFlashSale);
router.get('/', getAllFlashSales);
router.put('/:id', updateFlashSale);
router.delete('/:id', deleteFlashSale);
router.get('/details/:slug', getFlashSaleBySlug);
export default router;