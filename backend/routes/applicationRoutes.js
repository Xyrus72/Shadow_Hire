import express from 'express';
import FreelancerAcceptedJob from '../models/FreelancerAcceptedJob.js';
import {
  applyForJob,
  getJobApplications,
  getFreelancerApplications,
  approveApplication,
  rejectApplication,
  getApplicationDetail,
  withdrawApplication,
  getFreelancerAcceptedJobs,
  getAcceptedJobDetail,
  updateAcceptedJobStatus
} from '../controllers/applicationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ========== FREELANCER ROUTES ==========

// Freelancer applies for a job
router.post('/', authenticateToken, applyForJob);

// Freelancer gets their own applications
router.get('/freelancer/my-applications', authenticateToken, getFreelancerApplications);

// Freelancer withdraws an application
router.post('/:applicationId/withdraw', authenticateToken, withdrawApplication);

// ========== CLIENT ROUTES ==========

// Client gets all applications for a specific job
router.get('/job/:jobId', authenticateToken, getJobApplications);

// Client approves application
router.post('/:applicationId/approve', authenticateToken, approveApplication);

// Client rejects application
router.post('/:applicationId/reject', authenticateToken, rejectApplication);

// ========== GENERAL ROUTES ==========

// Diagnostic: Get all FreelancerAcceptedJob records (for testing)
router.get('/diagnostic/all-accepted-jobs', async (req, res) => {
  try {
    const allJobs = await FreelancerAcceptedJob.find({});
    res.status(200).json({
      message: 'All FreelancerAcceptedJob records',
      count: allJobs.length,
      jobs: allJobs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get application details (both client and freelancer can access)
router.get('/:applicationId', authenticateToken, getApplicationDetail);

// ========== FREELANCER ACCEPTED JOBS ==========

// Freelancer gets all their accepted jobs
router.get('/accepted-jobs/list', authenticateToken, getFreelancerAcceptedJobs);

// Freelancer gets details of specific accepted job
router.get('/accepted-jobs/:jobId/detail', authenticateToken, getAcceptedJobDetail);

// Freelancer updates progress of accepted job
router.put('/accepted-jobs/:jobId/status', authenticateToken, updateAcceptedJobStatus);

export default router;
