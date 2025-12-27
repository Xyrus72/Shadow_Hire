import mongoose from 'mongoose';

const freelancerApplicationSchema = new mongoose.Schema(
  {
    // References
    clientJobId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientJobs', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    freelancerEmail: { type: String, required: true },
    
    // Job Details (snapshot at time of application)
    jobTitle: { type: String, required: true },
    jobDescription: { type: String },
    requiredSkills: [{ type: String }],
    totalBudget: { type: Number, required: true },
    milestoneCount: { type: Number, default: 0 },
    totalMilestonePrice: { type: Number, default: 0 },
    
    // Application Details
    proposedRate: { type: Number, required: true }, // Freelancer's proposed rate/bid
    coverLetter: { type: String }, // Freelancer's application message
    estimatedDays: { type: Number }, // How many days to complete
    freelancerSkills: [{ type: String }], // Freelancer's matching skills
    
    // Status Workflow
    status: {
      type: String,
      enum: ['applied', 'under_review', 'approved', 'rejected', 'withdrawn'],
      default: 'applied'
    },
    
    // Timeline
    appliedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date, default: null },
    approvedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
    
    // Client Response
    clientFeedback: { type: String, default: null }, // Client's feedback on rejection
    clientReviewed: { type: Boolean, default: false },
    
    // Freelancer Profile (snapshot)
    freelancerName: { type: String },
    freelancerRating: { type: Number, default: 0 },
    freelancerReviews: { type: Number, default: 0 },
    freelancerCompletedJobs: { type: Number, default: 0 },
    freelancerPhotoURL: { type: String },
    
    // Additional Info
    attachments: [{ type: String }], // Portfolio, resume, etc.
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Indexes for fast queries
freelancerApplicationSchema.index({ clientJobId: 1, createdAt: -1 });
freelancerApplicationSchema.index({ freelancerId: 1, status: 1 });
freelancerApplicationSchema.index({ clientId: 1, status: 1 });
freelancerApplicationSchema.index({ jobId: 1 });
freelancerApplicationSchema.index({ status: 1 });

// Ensure one application per freelancer per job
freelancerApplicationSchema.index({ freelancerId: 1, jobId: 1 }, { unique: true });

// Create model using freelancer_applications collection
const FreelancerApplication = mongoose.model('FreelancerApplication', freelancerApplicationSchema, 'freelancer_applications');

export default FreelancerApplication;
