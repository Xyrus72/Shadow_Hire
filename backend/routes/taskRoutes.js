import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  addTimeEntry,
  deleteTask,
  getBurnoutWarning
} from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createTask);
router.get('/', authenticateToken, getTasks);
router.get('/burnout-warning', authenticateToken, getBurnoutWarning);
router.get('/:taskId', authenticateToken, getTaskById);
router.put('/:taskId', authenticateToken, updateTask);
router.post('/:taskId/time-entry', authenticateToken, addTimeEntry);
router.delete('/:taskId', authenticateToken, deleteTask);

export default router;
