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
    budgetType: { type: String, enum: ['hourly', 'fixed'], required: true },
    budgetMin: { type: Number, required: true },
    budgetMax: { type: Number, required: true },
    
    // Duration
    deadline: { type: Date, required: true },
    estimatedHours: { type: Number, default: 0 },
    afterHoursOnly: { type: Boolean, default: true },
    
    // Status
    status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' },
    
    // Matching
    proposals: [{
      freelancerId: mongoose.Schema.Types.ObjectId,
      proposedRate: Number,
      message: String,
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
      submittedAt: { type: Date, default: Date.now }
    }],
    
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    
    // Files
    attachments: [{ type: String }],
    
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
