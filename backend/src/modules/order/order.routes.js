import express from "express";
import {
  initPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  getMyOrders,
  syncOrderToPathao,
  ipn,
  getOrderById,
  bkashSuccess,
  getOrders,
  updateOrder,
  createOrderAdmin
} from "./order.controller.js";
import { requireAuth, admin, optionalAuth } from "../../middleware/auth.js";
import { validateObjectId } from "../../middleware/validate.js";

const router = express.Router();

// 🛒 Client Protocols (static routes first)
router.post("/init", optionalAuth, initPayment);
router.get("/myorders", optionalAuth, getMyOrders);

// 💳 SSLCommerz Webhooks
router.post("/ssl/success/:tran_id", paymentSuccess);
router.post("/ssl/fail/:tran_id", paymentFail);
router.post("/ssl/cancel/:tran_id", paymentCancel);
router.post("/ssl/ipn", ipn);

// 📱 bKash Callback
router.get("/bkash/success/:orderId", bkashSuccess);

// 🛡️ Admin: Get all orders (static route)
router.get("/", requireAuth, admin, getOrders);
router.post("/admin/create", requireAuth, admin, createOrderAdmin);

// 🛡️ Admin: Dynamic routes for specific order (must come after all static routes)

router.post("/:id/pathao-sync", requireAuth, admin, validateObjectId, syncOrderToPathao);

router.get('/:id', optionalAuth, getOrderById);
router.put('/:id', requireAuth, admin, validateObjectId, updateOrder);
router.put('/:id/status', requireAuth, admin, validateObjectId, updateOrder);


export default router;