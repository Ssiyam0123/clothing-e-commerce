import express from 'express';
import {
    getOrders,
    createOrderAdmin,
    getAdminOrderById,
    updateOrder,
    syncOrderToPathao
} from '../controllers/admin.order.controller.js';
import { protect } from '../../../middleware/auth.js';
import { authorize } from '../../../middleware/rbac.js';

import { validate, validateObjectId } from '../../../middleware/validate.js';
import { adminCreateOrderSchema, adminUpdateOrderSchema } from '../validators/order.validator.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(authorize('orders:view'), getOrders)
    .post(authorize('orders:create'), validate(adminCreateOrderSchema), createOrderAdmin);

router.route('/:id')
    .get(authorize('orders:view'), validateObjectId, getAdminOrderById)
    .put(authorize('orders:update'), validateObjectId, validate(adminUpdateOrderSchema), updateOrder);

router.post('/:id/sync-pathao', authorize('orders:update'), validateObjectId, syncOrderToPathao);

export default router;
