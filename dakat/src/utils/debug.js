import { getAuthToken } from '../services/api';

export const checkTasksInDatabase = async (jobId) => {
  try {
    console.log('🔍 Checking tasks in database for jobId:', jobId);
    
    // Call the debug endpoint
    const response = await fetch(`http://localhost:5000/api/tasks/debug/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      console.error('Debug endpoint failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    console.log('📊 Database Debug Info:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error checking database:', error);
    return null;
  }
};

export const getAllTasks = async () => {
  try {
    console.log('🔍 Fetching ALL tasks in database...');
    
    const response = await fetch(`http://localhost:5000/api/tasks/debug/all`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      console.error('Get all tasks endpoint failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    console.log('📊 All Tasks in Database:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching all tasks:', error);
    return null;
  }
};

export const checkProposalStatus = async (jobId) => {
  try {
    console.log('🔍 Checking proposal status for jobId:', jobId);
    
    const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      console.error('Job fetch failed:', response.status);
      return null;
    }
    
    const job = await response.json();
    console.log('📋 Job Details:', {
      title: job.title,
      milestonesCount: job.milestones?.length,
      assignedTo: job.assignedTo,
      status: job.status,
      proposals: job.proposals?.map(p => ({
        id: p._id,
        freelancerId: p.freelancerId,
        status: p.status,
        acceptedAt: p.acceptedAt
      }))
    });
    
    return job;
  } catch (error) {
    console.error('❌ Error checking job:', error);
    return null;
  }
};
