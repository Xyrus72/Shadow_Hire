import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Amount
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    
    // Status
    status: { type: String, enum: ['pending', 'escrow', 'released', 'refunded', 'pending_approval', 'cancelled'], default: 'pending' },
    
    // Payment Method
    paymentMethod: { type: String, enum: ['card', 'bank', 'upi', 'crypto', 'wallet'], required: true },
    
    // Milestone
    milestone: { type: String, default: '' },
    
    // Escrow
    escrowReleaseDate: { type: Date, default: null },
    escrowReleased: { type: Boolean, default: false },
    
    // Transaction
    transactionId: { type: String, unique: true, sparse: true },
    invoiceNumber: { type: String, unique: true, sparse: true },
    
    // Metadata
    description: { type: String, default: '' },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
