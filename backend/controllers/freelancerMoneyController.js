import FreelancerPayment from '../models/FreelancerPayment.js';
import FreelancerWallet from '../models/FreelancerWallet.js';
import FreelancerWithdrawal from '../models/FreelancerWithdrawal.js';
import FreelancerAcceptedJob from '../models/FreelancerAcceptedJob.js';
import User from '../models/User.js';

// ========== WALLET MANAGEMENT ==========

// Get freelancer's wallet details
export const getFreelancerWallet = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    let wallet = await FreelancerWallet.findOne({ freelancerId });

    if (!wallet) {
      // Create wallet if it doesn't exist
      const user = await User.findById(freelancerId).select('email displayName');
      wallet = new FreelancerWallet({
        freelancerId,
        freelancerEmail: user.email,
        freelancerName: user.displayName
      });
      await wallet.save();
    }

    res.status(200).json({
      message: 'Freelancer wallet details',
      wallet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== PAYMENT TRACKING ==========

// Get all payments for a freelancer
export const getFreelancerPayments = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const { paymentStatus, sortBy } = req.query;

    const filter = { freelancerId };
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    let query = FreelancerPayment.find(filter);

    if (sortBy === 'recent') {
      query = query.sort({ createdAt: -1 });
    } else if (sortBy === 'amount') {
      query = query.sort({ amount: -1 });
    }

    const payments = await query
      .populate('clientId', 'displayName photoURL')
      .populate('jobId', 'title');

    res.status(200).json({
      message: 'Freelancer payments',
      payments,
      summary: {
        total: payments.length,
        pending: payments.filter(p => p.paymentStatus === 'pending').length,
        in_escrow: payments.filter(p => p.paymentStatus === 'in_escrow').length,
        completed: payments.filter(p => p.paymentStatus === 'completed').length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payment details
export const getPaymentDetail = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const freelancerId = req.user.id;

    const payment = await FreelancerPayment.findById(paymentId)
      .populate('freelancerId', 'displayName email photoURL')
      .populate('clientId', 'displayName email photoURL')
      .populate('jobId');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.freelancerId._id.toString() !== freelancerId) {
      return res.status(403).json({ error: 'Not authorized to view this payment' });
    }

    res.status(200).json({
      message: 'Payment details',
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark job as completed (triggers payment)
export const completeJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const freelancerId = req.user.id;

    // Find the accepted job
    const acceptedJob = await FreelancerAcceptedJob.findOne({
      jobId: jobId,
      freelancerId: freelancerId
    });

    if (!acceptedJob) {
      return res.status(404).json({ error: 'Accepted job not found' });
    }

    if (acceptedJob.jobStatus === 'completed') {
      return res.status(400).json({ error: 'Job already completed' });
    }

    // Update accepted job status
    acceptedJob.jobStatus = 'completed';
    acceptedJob.completedAt = new Date();
    await acceptedJob.save();

    console.log(`[COMPLETE_JOB] Job marked complete: ${jobId}`);

    // Create payment record (money goes to escrow)
    const payment = new FreelancerPayment({
      freelancerId: acceptedJob.freelancerId,
      jobId: acceptedJob.jobId,
      acceptedJobId: acceptedJob._id,
      clientId: acceptedJob.clientId,
      jobTitle: acceptedJob.jobTitle,
      amount: acceptedJob.proposedRate, // Or totalBudget, based on your logic
      paymentStatus: 'in_escrow',
      description: `Payment for completed job: ${acceptedJob.jobTitle}`,
      escrowAt: new Date()
    });

    await payment.save();

    console.log(`[COMPLETE_JOB] Payment created in escrow: ${payment._id}`);

    res.status(200).json({
      message: 'Job marked as completed. Payment is in escrow awaiting client approval.',
      acceptedJob,
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Release payment from escrow (admin/client approves)
export const releasePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const adminId = req.user.id; // Should be admin or client

    const payment = await FreelancerPayment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.paymentStatus !== 'in_escrow') {
      return res.status(400).json({ error: 'Payment is not in escrow' });
    }

    // Update payment status
    payment.paymentStatus = 'completed';
    payment.completedAt = new Date();
    await payment.save();

    console.log(`[RELEASE_PAYMENT] Payment released: ${paymentId}`);

    // Update freelancer wallet
    const wallet = await FreelancerWallet.findOne({
      freelancerId: payment.freelancerId
    });

    if (wallet) {
      wallet.totalEarnings += payment.amount;
      wallet.availableBalance += payment.amount;
      wallet.escrowBalance -= payment.amount;
      wallet.completedPayments += 1;
      wallet.averageEarningsPerJob =
        wallet.totalEarnings / Math.max(wallet.totalPayments, 1);
      await wallet.save();

      console.log(`[RELEASE_PAYMENT] Wallet updated for freelancer: ${payment.freelancerId}`);
    }

    res.status(200).json({
      message: 'Payment released from escrow to freelancer wallet',
      payment,
      updatedWallet: wallet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== WITHDRAWAL MANAGEMENT ==========

// Request withdrawal
export const requestWithdrawal = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const {
      amount,
      paymentMethod,
      recipientName,
      recipientEmail,
      recipientAccount
    } = req.body;

    // Get wallet
    const wallet = await FreelancerWallet.findOne({ freelancerId });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (wallet.availableBalance < amount) {
      return res.status(400).json({
        error: `Insufficient balance. Available: ${wallet.availableBalance}`,
        availableBalance: wallet.availableBalance
      });
    }

    // Create withdrawal request
    const withdrawal = new FreelancerWithdrawal({
      freelancerId,
      freelancerEmail: wallet.freelancerEmail,
      amount,
      paymentMethod,
      recipientName: recipientName || wallet.freelancerName,
      recipientEmail: recipientEmail || wallet.freelancerEmail,
      recipientAccount,
      status: 'pending',
      referenceNumber: `WD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    await withdrawal.save();

    // Deduct from available balance, add to escrow
    wallet.availableBalance -= amount;
    wallet.escrowBalance += amount;
    await wallet.save();

    console.log(`[WITHDRAWAL_REQUEST] New withdrawal request: ${withdrawal._id}`);

    res.status(201).json({
      message: 'Withdrawal request submitted',
      withdrawal,
      updatedBalance: {
        availableBalance: wallet.availableBalance,
        escrowBalance: wallet.escrowBalance
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get withdrawal history
export const getWithdrawalHistory = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const { status } = req.query;

    const filter = { freelancerId };
    if (status) filter.status = status;

    const withdrawals = await FreelancerWithdrawal.find(filter).sort({
      requestedAt: -1
    });

    res.status(200).json({
      message: 'Withdrawal history',
      withdrawals,
      summary: {
        total: withdrawals.length,
        pending: withdrawals.filter(w => w.status === 'pending').length,
        completed: withdrawals.filter(w => w.status === 'completed').length,
        failed: withdrawals.filter(w => w.status === 'failed').length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Process withdrawal
export const processWithdrawal = async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { status, transactionId, adminNotes, failureReason } = req.body;

    const withdrawal = await FreelancerWithdrawal.findById(withdrawalId);

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ error: 'Withdrawal is not pending' });
    }

    // Update withdrawal
    withdrawal.status = status;
    withdrawal.transactionId = transactionId;
    withdrawal.adminNotes = adminNotes;

    if (status === 'completed') {
      withdrawal.completedAt = new Date();

      // Update wallet
      const wallet = await FreelancerWallet.findOne({
        freelancerId: withdrawal.freelancerId
      });

      if (wallet) {
        wallet.escrowBalance -= withdrawal.amount;
        wallet.withdrawnBalance += withdrawal.amount;
        wallet.lastWithdrawalDate = new Date();
        wallet.nextWithdrawalDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await wallet.save();
      }
    } else if (status === 'failed') {
      withdrawal.failureReason = failureReason;

      // Refund to available balance
      const wallet = await FreelancerWallet.findOne({
        freelancerId: withdrawal.freelancerId
      });

      if (wallet) {
        wallet.escrowBalance -= withdrawal.amount;
        wallet.availableBalance += withdrawal.amount;
        await wallet.save();
      }
    }

    await withdrawal.save();

    console.log(`[PROCESS_WITHDRAWAL] Withdrawal ${withdrawalId} processed: ${status}`);

    res.status(200).json({
      message: `Withdrawal ${status}`,
      withdrawal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== EARNINGS SUMMARY ==========

// Get earnings summary
export const getEarningsSummary = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    const wallet = await FreelancerWallet.findOne({ freelancerId });
    const totalPayments = await FreelancerPayment.countDocuments({
      freelancerId,
      paymentStatus: 'completed'
    });
    const pendingPayments = await FreelancerPayment.countDocuments({
      freelancerId,
      paymentStatus: { $in: ['pending', 'in_escrow'] }
    });
    const withdrawals = await FreelancerWithdrawal.find({
      freelancerId,
      status: 'completed'
    }).select('amount');

    const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);

    res.status(200).json({
      message: 'Earnings summary',
      summary: {
        totalEarnings: wallet?.totalEarnings || 0,
        availableBalance: wallet?.availableBalance || 0,
        escrowBalance: wallet?.escrowBalance || 0,
        withdrawnBalance: wallet?.withdrawnBalance || 0,
        totalWithdrawn,
        totalPayments,
        pendingPayments,
        averageEarningsPerJob: wallet?.averageEarningsPerJob || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== MILESTONE COMPLETION ==========

// Mark milestone as in progress (start working)
export const startMilestone = async (req, res) => {
  try {
    const { jobId, milestoneId } = req.params;
    const freelancerId = req.user.id;

    const Job = require('../models/Job.js').default;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Verify freelancer is assigned to this job
    if (job.assignedTo.toString() !== freelancerId) {
      return res.status(403).json({ error: 'Not assigned to this job' });
    }

    const milestone = job.milestones.find(m => m._id.toString() === milestoneId);

    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    if (milestone.status === 'completed' || milestone.status === 'approved') {
      return res.status(400).json({ error: 'Milestone already completed' });
    }

    // Update milestone status to in_progress
    milestone.status = 'in_progress';
    await job.save();

    console.log(`[START_MILESTONE] Milestone ${milestoneId} marked as in_progress`);

    res.status(200).json({
      message: 'Milestone marked as in progress',
      milestone
    });
  } catch (error) {
    console.error('[START_MILESTONE] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Submit/Complete milestone work (mark as DONE and ready for review)
export const completeMilestone = async (req, res) => {
  try {
    const { jobId, milestoneId } = req.params;
    const { submittedWork } = req.body;
    const freelancerId = req.user.id;

    // Find the accepted job
    const acceptedJob = await FreelancerAcceptedJob.findOne({
      jobId: jobId,
      freelancerId: freelancerId
    });

    if (!acceptedJob) {
      return res.status(404).json({ error: 'Accepted job not found' });
    }

    if (acceptedJob.jobStatus === 'completed') {
      return res.status(400).json({ error: 'Job already completed' });
    }

    // Get the main job to update milestone
    const Job = require('../models/Job.js').default;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Find and update the milestone
    const milestone = job.milestones.find(m => m._id.toString() === milestoneId);

    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    if (milestone.status === 'completed' || milestone.status === 'approved') {
      return res.status(400).json({ error: 'Milestone already completed' });
    }

    // Update milestone status
    milestone.status = 'submitted';
    milestone.submittedAt = new Date();
    milestone.submittedWork = submittedWork || 'Work submitted for review';

    await job.save();

    console.log(`[COMPLETE_MILESTONE] Milestone ${milestoneId} submitted for job ${jobId}`);

    // Update accepted job completed milestones count
    acceptedJob.completedMilestones = (job.milestones.filter(m => m.status === 'submitted' || m.status === 'approved').length);
    await acceptedJob.save();

    res.status(200).json({
      message: 'Milestone submitted for review',
      milestone,
      progress: {
        completedMilestones: acceptedJob.completedMilestones,
        totalMilestones: job.milestones.length
      }
    });
  } catch (error) {
    console.error('[COMPLETE_MILESTONE] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};


// Approve milestone (Client/Admin)
export const approveMilestone = async (req, res) => {
  try {
    const { jobId, milestoneId } = req.params;
    const { adminNotes } = req.body;

    const Job = require('../models/Job.js').default;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const milestone = job.milestones.find(m => m._id.toString() === milestoneId);

    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    if (milestone.status !== 'submitted') {
      return res.status(400).json({ error: 'Milestone is not submitted' });
    }

    // Update milestone
    milestone.status = 'approved';
    milestone.approvedAt = new Date();
    milestone.adminNotes = adminNotes || null;

    await job.save();

    // Create payment for this milestone
    const freelancerAcceptedJob = await FreelancerAcceptedJob.findOne({
      jobId: jobId
    });

    if (freelancerAcceptedJob) {
      const FreelancerPayment = require('../models/FreelancerPayment.js').default;
      const payment = new FreelancerPayment({
        freelancerId: job.assignedTo,
        jobId: job._id,
        acceptedJobId: freelancerAcceptedJob._id,
        clientId: job.clientId,
        milestoneId: milestone._id,
        jobTitle: job.title,
        milestoneName: milestone.title,
        amount: milestone.payment,
        paymentStatus: 'in_escrow',
        description: `Milestone payment: ${milestone.title}`,
        escrowAt: new Date()
      });

      await payment.save();

      console.log(`[APPROVE_MILESTONE] Milestone ${milestoneId} approved with payment ${payment._id}`);
    }

    res.status(200).json({
      message: 'Milestone approved and payment created',
      milestone
    });
  } catch (error) {
    console.error('[APPROVE_MILESTONE] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
