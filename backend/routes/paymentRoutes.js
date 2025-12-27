import express from 'express';
import {
  createPayment,
  getPayments,
  getPaymentById,
  releasePayment,
  refundPayment,
  getEarnings,
  withdrawEarnings,
  createReleaseRequest,
  releaseMilestonePayment
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
router.post('/release-request', authenticateToken, createReleaseRequest);
router.post('/milestone/:jobId/:milestoneId/release', authenticateToken, releaseMilestonePayment);

export default router;
