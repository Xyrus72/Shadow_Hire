import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true, unique: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    
    messages: [{
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      attachments: [{ type: String }],
      timestamp: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }
    }],
    
    lastMessage: { type: String, default: '' },
    lastMessageTime: { type: Date, default: Date.now },
    
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Chat', chatSchema);
