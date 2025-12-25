import React from 'react'
import { Outlet, Link } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,255,65,0.15) 0%, transparent 50%)'}}></div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(0,255,65,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#00ff41]/20 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,65,0.8)]">
                <defs>
                  <linearGradient id="authCloak" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#001a0a" stopOpacity="0.9"/>
                    <stop offset="50%" stopColor="#003311" stopOpacity="0.95"/>
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.98"/>
                  </linearGradient>
                  <radialGradient id="authGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00ff41" stopOpacity="1"/>
                    <stop offset="50%" stopColor="#00ff41" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#00ff41" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <path d="M50 5 Q30 8 22 25 L18 40 Q16 50 18 60 L22 75 Q28 82 38 85 L50 88 L62 85 Q72 82 78 75 L82 60 Q84 50 82 40 L78 25 Q70 8 50 5 Z" fill="url(#authCloak)" stroke="#003311" strokeWidth="1.5" opacity="0.95"/>
                <ellipse cx="50" cy="40" rx="25" ry="30" fill="#000000" opacity="1"/>
                <circle cx="42" cy="38" r="4" fill="url(#authGlow)" className="animate-pulse"/>
                <circle cx="58" cy="38" r="4" fill="url(#authGlow)" className="animate-pulse"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-[#00ff41] font-mono group-hover:tracking-wider transition-all">SHADOW HIRE</span>
          </Link>
          <Link to="/" className="text-sm text-gray-400 hover:text-[#00ff41] font-mono transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#00ff41]/20 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-gray-500 font-mono">
            Shadow Hire © 2025 • <a href="#" className="text-[#00ff41]/70 hover:text-[#00ff41] transition-colors">Privacy</a> • <a href="#" className="text-[#00ff41]/70 hover:text-[#00ff41] transition-colors">Terms</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default AuthLayout
