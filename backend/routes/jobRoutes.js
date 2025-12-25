import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  submitProposal,
  acceptProposal,
  updateJobStatus,
  deleteJob,
  searchJobs
} from '../controllers/jobController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createJob);
router.get('/', getJobs);
router.get('/search', searchJobs);
router.get('/:jobId', getJobById);
router.post('/:jobId/proposal', authenticateToken, submitProposal);
router.post('/:jobId/proposal/:proposalIndex/accept', authenticateToken, acceptProposal);
router.put('/:jobId/status', authenticateToken, updateJobStatus);
router.delete('/:jobId', authenticateToken, deleteJob);

export default router;
