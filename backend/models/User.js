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
    workHourLimit: { type: Number, default: 8 },
    
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
    availableBalance: { type: Number, default: 0 },
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

// Main User model - for login/registration (all users)
const User = mongoose.model('User', userSchema, 'users');

// Role-specific user models (for storing additional role-specific data)
const AdminUser = mongoose.model('AdminUser', userSchema, 'admin_users');
const ClientUser = mongoose.model('ClientUser', userSchema, 'client_users');
const FreelancerUser = mongoose.model('FreelancerUser', userSchema, 'freelancer_users');

// Function to get role-specific model
export const getRoleSpecificModel = (userType) => {
  switch(userType) {
    case 'admin':
      return AdminUser;
    case 'client':
      return ClientUser;
    case 'freelancer':
    default:
      return FreelancerUser;
  }
};

export { AdminUser, ClientUser, FreelancerUser };
export default User;

