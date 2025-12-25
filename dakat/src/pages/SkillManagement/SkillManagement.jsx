import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { userAPI } from '../../services/api'

const SkillManagement = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [userSkills, setUserSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const availableSkills = [
    // Frontend
    'React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS',
    // Backend
    'Node.js', 'Python', 'Java', 'PHP', 'Go', 'Ruby', 'C#', 'Express.js', 'Django', 'FastAPI',
    // Database
    'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Redis', 'GraphQL', 'Elasticsearch',
    // DevOps & Tools
    'Docker', 'Kubernetes', 'AWS', 'Git', 'CI/CD', 'Linux', 'Jenkins',
    // Other
    'REST API', 'Microservices', 'Machine Learning', 'Data Science', 'Figma', 'UI/UX Design'
  ]

  useEffect(() => {
    fetchUserSkills()
  }, [])

  const fetchUserSkills = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getProfile()
      setUserSkills(response.skills || [])
      setError('')
    } catch (err) {
      console.error('Error fetching skills:', err)
      setError('Failed to load your skills')
    } finally {
      setLoading(false)
    }
  }

  const toggleSkill = (skill) => {
    if (userSkills.includes(skill)) {
      setUserSkills(userSkills.filter(s => s !== skill))
    } else {
      setUserSkills([...userSkills, skill])
    }
  }

  const handleSaveSkills = async () => {
    if (userSkills.length === 0) {
      setError('Please select at least one skill')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')
      
      await userAPI.updateSkills(userSkills)
      
      setSuccess('✅ Skills updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error updating skills:', err)
      setError('Failed to update skills. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-[#00ff41]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <p className="text-[#00ff41] font-mono">Loading your skills...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white font-mono mb-2">
            Skill <span className="text-[#00ff41]">Management</span>
          </h1>
          <p className="text-gray-400 font-mono">
            Update your skills to match with suitable jobs. Jobs require specific skills - more matches = more opportunities!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-sm">
            {success}
          </div>
        )}

        {/* Skills Grid */}
        <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/20 rounded-xl p-8 mb-8">
          {/* Instructions */}
          <div className="mb-8 p-4 rounded-lg bg-[#00ff41]/5 border border-[#00ff41]/20">
            <div className="flex gap-3">
              <div className="text-[#00ff41] font-bold text-xl">💡</div>
              <div>
                <p className="text-white font-mono font-bold mb-1">Skill Matching Tips</p>
                <p className="text-gray-400 font-mono text-sm">
                  Select the skills you're proficient in. When applying for jobs, you'll see a match percentage based on how many of the job's required skills you have. Higher match = better chances of getting the job!
                </p>
              </div>
            </div>
          </div>

          {/* Skills Categories */}
          <div className="space-y-8">
            {/* Frontend Skills */}
            <div>
              <h3 className="text-lg font-bold text-[#00ff41] font-mono mb-4 flex items-center gap-2">
                <span>💻</span> Frontend Development
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {['React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS'].map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                      userSkills.includes(skill)
                        ? 'bg-[#00ff41] text-black border border-[#00ff41] font-bold shadow-lg shadow-[#00ff41]/50'
                        : 'bg-[#0a0a0a] text-gray-300 border border-[#00ff41]/20 hover:border-[#00ff41]/50'
                    }`}
                  >
                    {userSkills.includes(skill) && '✓ '}{skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Backend Skills */}
            <div>
              <h3 className="text-lg font-bold text-[#00ff41] font-mono mb-4 flex items-center gap-2">
                <span>⚙️</span> Backend Development
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {['Node.js', 'Python', 'Java', 'PHP', 'Go', 'Ruby', 'C#', 'Express.js', 'Django', 'FastAPI'].map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                      userSkills.includes(skill)
                        ? 'bg-[#00ff41] text-black border border-[#00ff41] font-bold shadow-lg shadow-[#00ff41]/50'
                        : 'bg-[#0a0a0a] text-gray-300 border border-[#00ff41]/20 hover:border-[#00ff41]/50'
                    }`}
                  >
                    {userSkills.includes(skill) && '✓ '}{skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Database Skills */}
            <div>
              <h3 className="text-lg font-bold text-[#00ff41] font-mono mb-4 flex items-center gap-2">
                <span>🗄️</span> Database & Tools
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {['MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Redis', 'GraphQL', 'Elasticsearch', 'REST API'].map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                      userSkills.includes(skill)
                        ? 'bg-[#00ff41] text-black border border-[#00ff41] font-bold shadow-lg shadow-[#00ff41]/50'
                        : 'bg-[#0a0a0a] text-gray-300 border border-[#00ff41]/20 hover:border-[#00ff41]/50'
                    }`}
                  >
                    {userSkills.includes(skill) && '✓ '}{skill}
                  </button>
                ))}
              </div>
            </div>

            {/* DevOps & Other Skills */}
            <div>
              <h3 className="text-lg font-bold text-[#00ff41] font-mono mb-4 flex items-center gap-2">
                <span>🚀</span> DevOps & Other
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {['Docker', 'Kubernetes', 'AWS', 'Git', 'CI/CD', 'Linux', 'Jenkins', 'Machine Learning', 'Data Science', 'Figma', 'UI/UX Design', 'Microservices'].map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                      userSkills.includes(skill)
                        ? 'bg-[#00ff41] text-black border border-[#00ff41] font-bold shadow-lg shadow-[#00ff41]/50'
                        : 'bg-[#0a0a0a] text-gray-300 border border-[#00ff41]/20 hover:border-[#00ff41]/50'
                    }`}
                  >
                    {userSkills.includes(skill) && '✓ '}{skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Summary & Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-white font-mono">
            <p className="text-lg">
              Selected Skills: <span className="text-[#00ff41] font-bold">{userSkills.length}</span>
            </p>
            {userSkills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {userSkills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-[#00ff41]/10 border border-[#00ff41]/30 rounded text-sm text-[#00ff41]">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/jobs')}
              className="flex-1 sm:flex-none px-6 py-3 rounded-lg border border-[#00ff41]/30 text-[#00ff41] font-mono font-bold hover:border-[#00ff41] hover:bg-[#00ff41]/5 transition-all"
            >
              ← Back to Jobs
            </button>

            <button
              onClick={handleSaveSkills}
              disabled={saving || userSkills.length === 0}
              className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-gradient-to-r from-[#00ff41] to-[#0df0a0] text-black font-mono font-bold hover:shadow-lg hover:shadow-[#00ff41]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  💾 Save Skills
                </>
              )}
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 p-6 rounded-lg bg-[#00ff41]/5 border border-[#00ff41]/20">
          <h3 className="text-xl font-bold text-white font-mono mb-4">Next Step</h3>
          <p className="text-gray-300 font-mono mb-4">
            Once you've updated your skills, go to <strong>Job Matching</strong> to see jobs that match your expertise. 
            The system will show you a match percentage based on how many skills you have that the job requires.
          </p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-3 rounded-lg bg-[#00ff41] text-black font-mono font-bold hover:bg-[#0df0a0] transition-all"
          >
            → Go to Job Matching
          </button>
        </div>
      </div>
    </div>
  )
}

export default SkillManagement
