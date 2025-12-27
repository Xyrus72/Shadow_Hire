import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    photoURL: { type: String, default: null },
    userType: { type: String, enum: ['freelancer', 'client', 'both', 'admin'], default: 'freelancer' },
    
    // Profile
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    hourlyRate: { type: Number, default: 0 },
    
    // Availability
    availableAfterHours: { type: Boolean, default: true },
    workHourLimit: { type: Number, default: 8 }, // hours per day
    
    // Rating
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    
    // Payment Info
    bankDetails: {
      accountHolder: String,
      accountNumber: String,
      ifscCode: String
    },
    upiId: { type: String, default: null },
    cryptoWallet: { type: String, default: null },
    
    // Verification
    isVerified: { type: Boolean, default: false },
    documentVerified: { type: Boolean, default: false },
    
    // Statistics
    totalEarnings: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    totalHoursWorked: { type: Number, default: 0 },
    
    // Preferences
    officeAccess: { type: Boolean, default: false },
    shudivhaService: { type: Boolean, default: false },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
