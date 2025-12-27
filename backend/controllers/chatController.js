import Chat from '../models/Chat.js';

export const createOrGetConversation = async (req, res) => {
  try {
    const { otherUserId, jobId } = req.body;
    const userId = req.user.id;

    const conversationId = [userId, otherUserId].sort().join('_');

    let chat = await Chat.findOne({ conversationId });

    if (!chat) {
      chat = new Chat({
        conversationId,
        participants: [userId, otherUserId],
        jobId: jobId || null,
        messages: []
      });
      await chat.save();
    }

    chat = await Chat.findOne({ conversationId })
      .populate('participants', 'displayName photoURL email')
      .populate('messages.senderId', 'displayName photoURL')
      .populate('jobId', 'title');

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'displayName photoURL email')
      .populate('messages.senderId', 'displayName photoURL')
      .populate('jobId', 'title')
      .sort({ lastMessageTime: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, attachments } = req.body;
    const senderId = req.user.id;

    const chat = await Chat.findOne({ conversationId });
    if (!chat) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const message = {
      senderId,
      content,
      attachments: attachments || [],
      timestamp: new Date(),
      read: false
    };

    chat.messages.push(message);
    chat.lastMessage = content;
    chat.lastMessageTime = new Date();

    await chat.save();
    await chat.populate('messages.senderId', 'displayName photoURL');

    res.json({
      message: 'Message sent',
      chat
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const chat = await Chat.findOne({ conversationId })
      .populate('messages.senderId', 'displayName photoURL');

    if (!chat) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = chat.messages.slice(-limit - offset, limit > offset ? -offset || undefined : undefined).reverse();

    res.json({
      conversationId,
      messages,
      totalMessages: chat.messages.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({ conversationId });
    if (!chat) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    chat.messages.forEach(msg => {
      if (msg.senderId.toString() !== userId) {
        msg.read = true;
      }
    });

    await chat.save();

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await Chat.deleteOne({ conversationId });

    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
