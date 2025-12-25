import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gadgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gadget', required: true },
    
    // Order Details
    quantity: { type: Number, required: true, default: 1 },
    pricePerUnit: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    
    // Status
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    
    // Shipping
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    
    // Tracking
    trackingNumber: { type: String, default: null },
    estimatedDelivery: { type: Date, default: null },
    
    // Payment
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['card', 'upi', 'wallet'], required: true },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
