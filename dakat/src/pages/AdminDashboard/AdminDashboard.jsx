import React, { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDevelopers: 0,
    totalClients: 0,
    totalJobs: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      // In a real app, you'd have specific admin endpoints
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => null)
      
      if (response?.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white font-mono mb-2">
            Admin <span className="text-[#00ff41]">Dashboard</span>
          </h1>
          <p className="text-gray-400 font-mono">Manage platform, users, and monitor system health</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
            { label: 'Developers', value: stats.totalDevelopers, icon: '👨‍💻' },
            { label: 'Clients', value: stats.totalClients, icon: '💼' },
            { label: 'Active Jobs', value: stats.totalJobs, icon: '📋' },
            { label: 'Revenue', value: `$${stats.totalRevenue?.toLocaleString()}`, icon: '💰' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/20 rounded-lg p-4">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-gray-400 font-mono text-xs mb-1">{stat.label}</p>
              <p className="text-white font-mono font-bold text-2xl">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Manage Users', desc: 'View and manage all platform users', icon: '👥', action: 'Go to Users' },
            { title: 'Monitor Jobs', desc: 'Track jobs and proposals', icon: '📋', action: 'View Jobs' },
            { title: 'Platform Settings', desc: 'Configure platform behavior', icon: '⚙️', action: 'Settings' }
          ].map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/20 rounded-lg p-6 hover:border-[#00ff41]/50 transition-all">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-white font-mono font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 font-mono text-sm mb-4">{item.desc}</p>
              <button className="px-4 py-2 bg-[#00ff41] text-black font-mono font-bold rounded hover:bg-[#0df0a0] transition-all text-sm">
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
