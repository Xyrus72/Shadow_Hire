import mongoose from 'mongoose';

const freelancerPaymentSchema = new mongoose.Schema(
  {
    // References
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    acceptedJobId: { type: mongoose.Schema.Types.ObjectId, ref: 'FreelancerAcceptedJob', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    milestoneId: { type: mongoose.Schema.Types.ObjectId, default: null }, // Optional: specific milestone payment
    
    // Payment Details
    jobTitle: { type: String, required: true },
    amount: { type: Number, required: true }, // Payment amount
    currency: { type: String, default: 'USD' },
    
    // Payment Status
    paymentStatus: {
      type: String,
      enum: ['pending', 'in_escrow', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    
    // Milestone Tracking (if milestone-based)
    milestoneName: { type: String, default: null },
    milestoneStatus: {
      type: String,
      enum: ['pending', 'submitted', 'approved', 'rejected'],
      default: null
    },
    
    // Timeline
    createdAt: { type: Date, default: Date.now },
    escrowAt: { type: Date, default: null }, // When payment went into escrow
    completedAt: { type: Date, default: null }, // When payment was released
    
    // Transaction Details
    transactionId: { type: String, default: null }, // Payment gateway transaction ID
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'upi', 'crypto', 'wallet', 'paypal'],
      default: 'bank_transfer'
    },
    
    // Notes
    description: { type: String },
    adminNotes: { type: String, default: null },
    
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Indexes
freelancerPaymentSchema.index({ freelancerId: 1, createdAt: -1 });
freelancerPaymentSchema.index({ freelancerId: 1, paymentStatus: 1 });
freelancerPaymentSchema.index({ jobId: 1 });
freelancerPaymentSchema.index({ clientId: 1 });
freelancerPaymentSchema.index({ acceptedJobId: 1 });

const FreelancerPayment = mongoose.model('FreelancerPayment', freelancerPaymentSchema, 'freelancer_payments');

export default FreelancerPayment;
