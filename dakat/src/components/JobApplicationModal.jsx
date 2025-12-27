import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { jobAPI, userAPI } from '../services/api'

const JobApplicationModal = ({ jobId, onClose, onSuccess }) => {
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [userSkills, setUserSkills] = useState([])
  const [matchPercentage, setMatchPercentage] = useState(0)
  const [proposal, setProposal] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchJobAndSkills()
  }, [jobId])

  const fetchJobAndSkills = async () => {
    try {
      setLoading(true)
      const [jobData, profileData] = await Promise.all([
        jobAPI.getJobById(jobId),
        userAPI.getProfile()
      ])
      
      setJob(jobData)
      const skills = profileData.skills || []
      setUserSkills(skills)
      
      // Calculate match percentage
      const requiredSkills = jobData.requiredSkills || []
      const matchedSkills = skills.filter(skill => requiredSkills.includes(skill))
      const percentage = requiredSkills.length > 0 
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
        : 0
      setMatchPercentage(percentage)
      
      setError('')
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load job details')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()
    
    if (!proposal.trim()) {
      setError('Please write a proposal/cover letter')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      
      await jobAPI.submitProposal(jobId, {
        coverLetter: proposal
      })
      
      setSuccess('✅ Application submitted successfully!')
      setTimeout(() => {
        onSuccess && onSuccess()
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Error submitting proposal:', err)
      setError(err.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#0a0a0a] border border-[#00ff41]/30 rounded-xl p-8 max-w-2xl w-full text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-[#00ff41]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <p className="text-[#00ff41] font-mono">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#0a0a0a] border border-red-500/30 rounded-xl p-8 max-w-2xl w-full">
          <p className="text-red-400 font-mono">Job not found</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded hover:bg-red-500/30 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const requiredSkills = job.requiredSkills || []
  const matchedSkills = userSkills.filter(skill => requiredSkills.includes(skill))
  const skillsNeeded = requiredSkills.filter(skill => !userSkills.includes(skill))

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl p-8 max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white font-mono mb-2">{job.title}</h2>
            <p className="text-gray-400 font-mono text-sm">{job.category}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Skill Match */}
        <div className="mb-6 p-4 rounded-lg bg-[#00ff41]/5 border border-[#00ff41]/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-mono font-bold">Skill Match</h3>
            <span className={`text-xl font-bold font-mono ${
              matchPercentage >= 80 ? 'text-green-400' : matchPercentage >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {matchPercentage}%
            </span>
          </div>
          <div className="w-full bg-[#0a0a0a] rounded-full h-2 border border-[#00ff41]/20 overflow-hidden">
            <div
              className={`h-full transition-all ${
                matchPercentage >= 80 ? 'bg-green-500' : matchPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${matchPercentage}%` }}
            />
          </div>
          <p className="text-gray-400 font-mono text-xs mt-2">
            {matchedSkills.length} of {requiredSkills.length} required skills matched
          </p>
        </div>

        {/* Required Skills */}
        <div className="mb-6">
          <h4 className="text-[#00ff41] font-mono font-bold mb-2">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map(skill => (
              <span
                key={skill}
                className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                  matchedSkills.includes(skill)
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                    : 'bg-red-500/20 border border-red-500/50 text-red-400'
                }`}
              >
                {matchedSkills.includes(skill) ? '✓' : '✗'} {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Needed */}
        {skillsNeeded.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-yellow-400 font-mono text-sm mb-2">
              💡 You don't have these {skillsNeeded.length} skill(s), but you can still apply!
            </p>
            <div className="flex flex-wrap gap-2">
              {skillsNeeded.map(skill => (
                <span key={skill} className="px-2 py-1 bg-yellow-500/20 rounded text-xs text-yellow-300 font-mono">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Job Details */}
        <div className="mb-6 p-4 bg-[#0a0a0a] rounded-lg border border-[#00ff41]/20">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 font-mono text-xs">Budget</p>
              <p className="text-white font-mono font-bold">${job.budgetMin} - ${job.budgetMax}</p>
            </div>
            <div>
              <p className="text-gray-400 font-mono text-xs">Duration</p>
              <p className="text-white font-mono font-bold capitalize">{job.duration}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-sm">
            {success}
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleApply} className="space-y-4">
          {/* Cover Letter */}
          <div>
            <label className="block text-[#00ff41] font-mono text-xs uppercase mb-2">Cover Letter</label>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Tell the client why you're the best fit for this job..."
              rows="4"
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[#00ff41]/20 text-white font-mono text-sm placeholder-gray-600 focus:border-[#00ff41] focus:outline-none resize-none"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-[#00ff41]/30 text-[#00ff41] font-mono font-bold hover:border-[#00ff41] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00ff41] to-[#0df0a0] text-black font-mono font-bold hover:shadow-lg hover:shadow-[#00ff41]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Applying...
                </>
              ) : (
                <>📤 Apply Now</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JobApplicationModal
