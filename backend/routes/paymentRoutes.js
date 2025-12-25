import express from 'express';
import {
  createPayment,
  getPayments,
  getPaymentById,
  releasePayment,
  refundPayment,
  getEarnings,
  withdrawEarnings
} from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createPayment);
router.get('/', authenticateToken, getPayments);
router.get('/earnings', authenticateToken, getEarnings);
router.get('/:paymentId', authenticateToken, getPaymentById);
router.post('/:paymentId/release', authenticateToken, releasePayment);
router.post('/refund', authenticateToken, refundPayment);
router.post('/withdraw', authenticateToken, withdrawEarnings);

export default router;
