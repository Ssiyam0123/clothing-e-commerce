import express from 'express';
import {
    initPayment,
    paymentSuccess,
    bkashSuccess,
    paymentFail,
    paymentCancel,
    ipn,
    getMyOrders,
    getOrderById,
    getOrderReport
} from '../controllers/public.order.controller.js';
import { protect, extractUser } from '../../../middleware/auth.js';

import { validate } from '../../../middleware/validate.js';
import { initPaymentSchema } from '../validators/order.validator.js';

const router = express.Router();

router.post('/init', extractUser, validate(initPaymentSchema), initPayment);
router.post('/ssl/success/:tran_id', paymentSuccess);
router.get('/bkash/success/:orderId', bkashSuccess);
router.post('/ssl/fail/:tran_id', paymentFail);
router.post('/ssl/cancel/:tran_id', paymentCancel);
router.post('/ssl/ipn', ipn);

router.get('/myorders', protect, getMyOrders);
router.get('/:id', extractUser, getOrderById);
router.get('/:id/report', extractUser, getOrderReport);

export default router;
