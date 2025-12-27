import express from 'express';
import {
  getFreelancerWallet,
  getFreelancerPayments,
  getPaymentDetail,
  completeJob,
  releasePayment,
  requestWithdrawal,
  getWithdrawalHistory,
  processWithdrawal,
  getEarningsSummary,
  startMilestone,
  completeMilestone,
  approveMilestone
} from '../controllers/freelancerMoneyController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ========== WALLET ROUTES ==========

// Get wallet details
router.get('/wallet', authenticateToken, getFreelancerWallet);

// ========== PAYMENT ROUTES ==========

// Get all payments
router.get('/payments', authenticateToken, getFreelancerPayments);

// Get specific payment details
router.get('/payments/:paymentId', authenticateToken, getPaymentDetail);

// Mark job as completed (trigger payment to escrow)
router.post('/complete-job/:jobId', authenticateToken, completeJob);

// Release payment from escrow (admin)
router.post('/release-payment/:paymentId', authenticateToken, releasePayment);

// ========== MILESTONE ROUTES ==========

// Freelancer: Start/Mark milestone as in progress
router.post('/milestone/:jobId/:milestoneId/start', authenticateToken, startMilestone);

// Freelancer: Submit/Complete milestone work
router.post('/milestone/:jobId/:milestoneId/submit', authenticateToken, completeMilestone);

// Admin/Client: Approve milestone (create payment)
router.post('/milestone/:jobId/:milestoneId/approve', authenticateToken, approveMilestone);

// ========== WITHDRAWAL ROUTES ==========

// Request withdrawal
router.post('/withdraw', authenticateToken, requestWithdrawal);

// Get withdrawal history
router.get('/withdrawals/history', authenticateToken, getWithdrawalHistory);

// Admin: Process withdrawal
router.post('/withdrawals/:withdrawalId/process', authenticateToken, processWithdrawal);

// ========== EARNINGS SUMMARY ==========

// Get earnings summary
router.get('/earnings/summary', authenticateToken, getEarningsSummary);

export default router;
