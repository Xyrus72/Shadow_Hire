import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    
    // Milestone
    milestone: { type: String, default: '' },
    
    // Status
    status: { type: String, enum: ['todo', 'in_progress', 'done', 'blocked'], default: 'todo' },
    
    // Time Tracking
    estimatedHours: { type: Number, required: true },
    actualHours: { type: Number, default: 0 },
    
    // Dates
    startDate: { type: Date, default: Date.now },
    deadline: { type: Date, required: true },
    completedAt: { type: Date, default: null },
    
    // Progress
    progress: { type: Number, default: 0, min: 0, max: 100 },
    
    // Tracking
    timeEntries: [{
      date: { type: Date, default: Date.now },
      hours: { type: Number, required: true },
      description: String
    }],
    
    // Attachments
    attachments: [{ type: String }],
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
