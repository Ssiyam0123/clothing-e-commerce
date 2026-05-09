import express from 'express';
import {
    initPayment,
    paymentSuccess,
    bkashSuccess,
    paymentFail,
    paymentCancel,
    ipn,
    getMyOrders,
    getOrderById
} from '../controllers/public.order.controller.js';
import { protect } from '../../../middleware/auth.js';

import { validate } from '../../../middleware/validate.js';
import { initPaymentSchema } from '../validators/order.validator.js';

const router = express.Router();

router.post('/init', validate(initPaymentSchema), initPayment);
router.post('/success/:tran_id', paymentSuccess);
router.get('/bkash/success/:orderId', bkashSuccess);
router.post('/fail/:tran_id', paymentFail);
router.post('/cancel/:tran_id', paymentCancel);
router.post('/ipn', ipn);

router.get('/myorders', protect, getMyOrders);
router.get('/:id', getOrderById);

export default router;
