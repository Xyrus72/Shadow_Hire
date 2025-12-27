import mongoose from 'mongoose';

const freelancerWithdrawalSchema = new mongoose.Schema(
  {
    // Freelancer Reference
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    freelancerEmail: { type: String, required: true },
    
    // Withdrawal Details
    amount: { type: Number, required: true }, // Withdrawal amount
    currency: { type: String, default: 'USD' },
    
    // Payment Method Used
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'upi', 'crypto', 'wallet', 'paypal'],
      required: true
    },
    
    // Recipient Details
    recipientName: { type: String },
    recipientEmail: { type: String },
    recipientAccount: { type: String }, // Account number, UPI ID, or wallet address
    
    // Status
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending'
    },
    
    // Dates
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    
    // Transaction Tracking
    transactionId: { type: String, default: null }, // Bank/Payment gateway reference
    referenceNumber: { type: String }, // Internal tracking reference
    
    // Admin Notes
    adminNotes: { type: String, default: null },
    failureReason: { type: String, default: null }, // If withdrawal failed
    
    // Fees
    processingFee: { type: Number, default: 0 },
    netAmount: { type: Number }, // Amount after fees
    
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Indexes
freelancerWithdrawalSchema.index({ freelancerId: 1, createdAt: -1 });
freelancerWithdrawalSchema.index({ status: 1 });
freelancerWithdrawalSchema.index({ requestedAt: -1 });

const FreelancerWithdrawal = mongoose.model('FreelancerWithdrawal', freelancerWithdrawalSchema, 'freelancer_withdrawals');

export default FreelancerWithdrawal;
