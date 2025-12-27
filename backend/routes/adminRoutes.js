import express from 'express';
import { createAnnouncement, getAllAnnouncements, deleteAnnouncement, sendMessage, getUserMessages, markMessageAsRead, getAllUsers, deleteUser, deleteUserByEmail, getUserById, payFreelancer, receiveClientMessage, getAllAdminMessages, getUnreadAdminMessages } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Announcement routes
router.post('/announcements', createAnnouncement);
router.get('/announcements', getAllAnnouncements);
router.delete('/announcements/:announcementId', deleteAnnouncement);

// Message routes
router.post('/messages', sendMessage);
router.post('/messages/client', authenticateToken, receiveClientMessage);
router.get('/messages/:userId', getUserMessages);
router.get('/messages-admin/all', authenticateToken, getAllAdminMessages);
router.get('/messages-admin/unread', authenticateToken, getUnreadAdminMessages);
router.patch('/messages/:messageId/read', markMessageAsRead);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.delete('/users/:userId', deleteUser);
router.delete('/users/email/:email', deleteUserByEmail);

// Freelancer payment routes
router.post('/pay-freelancer', payFreelancer);

export default router;
