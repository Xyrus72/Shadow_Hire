import React, { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const ClientDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewJobForm, setShowNewJobForm] = useState(false)
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    requiredSkills: [],
    budget: '',
    deadline: ''
  })

  useEffect(() => {
    fetchClientData()
  }, [user])

  const fetchClientData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')

      // Fetch client profile
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

      // Fetch client's posted jobs
      const jobsRes = await fetch('http://localhost:5000/api/jobs/my-jobs', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => null)

      if (jobsRes?.ok) {
        const data = await jobsRes.json()
        setJobs(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Error fetching client data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePostJob = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('authToken')
      
      const response = await fetch('http://localhost:5000/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newJob.title,
          description: newJob.description,
          requiredSkills: newJob.requiredSkills,
          budget: newJob.budget,
          deadline: newJob.deadline,
          clientId: user.uid
        })
      })

      if (response.ok) {
        setShowNewJobForm(false)
        setNewJob({ title: '', description: '', requiredSkills: [], budget: '', deadline: '' })
        fetchClientData()
        alert('Job posted successfully!')
      } else {
        alert('Failed to post job')
      }
    } catch (err) {
      console.error('Error posting job:', err)
      alert('Error posting job')
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white font-mono mb-2">
            Client <span className="text-[#00ff41]">Dashboard</span>
          </h1>
          <p className="text-gray-400 font-mono">Post jobs, manage projects, and hire developers</p>
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
                  <p className="text-[#00ff41] font-mono text-sm mt-1">Company: {profile.companyName || 'Not specified'}</p>
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
            { label: 'Posted Jobs', value: jobs.length, icon: '📋' },
            { label: 'Active Jobs', value: jobs.filter(j => j.status === 'active').length || 0, icon: '🔴' },
            { label: 'Total Proposals', value: jobs.reduce((sum, j) => sum + (j.proposals?.length || 0), 0), icon: '📬' },
            { label: 'Total Spent', value: `$${jobs.reduce((sum, j) => sum + (j.budget || 0), 0).toLocaleString()}`, icon: '💰' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/20 rounded-lg p-4">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-gray-400 font-mono text-xs mb-1">{stat.label}</p>
              <p className="text-white font-mono font-bold text-2xl">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Post New Job Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowNewJobForm(!showNewJobForm)}
            className="px-6 py-3 bg-[#00ff41] text-black font-mono font-bold rounded hover:bg-[#0df0a0] transition-all text-lg"
          >
            {showNewJobForm ? '✕ Cancel' : '+ Post New Job'}
          </button>
        </div>

        {/* New Job Form */}
        {showNewJobForm && (
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/20 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-white font-mono mb-4">Post a New Job</h3>
            <form onSubmit={handlePostJob} className="space-y-4">
              <div>
                <label className="block text-white font-mono text-sm mb-2">Job Title</label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-[#00ff41]/30 text-white font-mono rounded focus:outline-none focus:border-[#00ff41]"
                  placeholder="Enter job title"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-mono text-sm mb-2">Description</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-[#00ff41]/30 text-white font-mono rounded focus:outline-none focus:border-[#00ff41]"
                  placeholder="Enter job description"
                  rows="4"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-mono text-sm mb-2">Budget ($)</label>
                  <input
                    type="number"
                    value={newJob.budget}
                    onChange={(e) => setNewJob({ ...newJob, budget: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-[#00ff41]/30 text-white font-mono rounded focus:outline-none focus:border-[#00ff41]"
                    placeholder="Job budget"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-mono text-sm mb-2">Deadline</label>
                  <input
                    type="date"
                    value={newJob.deadline}
                    onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-[#00ff41]/30 text-white font-mono rounded focus:outline-none focus:border-[#00ff41]"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-[#00ff41] text-black font-mono font-bold rounded hover:bg-[#0df0a0] transition-all"
              >
                Post Job
              </button>
            </form>
          </div>
        )}

        {/* Posted Jobs */}
        <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white font-mono mb-4">Your Posted Jobs</h3>
          {jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.map((job, idx) => (
                <div key={idx} className="border border-[#00ff41]/20 rounded p-4 hover:bg-[#0a0a0a]/50 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-white font-mono font-bold">{job.title}</h4>
                      <p className="text-gray-400 font-mono text-sm">{job.description?.substring(0, 100)}...</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {job.requiredSkills?.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] font-mono rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-mono font-bold text-lg">${job.budget}</p>
                      <p className="text-[#00ff41] font-mono text-xs">{job.status || 'Active'}</p>
                      <p className="text-gray-400 font-mono text-xs mt-1">{job.proposals?.length || 0} proposals</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 font-mono">You haven't posted any jobs yet. Create your first job to hire developers!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
