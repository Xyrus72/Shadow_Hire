import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    
    // Requirements
    requiredSkills: [{ type: String }],
    experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'intermediate' },
    
    // Payment
    totalBudget: { type: Number, required: true }, // Total job budget
    paymentStatus: { type: String, enum: ['pending', 'paid', 'partial', 'completed'], default: 'pending' }, // Payment status from client
    
    // Status
    status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' },
    
    // Milestones/Tasks
    milestones: [{
      _id: mongoose.Schema.Types.ObjectId,
      title: { type: String, required: true },
      description: { type: String },
      payment: { type: Number, required: true }, // Payment for this milestone
      status: { type: String, enum: ['pending', 'in_progress', 'submitted', 'approved', 'completed', 'rejected'], default: 'pending' },
      dueDate: { type: Date },
      submittedAt: { type: Date, default: null },
      approvedAt: { type: Date, default: null },
      submittedWork: { type: String, default: null }, // Description of work done
      adminNotes: { type: String, default: null } // Admin approval notes
    }],
    
    // Matching
    proposals: [{
      freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      proposedRate: Number,
      message: String,
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
      submittedAt: { type: Date, default: Date.now },
      acceptedAt: { type: Date, default: null }
    }],
    
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedAt: { type: Date, default: null }, // When freelancer was assigned
    acceptedProposalId: { type: mongoose.Schema.Types.ObjectId, default: null }, // Reference to accepted proposal
    
    // Payment tracking
    paymentStatus: { type: String, enum: ['pending', 'escrow', 'partial', 'completed'], default: 'pending' },
    adminApprovalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    amountPaid: { type: Number, default: 0 },
    
    // Files
    attachments: [{ type: String }],
    
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Create indexes for faster queries
jobSchema.index({ clientId: 1 });
jobSchema.index({ assignedTo: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ 'proposals.freelancerId': 1 });

export default mongoose.model('Job', jobSchema);
