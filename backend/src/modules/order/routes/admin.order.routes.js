import express from 'express';
import {
    getOrders,
    createOrderAdmin,
    getAdminOrderById,
    updateOrder,
    syncOrderToPathao
} from '../controllers/admin.order.controller.js';
import { protect, admin } from '../../../middleware/auth.js';

import { validate, validateObjectId } from '../../../middleware/validate.js';
import { adminCreateOrderSchema, adminUpdateOrderSchema } from '../validators/order.validator.js';

const router = express.Router();

router.use(protect, admin);

router.route('/')
    .get(getOrders)
    .post(validate(adminCreateOrderSchema), createOrderAdmin);

router.route('/:id')
    .get(validateObjectId, getAdminOrderById)
    .put(validateObjectId, validate(adminUpdateOrderSchema), updateOrder);

router.post('/:id/sync-pathao', validateObjectId, syncOrderToPathao);

export default router;
