import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import JobApplicationModal from '../../components/JobApplicationModal'
import { jobAPI, userAPI } from '../../services/api'

const JobMatching = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [userSkills, setUserSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterMatch, setFilterMatch] = useState('all')
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [jobMatches, setJobMatches] = useState({})

  useEffect(() => {
    fetchJobsAndSkills()
  }, [])

  const fetchJobsAndSkills = async () => {
    try {
      setLoading(true)
      const [jobsData, profileData] = await Promise.all([
        jobAPI.getJobs(),
        userAPI.getProfile()
      ])
      
      setJobs(jobsData || [])
      setUserSkills(profileData.skills || [])

      // Calculate match percentage for each job
      const matches = {}
      jobsData?.forEach(job => {
        const requiredSkills = job.requiredSkills || []
        const matchedSkills = (profileData.skills || []).filter(s => requiredSkills.includes(s))
        const percentage = requiredSkills.length > 0 
          ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
          : 0
        matches[job._id] = { percentage, matched: matchedSkills.length, required: requiredSkills.length }
      })
      setJobMatches(matches)
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!userSkills || userSkills.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-yellow-500/30 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white font-mono mb-2">Update Your Skills First!</h2>
            <p className="text-gray-400 font-mono mb-6">
              You haven't set up your skills yet. Update your skill set to see matching jobs and apply!
            </p>
            <button
              onClick={() => navigate('/skills')}
              className="px-6 py-3 bg-gradient-to-r from-[#00ff41] to-[#0df0a0] text-black font-mono font-bold rounded-lg hover:shadow-lg hover:shadow-[#00ff41]/50 transition-all"
            >
              → Update Your Skills
            </button>
          </div>
        </div>
      </div>
    )
  }

  const filteredJobs = jobs.filter(job => {
    const categoryMatch = filterCategory === 'all' || job.category === filterCategory
    let matchMatch = true
    
    if (filterMatch !== 'all') {
      const match = jobMatches[job._id]?.percentage || 0
      if (filterMatch === 'high' && match < 80) matchMatch = false
      if (filterMatch === 'medium' && (match < 50 || match >= 80)) matchMatch = false
      if (filterMatch === 'low' && match >= 50) matchMatch = false
    }
    
    return categoryMatch && matchMatch && job.status === 'open'
  })

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const matchA = jobMatches[a._id]?.percentage || 0
    const matchB = jobMatches[b._id]?.percentage || 0
    return matchB - matchA
  })

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', bar: 'bg-green-500' }
    if (percentage >= 50) return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', bar: 'bg-yellow-500' }
    return { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', bar: 'bg-red-500' }
  }

  const getMatchLabel = (percentage) => {
    if (percentage >= 90) return '⭐ Perfect Match'
    if (percentage >= 80) return '✓ High Match'
    if (percentage >= 50) return '⚡ Medium Match'
    return '→ Low Match'
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white font-mono mb-2">
                Job <span className="text-[#00ff41]">Matching</span>
              </h1>
              <p className="text-gray-400 font-mono">
                Based on {userSkills.length} of your skills - Highest matches first
              </p>
            </div>
            <button
              onClick={() => navigate('/skills')}
              className="px-4 py-2 bg-[#00ff41]/20 border border-[#00ff41]/50 text-[#00ff41] font-mono text-sm rounded hover:bg-[#00ff41]/30 transition-all"
            >
              ✏️ Edit Skills
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="text-sm text-[#00ff41] font-mono mb-2 block">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[#00ff41]/20 text-white font-mono text-sm focus:border-[#00ff41] focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="web-development">Web Development</option>
              <option value="mobile-development">Mobile Development</option>
              <option value="design">Design</option>
              <option value="writing">Writing</option>
              <option value="video">Video & Media</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[#00ff41] font-mono mb-2 block">Match Level</label>
            <select
              value={filterMatch}
              onChange={(e) => setFilterMatch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[#00ff41]/20 text-white font-mono text-sm focus:border-[#00ff41] focus:outline-none"
            >
              <option value="all">All Matches</option>
              <option value="high">High Match (80%+)</option>
              <option value="medium">Medium Match (50-80%)</option>
              <option value="low">Low Match (&lt;50%)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchJobsAndSkills}
              className="w-full px-4 py-2 bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] font-mono text-sm rounded hover:bg-[#00ff41]/20 transition-all"
            >
              🔄 Refresh Jobs
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-[#00ff41]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <p className="text-[#00ff41] font-mono">Loading jobs...</p>
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/20 rounded-xl p-8 text-center">
            <p className="text-gray-400 font-mono mb-4">No jobs match your current filters</p>
            <button
              onClick={() => {
                setFilterCategory('all')
                setFilterMatch('all')
              }}
              className="px-4 py-2 bg-[#00ff41]/20 border border-[#00ff41]/50 text-[#00ff41] font-mono text-sm rounded hover:bg-[#00ff41]/30 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedJobs.map(job => {
              const match = jobMatches[job._id] || { percentage: 0, matched: 0, required: 0 }
              const colors = getMatchColor(match.percentage)
              
              return (
                <div key={job._id} className="bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a] to-[#050505] border border-[#00ff41]/20 rounded-xl p-6 hover:border-[#00ff41]/50 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Left - Job Info */}
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold text-white font-mono mb-2">{job.title}</h3>
                      <p className="text-gray-400 font-mono text-sm mb-3">{job.description?.substring(0, 100)}...</p>
                      
                      {/* Required Skills */}
                      <div className="mb-2">
                        <p className="text-[#00ff41] font-mono text-xs mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {(job.requiredSkills || []).slice(0, 5).map(skill => (
                            <span
                              key={skill}
                              className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                                userSkills.includes(skill)
                                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                                  : 'bg-gray-500/20 border border-gray-500/50 text-gray-400'
                              }`}
                            >
                              {userSkills.includes(skill) ? '✓' : '○'} {skill}
                            </span>
                          ))}
                          {job.requiredSkills?.length > 5 && (
                            <span className="px-2 py-1 text-xs text-gray-400 font-mono">
                              +{job.requiredSkills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Center - Match Score */}
                    <div className="flex flex-col items-center justify-center py-4 md:py-0 md:border-l md:border-r border-[#00ff41]/20">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center ${colors.bg} border-2 ${colors.border} relative`}>
                        <div className="text-center">
                          <p className={`text-3xl font-bold font-mono ${colors.text}`}>{match.percentage}%</p>
                          <p className="text-xs text-gray-400 font-mono">{match.matched}/{match.required} skills</p>
                        </div>
                      </div>
                      <p className={`text-xs font-mono font-bold mt-3 ${colors.text}`}>{getMatchLabel(match.percentage)}</p>
                    </div>

                    {/* Right - Job Details & Action */}
                    <div className="flex flex-col justify-between">
                      <div className="space-y-2 mb-4">
                        <div>
                          <p className="text-gray-500 font-mono text-xs">Budget</p>
                          <p className="text-white font-mono font-bold">${job.budgetMin}-${job.budgetMax}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-mono text-xs">Duration</p>
                          <p className="text-white font-mono font-bold capitalize">{job.duration}</p>
                        </div>
                        {job.deadline && (
                          <div>
                            <p className="text-gray-500 font-mono text-xs">Deadline</p>
                            <p className="text-white font-mono font-bold text-sm">{new Date(job.deadline).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedJobId(job._id)}
                        disabled={match.percentage < 20}
                        className={`w-full px-4 py-3 rounded-lg font-mono font-bold transition-all ${
                          match.percentage < 20
                            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-500/30'
                            : 'bg-gradient-to-r from-[#00ff41] to-[#0df0a0] text-black hover:shadow-lg hover:shadow-[#00ff41]/50'
                        }`}
                      >
                        {match.percentage < 20 ? 'Skills Too Low' : '📤 Apply Now'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {selectedJobId && (
        <JobApplicationModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
          onSuccess={() => fetchJobsAndSkills()}
        />
      )}
    </div>
  )
}

export default JobMatching
