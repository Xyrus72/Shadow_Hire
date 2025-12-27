import mongoose from 'mongoose';
import Job from '../models/Job.js';
import ClientJobs from '../models/ClientJobs.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

export const createJob = async (req, res) => {
  try {
    const { title, description, category, requiredSkills, budgetType, budgetMin, budgetMax, totalBudget, deadline, estimatedHours, milestones, afterHoursOnly } = req.body;
    const clientId = req.user.id;

    // Get client email
    const client = await User.findById(clientId).select('email');
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Process milestones with proper IDs
    const processedMilestones = milestones ? milestones.map(m => ({
      _id: new mongoose.Types.ObjectId(),
      title: m.title,
      description: m.description || '',
      payment: m.payment,
      dueDate: m.dueDate,
      status: 'pending'
    })) : [];

    // Calculate total milestone price
    const totalMilestonePrice = processedMilestones.reduce((sum, m) => sum + (m.payment || 0), 0);

    const newJob = new Job({
      clientId,
      title,
      description,
      category,
      requiredSkills,
      budgetType,
      budgetMin,
      budgetMax,
      totalBudget: totalBudget || budgetMax,
      deadline,
      estimatedHours,
      milestones: processedMilestones,
      milestoneCount: processedMilestones.length, // Store milestone count
      totalMilestonePrice: totalMilestonePrice, // Store total milestone price
      paymentStatus: 'pending',
      adminApprovalStatus: 'pending',
      afterHoursOnly: afterHoursOnly !== false
    });

    await newJob.save();
    await newJob.populate('clientId', 'displayName photoURL');

    // Create corresponding ClientJob entry
    const clientJob = new ClientJobs({
      jobId: newJob._id,
      clientId: newJob.clientId,
      clientEmail: client.email,
      title: newJob.title,
      description: newJob.description,
      category: newJob.category,
      requiredSkills: newJob.requiredSkills,
      experienceLevel: newJob.experienceLevel,
      totalBudget: newJob.totalBudget,
      paymentStatus: newJob.paymentStatus,
      status: newJob.status,
      milestoneCount: processedMilestones.length, // Store milestone count
      totalMilestonePrice: totalMilestonePrice, // Store total milestone price
      attachments: newJob.attachments,
      visibility: newJob.visibility
    });

    await clientJob.save();

    res.status(201).json({
      message: 'Job created successfully with milestones',
      job: newJob
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { status, category, skills, afterHoursOnly, userId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (skills) filter.requiredSkills = { $in: skills.split(',') };
    if (afterHoursOnly) filter.afterHoursOnly = afterHoursOnly === 'true';
    if (userId) filter.clientId = userId;

    const jobs = await Job.find(filter)
      .populate('clientId', 'displayName photoURL averageRating')
      .populate('assignedTo', 'displayName photoURL email averageRating')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId)
      .populate('clientId', 'displayName photoURL email averageRating')
      .populate('assignedTo', 'displayName photoURL email averageRating')
      .populate('proposals.freelancerId', 'displayName photoURL averageRating');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClientAcceptedJobs = async (req, res) => {
  try {
    const clientId = req.user.id;

    // Get all jobs where current user is the client and a freelancer has been assigned
    const jobs = await Job.find({
      clientId: clientId,
      assignedTo: { $ne: null },  // Freelancer has been assigned
      status: 'in_progress'
    })
      .populate('clientId', 'displayName photoURL email')
      .populate('assignedTo', 'displayName photoURL email averageRating')
      .sort({ assignedAt: -1 })
      .limit(50);

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all jobs posted by the current client (from ClientJobs collection)
export const getClientPostedJobs = async (req, res) => {
  try {
    const clientId = req.user.id;

    // Get all jobs from ClientJobs collection for current client
    const clientJobs = await ClientJobs.find({ clientId })
      .populate('jobId')
      .populate('assignedTo', 'displayName photoURL email averageRating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Client jobs fetched successfully',
      jobs: clientJobs,
      count: clientJobs.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific client job with detailed info
export const getClientJobDetail = async (req, res) => {
  try {
    const { jobId } = req.params;
    const clientId = req.user.id;

    // Verify the job belongs to the current client
    const clientJob = await ClientJobs.findOne({
      jobId: jobId,
      clientId: clientId
    })
      .populate('jobId')
      .populate('assignedTo', 'displayName photoURL email averageRating');

    if (!clientJob) {
      return res.status(404).json({ error: 'Job not found or does not belong to you' });
    }

    res.status(200).json({
      message: 'Client job details fetched successfully',
      job: clientJob
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const submitProposal = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { proposedRate, message } = req.body;
    const freelancerId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const existingProposal = job.proposals.find(p => p.freelancerId.toString() === freelancerId);
    if (existingProposal) {
      return res.status(400).json({ error: 'You have already submitted a proposal for this job' });
    }

    job.proposals.push({
      freelancerId,
      proposedRate,
      message
    });

    await job.save();
    await job.populate('proposals.freelancerId', 'displayName photoURL');

    res.json({
      message: 'Proposal submitted successfully',
      job
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.clientId.toString() !== userId && job.assignedTo.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    job.status = status;
    await job.save();

    res.json({
      message: 'Job status updated',
      job
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.clientId.toString() !== userId) {
      return res.status(403).json({ error: 'Only job creator can delete' });
    }

    await Job.findByIdAndDelete(jobId);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchJobs = async (req, res) => {
  try {
    const { query } = req.query;

    const jobs = await Job.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(query, 'i')] } }
      ]
    })
    .populate('clientId', 'displayName photoURL')
    .limit(20);

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit milestone work
export const submitMilestone = async (req, res) => {
  try {
    const { jobId, milestoneId } = req.params;
    const { submittedWork } = req.body;
    const freelancerId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.assignedTo.toString() !== freelancerId) {
      return res.status(403).json({ error: 'Only assigned freelancer can submit' });
    }

    const milestone = job.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    milestone.status = 'submitted';
    milestone.submittedWork = submittedWork;
    milestone.submittedAt = new Date();

    await job.save();

    res.json({
      message: 'Milestone submitted for approval',
      milestone
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin approve milestone
export const approveMilestone = async (req, res) => {
  try {
    const { jobId, milestoneId } = req.params;
    const { adminNotes } = req.body;
    const adminId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const milestone = job.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    milestone.status = 'approved';
    milestone.approvedAt = new Date();
    milestone.adminNotes = adminNotes || '';

    // Update job payment status
    const allApproved = job.milestones.every(m => m.status === 'approved' || m.status === 'completed');
    const someApproved = job.milestones.some(m => m.status === 'approved' || m.status === 'completed');

    if (allApproved) {
      job.paymentStatus = 'completed';
    } else if (someApproved) {
      job.paymentStatus = 'partial';
    }

    await job.save();

    res.json({
      message: 'Milestone approved',
      milestone
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject milestone
export const rejectMilestone = async (req, res) => {
  try {
    const { jobId, milestoneId } = req.params;
    const { adminNotes } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const milestone = job.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    milestone.status = 'pending';
    milestone.submittedWork = null;
    milestone.submittedAt = null;
    milestone.adminNotes = adminNotes || 'Needs revision';

    await job.save();

    res.json({
      message: 'Milestone rejected, sent back for revision',
      milestone
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get proposals submitted by freelancer
export const getFreelancerProposals = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    // Find all jobs where this freelancer has submitted a proposal
    const jobs = await Job.find({
      'proposals.freelancerId': freelancerId
    })
    .populate('clientId', 'displayName photoURL email')
    .populate('proposals.freelancerId', 'displayName photoURL')
    .select('title description budgetMin budgetMax deadline totalBudget proposals milestones')
    .sort({ createdAt: -1 })
    .lean();

    // Extract proposals with job info
    const proposals = jobs.flatMap(job => 
      job.proposals
        .filter(p => p.freelancerId._id.toString() === freelancerId)
        .map(p => ({
          _id: p._id,
          jobId: job._id,
          jobTitle: job.title,
          jobDescription: job.description,
          clientId: job.clientId._id,
          clientName: job.clientId.displayName,
          clientPhoto: job.clientId.photoURL,
          budget: job.totalBudget || job.budgetMax,
          deadline: job.deadline,
          proposedRate: p.proposedRate,
          message: p.message,
          status: p.status,
          submittedAt: p.submittedAt,
          acceptedAt: p.acceptedAt,
          milestonesCount: job.milestones?.length || 0
        }))
    );

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get accepted jobs for a freelancer
export const getAcceptedJobs = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    console.log(`[getAcceptedJobs] Fetching jobs for freelancer: ${freelancerId}`);

    // Find all jobs assigned to this freelancer (accepted)
    const jobs = await Job.find({
      assignedTo: freelancerId,
      status: { $in: ['in_progress', 'completed'] }
    })
    .populate('clientId', 'displayName photoURL email')
    .sort({ assignedAt: -1 })
    .lean();

    console.log(`[getAcceptedJobs] Found ${jobs.length} jobs for freelancer ${freelancerId}`);
    console.log(`[getAcceptedJobs] Query used: assignedTo=${freelancerId}, status in ['in_progress', 'completed']`);

    // Format jobs with milestone details
    const acceptedJobs = jobs.map(job => {
      const formattedJob = {
        _id: job._id,
        jobTitle: job.title,
        jobDescription: job.description,
        clientId: job.clientId._id,
        clientName: job.clientId.displayName,
        clientPhoto: job.clientId.photoURL,
        totalBudget: job.totalBudget,
        jobStatus: job.status,
        paymentStatus: job.paymentStatus,
        assignedAt: job.assignedAt,
        milestones: (job.milestones || []).map((m, idx) => ({
          _id: m._id,
          taskNumber: idx + 1,
          title: m.title,
          description: m.description,
          payment: m.payment,
          status: m.status,
          dueDate: m.dueDate,
          submittedAt: m.submittedAt,
          approvedAt: m.approvedAt,
          submittedWork: m.submittedWork,
          adminNotes: m.adminNotes
        }))
      };
      console.log(`[getAcceptedJobs] Job "${job.title}" has ${formattedJob.milestones.length} milestones`);
      return formattedJob;
    });

    console.log(`[getAcceptedJobs] Returning ${acceptedJobs.length} formatted jobs`);
    res.json(acceptedJobs);
  } catch (error) {
    console.error('[getAcceptedJobs] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get proposals for a client's posted job
export const getJobProposals = async (req, res) => {
  try {
    const { jobId } = req.params;
    const clientId = req.user.id;

    const job = await Job.findById(jobId)
      .populate('proposals.freelancerId', 'displayName photoURL email rating skills averageRating')
      .populate('clientId', 'displayName');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.clientId._id.toString() !== clientId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const proposals = job.proposals.map(p => ({
      _id: p._id,
      freelancerId: p.freelancerId._id,
      freelancerName: p.freelancerId.displayName,
      freelancerPhoto: p.freelancerId.photoURL,
      freelancerEmail: p.freelancerId.email,
      freelancerRating: p.freelancerId.averageRating || p.freelancerId.rating || 0,
      freelancerSkills: p.freelancerId.skills || [],
      proposedRate: p.proposedRate,
      message: p.message,
      status: p.status,
      submittedAt: p.submittedAt,
      acceptedAt: p.acceptedAt
    }));

    res.json({
      jobId,
      jobTitle: job.title,
      proposals
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Client accepts a proposal
export const acceptProposal = async (req, res) => {
  try {
    const { jobId, proposalId } = req.params;
    const clientId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.clientId.toString() !== clientId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const proposal = job.proposals.id(proposalId);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Update proposal status and track acceptance time
    proposal.status = 'accepted';
    proposal.acceptedAt = new Date();
    
    // Assign freelancer to job and track assignment time
    job.assignedTo = proposal.freelancerId;
    job.assignedAt = new Date();
    job.acceptedProposalId = proposal._id;
    job.status = 'in_progress';
    
    await job.save();

    // Create tasks for each milestone
    // Calculate deadline - use job deadline or default to 30 days from now
    const taskDeadline = job.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    console.log('[acceptProposal] ===== CREATING TASKS =====')
    console.log('[acceptProposal] jobId:', job._id)
    console.log('[acceptProposal] freelancerId:', proposal.freelancerId)
    console.log('[acceptProposal] clientId:', job.clientId)
    console.log('[acceptProposal] Number of milestones:', job.milestones?.length || 0)
    
    // If job has milestones, create a task for each milestone
    if (job.milestones && job.milestones.length > 0) {
      console.log('[acceptProposal] Creating task for each of', job.milestones.length, 'milestones')
      const createdTaskIds = [];
      for (let i = 0; i < job.milestones.length; i++) {
        const milestone = job.milestones[i];
        console.log(`[acceptProposal] Creating task ${i + 1}:`, {
          title: `${job.title} - ${milestone.title}`,
          estimatedBudget: milestone.payment || (job.totalBudget / job.milestones.length),
          deadline: milestone.dueDate || taskDeadline
        })
        
        const milestoneTask = new Task({
          jobId: job._id,
          freelancerId: proposal.freelancerId,
          clientId: job.clientId,
          title: `${job.title} - ${milestone.title}`,
          description: milestone.description || job.description,
          status: 'pending',
          clientApproved: true,
          clientApprovedAt: new Date(),
          estimatedHours: (job.estimatedHours || 8) / job.milestones.length,
          estimatedBudget: milestone.payment || (job.totalBudget / job.milestones.length),
          deadline: milestone.dueDate || taskDeadline,
          milestone: milestone.title,
          progress: 0
        });
        const savedTask = await milestoneTask.save();
        createdTaskIds.push(savedTask._id.toString());
        console.log(`[acceptProposal] Task ${i + 1} saved with ID:`, savedTask._id)
      }
      console.log('[acceptProposal] All', job.milestones.length, 'tasks created successfully with IDs:', createdTaskIds)
      
      // Verify tasks were actually saved
      const verifyTasks = await Task.find({ jobId: job._id });
      console.log('[acceptProposal] VERIFICATION: Found', verifyTasks.length, 'tasks in database for this job');
    } else {
      // If no milestones, create a single task
      console.log('[acceptProposal] No milestones found, creating single task')
      const newTask = new Task({
        jobId: job._id,
        freelancerId: proposal.freelancerId,
        clientId: job.clientId,
        title: job.title,
        description: job.description,
        status: 'pending',
        clientApproved: true,
        clientApprovedAt: new Date(),
        estimatedHours: job.estimatedHours || 8,
        estimatedBudget: job.totalBudget,
        deadline: taskDeadline,
        milestone: '',
        progress: 0
      });
      const savedTask = await newTask.save();
      console.log('[acceptProposal] Single task created with ID:', savedTask._id)
    }
    console.log('[acceptProposal] ===== TASK CREATION COMPLETE =====')

    // Create a chat conversation between client and freelancer
    const conversationId = [clientId, proposal.freelancerId.toString()].sort().join('_');
    let chat = await Chat.findOne({ conversationId });

    if (!chat) {
      chat = new Chat({
        conversationId,
        participants: [clientId, proposal.freelancerId],
        jobId: job._id,
        messages: []
      });
      await chat.save();
    }

    // Populate freelancer details for response
    await job.populate('assignedTo', 'displayName photoURL email');

    res.json({
      message: 'Proposal accepted and chat conversation created',
      proposal,
      freelancerId: proposal.freelancerId,
      jobId: job._id,
      conversationId,
      assignedAt: job.assignedAt,
      acceptedAt: proposal.acceptedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Client rejects a proposal
export const rejectProposal = async (req, res) => {
  try {
    const { jobId, proposalId } = req.params;
    const clientId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.clientId.toString() !== clientId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const proposal = job.proposals.id(proposalId);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    proposal.status = 'rejected';
    await job.save();

    res.json({
      message: 'Proposal rejected',
      proposal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

