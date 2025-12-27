import Announcement from '../models/Announcement.js';
import Message from '../models/Message.js';
import User, { AdminUser, ClientUser, FreelancerUser } from '../models/User.js';
import Payment from '../models/Payment.js';

// ========== ANNOUNCEMENTS ==========

// Create announcement (Admin only)
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    const adminId = req.user?.uid || req.body.adminId;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const announcement = new Announcement({
      title,
      content,
      createdBy: adminId
    });

    await announcement.save();
    res.status(201).json({ 
      message: 'Announcement created successfully',
      announcement 
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
};

// Get all announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ 
      message: 'Announcements fetched successfully',
      announcements 
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
};

// Delete announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;

    const announcement = await Announcement.findByIdAndUpdate(
      announcementId,
      { isActive: false },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.status(200).json({ 
      message: 'Announcement deleted successfully',
      announcement 
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
};

// ========== MESSAGES ==========

// Send message to specific user (Admin)
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, recipientEmail, subject, message } = req.body;
    const senderId = req.user?.uid || req.body.senderId;
    const senderName = req.user?.displayName || req.body.senderName || 'Admin';

    if (!recipientId || !subject || !message) {
      return res.status(400).json({ message: 'Recipient, subject, and message are required' });
    }

    const newMessage = new Message({
      senderId,
      senderName,
      recipientId,
      recipientEmail,
      subject,
      message
    });

    await newMessage.save();
    res.status(201).json({ 
      message: 'Message sent successfully',
      data: newMessage 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Get messages for a user
export const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({ recipientId: userId }).sort({ createdAt: -1 });
    res.status(200).json({ 
      message: 'Messages fetched successfully',
      messages 
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ 
      message: 'Message marked as read',
      data: message 
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Error marking message as read', error: error.message });
  }
};

// ========== USER MANAGEMENT ==========

// Get all users (Admin)
export const getAllUsers = async (req, res) => {
  try {
    // Fetch users from all collections
    const [adminUsers, clientUsers, freelancerUsers, regularUsers] = await Promise.all([
      AdminUser.find().select('-password'),
      ClientUser.find().select('-password'),
      FreelancerUser.find().select('-password'),
      User.find().select('-password')
    ]);

    // Combine all users and remove duplicates
    const allUsers = [
      ...adminUsers,
      ...clientUsers,
      ...freelancerUsers,
      ...regularUsers
    ];

    // Remove duplicates by uid
    const uniqueUsers = Array.from(
      new Map(allUsers.map(user => [user.uid, user])).values()
    );

    res.status(200).json({ 
      message: 'Users fetched successfully',
      users: uniqueUsers,
      summary: {
        total: uniqueUsers.length,
        admins: adminUsers.length,
        clients: clientUsers.length,
        freelancers: freelancerUsers.length
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Delete user (Admin)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      message: 'User deleted successfully',
      user 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Delete user by email
export const deleteUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      message: 'User deleted successfully',
      user 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      message: 'User fetched successfully',
      user 
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// ========== FREELANCER PAYMENTS ==========

// Pay freelancer
export const payFreelancer = async (req, res) => {
  try {
    const { freelancerId, taskId, amount, paymentMethod, freelancerEmail } = req.body;

    if (!freelancerId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Verify freelancer exists
    const freelancer = await User.findById(freelancerId);
    if (!freelancer || freelancer.userType !== 'freelancer') {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Create payment record
    const payment = new Payment({
      jobId: taskId ? null : null,
      clientId: req.user?.id,
      freelancerId: freelancerId,
      amount: parseFloat(amount),
      currency: 'USD',
      paymentMethod: paymentMethod,
      status: 'released',
      description: taskId ? `Payment for task completion` : 'Direct payment',
      escrowReleased: true,
      escrowReleaseDate: new Date(),
      transactionId: `ADMIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber: `INV-${Date.now()}`
    });

    await payment.save();

    // Update freelancer's total earnings
    freelancer.totalEarnings = (freelancer.totalEarnings || 0) + parseFloat(amount);
    await freelancer.save();

    res.status(201).json({
      message: 'Payment processed successfully',
      payment: payment,
      freelancer: {
        id: freelancer._id,
        name: freelancer.displayName,
        email: freelancer.email,
        totalEarnings: freelancer.totalEarnings
      }
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

// Receive message from client to admin
export const receiveClientMessage = async (req, res) => {
  try {
    console.log('📨 Received client message request');
    console.log('Request body:', req.body);
    console.log('User from auth:', req.user);
    
    const { subject, message } = req.body;
    const clientId = req.user?.id || req.user?._id;

    console.log('Client ID:', clientId);
    console.log('Subject:', subject);
    console.log('Message:', message);

    if (!subject || !message) {
      console.log('❌ Missing subject or message');
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    let client;
    try {
      console.log('🔍 Searching for user with ID:', clientId);
      client = await User.findById(clientId);
      console.log('✓ User search completed, found:', !!client);
    } catch (findError) {
      console.log('❌ Error finding user:', findError.message);
      throw findError;
    }
    
    if (!client) {
      console.log('❌ Client not found with ID:', clientId);
      return res.status(404).json({ message: 'Client not found' });
    }

    // Create a message from client to admin (addressed to all admins)
    const newMessage = new Message({
      senderId: clientId,
      senderName: client.displayName || 'Client',
      subject: subject,
      message: message,
      recipientId: 'admin', // Mark as message for all admins
      isAdminMessage: true
    });

    console.log('📝 Message object created:', newMessage);

    try {
      await newMessage.save();
      console.log('✅ Message saved successfully to database');
    } catch (saveError) {
      console.log('❌ Error saving message:', saveError.message);
      throw saveError;
    }

    res.status(201).json({
      message: 'Your message has been sent to the admin',
      data: newMessage
    });
  } catch (error) {
    console.error('❌ Error in receiveClientMessage:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Get all messages from clients to admins (visible to all admins)
export const getAllAdminMessages = async (req, res) => {
  try {
    // Get all messages addressed to admins
    const messages = await Message.find({ 
      $or: [
        { recipientId: 'admin' },
        { isAdminMessage: true }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Admin messages fetched successfully',
      messages,
      total: messages.length
    });
  } catch (error) {
    console.error('Error fetching admin messages:', error);
    res.status(500).json({ message: 'Error fetching admin messages', error: error.message });
  }
};

// Get unread messages from clients to admins
export const getUnreadAdminMessages = async (req, res) => {
  try {
    const unreadMessages = await Message.find({
      $or: [
        { recipientId: 'admin' },
        { isAdminMessage: true }
      ],
      isRead: false
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Unread admin messages fetched successfully',
      messages: unreadMessages,
      total: unreadMessages.length
    });
  } catch (error) {
    console.error('Error fetching unread admin messages:', error);
    res.status(500).json({ message: 'Error fetching unread admin messages', error: error.message });
  }
};
