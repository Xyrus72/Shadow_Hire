import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  addTimeEntry,
  deleteTask,
  getBurnoutWarning,
  getAcceptedTasksCount,
  updateTaskStatus,
  debugTasksByJob,
  getAllTasksDebug
} from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createTask);
router.get('/debug/all', getAllTasksDebug);
router.get('/debug/:jobId', debugTasksByJob);
router.get('/freelancer/:freelancerId', authenticateToken, getTasks);
router.get('/count/accepted', authenticateToken, getAcceptedTasksCount);
router.get('/burnout-warning', authenticateToken, getBurnoutWarning);
router.get('/', authenticateToken, getTasks);
router.get('/:taskId', authenticateToken, getTaskById);
router.put('/:taskId', authenticateToken, updateTask);
router.put('/:taskId/status', authenticateToken, updateTaskStatus);
router.post('/:taskId/time-entry', authenticateToken, addTimeEntry);
router.delete('/:taskId', authenticateToken, deleteTask);

export default router;