import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    
    // Rating
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    
    // Category (for filtering)
    ratingType: { type: String, enum: ['communication', 'quality', 'professionalism', 'timeliness', 'overall'], default: 'overall' },
    
    // Verification
    verified: { type: Boolean, default: true }, // Auto-verified if job completed
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Rating', ratingSchema);
