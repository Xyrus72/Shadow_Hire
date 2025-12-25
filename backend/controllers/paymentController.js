import Payment from '../models/Payment.js';
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
