import express from 'express';
import {
  registerUser,
  loginUser,
  checkRegistration,
  getUser,
  updateUser,
  updateSkills,
  updatePaymentMethod,
  getPublicProfile
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/check-registration', checkRegistration);
router.get('/profile', authenticateToken, getUser);
router.put('/profile', authenticateToken, updateUser);
router.put('/skills', authenticateToken, updateSkills);
router.put('/payment-method', authenticateToken, updatePaymentMethod);
router.get('/public/:userId', getPublicProfile);

export default router;
