import Payment from '../models/Payment.js';
import FreelancerPayment from '../models/FreelancerPayment.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

export const createPayment = async (req, res) => {
  try {
    const { jobId, freelancerId, amount, paymentMethod, milestone } = req.body;
    const clientId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.clientId.toString() !== clientId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const invoiceNumber = `INV-${Date.now()}`;

    const payment = new Payment({
      jobId,
      clientId,
      freelancerId,
      amount,
      paymentMethod,
      milestone,
      status: 'escrow',
      invoiceNumber
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment created and held in escrow',
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const { userId, role } = req.query; // role: 'client' or 'freelancer'
    const filter = {};

    if (role === 'client') {
      filter.clientId = userId;
    } else if (role === 'freelancer') {
      filter.freelancerId = userId;
    }

    const payments = await Payment.find(filter)
      .populate('jobId', 'title')
      .populate('clientId', 'displayName')
      .populate('freelancerId', 'displayName')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('jobId')
      .populate('clientId')
      .populate('freelancerId');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const releasePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.clientId.toString() !== userId) {
      return res.status(403).json({ error: 'Only client can release payment' });
    }

    payment.status = 'released';
    payment.escrowReleased = true;
    payment.escrowReleaseDate = new Date();

    await payment.save();

    // Update freelancer earnings
    const freelancer = await User.findById(payment.freelancerId);
    freelancer.totalEarnings += payment.amount;
    await freelancer.save();

    res.json({
      message: 'Payment released successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const refundPayment = async (req, res) => {
  try {
    const { paymentId, reason } = req.body;
    const userId = req.user.id;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.clientId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    payment.status = 'refunded';

    await payment.save();

    res.json({
      message: 'Payment refunded',
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEarnings = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    const payments = await Payment.find({
      freelancerId,
      status: 'released'
    });

    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
    const completedJobs = new Set(payments.map(p => p.jobId.toString())).size;

    res.json({
      totalEarnings,
      completedJobs,
      payments,
      breakdown: {
        released: totalEarnings,
        pending: 0,
        thisMonth: payments.filter(p => {
          const date = new Date(p.createdAt);
          const now = new Date();
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).reduce((sum, p) => sum + p.amount, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const withdrawEarnings = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (user.totalEarnings < amount) {
      return res.status(400).json({ error: 'Insufficient earnings' });
    }

    user.totalEarnings -= amount;
    await user.save();

    res.json({
      message: 'Withdrawal processed',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const createReleaseRequest = async (req, res) => {
  try {
    const { jobId, freelancerId, amount, clientId } = req.body;
    const userId = req.user.id;

    // Verify the client is making this request
    if (clientId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Verify job exists and belongs to this client
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.clientId.toString() !== userId) {
      return res.status(403).json({ error: 'This job does not belong to you' });
    }

    // Create a payment record with status 'pending_approval'
    const payment = new Payment({
      jobId,
      clientId,
      freelancerId,
      amount,
      status: 'pending_approval',
      milestone: 'Milestone Payment',
      invoiceNumber: `REL-${Date.now()}`
    });

    await payment.save();

    res.status(201).json({
      message: 'Fund release request submitted to admin for approval',
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Release payment for approved milestone
export const releaseMilestonePayment = async (req, res) => {
  try {
    const { jobId, milestoneId } = req.params;
    const adminId = req.user.id;

    console.log('[releaseMilestonePayment] Processing payment for job:', jobId, 'milestone:', milestoneId);

    const job = await Job.findById(jobId).populate('assignedTo clientId');
    if (!job) {
      console.error('[releaseMilestonePayment] Job not found:', jobId);
      return res.status(404).json({ error: 'Job not found' });
    }
    console.log('[releaseMilestonePayment] Job found:', job._id, 'assignedTo:', job.assignedTo);

    const milestone = job.milestones.find(m => m._id.toString() === milestoneId);
    if (!milestone) {
      console.error('[releaseMilestonePayment] Milestone not found:', milestoneId, 'in milestones:', job.milestones.map(m => m._id));
      return res.status(404).json({ error: 'Milestone not found' });
    }
    console.log('[releaseMilestonePayment] Milestone found:', milestone._id, 'status:', milestone.status);

    if (milestone.status !== 'approved') {
      console.error('[releaseMilestonePayment] Milestone not approved, status:', milestone.status);
      return res.status(400).json({ error: 'Only approved milestones can be paid' });
    }

    if (!job.assignedTo) {
      console.error('[releaseMilestonePayment] No freelancer assigned to this job');
      return res.status(400).json({ error: 'No freelancer assigned to this job' });
    }

    // Create payment record for this milestone
    const payment = new Payment({
      jobId,
      clientId: job.clientId._id,
      freelancerId: job.assignedTo._id,
      amount: milestone.payment,
      status: 'released',
      milestone: milestone.title,
      invoiceNumber: `MS-${jobId}-${milestoneId}-${Date.now()}`
    });

    await payment.save();
    console.log('[releaseMilestonePayment] Payment record created:', payment._id);

    // Create FreelancerPayment record for freelancer tracking
    const freelancerPayment = new FreelancerPayment({
      freelancerId: job.assignedTo._id,
      jobId,
      clientId: job.clientId._id,
      milestoneId,
      jobTitle: job.title,
      amount: milestone.payment,
      paymentStatus: 'completed',
      milestoneName: milestone.title,
      milestoneStatus: 'approved',
      completedAt: new Date(),
      description: `Milestone payment for: ${milestone.title}`
    });

    await freelancerPayment.save();
    console.log('[releaseMilestonePayment] FreelancerPayment record created:', freelancerPayment._id);

    // Update freelancer's total earnings and available balance
    const freelancer = await User.findById(job.assignedTo._id);
    if (freelancer) {
      freelancer.totalEarnings = (freelancer.totalEarnings || 0) + milestone.payment;
      freelancer.availableBalance = (freelancer.availableBalance || 0) + milestone.payment;
      await freelancer.save();
      console.log('[releaseMilestonePayment] Updated freelancer earnings:', freelancer.totalEarnings, 'balance:', freelancer.availableBalance);
    } else {
      console.error('[releaseMilestonePayment] Freelancer not found:', job.assignedTo._id);
    }

    // Mark milestone as completed
    milestone.status = 'completed';
    await job.save();
    console.log('[releaseMilestonePayment] Job saved with completed milestone');

    res.json({
      message: 'Milestone payment released successfully',
      payment,
      milestone
    });
  } catch (error) {
    console.error('[releaseMilestonePayment] Error:', error.message);
    console.error('[releaseMilestonePayment] Stack:', error.stack);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export const processMilestonePayment = async (req, res) => {
  try {
    const { taskId, amount, jobId } = req.body;
    const freelancerId = req.user.id;

    // Verify job and freelancer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.assignedTo?.toString() !== freelancerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update freelancer's balance
    const user = await User.findById(freelancerId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.availableBalance = (user.availableBalance || 0) + amount;
    user.totalEarnings = (user.totalEarnings || 0) + amount;
    await user.save();

    // Create payment record
    const payment = new Payment({
      jobId: jobId,
      clientId: job.clientId,
      freelancerId: freelancerId,
      amount: amount,
      paymentMethod: 'wallet',
      milestone: taskId,
      status: 'released',
      description: `Milestone payment for task completion`
    });

    await payment.save();

    res.status(201).json({
      message: 'Milestone payment processed successfully',
      payment,
      newBalance: user.availableBalance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const requestMilestonePayment = async (req, res) => {
  try {
    const { taskId, amount, jobId } = req.body;
    const freelancerId = req.user.id;

    // Verify task exists and belongs to freelancer
    const Task = await import('../models/Task.js').then(m => m.default);
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.freelancerId.toString() !== freelancerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Fetch the job to get clientId
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Create payment request (status: pending_approval)
    const payment = new Payment({
      jobId: jobId,
      clientId: job.clientId,
      freelancerId: freelancerId,
      amount: amount,
      paymentMethod: 'wallet',
      milestone: taskId,
      status: 'pending_approval',
      description: `Payment request for milestone completion`
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment request submitted for admin approval',
      payment,
      status: 'pending_approval'
    });
  } catch (error) {
    console.error('[requestMilestonePayment] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const approvePaymentRequest = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update payment status to released
    payment.status = 'released';
    await payment.save();

    // Add money to freelancer's balance
    const User = await import('../models/User.js').then(m => m.default);
    const user = await User.findById(payment.freelancerId);
    
    if (user) {
      user.availableBalance = (user.availableBalance || 0) + payment.amount;
      user.totalEarnings = (user.totalEarnings || 0) + payment.amount;
      await user.save();
    }

    res.json({
      message: 'Payment approved and released',
      payment,
      newBalance: user?.availableBalance || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectPaymentRequest = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update payment status to refunded
    payment.status = 'refunded';
    await payment.save();

    res.json({
      message: 'Payment request rejected',
      payment,
      reason: reason || 'No reason provided'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};