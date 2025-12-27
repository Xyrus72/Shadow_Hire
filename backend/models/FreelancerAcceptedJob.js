import mongoose from 'mongoose';

const freelancerAcceptedJobSchema = new mongoose.Schema(
  {
    // References
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'FreelancerApplication', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    clientJobId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientJobs', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Job Details
    jobTitle: { type: String, required: true },
    jobDescription: { type: String },
    category: { type: String },
    requiredSkills: [{ type: String }],
    
    // Client Info
    clientName: { type: String },
    clientPhotoURL: { type: String },
    clientEmail: { type: String },
    clientRating: { type: Number, default: 0 },
    
    // Freelancer Info
    freelancerName: { type: String, required: true },
    freelancerPhotoURL: { type: String },
    freelancerEmail: { type: String },
    freelancerRating: { type: Number, default: 0 },
    freelancerCompletedJobs: { type: Number, default: 0 },
    freelancerTotalReviews: { type: Number, default: 0 },
    freelancerSkills: [{ type: String }],
    
    // Budget & Payment Details
    totalBudget: { type: Number, required: true },
    proposedRate: { type: Number, required: true }, // Freelancer's bid
    milestoneCount: { type: Number, default: 0 },
    totalMilestonePrice: { type: Number, default: 0 },
    
    // Estimated Timeline
    estimatedDays: { type: Number },
    
    // Job Status
    jobStatus: {
      type: String,
      enum: ['in_progress', 'completed', 'on_hold', 'cancelled'],
      default: 'in_progress'
    },
    
    // Progress Tracking
    completedMilestones: { type: Number, default: 0 },
    startedAt: { type: Date },
    expectedCompletionDate: { type: Date },
    completedAt: { type: Date, default: null },
    
    // Payment Progress
    amountPaid: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'completed'],
      default: 'pending'
    },
    
    // Files & Attachments
    attachments: [{ type: String }],
    
    // Timestamps
    acceptedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Indexes for fast queries
freelancerAcceptedJobSchema.index({ freelancerId: 1, jobStatus: 1 });
freelancerAcceptedJobSchema.index({ freelancerId: 1, acceptedAt: -1 });
freelancerAcceptedJobSchema.index({ clientId: 1 });
freelancerAcceptedJobSchema.index({ jobId: 1 });
freelancerAcceptedJobSchema.index({ jobStatus: 1 });

// Create model using freelancer_accepted_jobs collection
const FreelancerAcceptedJob = mongoose.model('FreelancerAcceptedJob', freelancerAcceptedJobSchema, 'freelancer_accepted_jobs');

export default FreelancerAcceptedJob;
