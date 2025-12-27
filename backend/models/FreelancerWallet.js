import mongoose from 'mongoose';

const freelancerWalletSchema = new mongoose.Schema(
  {
    // Freelancer Reference
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    freelancerEmail: { type: String, required: true },
    freelancerName: { type: String },
    
    // Balance Tracking
    totalEarnings: { type: Number, default: 0 }, // Total money earned from all jobs
    availableBalance: { type: Number, default: 0 }, // Money ready to withdraw
    escrowBalance: { type: Number, default: 0 }, // Money in escrow (waiting for job completion)
    withdrawnBalance: { type: Number, default: 0 }, // Total withdrawn so far
    
    // Transaction Counts
    totalPayments: { type: Number, default: 0 }, // Total payment transactions
    completedPayments: { type: Number, default: 0 }, // Completed payments
    pendingPayments: { type: Number, default: 0 }, // Pending payments
    
    // Withdrawal Info
    lastWithdrawalDate: { type: Date, default: null },
    nextWithdrawalDate: { type: Date, default: null },
    
    // Payment Method (Default)
    defaultPaymentMethod: {
      type: String,
      enum: ['bank_transfer', 'upi', 'crypto', 'wallet', 'paypal'],
      default: 'bank_transfer'
    },
    
    // Bank Details (for withdrawals)
    bankDetails: {
      accountHolder: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String
    },
    
    // UPI
    upiId: { type: String, default: null },
    
    // Crypto Wallet
    cryptoWallet: { type: String, default: null },
    cryptoType: { type: String, default: 'BTC' }, // BTC, ETH, etc
    
    // Status
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    
    // History
    totalJobsCompleted: { type: Number, default: 0 },
    averageEarningsPerJob: { type: Number, default: 0 },
    
    // Dates
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Indexes
freelancerWalletSchema.index({ freelancerId: 1 });
freelancerWalletSchema.index({ freelancerEmail: 1 });

const FreelancerWallet = mongoose.model('FreelancerWallet', freelancerWalletSchema, 'freelancer_wallets');

export default FreelancerWallet;
