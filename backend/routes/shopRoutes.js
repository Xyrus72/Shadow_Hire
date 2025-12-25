import express from 'express';
import {
  getAllGadgets,
  getGadgetById,
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} from '../controllers/shopController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Gadgets
router.get('/gadgets', getAllGadgets);
router.get('/gadgets/:gadgetId', getGadgetById);

// Orders
router.post('/orders', authenticateToken, createOrder);
router.get('/orders', authenticateToken, getOrders);
router.get('/orders/:orderId', authenticateToken, getOrderById);
router.put('/orders/:orderId/status', authenticateToken, updateOrderStatus);
router.post('/orders/:orderId/cancel', authenticateToken, cancelOrder);

export default router;
