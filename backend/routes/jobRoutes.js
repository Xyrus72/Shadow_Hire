import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  getClientAcceptedJobs,
  submitProposal,
  updateJobStatus,
  deleteJob,
  searchJobs,
  submitMilestone,
  approveMilestone,
  rejectMilestone,
  getFreelancerProposals,
  getAcceptedJobs,
  getJobProposals,
  acceptProposal,
  rejectProposal
} from '../controllers/jobController.js';
import { authenticateToken } from '../middleware/auth.js';
import Job from '../models/Job.js';

const router = express.Router();

// ===== FREELANCER ROUTES (Must come FIRST before wildcard routes) =====
// Diagnostic route - shows accepted jobs for debugging
router.get('/freelancer/diagnostic', authenticateToken, async (req, res) => {
  try {
    const freelancerId = req.user.id;
    console.log(`[Diagnostic] Freelancer ID: ${freelancerId}`);

    const jobsWithAssignedTo = await Job.find({ assignedTo: freelancerId }).lean();
    const jobsInProgress = await Job.find({ status: 'in_progress' }).lean();
    const jobsAssignedToMe = await Job.find({ assignedTo: freelancerId, status: { $in: ['in_progress', 'completed'] } }).lean();

    res.json({
      freelancerId,
      jobsWithMyAssignedTo: jobsWithAssignedTo.length,
      allInProgressJobs: jobsInProgress.length,
      myAcceptedJobs: jobsAssignedToMe.length,
      myJobs: jobsAssignedToMe.map(j => ({
        id: j._id,
        title: j.title,
        status: j.status,
        assignedTo: j.assignedTo,
        milestones: j.milestones?.length || 0
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get freelancer's accepted/assigned jobs (with all milestones and details)
router.get('/freelancer/accepted-jobs', authenticateToken, getAcceptedJobs);

// Get client's accepted jobs (jobs where freelancer has been assigned)
router.get('/client/accepted-jobs', authenticateToken, getClientAcceptedJobs);

// Get freelancer's proposals (all bids submitted)
router.get('/freelancer/my-proposals', authenticateToken, getFreelancerProposals);

// ===== PUBLIC/GENERAL ROUTES =====
// Public and general routes
router.post('/', authenticateToken, createJob);
router.get('/', getJobs);
router.get('/search', searchJobs);
router.get('/:jobId', getJobById);
router.get('/:jobId/proposals', authenticateToken, getJobProposals);
router.post('/:jobId/proposal', authenticateToken, submitProposal);
router.post('/:jobId/proposal/:proposalId/accept', authenticateToken, acceptProposal);
router.post('/:jobId/proposal/:proposalId/reject', authenticateToken, rejectProposal);
router.put('/:jobId/status', authenticateToken, updateJobStatus);
router.delete('/:jobId', authenticateToken, deleteJob);

// Milestone routes
router.post('/:jobId/milestone/:milestoneId/submit', authenticateToken, submitMilestone);
router.post('/:jobId/milestone/:milestoneId/approve', authenticateToken, approveMilestone);
router.post('/:jobId/milestone/:milestoneId/reject', authenticateToken, rejectMilestone);

export default router;
