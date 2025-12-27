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

    if (jobId) filter.jobId = jobId;
    if (status) filter.status = status;
    
    // If userId is provided, use it; otherwise use authenticated user's ID
    if (userId) {
      filter.freelancerId = userId;
    } else {
      filter.freelancerId = authenticatedUserId;
    }

    const tasks = await Task.find(filter)
      .populate('jobId', 'title description')
      .populate('freelancerId', 'displayName photoURL')
      .sort({ deadline: 1 });

    res.json(tasks);
  } catch (error) {
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
