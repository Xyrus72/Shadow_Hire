import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('myJobs');
  const [jobs, setJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Messaging states
  const [adminMessage, setAdminMessage] = useState('');
  const [freelancerMessage, setFreelancerMessage] = useState('');
  const [selectedJobForMsg, setSelectedJobForMsg] = useState(null);
  const [messages, setMessages] = useState([]);

  // Job posting form
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [milestoneCount, setMilestoneCount] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [milestoneInput, setMilestoneInput] = useState({
    title: '',
    description: '',
    payment: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    experienceLevel: 'intermediate'
  });

  // Proposals state
  const [selectedJobProposals, setSelectedJobProposals] = useState(null)
  const [jobProposals, setJobProposals] = useState({})
  const [proposalApprovalNotes, setProposalApprovalNotes] = useState('')

  // Common skills for quick selection
  const commonSkills = ['React', 'JavaScript', 'Python', 'Java', 'Node.js', 'TypeScript', 'Tailwind', 'Vue.js', 'Angular', 'MongoDB', 'PostgreSQL', 'Express', 'AWS', 'Docker', 'Git'];

  useEffect(() => {
    if (user) {
      // Get user ID from localStorage (set during login)
      const shadowUser = JSON.parse(localStorage.getItem('shadowUser') || '{}');
      if (shadowUser.id) {
        fetchClientJobs(shadowUser.id);
        fetchClientAcceptedJobs();
      }
    }
  }, [user]);

  const fetchClientJobs = async (userId) => {
    setLoading(true);
    setError('');
    try {
      // Pass userId as query parameter to backend for filtering
      const response = await api.jobAPI.getJobs({ userId });
      setJobs(Array.isArray(response) ? response : []);
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientAcceptedJobs = async () => {
    try {
      const response = await api.jobAPI.getClientAcceptedJobs();
      setAcceptedJobs(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Failed to fetch accepted jobs:', err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
      setSelectedSkills([...selectedSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleAddCommonSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddMilestone = () => {
    if (!milestoneInput.title || !milestoneInput.payment) {
      setError('Please fill in all milestone fields');
      return;
    }

    const newMilestone = {
      _id: new Date().getTime().toString(),
      title: milestoneInput.title,
      description: milestoneInput.description,
      payment: parseFloat(milestoneInput.payment),
      status: 'pending'
    };

    setMilestones([...milestones, newMilestone]);
    setMilestoneInput({ title: '', description: '', payment: '' });
    setError('');
  };

  const handleRemoveMilestone = (id) => {
    setMilestones(milestones.filter(m => m._id !== id));
  };

  const handleAutoGenerateMilestones = () => {
    if (!totalBudget || !milestoneCount) {
      setError('Please enter total budget and number of milestones');
      return;
    }

    const count = parseInt(milestoneCount);
    const budget = parseFloat(totalBudget);

    if (count < 1) {
      setError('Number of milestones must be at least 1');
      return;
    }

    const perMilestone = budget / count;
    const newMilestones = [];

    for (let i = 1; i <= count; i++) {
      newMilestones.push({
        _id: new Date().getTime().toString() + i,
        title: `Milestone ${i}`,
        description: `Payment for milestone ${i}`,
        payment: parseFloat(perMilestone.toFixed(2)),
        status: 'pending'
      });
    }

    setMilestones(newMilestones);
    setMilestoneInput({ title: '', description: '', payment: '' });
    setError('');
    alert(`✓ Created ${count} milestones of $${perMilestone.toFixed(2)} each`);
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (selectedSkills.length === 0) {
        setError('Please select at least one skill');
        setLoading(false);
        return;
      }

      if (milestones.length === 0) {
        setError('Please add at least one milestone/task');
        setLoading(false);
        return;
      }

      const totalBudget = milestones.reduce((sum, m) => sum + m.payment, 0);

      const jobPayload = {
        ...formData,
        requiredSkills: selectedSkills,
        totalBudget: totalBudget,
        milestones: milestones
      };

      await api.jobAPI.createJob(jobPayload);
      
      setFormData({
        title: '',
        description: '',
        category: '',
        experienceLevel: 'intermediate'
      });
      setTotalBudget('');
      setMilestoneCount('');
      setSelectedSkills([]);
      setSkillInput('');
      setMilestones([]);
      setMilestoneInput({ title: '', description: '', payment: '' });
      setShowJobForm(false);
      const shadowUser = JSON.parse(localStorage.getItem('shadowUser') || '{}');
      if (shadowUser.id) {
        await fetchClientJobs(shadowUser.id);
      }
    } catch (err) {
      setError(err.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const handleSendAdminMessage = async () => {
    if (!adminMessage.trim()) return;

    setLoading(true);
    try {
      await api.userAPI.sendAdminMessage({
        subject: 'Message from Client',
        message: adminMessage
      });
      setAdminMessage('');
      alert('Message sent to admin successfully');
    } catch (err) {
      setError('Failed to send message to admin');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFreelancerMessage = async () => {
    if (!freelancerMessage.trim() || !selectedJobForMsg) return;

    if (!selectedJobForMsg.assignedTo) {
      setError('No freelancer is assigned to this job yet');
      return;
    }

    setLoading(true);
    try {
      // First create or get conversation with the freelancer
      const conversation = await api.chatAPI.createOrGetConversation(
        selectedJobForMsg.assignedTo,
        selectedJobForMsg._id
      );
      
      // Then send the message in that conversation
      await api.chatAPI.sendMessage(conversation.conversationId, {
        content: freelancerMessage
      });
      
      setFreelancerMessage('');
      setSelectedJobForMsg(null);
      alert('Message sent to freelancer successfully');
    } catch (err) {
      setError('Failed to send message to freelancer');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch proposals for a specific job
  const fetchJobProposals = async (jobId) => {
    try {
      const data = await api.jobAPI.getJobProposals(jobId);
      const proposalsArray = data.proposals || [];
      setJobProposals(prev => ({
        ...prev,
        [jobId]: proposalsArray
      }));
      setSelectedJobProposals(jobId);
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError('Failed to fetch proposals');
    }
  };

  // Accept a proposal
  const handleAcceptProposal = async (jobId, proposalId, freelancerId) => {
    try {
      setLoading(true);
      await api.jobAPI.acceptProposal(jobId, proposalId);
      setError('✅ Proposal accepted! You can now chat with the freelancer.');
      
      // Refresh the jobs and proposals
      const shadowUser = JSON.parse(localStorage.getItem('shadowUser') || '{}');
      if (shadowUser.id) {
        await fetchClientJobs(shadowUser.id);
      }
      
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to accept proposal');
    } finally {
      setLoading(false);
    }
  };

  // Reject a proposal
  const handleRejectProposal = async (jobId, proposalId) => {
    if (!window.confirm('Are you sure you want to reject this proposal?')) return;

    try {
      setLoading(true);
      await api.jobAPI.rejectProposal(jobId, proposalId);
      setError('✅ Proposal rejected');
      
      // Refresh proposals
      await fetchJobProposals(jobId);
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to reject proposal');
    } finally {
      setLoading(false);
    }
  };

  // Start chat with freelancer
  const handleStartChat = async (freelancerId, jobId) => {
    try {
      setLoading(true);
      // Create or get conversation with the freelancer
      const conversation = await api.chatAPI.createOrGetConversation(freelancerId, jobId);
      
      // Navigate to chat page
      navigate('/chat');
    } catch (err) {
      console.error('Error starting chat:', err);
      setError('Failed to start chat');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-[#00ff41] font-mono flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#00ff41] font-mono p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#00ff41] drop-shadow-[0_0_10px_#00ff41]">
            💼 Client Dashboard
          </h1>
          <p className="text-gray-400">Manage your jobs and communicate with freelancers and admin</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-[#00ff41]/20 pb-4">
          <button
            onClick={() => setActiveTab('myJobs')}
            className={`px-6 py-2 font-bold transition-all ${
              activeTab === 'myJobs'
                ? 'text-[#00ff41] bg-[#00ff41]/10 rounded'
                : 'text-gray-400 hover:text-[#00ff41]'
            }`}
          >
            📋 My Jobs
          </button>
          <button
            onClick={() => setActiveTab('acceptedJobs')}
            className={`px-6 py-2 font-bold transition-all ${
              activeTab === 'acceptedJobs'
                ? 'text-[#00ff41] bg-[#00ff41]/10 rounded'
                : 'text-gray-400 hover:text-[#00ff41]'
            }`}
          >
            ✅ Accepted Jobs
          </button>
          <button
            onClick={() => setActiveTab('postJob')}
            className={`px-6 py-2 font-bold transition-all ${
              activeTab === 'postJob'
                ? 'text-[#00ff41] bg-[#00ff41]/10 rounded'
                : 'text-gray-400 hover:text-[#00ff41]'
            }`}
          >
            ➕ Post Job
          </button>
          <button
            onClick={() => setActiveTab('messageAdmin')}
            className={`px-6 py-2 font-bold transition-all ${
              activeTab === 'messageAdmin'
                ? 'text-[#00ff41] bg-[#00ff41]/10 rounded'
                : 'text-gray-400 hover:text-[#00ff41]'
            }`}
          >
            👑 Message Admin
          </button>
          <button
            onClick={() => setActiveTab('messageFreelancer')}
            className={`px-6 py-2 font-bold transition-all ${
              activeTab === 'messageFreelancer'
                ? 'text-[#00ff41] bg-[#00ff41]/10 rounded'
                : 'text-gray-400 hover:text-[#00ff41]'
            }`}
          >
            👨‍💻 Message Freelancer
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-6 py-2 font-bold transition-all ${
              activeTab === 'proposals'
                ? 'text-[#00ff41] bg-[#00ff41]/10 rounded'
                : 'text-gray-400 hover:text-[#00ff41]'
            }`}
          >
            📋 Proposals
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded text-red-300">
            {error}
          </div>
        )}

        {/* My Jobs Tab */}
        {activeTab === 'myJobs' && (
          <div className="space-y-6">
            {loading ? (
              <p className="text-gray-400">Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-[#00ff41]/30 rounded">
                <p className="text-gray-400 mb-4">No jobs posted yet</p>
                <button
                  onClick={() => setActiveTab('postJob')}
                  className="px-6 py-2 bg-[#00ff41] text-black font-bold rounded hover:bg-cyan-400 transition-all"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              jobs.map(job => (
                <div
                  key={job._id}
                  className="bg-gray-900/50 border-2 border-[#00ff41]/30 rounded-lg p-6 hover:border-[#00ff41] transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#00ff41]">{job.title}</h3>
                      <p className="text-gray-400 text-sm mt-2">{job.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded font-bold text-xs whitespace-nowrap ml-4 ${
                      job.status === 'open' ? 'bg-green-500/30 text-green-300' :
                      job.status === 'in_progress' ? 'bg-yellow-500/30 text-yellow-300' :
                      'bg-blue-500/30 text-blue-300'
                    }`}>
                      {job.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-400">Total Budget</p>
                      <p className="text-[#00ff41] font-bold">${job.totalBudget}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Deadline</p>
                      <p className="text-[#00ff41] font-bold">{new Date(job.deadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Status</p>
                      <p className="text-[#00ff41] font-bold">
                        {job.assignedTo ? '✓ Assigned' : '○ Open'}
                      </p>
                    </div>
                  </div>

                  {/* Milestones Display */}
                  {job.milestones && job.milestones.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#00ff41]/20">
                      <p className="text-[#00ff41] font-bold mb-3">📋 Milestones ({job.milestones.length})</p>
                      <div className="space-y-2">
                        {job.milestones.map((milestone, idx) => (
                          <div key={idx} className="bg-black/50 border border-[#00ff41]/20 rounded p-2 text-xs">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-[#00ff41] font-bold">Task {idx + 1}: {milestone.title}</p>
                                <p className="text-gray-400">💰 ${milestone.payment} | Status: <span className={`font-bold ${
                                  milestone.status === 'completed' ? 'text-green-400' :
                                  milestone.status === 'approved' ? 'text-[#00ff41]' :
                                  milestone.status === 'submitted' ? 'text-yellow-400' :
                                  'text-gray-400'
                                }`}>{milestone.status}</span></p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.assignedTo && (
                    <div className="mt-4 pt-4 border-t border-[#00ff41]/20">
                      <p className="text-[#00ff41] font-bold mb-3">✓ Assigned Freelancer</p>
                      <div className="flex items-center gap-3 bg-black/50 border border-[#00ff41]/20 rounded p-3">
                        <img 
                          src={job.assignedTo.photoURL || `https://ui-avatars.com/api/?name=${job.assignedTo.displayName}`} 
                          alt={job.assignedTo.displayName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-[#00ff41] font-bold">{job.assignedTo.displayName}</p>
                          <p className="text-gray-400 text-xs">{job.assignedTo.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">Rating</p>
                          <p className="text-[#00ff41] font-bold">⭐ {job.assignedTo.averageRating || 'N/A'}</p>
                        </div>
                      </div>
                      {job.assignedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Assigned on {new Date(job.assignedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Accepted Jobs Tab */}
        {activeTab === 'acceptedJobs' && (
          <div className="space-y-6">
            {acceptedJobs.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-[#00ff41]/30 rounded">
                <p className="text-gray-400 mb-2">No accepted jobs yet</p>
                <p className="text-gray-500 text-sm">Jobs will appear here once you accept a freelancer's proposal</p>
              </div>
            ) : (
              acceptedJobs.map(job => (
                <div
                  key={job._id}
                  className="bg-gradient-to-r from-[#00ff41]/10 to-cyan-400/10 border-2 border-[#00ff41]/50 rounded-lg p-6 hover:border-[#00ff41] transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#00ff41]">{job.title}</h3>
                      <p className="text-gray-300 text-sm mt-2">{job.description}</p>
                    </div>
                    <span className="px-4 py-2 rounded font-bold text-sm bg-green-500/30 text-green-300 whitespace-nowrap ml-4">
                      ✅ IN PROGRESS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                    <div className="bg-black/40 border border-[#00ff41]/20 rounded p-3">
                      <p className="text-gray-400 text-xs">Total Budget</p>
                      <p className="text-[#00ff41] font-bold text-lg">${job.totalBudget}</p>
                    </div>
                    <div className="bg-black/40 border border-[#00ff41]/20 rounded p-3">
                      <p className="text-gray-400 text-xs">Deadline</p>
                      <p className="text-[#00ff41] font-bold">{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="bg-black/40 border border-[#00ff41]/20 rounded p-3">
                      <p className="text-gray-400 text-xs">Status</p>
                      <p className="text-[#00ff41] font-bold">✓ Assigned</p>
                    </div>
                    <div className="bg-black/40 border border-[#00ff41]/20 rounded p-3">
                      <p className="text-gray-400 text-xs">Milestones</p>
                      <p className="text-[#00ff41] font-bold text-lg">{job.milestones?.length || 0}</p>
                    </div>
                  </div>

                  {/* Milestones Display */}
                  {job.milestones && job.milestones.length > 0 && (
                    <div className="mb-6 pt-4 border-t border-[#00ff41]/30">
                      <p className="text-[#00ff41] font-bold mb-3">📋 Milestones ({job.milestones.length})</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {job.milestones.map((milestone, idx) => (
                          <div key={idx} className="bg-black/60 border border-[#00ff41]/30 rounded p-3 text-xs">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-[#00ff41] font-bold">Milestone {idx + 1}</p>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                milestone.status === 'completed' ? 'bg-green-500/30 text-green-400' :
                                milestone.status === 'approved' ? 'bg-[#00ff41]/30 text-[#00ff41]' :
                                milestone.status === 'submitted' ? 'bg-yellow-500/30 text-yellow-400' :
                                'bg-gray-500/30 text-gray-300'
                              }`}>{milestone.status}</span>
                            </div>
                            <p className="text-gray-300 mb-2">{milestone.title}</p>
                            <div className="flex justify-between">
                              <p className="text-gray-400">💰 ${milestone.payment}</p>
                              {milestone.dueDate && (
                                <p className="text-gray-400">📅 {new Date(milestone.dueDate).toLocaleDateString()}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assigned Freelancer Section */}
                  {job.assignedTo && (
                    <div className="pt-4 border-t border-[#00ff41]/30">
                      <p className="text-[#00ff41] font-bold mb-4">👨‍💻 Assigned Freelancer</p>
                      <div className="flex items-center gap-4 bg-black/50 border-2 border-[#00ff41]/30 rounded-lg p-4">
                        <img 
                          src={job.assignedTo.photoURL || `https://ui-avatars.com/api/?name=${job.assignedTo.displayName}`} 
                          alt={job.assignedTo.displayName}
                          className="w-16 h-16 rounded-full border-2 border-[#00ff41]"
                        />
                        <div className="flex-1">
                          <p className="text-[#00ff41] font-bold text-lg">{job.assignedTo.displayName}</p>
                          <p className="text-gray-400 text-sm">{job.assignedTo.email}</p>
                          {job.assignedTo.averageRating && (
                            <p className="text-[#00ff41] text-sm mt-1">⭐ Rating: {job.assignedTo.averageRating}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs mb-2">Assigned</p>
                          <p className="text-[#00ff41] font-bold text-sm">
                            {job.assignedAt ? new Date(job.assignedAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Post Job Tab */}
        {activeTab === 'postJob' && (
          <div className="bg-gray-900/50 border-2 border-[#00ff41]/30 rounded-lg p-8">
            <form onSubmit={handlePostJob} className="space-y-6">
              <div>
                <label className="block text-[#00ff41] font-bold mb-2">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Build a React Dashboard"
                  className="w-full bg-black border-2 border-[#00ff41]/30 rounded px-4 py-2 text-[#00ff41] placeholder-gray-600 focus:border-[#00ff41] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#00ff41] font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe your project in detail..."
                  rows="4"
                  className="w-full bg-black border-2 border-[#00ff41]/30 rounded px-4 py-2 text-[#00ff41] placeholder-gray-600 focus:border-[#00ff41] focus:outline-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-[#00ff41] font-bold mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  placeholder="Web Development"
                  className="w-full bg-black border-2 border-[#00ff41]/30 rounded px-4 py-2 text-[#00ff41] placeholder-gray-600 focus:border-[#00ff41] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#00ff41] font-bold mb-3">Required Skills</label>
                
                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {selectedSkills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="bg-[#00ff41] text-black px-3 py-1 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-cyan-400 transition-all"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="font-bold text-lg hover:opacity-70"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skill Input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="Type a skill and press Enter or click Add"
                    className="flex-1 bg-black border-2 border-[#00ff41]/30 rounded px-4 py-2 text-[#00ff41] placeholder-gray-600 focus:border-[#00ff41] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-[#00ff41] text-black font-bold rounded hover:bg-cyan-400 transition-all"
                  >
                    ➕ Add
                  </button>
                </div>

                {/* Common Skills Suggestions */}
                <div>
                  <p className="text-gray-400 text-xs mb-2">Common Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonSkills.map((skill, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddCommonSkill(skill)}
                        disabled={selectedSkills.includes(skill)}
                        className={`px-3 py-1 rounded text-sm font-bold transition-all ${
                          selectedSkills.includes(skill)
                            ? 'bg-[#00ff41]/30 text-[#00ff41] opacity-50 cursor-not-allowed'
                            : 'bg-[#00ff41]/20 text-[#00ff41] hover:bg-[#00ff41] hover:text-black'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Milestones/Tasks Section */}
              <div>
                <label className="block text-[#00ff41] font-bold mb-3">📋 Divide Your Task into Milestones</label>
                <p className="text-gray-400 text-sm mb-4">Choose how many milestones you want (1 or more). Divide your total budget among them.</p>
                
                {/* Auto-Generate Milestones Section */}
                <div className="bg-blue-900/20 border-2 border-blue-500/30 rounded p-4 mb-4">
                  <p className="text-blue-300 font-bold mb-3">💡 Quick Setup: Auto-Divide Budget</p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-gray-400 text-xs">Total Task Budget ($)</label>
                      <input
                        type="number"
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(e.target.value)}
                        placeholder="e.g., 1000"
                        className="w-full bg-black border-2 border-blue-500/30 rounded px-3 py-2 text-[#00ff41] placeholder-gray-600 focus:border-blue-400 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs">Number of Milestones</label>
                      <input
                        type="number"
                        value={milestoneCount}
                        onChange={(e) => setMilestoneCount(e.target.value)}
                        placeholder="e.g., 5"
                        className="w-full bg-black border-2 border-blue-500/30 rounded px-3 py-2 text-[#00ff41] placeholder-gray-600 focus:border-blue-400 focus:outline-none text-sm"
                        min="1"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoGenerateMilestones}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-all text-sm"
                  >
                    🎯 Auto-Generate Milestones
                  </button>
                  <p className="text-blue-300 text-xs mt-2">OR manually add milestones below →</p>
                </div>
                
                {/* Display existing milestones */}
                {milestones.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <div className="bg-[#00ff41]/10 border border-[#00ff41]/20 rounded p-2 mb-3">
                      <p className="text-[#00ff41] font-bold text-sm">✓ {milestones.length} milestone{milestones.length !== 1 ? 's' : ''} added</p>
                    </div>
                    {milestones.map((milestone, idx) => (
                      <div key={milestone._id} className="bg-[#00ff41]/10 border border-[#00ff41]/30 rounded p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-[#00ff41] font-bold">Milestone {idx + 1}: {milestone.title}</p>
                            {milestone.description && <p className="text-gray-400 text-sm">{milestone.description}</p>}
                            <p className="text-gray-400 text-xs mt-1">💰 ${milestone.payment}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMilestone(milestone._id)}
                            className="text-red-400 hover:text-red-300 font-bold text-lg ml-2"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="bg-[#00ff41]/5 border border-[#00ff41]/30 rounded p-3">
                      <p className="text-[#00ff41] font-bold">💰 Total Task Budget: ${milestones.reduce((sum, m) => sum + m.payment, 0).toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#00ff41] font-bold mb-2">Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleFormChange}
                    className="w-full bg-black border-2 border-[#00ff41]/30 rounded px-4 py-2 text-[#00ff41] focus:border-[#00ff41] focus:outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

              </div>

              {/* Skills Count Display */}
              <div className="bg-[#00ff41]/10 border border-[#00ff41]/30 rounded p-4">
                <p className="text-[#00ff41] font-bold">
                  ✓ {selectedSkills.length} {selectedSkills.length === 1 ? 'skill' : 'skills'} selected
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || selectedSkills.length === 0}
                className="w-full px-6 py-3 bg-[#00ff41] text-black font-bold rounded hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : '✓ Post Job'}
              </button>
            </form>
          </div>
        )}

        {/* Message Admin Tab */}
        {activeTab === 'messageAdmin' && (
          <div className="bg-gray-900/50 border-2 border-[#00ff41]/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#00ff41] mb-6">👑 Send Message to Admin</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[#00ff41] font-bold mb-2">Your Message</label>
                <textarea
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Type your message to the admin..."
                  rows="6"
                  className="w-full bg-black border-2 border-[#00ff41]/30 rounded px-4 py-3 text-[#00ff41] placeholder-gray-600 focus:border-[#00ff41] focus:outline-none"
                ></textarea>
              </div>
              <button
                onClick={handleSendAdminMessage}
                disabled={!adminMessage.trim() || loading}
                className="w-full px-6 py-3 bg-[#00ff41] text-black font-bold rounded hover:bg-cyan-400 transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : '✓ Send Message'}
              </button>
            </div>
          </div>
        )}

        {/* Message Freelancer Tab */}
        {activeTab === 'messageFreelancer' && (
          <div className="bg-gray-900/50 border-2 border-[#00ff41]/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#00ff41] mb-6">👨‍💻 Send Message to Freelancer</h2>
            
            {jobs.filter(j => j.assignedTo).length === 0 ? (
              <p className="text-gray-400">You don't have any jobs assigned to freelancers yet</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-[#00ff41] font-bold mb-2">Select Job</label>
                  <select
                    value={selectedJobForMsg?._id || ''}
                    onChange={(e) => {
                      const job = jobs.find(j => j._id === e.target.value);
                      setSelectedJobForMsg(job);
                    }}
                    className="w-full bg-black border-2 border-[#00ff41]/30 rounded px-4 py-2 text-[#00ff41] focus:border-[#00ff41] focus:outline-none"
                  >
                    <option value="">-- Select a job --</option>
                    {jobs.filter(j => j.assignedTo).map(job => (
                      <option key={job._id} value={job._id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#00ff41] font-bold mb-2">Your Message</label>
                  <textarea
                    value={freelancerMessage}
                    onChange={(e) => setFreelancerMessage(e.target.value)}
                    placeholder="Type your message to the freelancer..."
                    rows="6"
                    className="w-full bg-black border-2 border-[#00ff41]/30 rounded px-4 py-3 text-[#00ff41] placeholder-gray-600 focus:border-[#00ff41] focus:outline-none"
                  ></textarea>
                </div>

                <button
                  onClick={handleSendFreelancerMessage}
                  disabled={!freelancerMessage.trim() || !selectedJobForMsg || loading}
                  className="w-full px-6 py-3 bg-[#00ff41] text-black font-bold rounded hover:bg-cyan-400 transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending...' : '✓ Send Message'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Proposals Tab */}
        {activeTab === 'proposals' && (
          <div className="bg-gray-900/50 border-2 border-[#00ff41]/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#00ff41] mb-6">📋 Freelancer Proposals</h2>
            
            {loading ? (
              <p className="text-gray-400">Loading proposals...</p>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-[#00ff41]/30 rounded">
                <p className="text-gray-400">No jobs posted yet</p>
              </div>
            ) : (
              <div className="space-y-8">
                {jobs.map(job => {
                  const proposals = jobProposals[job._id] || [];
                  return (
                    <div key={job._id} className="border-2 border-[#00ff41]/20 rounded-lg p-6 bg-black/50">
                      <div className="flex justify-between items-start mb-6 pb-6 border-b border-[#00ff41]/20">
                        <div>
                          <h3 className="text-xl font-bold text-[#00ff41] mb-2">{job.title}</h3>
                          <p className="text-gray-400 text-sm">Budget: <span className="text-cyan-400">${job.budget}</span></p>
                        </div>
                        <button
                          onClick={() => {
                            if (!jobProposals[job._id]) {
                              fetchJobProposals(job._id);
                            }
                            setSelectedJobProposals(job._id === selectedJobProposals ? null : job._id);
                          }}
                          className="px-4 py-2 bg-[#00ff41] text-black font-bold rounded hover:bg-cyan-400 transition-all"
                        >
                          {selectedJobProposals === job._id ? '▼ Hide' : '▶ Show'} Proposals ({proposals.length})
                        </button>
                      </div>

                      {selectedJobProposals === job._id && (
                        <div className="space-y-4">
                          {proposals.length === 0 ? (
                            <p className="text-gray-400 text-center py-6">No proposals for this job yet</p>
                          ) : (
                            proposals.map(proposal => {
                              const getStatusColor = (status) => {
                                switch(status) {
                                  case 'accepted': return 'bg-green-500/20 text-green-300 border-green-500';
                                  case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500';
                                  default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
                                }
                              };

                              return (
                                <div key={proposal._id} className="bg-gray-900/50 border-2 border-gray-700 rounded-lg p-4">
                                  <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-3">
                                        <h4 className="font-bold text-[#00ff41]">{proposal.freelancerName || 'Unknown'}</h4>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(proposal.status)}`}>
                                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm">⭐ Rating: {proposal.freelancerRating || 'N/A'} | 📧 {proposal.freelancerEmail}</p>
                                      <div className="mt-2 text-sm text-gray-300">
                                        <p>💼 Skills: {proposal.freelancerSkills?.length > 0 ? proposal.freelancerSkills.join(', ') : 'No skills listed'}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-black/50 rounded p-3 mb-4 border-l-4 border-cyan-400">
                                    <p className="text-gray-300 text-sm italic">&quot;{proposal.message}&quot;</p>
                                  </div>

                                  <div className="flex justify-between items-center mb-4">
                                    <div className="text-sm">
                                      <p className="text-gray-400">Proposed Rate: <span className="text-cyan-400 font-bold">${proposal.proposedRate}/hr</span></p>
                                      <p className="text-gray-400">Job Budget: <span className="text-[#00ff41] font-bold">${job.budget}</span></p>
                                    </div>
                                  </div>

                                  {proposal.status === 'pending' && (
                                    <div className="flex gap-3">
                                      <button
                                        onClick={() => handleAcceptProposal(job._id, proposal._id, proposal.freelancerId)}
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-all disabled:opacity-50"
                                      >
                                        ✓ Accept
                                      </button>
                                      <button
                                        onClick={() => handleRejectProposal(job._id, proposal._id)}
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-all disabled:opacity-50"
                                      >
                                        ✗ Reject
                                      </button>
                                    </div>
                                  )}

                                  {proposal.status === 'accepted' && (
                                    <div className="flex gap-3">
                                      <button
                                        onClick={() => handleStartChat(proposal.freelancerId, job._id)}
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-all disabled:opacity-50"
                                      >
                                        💬 Chat Now
                                      </button>
                                      <p className="flex-1 p-2 bg-green-500/10 border border-green-500/30 rounded text-green-300 text-sm">
                                        ✓ Freelancer assigned to job
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}