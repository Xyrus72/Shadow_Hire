import mongoose from 'mongoose';
import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    const { jobId, title, description, milestone, estimatedHours, deadline } = req.body;
    const freelancerId = req.user.id;

    const newTask = new Task({
      jobId,
      freelancerId,
      title,
      description,
      milestone,
      estimatedHours,
      deadline
    });

    await newTask.save();

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { jobId, status, userId } = req.query;
    const authenticatedUserId = req.user.id;
    const filter = {};

    console.log('[getTasks] ===== FETCHING TASKS =====');
    console.log('[getTasks] Query params:', { jobId, status, userId, authenticatedUserId });

    // Filter by jobId if provided - IMPORTANT: convert string to ObjectId for MongoDB query
    if (jobId) {
      filter.jobId = new mongoose.Types.ObjectId(jobId);
      console.log('[getTasks] Added jobId filter:', jobId);
    }
    
    if (status) {
      filter.status = status;
      console.log('[getTasks] Added status filter:', status);
    }
    
    // If userId is provided, use it; otherwise use authenticated user's ID
    if (userId) {
      filter.freelancerId = userId;
      console.log('[getTasks] Added freelancerId filter (from userId param):', userId);
    } else if (!jobId) {
      // Only auto-filter by authenticated user if not filtering by jobId
      filter.freelancerId = authenticatedUserId;
      console.log('[getTasks] Added freelancerId filter (from auth):', authenticatedUserId);
    }

    console.log('[getTasks] Final filter object:', JSON.stringify(filter));

    const tasks = await Task.find(filter)
      .populate('jobId', 'title description totalBudget milestones clientId')
      .populate('freelancerId', 'displayName photoURL')
      .populate('clientId', 'displayName photoURL email')
      .sort({ deadline: 1 });

    console.log('[getTasks] Found', tasks.length, 'tasks');
    if (tasks.length > 0) {
      console.log('[getTasks] Task details:', tasks.map(t => ({
        _id: t._id.toString(),
        title: t.title,
        status: t.status,
        jobId: t.jobId?._id?.toString(),
        freelancerId: t.freelancerId?._id?.toString(),
        estimatedBudget: t.estimatedBudget,
        deadline: t.deadline
      })));
    } else {
      console.log('[getTasks] No tasks found. Looking for all tasks in database...');
      const allTasks = await Task.find({});
      console.log('[getTasks] Total tasks in database:', allTasks.length);
      if (allTasks.length > 0) {
        console.log('[getTasks] Sample tasks from database:', allTasks.slice(0, 3).map(t => ({
          _id: t._id.toString(),
          title: t.title,
          jobId: t.jobId?.toString(),
          freelancerId: t.freelancerId?.toString(),
          status: t.status
        })));
      }
    }
    
    console.log('[getTasks] ===== FETCH COMPLETE =====');
    res.json(tasks);
  } catch (error) {
    console.error('[getTasks] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate('jobId')
      .populate('freelancerId');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, progress, description } = req.body;
    const userId = req.user.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.freelancerId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (status) task.status = status;
    if (progress !== undefined) task.progress = progress;
    if (description) task.description = description;

    if (status === 'done' && !task.completedAt) {
      task.completedAt = new Date();
    }

    await task.save();

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addTimeEntry = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { hours, description, date } = req.body;
    const userId = req.user.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.freelancerId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    task.timeEntries.push({
      date: date || new Date(),
      hours,
      description
    });

    task.actualHours += hours;

    await task.save();

    res.json({
      message: 'Time entry added',
      task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.freelancerId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Task.findByIdAndDelete(taskId);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBurnoutWarning = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const tasks = await Task.find({ freelancerId: userId });
    const todayEntries = tasks.flatMap(t => 
      t.timeEntries.filter(te => te.date.toISOString().split('T')[0] === today)
    );

    const totalHours = todayEntries.reduce((sum, te) => sum + te.hours, 0);
    const hoursLimit = 8;

    res.json({
      totalHours,
      hoursLimit,
      warning: totalHours > hoursLimit,
      message: totalHours > hoursLimit ? `You've exceeded daily limit by ${totalHours - hoursLimit} hours` : 'You are within limits'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAcceptedTasksCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const acceptedTasks = await Task.countDocuments({
      freelancerId: userId,
      status: 'accepted',
      clientApproved: true
    });

    res.json({ count: acceptedTasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const validStatuses = ['pending', 'accepted', 'todo', 'in_progress', 'done', 'blocked'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify the user is the freelancer assigned to this task
    if (task.freelancerId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    task.status = status;
    await task.save();

    res.json({
      message: 'Task status updated successfully',
      task: task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DEBUG ENDPOINT - Check all tasks for a specific job
export const debugTasksByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log('[debugTasksByJob] ===== DEBUG REQUEST =====');
    console.log('[debugTasksByJob] Looking for tasks with jobId:', jobId);

    // Get all tasks in database
    const allTasks = await Task.find({});
    console.log('[debugTasksByJob] Total tasks in database:', allTasks.length);

    // Get tasks for this specific job (with ObjectId conversion)
    const tasksWithObjectId = await Task.find({
      jobId: new mongoose.Types.ObjectId(jobId)
    });
    console.log('[debugTasksByJob] Tasks found with ObjectId filter:', tasksWithObjectId.length);

    // Get tasks for this specific job (with string comparison)
    const tasksWithString = await Task.find({
      jobId: jobId
    });
    console.log('[debugTasksByJob] Tasks found with string filter:', tasksWithString.length);

    // Get tasks without any filter to see all
    const tasksAll = await Task.find({}).select('jobId title status freelancerId');
    console.log('[debugTasksByJob] All tasks in DB:', tasksAll.map(t => ({
      id: t._id.toString(),
      jobId: t.jobId.toString(),
      title: t.title,
      status: t.status,
      freelancerId: t.freelancerId.toString()
    })));

    res.json({
      requestedJobId: jobId,
      totalTasksInDatabase: allTasks.length,
      tasksForThisJobWithObjectId: tasksWithObjectId.length,
      tasksForThisJobWithString: tasksWithString.length,
      taskDetails: tasksWithObjectId.map(t => ({
        _id: t._id.toString(),
        jobId: t.jobId.toString(),
        title: t.title,
        status: t.status,
        freelancerId: t.freelancerId.toString(),
        estimatedBudget: t.estimatedBudget,
        deadline: t.deadline
      })),
      allTasksInDatabase: tasksAll.map(t => ({
        id: t._id.toString(),
        jobId: t.jobId.toString(),
        title: t.title,
        status: t.status
      }))
    });
  } catch (error) {
    console.error('[debugTasksByJob] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// DEBUG ENDPOINT - Get all tasks without filtering
export const getAllTasksDebug = async (req, res) => {
  try {
    console.log('[getAllTasksDebug] ===== FETCHING ALL TASKS =====');
    
    const allTasks = await Task.find({})
      .populate('jobId', 'title')
      .populate('freelancerId', 'displayName')
      .sort({ createdAt: -1 });
    
    console.log('[getAllTasksDebug] Found', allTasks.length, 'tasks total');
    
    res.json({
      totalCount: allTasks.length,
      tasks: allTasks.map(t => ({
        _id: t._id.toString(),
        title: t.title,
        status: t.status,
        jobId: t.jobId?._id?.toString() || t.jobId?.toString(),
        jobTitle: t.jobId?.title,
        freelancerId: t.freelancerId?._id?.toString() || t.freelancerId?.toString(),
        freelancerName: t.freelancerId?.displayName,
        createdAt: t.createdAt,
        estimatedBudget: t.estimatedBudget
      }))
    });
  } catch (error) {
    console.error('[getAllTasksDebug] Error:', error);
    res.status(500).json({ error: error.message });
  }
};