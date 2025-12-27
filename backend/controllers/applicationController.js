import FreelancerApplication from '../models/FreelancerApplication.js';
import FreelancerAcceptedJob from '../models/FreelancerAcceptedJob.js';
import ClientJobs from '../models/ClientJobs.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

// ========== FREELANCER APPLICATIONS ==========

// Freelancer applies for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId, proposedRate, coverLetter, estimatedDays, freelancerSkills, attachments } = req.body;
    const freelancerId = req.user.id;

    // Get freelancer details
    const freelancer = await User.findById(freelancerId).select('email displayName photoURL averageRating totalReviews projectsCompleted');
    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer not found' });
    }

    // Get the main job
    const job = await Job.findById(jobId).populate('clientId', 'id');
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get the ClientJob
    const clientJob = await ClientJobs.findOne({ jobId: jobId });
    if (!clientJob) {
      return res.status(404).json({ error: 'Client job not found' });
    }

    // Check if already applied
    const existingApplication = await FreelancerApplication.findOne({
      freelancerId,
      jobId
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Create application
    const application = new FreelancerApplication({
      clientJobId: clientJob._id,
      jobId: job._id,
      clientId: job.clientId,
      freelancerId,
      freelancerEmail: freelancer.email,
      jobTitle: job.title,
      jobDescription: job.description,
      requiredSkills: job.requiredSkills,
      totalBudget: job.totalBudget,
      milestoneCount: job.milestoneCount || 0,
      totalMilestonePrice: job.totalMilestonePrice || 0,
      proposedRate,
      coverLetter: coverLetter || '',
      estimatedDays: estimatedDays || 0,
      freelancerSkills: freelancerSkills || [],
      freelancerName: freelancer.displayName,
      freelancerRating: freelancer.averageRating || 0,
      freelancerReviews: freelancer.totalReviews || 0,
      freelancerCompletedJobs: freelancer.projectsCompleted || 0,
      freelancerPhotoURL: freelancer.photoURL,
      attachments: attachments || []
    });

    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all applications for a specific job (client view)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const clientId = req.user.id;

    // Verify client owns this job
    const job = await Job.findById(jobId);
    if (!job || job.clientId.toString() !== clientId) {
      return res.status(403).json({ error: 'Not authorized to view these applications' });
    }

    const applications = await FreelancerApplication.find({ jobId })
      .populate('freelancerId', 'displayName photoURL email')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      message: 'Applications fetched successfully',
      applications,
      totalApplications: applications.length,
      approvedApplications: applications.filter(a => a.status === 'approved').length,
      pendingApplications: applications.filter(a => a.status === 'applied').length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all applications submitted by a freelancer
export const getFreelancerApplications = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const { status } = req.query;

    const filter = { freelancerId };
    if (status) filter.status = status;

    const applications = await FreelancerApplication.find(filter)
      .populate('clientId', 'displayName photoURL')
      .populate('jobId', 'title status')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      message: 'Freelancer applications fetched successfully',
      applications,
      summary: {
        total: applications.length,
        applied: applications.filter(a => a.status === 'applied').length,
        approved: applications.filter(a => a.status === 'approved').length,
        rejected: applications.filter(a => a.status === 'rejected').length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Client approves freelancer application
// Client approves freelancer application
export const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const clientId = req.user.id;

    console.log(`[APPROVE] Processing application: ${applicationId} by client: ${clientId}`);

    const application = await FreelancerApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    console.log(`[APPROVE] Application found:`, application._id);

    // Verify client owns the job
    if (application.clientId.toString() !== clientId) {
      return res.status(403).json({ error: 'Not authorized to approve this application' });
    }

    if (application.status !== 'applied') {
      return res.status(400).json({ error: `Cannot approve application with status: ${application.status}` });
    }

    // Update application status
    application.status = 'approved';
    application.approvedAt = new Date();
    application.clientReviewed = true;
    await application.save();

    console.log(`[APPROVE] Application updated to approved`);

    // Update the main Job to assign freelancer
    const job = await Job.findById(application.jobId);
    if (job) {
      job.assignedTo = application.freelancerId;
      job.assignedAt = new Date();
      job.status = 'in_progress';
      await job.save();
      console.log(`[APPROVE] Job updated`);
    }

    // Update ClientJobs to assign freelancer
    const clientJob = await ClientJobs.findById(application.clientJobId);
    if (clientJob) {
      clientJob.assignedTo = application.freelancerId;
      clientJob.assignedAt = new Date();
      clientJob.status = 'in_progress';
      await clientJob.save();
      console.log(`[APPROVE] ClientJob updated`);
    }

    // Get client details
    const client = await User.findById(clientId).select('displayName photoURL email averageRating');
    console.log(`[APPROVE] Client details fetched:`, client?.displayName);
    
    // Get freelancer details
    const freelancer = await User.findById(application.freelancerId).select('displayName photoURL email averageRating projectsCompleted totalReviews');
    console.log(`[APPROVE] Freelancer details fetched:`, freelancer?.displayName);

    // Create FreelancerAcceptedJob entry
    const acceptedJob = new FreelancerAcceptedJob({
      applicationId: application._id,
      jobId: application.jobId,
      clientJobId: application.clientJobId,
      clientId: application.clientId,
      freelancerId: application.freelancerId,
      jobTitle: application.jobTitle,
      jobDescription: application.jobDescription,
      category: application.category || 'general',
      requiredSkills: application.requiredSkills,
      clientName: client?.displayName || 'Unknown Client',
      clientPhotoURL: client?.photoURL || null,
      clientEmail: client?.email || null,
      clientRating: client?.averageRating || 0,
      freelancerName: freelancer?.displayName || 'Unknown Freelancer',
      freelancerPhotoURL: freelancer?.photoURL || null,
      freelancerEmail: freelancer?.email || null,
      freelancerRating: freelancer?.averageRating || 0,
      freelancerCompletedJobs: freelancer?.projectsCompleted || 0,
      freelancerTotalReviews: freelancer?.totalReviews || 0,
      freelancerSkills: application.freelancerSkills || [],
      totalBudget: application.totalBudget,
      proposedRate: application.proposedRate,
      milestoneCount: application.milestoneCount,
      totalMilestonePrice: application.totalMilestonePrice,
      estimatedDays: application.estimatedDays,
      jobStatus: 'in_progress',
      startedAt: new Date(),
      attachments: application.attachments || []
    });

    console.log(`[APPROVE] Saving FreelancerAcceptedJob...`);
    await acceptedJob.save();
    console.log(`[APPROVE] FreelancerAcceptedJob saved:`, acceptedJob._id);

    res.status(200).json({
      message: 'Application approved and freelancer assigned to job',
      application,
      acceptedJob
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Client rejects freelancer application
export const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { feedback } = req.body;
    const clientId = req.user.id;

    const application = await FreelancerApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Verify client owns the job
    if (application.clientId.toString() !== clientId) {
      return res.status(403).json({ error: 'Not authorized to reject this application' });
    }

    if (application.status !== 'applied') {
      return res.status(400).json({ error: `Cannot reject application with status: ${application.status}` });
    }

    // Update application status
    application.status = 'rejected';
    application.rejectedAt = new Date();
    application.clientReviewed = true;
    application.clientFeedback = feedback || null;
    await application.save();

    res.status(200).json({
      message: 'Application rejected',
      application
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get application details
export const getApplicationDetail = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const application = await FreelancerApplication.findById(applicationId)
      .populate('freelancerId', 'displayName photoURL email averageRating')
      .populate('clientId', 'displayName photoURL email');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Verify user is either the client or freelancer
    if (application.clientId._id.toString() !== userId && application.freelancerId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to view this application' });
    }

    res.status(200).json({
      message: 'Application details fetched',
      application
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Freelancer withdraws application
export const withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const freelancerId = req.user.id;

    const application = await FreelancerApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Verify freelancer owns the application
    if (application.freelancerId.toString() !== freelancerId) {
      return res.status(403).json({ error: 'Not authorized to withdraw this application' });
    }

    if (application.status === 'approved') {
      return res.status(400).json({ error: 'Cannot withdraw an approved application' });
    }

    application.status = 'withdrawn';
    await application.save();

    res.status(200).json({
      message: 'Application withdrawn successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== FREELANCER ACCEPTED JOBS ==========

// Get all accepted jobs for a freelancer
export const getFreelancerAcceptedJobs = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const { jobStatus } = req.query;

    console.log(`[GET_ACCEPTED_JOBS] Fetching for freelancer: ${freelancerId}`);

    const filter = { freelancerId };
    if (jobStatus) filter.jobStatus = jobStatus;

    const acceptedJobs = await FreelancerAcceptedJob.find(filter)
      .populate('clientId', 'displayName photoURL email')
      .populate('jobId', 'title status')
      .sort({ acceptedAt: -1 });

    console.log(`[GET_ACCEPTED_JOBS] Found ${acceptedJobs.length} jobs`);

    res.status(200).json({
      message: 'Freelancer accepted jobs fetched successfully',
      jobs: acceptedJobs,
      summary: {
        total: acceptedJobs.length,
        in_progress: acceptedJobs.filter(j => j.jobStatus === 'in_progress').length,
        completed: acceptedJobs.filter(j => j.jobStatus === 'completed').length,
        on_hold: acceptedJobs.filter(j => j.jobStatus === 'on_hold').length
      }
    });
  } catch (error) {
    console.error('[GET_ACCEPTED_JOBS] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get a specific accepted job details
export const getAcceptedJobDetail = async (req, res) => {
  try {
    const { jobId } = req.params;
    const freelancerId = req.user.id;

    const acceptedJob = await FreelancerAcceptedJob.findOne({
      jobId: jobId,
      freelancerId: freelancerId
    })
      .populate('clientId', 'displayName photoURL email')
      .populate('jobId');

    if (!acceptedJob) {
      return res.status(404).json({ error: 'Accepted job not found' });
    }

    res.status(200).json({
      message: 'Accepted job details fetched',
      job: acceptedJob
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update accepted job status (progress)
export const updateAcceptedJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { jobStatus, completedMilestones, amountPaid, paymentStatus } = req.body;
    const freelancerId = req.user.id;

    const acceptedJob = await FreelancerAcceptedJob.findOne({
      jobId: jobId,
      freelancerId: freelancerId
    });

    if (!acceptedJob) {
      return res.status(404).json({ error: 'Accepted job not found' });
    }

    // Update fields
    if (jobStatus) acceptedJob.jobStatus = jobStatus;
    if (completedMilestones !== undefined) acceptedJob.completedMilestones = completedMilestones;
    if (amountPaid !== undefined) acceptedJob.amountPaid = amountPaid;
    if (paymentStatus) acceptedJob.paymentStatus = paymentStatus;

    if (jobStatus === 'completed') {
      acceptedJob.completedAt = new Date();
    }

    await acceptedJob.save();

    res.status(200).json({
      message: 'Accepted job status updated',
      job: acceptedJob
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
