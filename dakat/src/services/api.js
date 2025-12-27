const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('shadowUser');
};

const apiCall = async (endpoint, method = 'GET', data = null, includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const options = {
    method,
    headers,
    credentials: 'include'
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const url = `${API_URL}${endpoint}`;
    console.log(`API Call: ${method} ${url}`);
    
    const response = await fetch(url, options);
    
    // Try to parse JSON response
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = { error: 'Failed to parse response' };
    }

    if (!response.ok) {
      const errorMessage = responseData.error || `HTTP ${response.status}`;
      console.error('API Error:', errorMessage);
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

// User APIs
export const userAPI = {
  register: (userData) => apiCall('/users/register', 'POST', userData, false),
  login: (email) => apiCall('/users/login', 'POST', { email }, false),
  getProfile: () => apiCall('/users/profile', 'GET'),
  updateProfile: (data) => apiCall('/users/profile', 'PUT', data),
  updateSkills: (skills) => apiCall('/users/skills', 'PUT', { skills }),
  updatePaymentMethod: (paymentMethod, paymentDetails) =>
    apiCall('/users/payment-method', 'PUT', { paymentMethod, paymentDetails }),
  getPublicProfile: (userId) => apiCall(`/users/public/${userId}`, 'GET', null, false),
  getBalance: () => apiCall('/users/balance', 'GET')
};

// Job APIs
export const jobAPI = {
  createJob: (jobData) => apiCall('/jobs', 'POST', jobData),
  getJobs: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiCall(`/jobs?${query}`, 'GET', null, false);
  },
  getJobById: (jobId) => apiCall(`/jobs/${jobId}`, 'GET', null, false),
  submitProposal: (jobId, proposalData) =>
    apiCall(`/jobs/${jobId}/proposal`, 'POST', proposalData),
  acceptProposal: (jobId, proposalId) =>
    apiCall(`/jobs/${jobId}/proposal/${proposalId}/accept`, 'POST'),
  rejectProposal: (jobId, proposalId) =>
    apiCall(`/jobs/${jobId}/proposal/${proposalId}/reject`, 'POST'),
  getFreelancerProposals: () =>
    apiCall('/jobs/freelancer/my-proposals', 'GET'),
  getAcceptedJobs: () =>
    apiCall('/jobs/freelancer/accepted-jobs', 'GET'),
  getClientAcceptedJobs: () =>
    apiCall('/jobs/client/accepted-jobs', 'GET'),
  getJobProposals: (jobId) =>
    apiCall(`/jobs/${jobId}/proposals`, 'GET'),
  updateJobStatus: (jobId, status) =>
    apiCall(`/jobs/${jobId}/status`, 'PUT', { status }),
  deleteJob: (jobId) => apiCall(`/jobs/${jobId}`, 'DELETE'),
  searchJobs: (query) => apiCall(`/jobs/search?query=${query}`, 'GET', null, false),
  
  // Milestone APIs
  submitMilestone: (jobId, milestoneId, submittedWork) =>
    apiCall(`/jobs/${jobId}/milestone/${milestoneId}/submit`, 'POST', { submittedWork }),
  approveMilestone: (jobId, milestoneId, adminNotes) =>
    apiCall(`/jobs/${jobId}/milestone/${milestoneId}/approve`, 'POST', { adminNotes }),
  rejectMilestone: (jobId, milestoneId, adminNotes) =>
    apiCall(`/jobs/${jobId}/milestone/${milestoneId}/reject`, 'POST', { adminNotes })
};

// Task APIs
export const taskAPI = {
  createTask: (taskData) => apiCall('/tasks', 'POST', taskData),
  getTasks: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiCall(`/tasks?${query}`, 'GET');
  },
  getTaskById: (taskId) => apiCall(`/tasks/${taskId}`, 'GET'),
  updateTask: (taskId, taskData) => apiCall(`/tasks/${taskId}`, 'PUT', taskData),
  addTimeEntry: (taskId, entryData) =>
    apiCall(`/tasks/${taskId}/time-entry`, 'POST', entryData),
  deleteTask: (taskId) => apiCall(`/tasks/${taskId}`, 'DELETE'),
  getBurnoutWarning: () => apiCall('/tasks/burnout-warning', 'GET'),
  getAcceptedTasksCount: () => apiCall('/tasks/count/accepted', 'GET')
};

// Chat APIs
export const chatAPI = {
  createOrGetConversation: (otherUserId, jobId = null) =>
    apiCall('/chat/conversation', 'POST', { otherUserId, jobId }),
  getConversations: () => apiCall('/chat/conversations', 'GET'),
  sendMessage: (conversationId, messageData) =>
    apiCall(`/chat/${conversationId}/message`, 'POST', messageData),
  getMessages: (conversationId, limit = 50, offset = 0) =>
    apiCall(`/chat/${conversationId}/messages?limit=${limit}&offset=${offset}`, 'GET'),
  markAsRead: (conversationId) =>
    apiCall(`/chat/${conversationId}/read`, 'PUT'),
  deleteConversation: (conversationId) =>
    apiCall(`/chat/${conversationId}`, 'DELETE')
};

// Payment APIs
export const paymentAPI = {
  createPayment: (paymentData) => apiCall('/payments', 'POST', paymentData),
  getPayments: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiCall(`/payments?${query}`, 'GET');
  },
  getPaymentById: (paymentId) => apiCall(`/payments/${paymentId}`, 'GET'),
  releasePayment: (paymentId) => apiCall(`/payments/${paymentId}/release`, 'POST'),
  refundPayment: (paymentId, reason) =>
    apiCall('/payments/refund', 'POST', { paymentId, reason }),
  getEarnings: () => apiCall('/payments/earnings', 'GET'),
  withdrawEarnings: (amount, paymentMethod) =>
    apiCall('/payments/withdraw', 'POST', { amount, paymentMethod }),
  releaseMilestonePayment: (jobId, milestoneId) =>
    apiCall(`/payments/milestone/${jobId}/${milestoneId}/release`, 'POST')
};

// Rating APIs
export const ratingAPI = {
  createRating: (ratingData) => apiCall('/ratings', 'POST', ratingData),
  getRatings: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiCall(`/ratings?${query}`, 'GET', null, false);
  },
  getUserRatings: (userId) => apiCall(`/ratings/${userId}`, 'GET', null, false),
  deleteRating: (ratingId) => apiCall(`/ratings/${ratingId}`, 'DELETE')
};

// Shop APIs
export const shopAPI = {
  getAllGadgets: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiCall(`/shop/gadgets?${query}`, 'GET', null, false);
  },
  getGadgetById: (gadgetId) => apiCall(`/shop/gadgets/${gadgetId}`, 'GET', null, false),
  createOrder: (orderData) => apiCall('/shop/orders', 'POST', orderData),
  getOrders: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiCall(`/shop/orders?${query}`, 'GET');
  },
  getOrderById: (orderId) => apiCall(`/shop/orders/${orderId}`, 'GET'),
  updateOrderStatus: (orderId, status, trackingNumber) =>
    apiCall(`/shop/orders/${orderId}/status`, 'PUT', { status, trackingNumber }),
  cancelOrder: (orderId) => apiCall(`/shop/orders/${orderId}/cancel`, 'POST')
};

export default {
  userAPI,
  jobAPI,
  taskAPI,
  chatAPI,
  paymentAPI,
  ratingAPI,
  shopAPI,
  getAuthToken,
  setAuthToken
};
