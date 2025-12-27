import React, { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const DeveloperDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [proposals, setProposals] = useState([])
  const [acceptedJobs, setAcceptedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchDeveloperData()
  }, [user])

  const fetchDeveloperData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')

      // Fetch developer profile
      const profileRes = await fetch('http://localhost:5000/api/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => null)

      if (profileRes?.ok) {
        const data = await profileRes.json()
        setProfile(data)
      }

      // Fetch user proposals and accepted jobs in parallel
      try {
        const proposalsRes = await api.jobAPI.getFreelancerProposals()
        const acceptedJobsRes = await api.jobAPI.getAcceptedJobs()
        
        console.log('✅ Proposals API Response:', proposalsRes)
        console.log('✅ Accepted Jobs API Response:', acceptedJobsRes)
        
        setProposals(Array.isArray(proposalsRes) ? proposalsRes : [])
        setAcceptedJobs(Array.isArray(acceptedJobsRes) ? acceptedJobsRes : [])
        setMessage('') // Clear error message on success
        
        if (!Array.isArray(acceptedJobsRes) || acceptedJobsRes.length === 0) {
          console.warn('⚠️ No accepted jobs returned or invalid format')
        }
      } catch (err) {
        console.error('❌ Error fetching proposals/jobs:', err)
        console.error('❌ Error details:', err.message)
        console.error('❌ Full error:', err)
        setMessage(`❌ Error loading jobs: ${err.message}`)
        setProposals([])
        setAcceptedJobs([])
      }
    } catch (err) {
      console.error('Error fetching developer data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'bg-green-900/50 text-green-400 border-green-500/50'
      case 'rejected': return 'bg-red-900/50 text-red-400 border-red-500/50'
      case 'pending': return 'bg-yellow-900/50 text-yellow-400 border-yellow-500/50'
      default: return 'bg-gray-900/50 text-gray-400 border-gray-500/50'
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {message && (
          <div className="mb-4 p-4 bg-red-900/40 border-2 border-red-500 text-red-300 rounded font-mono text-sm animate-pulse">
            <p className="font-bold">⚠️ Alert</p>
            <p>{message}</p>
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white font-mono mb-2">
            Developer <span className="text-[#00ff41]">Dashboard</span>
          </h1>
          <p className="text-gray-400 font-mono">Manage your profile, applications, and earnings</p>
        </div>

        {/* Profile Summary */}
        {profile && (
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/20 rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {profile.photoURL && (
                  <img src={profile.photoURL} alt={profile.displayName} className="w-16 h-16 rounded-full object-cover" />
                )}
                <div>
                  <h2 className="text-xl font-bold text-white font-mono">{profile.displayName}</h2>
                  <p className="text-gray-400 font-mono text-sm">{profile.email}</p>
                  <p className="text-[#00ff41] font-mono text-sm mt-1">⭐ {profile.rating || 'No rating yet'}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="px-4 py-2 bg-[#00ff41] text-black font-mono font-bold rounded hover:bg-[#0df0a0] transition-all"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Skills Added', value: profile?.skills?.length || 0, icon: '🎯' },
            { label: 'Total Bids', value: proposals.length, icon: '📝' },
            { label: 'Accepted Jobs', value: proposals.filter(p => p.status === 'accepted').length + acceptedJobs.length || 0, icon: '✅' },
            { label: 'Total Earnings', value: `$${profile?.totalEarnings?.toLocaleString() || 0}`, icon: '💰' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/20 rounded-lg p-4">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-gray-400 font-mono text-xs mb-1">{stat.label}</p>
              <p className="text-white font-mono font-bold text-2xl">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/20 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white font-mono mb-4">Your Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile?.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill, idx) => (
                <div key={idx} className="px-3 py-1 bg-[#00ff41]/20 border border-[#00ff41] text-[#00ff41] font-mono rounded-full text-sm">
                  {skill}
                </div>
              ))
            ) : (
              <p className="text-gray-400 font-mono">No skills added yet.</p>
            )}
          </div>
          <button 
            onClick={() => navigate('/skills')}
            className="mt-4 px-4 py-2 bg-[#00ff41] text-black font-mono font-bold rounded hover:bg-[#0df0a0] transition-all"
          >
            Manage Skills
          </button>
        </div>

        {/* My Proposals/Bids */}
        <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white font-mono mb-4">📋 My Proposals/Bids</h3>
          {loading ? (
            <p className="text-gray-400 font-mono">Loading proposals...</p>
          ) : proposals.length > 0 ? (
            <div className="space-y-3">
              {proposals.map((proposal) => (
                <div 
                  key={proposal._id} 
                  className={`border rounded-lg p-4 hover:bg-[#0a0a0a]/50 transition-all ${
                    proposal.status === 'accepted' ? 'border-green-500/50 bg-green-900/10' :
                    proposal.status === 'rejected' ? 'border-red-500/50 bg-red-900/10' :
                    'border-[#00ff41]/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-mono font-bold text-lg">{proposal.jobTitle}</h4>
                      <p className="text-gray-400 font-mono text-sm">👤 {proposal.clientName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded font-bold text-xs font-mono border ${getStatusColor(proposal.status)}`}>
                      {proposal.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 font-mono text-sm mb-3">{proposal.jobDescription}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono mb-3">
                    <div>
                      <p className="text-gray-400">Proposed Rate</p>
                      <p className="text-[#00ff41] font-bold">${proposal.proposedRate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Budget</p>
                      <p className="text-[#00ff41] font-bold">${proposal.budget}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Deadline</p>
                      <p className="text-[#00ff41] font-bold">{new Date(proposal.deadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Milestones</p>
                      <p className="text-[#00ff41] font-bold">{proposal.milestonesCount} tasks</p>
                    </div>
                  </div>
                  
                  {proposal.message && (
                    <div className="bg-black/50 border border-gray-700 rounded p-2 mb-3">
                      <p className="text-gray-300 font-mono text-xs">💬 {proposal.message}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {proposal.status === 'accepted' && (
                      <button
                        onClick={() => navigate('/chat')}
                        className="flex-1 px-4 py-2 bg-[#00ff41] text-black font-mono font-bold rounded text-xs hover:bg-[#0df0a0] transition-all"
                      >
                        💬 Chat with Client
                      </button>
                    )}
                    <p className="text-gray-500 font-mono text-xs self-center">
                      Submitted: {new Date(proposal.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 font-mono">No bids yet. Head to Jobs to find opportunities!</p>
          )}
        </div>

        {/* Accepted Jobs/Tasks - Kanban Board */}
        <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/20 rounded-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white font-mono">📋 Ongoing Ask</h3>
              <p className="text-gray-400 font-mono text-sm">Manage your projects & track work hours</p>
            </div>
            <button 
              onClick={fetchDeveloperData}
              className="px-3 py-1 bg-[#00ff41]/20 border border-[#00ff41] text-[#00ff41] font-mono text-xs rounded hover:bg-[#00ff41]/30 transition-all"
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-gray-400 font-mono">⏳ Loading tasks...</p>
          ) : acceptedJobs && Array.isArray(acceptedJobs) && acceptedJobs.length > 0 ? (
            <>
              {/* Wallet and Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-black/50 border border-[#00ff41]/20 rounded p-4">
                  <p className="text-gray-400 font-mono text-xs mb-1">💰 Your Wallet</p>
                  <p className="text-[#00ff41] font-bold text-3xl">${acceptedJobs.reduce((sum, job) => sum + (job.totalBudget || 0), 0).toLocaleString()}</p>
                </div>
                <div className="bg-black/50 border border-[#00ff41]/20 rounded p-4">
                  <p className="text-gray-400 font-mono text-xs mb-1">⏱ Worked Today</p>
                  <p className="text-[#00ff41] font-bold text-3xl">0h</p>
                </div>
              </div>

              {/* Task Counts */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-3">
                  <p className="text-yellow-600 font-mono text-xs">TO DO</p>
                  <p className="text-yellow-400 font-bold text-2xl">{acceptedJobs.reduce((sum, job) => sum + (job.milestones?.filter(m => m.status === 'pending').length || 0), 0)}</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3">
                  <p className="text-blue-600 font-mono text-xs">IN PROGRESS</p>
                  <p className="text-blue-400 font-bold text-2xl">{acceptedJobs.reduce((sum, job) => sum + (job.milestones?.filter(m => m.status === 'in_progress').length || 0), 0)}</p>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 rounded p-3">
                  <p className="text-green-600 font-mono text-xs">COMPLETED</p>
                  <p className="text-green-400 font-bold text-2xl">{acceptedJobs.reduce((sum, job) => sum + (job.milestones?.filter(m => m.status === 'completed').length || 0), 0)}</p>
                </div>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded p-3">
                  <p className="text-purple-600 font-mono text-xs">SUBMITTED</p>
                  <p className="text-purple-400 font-bold text-2xl">{acceptedJobs.reduce((sum, job) => sum + (job.milestones?.filter(m => m.status === 'submitted').length || 0), 0)}</p>
                </div>
                <div className="bg-[#00ff41]/20 border border-[#00ff41]/30 rounded p-3">
                  <p className="text-[#00ff41]/70 font-mono text-xs">TOTAL HOURS</p>
                  <p className="text-[#00ff41] font-bold text-2xl">38h</p>
                </div>
              </div>

              {/* Kanban Board */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* TO DO Column */}
                <div className="bg-yellow-900/10 border border-yellow-500/30 rounded p-4">
                  <h4 className="text-yellow-400 font-mono font-bold mb-4">TO DO</h4>
                  <div className="space-y-3">
                    {acceptedJobs.flatMap(job => 
                      (job.milestones || [])
                        .filter(m => m.status === 'pending')
                        .map(milestone => (
                          <div key={milestone._id} className="bg-black/40 border border-yellow-500/20 rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="text-white font-mono font-bold text-sm">{milestone.title}</h5>
                              <span className="text-yellow-400 text-xs font-mono">→ {job.clientName}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                              {milestone.dueDate && <span>📅 {new Date(milestone.dueDate).toLocaleDateString()}</span>}
                              <span>⏱ 0h</span>
                            </div>
                          </div>
                        ))
                    )}
                    <button className="w-full text-yellow-400 font-mono text-xs py-2 hover:bg-yellow-900/20 rounded transition-all">
                      + Add Task
                    </button>
                  </div>
                </div>

                {/* IN PROGRESS Column */}
                <div className="bg-blue-900/10 border border-blue-500/30 rounded p-4">
                  <h4 className="text-blue-400 font-mono font-bold mb-4">IN PROGRESS</h4>
                  <div className="space-y-3">
                    {acceptedJobs.flatMap(job => 
                      (job.milestones || [])
                        .filter(m => m.status === 'in_progress')
                        .map(milestone => (
                          <div key={milestone._id} className="bg-black/40 border border-blue-500/20 rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="text-white font-mono font-bold text-sm">{milestone.title}</h5>
                              <span className="text-blue-400 text-xs font-mono">→ {job.clientName}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                              {milestone.dueDate && <span>📅 {new Date(milestone.dueDate).toLocaleDateString()}</span>}
                              <span>⏱ 3/6h</span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* DONE Column */}
                <div className="bg-green-900/10 border border-green-500/30 rounded p-4">
                  <h4 className="text-green-400 font-mono font-bold mb-4">DONE</h4>
                  <div className="space-y-3">
                    {acceptedJobs.flatMap(job => 
                      (job.milestones || [])
                        .filter(m => m.status === 'completed')
                        .map(milestone => (
                          <div key={milestone._id} className="bg-black/40 border border-green-500/20 rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="text-white font-mono font-bold text-sm">{milestone.title}</h5>
                              <span className="text-green-400 text-xs font-mono">→ {job.clientName}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                              <span>⏱ {milestone.hoursWorked || 0}h</span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>

              {/* Break Reminder */}
              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4 mb-4">
                <p className="text-orange-400 font-mono font-bold mb-2">☕ Take a Break</p>
                <p className="text-gray-300 font-mono text-sm mb-3">You've been working for 2 hours. Take a 15-minute break to stay productive!</p>
                <button className="px-4 py-2 bg-orange-500/20 border border-orange-500 text-orange-400 font-mono text-xs rounded hover:bg-orange-500/30 transition-all">
                  Start Break
                </button>
              </div>

              {/* All Jobs Summary */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-[#00ff41] font-mono font-bold text-sm mb-4">All Active Projects</h4>
                <div className="space-y-2">
                  {acceptedJobs.map(job => (
                    <div key={job._id} className="bg-black/30 border border-gray-700 rounded p-3 flex justify-between items-center">
                      <div>
                        <p className="text-white font-mono font-bold text-sm">{job.jobTitle}</p>
                        <p className="text-gray-400 font-mono text-xs">💰 ${job.totalBudget?.toLocaleString()} • {job.milestones?.length || 0} tasks</p>
                      </div>
                      <button 
                        onClick={() => navigate('/chat')}
                        className="px-3 py-1 bg-[#00ff41]/20 border border-[#00ff41] text-[#00ff41] font-mono text-xs rounded hover:bg-[#00ff41]/30 transition-all"
                      >
                        💬 Chat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="bg-blue-900/10 border border-blue-500/30 rounded p-4">
                <p className="text-gray-300 font-mono mb-3 font-bold">📌 No accepted jobs yet</p>
                <p className="text-gray-400 font-mono text-sm mb-3">
                  Here's how to get started:
                </p>
                <ol className="text-gray-400 font-mono text-sm space-y-2 ml-4 list-decimal">
                  <li>Go to <span className="text-[#00ff41]">Jobs Page</span> and browse available jobs</li>
                  <li>Submit your <span className="text-[#00ff41]">proposal/bid</span> for a job you want</li>
                  <li>Client will review and accept your proposal</li>
                  <li>Once accepted, all tasks appear here organized by status</li>
                </ol>
                <button 
                  onClick={() => navigate('/jobs')}
                  className="mt-4 px-4 py-2 bg-[#00ff41] text-black font-mono font-bold rounded text-xs hover:bg-[#0df0a0] transition-all"
                >
                  🔍 Find Jobs
                </button>
              </div>

              {/* Debug Info */}
              <div className="bg-gray-900/30 border border-gray-700 rounded p-3 text-xs font-mono">
                <p className="text-gray-400 mb-2">🔧 Debug Info:</p>
                <p className="text-gray-500">- User ID: {user?.uid?.substring(0, 8)}...</p>
                <p className="text-gray-500">- Submit proposals and have clients accept them</p>
                <p className="text-gray-500">- Check browser console for API logs</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeveloperDashboard