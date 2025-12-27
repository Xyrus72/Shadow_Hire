import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    recipientId: {
      type: String,
      required: false,
      default: null
    },
    recipientEmail: {
      type: String,
      required: false
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isAdminMessage: {
      type: Boolean,
      default: false,
      description: 'True if this message is addressed to all admins'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
