import express from 'express';
import {
  createRating,
  getRatings,
  getUserRatings,
  deleteRating
} from '../controllers/ratingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createRating);
router.get('/', getRatings);
router.get('/:userId', getUserRatings);
router.delete('/:ratingId', authenticateToken, deleteRating);

export default router;
