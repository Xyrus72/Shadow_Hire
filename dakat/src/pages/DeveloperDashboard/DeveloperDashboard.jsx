import React, { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const DeveloperDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

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

      // Fetch user applications (jobs applied to)
      const appsRes = await fetch('http://localhost:5000/api/jobs/my-applications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => null)

      if (appsRes?.ok) {
        const data = await appsRes.json()
        setApplications(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Error fetching developer data:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4">
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
            { label: 'Total Applications', value: applications.length, icon: '📝' },
            { label: 'Active Offers', value: applications.filter(a => a.status === 'accepted').length || 0, icon: '✅' },
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

        {/* Applications */}
        <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white font-mono mb-4">My Applications</h3>
          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((app, idx) => (
                <div key={idx} className="border border-[#00ff41]/20 rounded p-4 hover:bg-[#0a0a0a]/50 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-mono font-bold">{app.jobTitle}</h4>
                      <p className="text-gray-400 font-mono text-sm">{app.clientName}</p>
                      <p className="text-[#00ff41] font-mono text-sm mt-1">Status: {app.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-mono font-bold">${app.budget}</p>
                      <p className="text-gray-400 font-mono text-xs">{app.dueDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 font-mono">No applications yet. Head to Job Matching to find opportunities!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeveloperDashboard
