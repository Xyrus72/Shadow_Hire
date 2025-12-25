import mongoose from 'mongoose';

const gadgetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ['laptop', 'keyboard', 'mouse', 'headphones'], required: true },
    description: { type: String, default: '' },
    specs: { type: String, default: '' },
    
    // Pricing
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    discount: { type: Number, required: true }, // percentage
    
    // Stock
    stock: { type: Number, default: 0 },
    
    // Rating
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    
    // Availability
    isActive: { type: Boolean, default: true },
    
    // Image
    imageUrl: { type: String, default: '' },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Gadget', gadgetSchema);
