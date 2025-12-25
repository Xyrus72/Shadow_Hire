import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Get user from localStorage
    const shadowUser = localStorage.getItem('shadowUser')
    if (shadowUser) {
      setUser(JSON.parse(shadowUser))
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('shadowUser')
    navigate('/auth/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <p className="text-[#00ff41] font-mono">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <p className="text-red-400 font-mono mb-4">You are not logged in</p>
          <button
            onClick={() => navigate('/auth/login')}
            className="px-6 py-2 rounded-lg bg-[#00ff41] text-black font-mono font-bold hover:bg-[#0df0a0] transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Profile Card */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#00ff41]/20 via-transparent to-[#00ff41]/20 rounded-2xl blur-xl opacity-50"></div>
          
          <div className="relative bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.15)] overflow-hidden">
            {/* Header */}
            <div className="relative px-8 pt-8 pb-6 border-b border-[#00ff41]/20">
              <div className="absolute top-0 left-0 w-full h-px overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-[#00ff41] to-transparent animate-pulse"></div>
              </div>
              
              <h1 className="text-3xl font-bold text-white font-mono text-center">
                Your <span className="text-[#00ff41]">Profile</span>
              </h1>
            </div>

            {/* Profile Content */}
            <div className="px-8 py-12">
              {/* Avatar */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <img
                    src={user?.photoURL || 'https://via.placeholder.com/150?text=User'}
                    alt={user?.name}
                    className="w-32 h-32 rounded-full border-2 border-[#00ff41] shadow-[0_0_30px_rgba(0,255,65,0.3)]"
                  />
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-[#00ff41] rounded-full border-2 border-black shadow-lg animate-pulse"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-6">
                {/* Display Name */}
                <div className="bg-[rgba(0,255,65,0.05)] border border-[#00ff41]/20 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wider text-[#00ff41]/70 font-mono mb-2">Display Name</p>
                  <p className="text-lg text-white font-mono">{user?.name || 'Not set'}</p>
                </div>

                {/* Email */}
                <div className="bg-[rgba(0,255,65,0.05)] border border-[#00ff41]/20 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wider text-[#00ff41]/70 font-mono mb-2">Email Address</p>
                  <p className="text-lg text-white font-mono break-all">{user?.email}</p>
                </div>

                {/* Role */}
                <div className="bg-[rgba(0,255,65,0.05)] border border-[#00ff41]/20 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wider text-[#00ff41]/70 font-mono mb-2">Developer Role</p>
                  <p className="text-lg text-white font-mono">{user?.role || 'Not specified'}</p>
                </div>

                {/* Account Created */}
                <div className="bg-[rgba(0,255,65,0.05)] border border-[#00ff41]/20 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wider text-[#00ff41]/70 font-mono mb-2">Account Status</p>
                  <p className="text-lg text-white font-mono flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"></span>
                    Active
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full mt-8 py-3 rounded-lg text-sm font-mono font-bold text-black bg-gradient-to-r from-red-500 to-red-600 border border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.3)] transition-all hover:shadow-[0_0_35px_rgba(239,68,68,0.5)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 p-4 rounded-lg border border-[#00ff41]/20 bg-[rgba(0,255,65,0.03)]">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00ff41]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#00ff41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[#00ff41]/70 font-mono font-bold">🔐 Secure Session</p>
              <p className="text-xs text-gray-500 font-mono">Your profile data is encrypted and secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
