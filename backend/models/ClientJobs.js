import mongoose from 'mongoose';

const clientJobSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }, // Reference to main Job
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientEmail: { type: String, required: true },
    
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    
    // Requirements
    requiredSkills: [{ type: String }],
    experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'intermediate' },
    
    // Payment
    totalBudget: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'partial', 'completed'], default: 'pending' },
    
    // Status
    status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' },
    
    // Proposals count
    proposalCount: { type: Number, default: 0 },
    
    // Milestones count
    milestoneCount: { type: Number, default: 0 },
    
    // Total milestone price (sum of all milestone payments)
    totalMilestonePrice: { type: Number, default: 0 },
    
    // Assigned freelancer
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedAt: { type: Date, default: null },
    
    // Files
    attachments: [{ type: String }],
    
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Create indexes for faster queries
clientJobSchema.index({ clientId: 1, createdAt: -1 });
clientJobSchema.index({ clientEmail: 1 });
clientJobSchema.index({ status: 1 });
clientJobSchema.index({ jobId: 1 });

// Create ClientJobs model using client_jobs collection
const ClientJobs = mongoose.model('ClientJobs', clientJobSchema, 'client_jobs');

export default ClientJobs;
