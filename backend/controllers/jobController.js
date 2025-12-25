import Job from '../models/Job.js';
import User from '../models/User.js';

export const createJob = async (req, res) => {
  try {
    const { title, description, category, requiredSkills, budgetType, budgetMin, budgetMax, deadline, estimatedHours, afterHoursOnly } = req.body;
    const clientId = req.user.id;

    const newJob = new Job({
      clientId,
      title,
      description,
      category,
      requiredSkills,
      budgetType,
      budgetMin,
      budgetMax,
      deadline,
      estimatedHours,
      afterHoursOnly: afterHoursOnly !== false
    });

    await newJob.save();
    await newJob.populate('clientId', 'displayName photoURL');

    res.status(201).json({
      message: 'Job created successfully',
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
      .populate('proposals.freelancerId', 'displayName photoURL averageRating');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
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

export const acceptProposal = async (req, res) => {
  try {
    const { jobId, proposalIndex } = req.params;
    const clientId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.clientId.toString() !== clientId) {
      return res.status(403).json({ error: 'Only job creator can accept proposals' });
    }

    const proposal = job.proposals[proposalIndex];
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    job.proposals.forEach((p, idx) => {
      p.status = idx === parseInt(proposalIndex) ? 'accepted' : 'rejected';
    });

    job.assignedTo = proposal.freelancerId;
    job.status = 'in_progress';

    await job.save();

    res.json({
      message: 'Proposal accepted',
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
