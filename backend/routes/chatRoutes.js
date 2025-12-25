import express from 'express';
import {
  createOrGetConversation,
  getConversations,
  sendMessage,
  getMessages,
  markAsRead,
  deleteConversation
} from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/conversation', authenticateToken, createOrGetConversation);
router.get('/conversations', authenticateToken, getConversations);
router.post('/:conversationId/message', authenticateToken, sendMessage);
router.get('/:conversationId/messages', authenticateToken, getMessages);
router.put('/:conversationId/read', authenticateToken, markAsRead);
router.delete('/:conversationId', authenticateToken, deleteConversation);

export default router;
