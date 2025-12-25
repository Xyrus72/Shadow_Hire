import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, userPhoto, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate('/auth/login')
        setIsOpen(false)
      })
      .catch(error => console.error('Logout error:', error))
  }

  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-md border-b-2 border-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.3)] z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* Logo with Omen-style figure */}
        <div className="relative flex items-center gap-3 group">
          {/* Omen-Inspired Phantom */}
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-[0_0_20px_rgba(0,255,65,0.8)] group-hover:drop-shadow-[0_0_30px_rgba(0,255,65,1)] transition-all duration-500">
              <defs>
                <linearGradient id="omenCloak" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#001a0a" stopOpacity="0.9"/>
                  <stop offset="50%" stopColor="#003311" stopOpacity="0.95"/>
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.98"/>
                </linearGradient>
                <radialGradient id="omenGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00ff41" stopOpacity="1"/>
                  <stop offset="50%" stopColor="#00ff41" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#00ff41" stopOpacity="0"/>
                </radialGradient>
                <filter id="smokeBlur">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
                </filter>
              </defs>
              
              {/* Floating smoke/mist particles - bottom */}
              <circle cx="30" cy="92" r="3" fill="#00ff41" opacity="0.2" filter="url(#smokeBlur)" className="animate-pulse"/>
              <circle cx="70" cy="95" r="2.5" fill="#00ff41" opacity="0.15" filter="url(#smokeBlur)" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
              <circle cx="45" cy="88" r="2" fill="#00ff41" opacity="0.25" filter="url(#smokeBlur)" className="animate-pulse" style={{animationDelay: '1s'}}/>
              <circle cx="55" cy="93" r="2.8" fill="#00ff41" opacity="0.18" filter="url(#smokeBlur)" className="animate-pulse" style={{animationDelay: '1.5s'}}/>
              
              {/* Main tattered cloak shape */}
              <path d="M50 8 Q35 12 25 28 L18 45 Q15 58 16 70 L18 82 Q20 88 25 92 L28 95" 
                    fill="url(#omenCloak)" stroke="#00ff41" strokeWidth="0.5" opacity="0.3"/>
              <path d="M50 8 Q65 12 75 28 L82 45 Q85 58 84 70 L82 82 Q80 88 75 92 L72 95" 
                    fill="url(#omenCloak)" stroke="#00ff41" strokeWidth="0.5" opacity="0.3"/>
              
              {/* Hood main structure */}
              <path d="M50 5 Q30 8 22 25 L18 40 Q16 50 18 60 L22 75 Q28 82 38 85 L50 88 L62 85 Q72 82 78 75 L82 60 Q84 50 82 40 L78 25 Q70 8 50 5 Z" 
                    fill="url(#omenCloak)" stroke="#003311" strokeWidth="1.5" opacity="0.95"/>
              
              {/* Torn/tattered edges */}
              <path d="M25 75 L22 82 L25 80 L23 85 L26 83" stroke="#001a0a" strokeWidth="1" opacity="0.6" fill="none"/>
              <path d="M75 75 L78 82 L75 80 L77 85 L74 83" stroke="#001a0a" strokeWidth="1" opacity="0.6" fill="none"/>
              <path d="M38 85 L35 90 L38 88 L36 92" stroke="#001a0a" strokeWidth="0.8" opacity="0.5" fill="none"/>
              <path d="M62 85 L65 90 L62 88 L64 92" stroke="#001a0a" strokeWidth="0.8" opacity="0.5" fill="none"/>
              
              {/* Deep void inside hood - complete darkness */}
              <ellipse cx="50" cy="40" rx="25" ry="30" fill="#000000" opacity="1"/>
              <ellipse cx="50" cy="42" rx="23" ry="28" fill="#000000" opacity="0.95"/>
              
              {/* Ethereal glowing eyes/orbs */}
              <circle cx="42" cy="38" r="4" fill="url(#omenGlow)" className="animate-pulse" style={{animationDuration: '3s'}}/>
              <circle cx="58" cy="38" r="4" fill="url(#omenGlow)" className="animate-pulse" style={{animationDuration: '3s'}}/>
              
              {/* Eye glow trails */}
              <ellipse cx="42" cy="38" rx="6" ry="8" fill="#00ff41" opacity="0.3" className="animate-pulse"/>
              <ellipse cx="58" cy="38" rx="6" ry="8" fill="#00ff41" opacity="0.3" className="animate-pulse"/>
              
              {/* Mystic energy particles around eyes */}
              <circle cx="38" cy="35" r="1" fill="#00ff41" opacity="0.7" className="animate-pulse" style={{animationDelay: '0.3s'}}/>
              <circle cx="46" cy="34" r="0.8" fill="#00ff41" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
              <circle cx="54" cy="34" r="0.8" fill="#00ff41" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.9s'}}/>
              <circle cx="62" cy="35" r="1" fill="#00ff41" opacity="0.7" className="animate-pulse" style={{animationDelay: '1.2s'}}/>
              
              {/* Smoke wisps rising from hood */}
              <path d="M35 25 Q32 20 30 15 Q28 10 27 5" stroke="#00ff41" strokeWidth="1" opacity="0.2" strokeLinecap="round" filter="url(#smokeBlur)" className="animate-pulse"/>
              <path d="M50 15 Q50 10 50 5 Q50 2 50 0" stroke="#00ff41" strokeWidth="1.2" opacity="0.25" strokeLinecap="round" filter="url(#smokeBlur)" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
              <path d="M65 25 Q68 20 70 15 Q72 10 73 5" stroke="#00ff41" strokeWidth="1" opacity="0.2" strokeLinecap="round" filter="url(#smokeBlur)" className="animate-pulse" style={{animationDelay: '1s'}}/>
              
              {/* Phantom smoke tendrils */}
              <path d="M20 55 Q15 58 12 62" stroke="#00ff41" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" filter="url(#smokeBlur)" className="animate-pulse"/>
              <path d="M80 55 Q85 58 88 62" stroke="#00ff41" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" filter="url(#smokeBlur)" className="animate-pulse" style={{animationDelay: '0.7s'}}/>
              
              {/* Glitch particles */}
              <rect x="15" y="50" width="3" height="1" fill="#00ff41" opacity="0.4" className="animate-pulse"/>
              <rect x="82" y="50" width="3" height="1" fill="#00ff41" opacity="0.4" className="animate-pulse" style={{animationDelay: '0.4s'}}/>
            </svg>
            
            {/* Multiple atmospheric glow layers */}
            <div className="absolute inset-0 rounded-full opacity-15 blur-xl animate-pulse" 
                 style={{background: 'radial-gradient(circle, rgba(0,255,65,0.4) 0%, transparent 70%)'}}></div>
            <div className="absolute inset-0 rounded-full opacity-10 blur-2xl animate-pulse" 
                 style={{background: 'radial-gradient(circle, rgba(0,255,65,0.3) 0%, transparent 70%)', animationDelay: '1.5s'}}></div>
          </div>
          <h1 className="text-2xl font-bold text-[#00ff41] font-mono animate-pulse group-hover:tracking-wider transition-all duration-300 drop-shadow-[0_0_10px_rgba(0,255,65,0.9)]">
            SHADOW HIRE
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className={`
          md:flex md:gap-8 md:items-center md:static md:flex-row md:bg-transparent md:w-auto md:p-0
          ${isOpen ? 'flex' : 'hidden'} 
          flex-col absolute top-[70px] left-0 w-full bg-black/98 p-8 gap-6 border-t-2 border-[#00ff41]
        `}>
          <li className="group">
            <Link to="/" className="relative text-[#00ff41] font-mono text-base font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2">
              <span>&gt;</span>
              <span>Home</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ff41] to-cyan-400 shadow-[0_0_5px_#00ff41] group-hover:w-full transition-all duration-400"></span>
            </Link>
          </li>
          
          {/* Premium Features - Only show when logged in */}
          {user && (
            <>
              <li className="group">
                <Link to="/jobs" className="relative text-[#00ff41] font-mono text-base font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2">
                  <span>&gt;</span>
                  <span>💼 Jobs</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ff41] to-cyan-400 shadow-[0_0_5px_#00ff41] group-hover:w-full transition-all duration-400"></span>
                </Link>
              </li>
              <li className="group">
                <Link to="/skills" className="relative text-[#00ff41] font-mono text-base font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2">
                  <span>&gt;</span>
                  <span>🎯 Skills</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ff41] to-cyan-400 shadow-[0_0_5px_#00ff41] group-hover:w-full transition-all duration-400"></span>
                </Link>
              </li>
              <li className="group">
                <Link to="/dashboard" className="relative text-[#00ff41] font-mono text-base font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2">
                  <span>&gt;</span>
                  <span>📋 Tasks</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ff41] to-cyan-400 shadow-[0_0_5px_#00ff41] group-hover:w-full transition-all duration-400"></span>
                </Link>
              </li>
              <li className="group">
                <Link to="/chat" className="relative text-[#00ff41] font-mono text-base font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2">
                  <span>&gt;</span>
                  <span>💬 Chat</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ff41] to-cyan-400 shadow-[0_0_5px_#00ff41] group-hover:w-full transition-all duration-400"></span>
                </Link>
              </li>
              <li className="group">
                <Link to="/payment" className="relative text-[#00ff41] font-mono text-base font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2">
                  <span>&gt;</span>
                  <span>💰 Pay</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ff41] to-cyan-400 shadow-[0_0_5px_#00ff41] group-hover:w-full transition-all duration-400"></span>
                </Link>
              </li>
              <li className="group">
                <Link to="/ratings" className="relative text-[#00ff41] font-mono text-base font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2">
                  <span>&gt;</span>
                  <span>⭐ Reviews</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ff41] to-cyan-400 shadow-[0_0_5px_#00ff41] group-hover:w-full transition-all duration-400"></span>
                </Link>
              </li>
              <li className="group">
                <Link to="/shop" className="relative text-[#00ff41] font-mono text-base font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2">
                  <span>&gt;</span>
                  <span>🛍️ Shop</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ff41] to-cyan-400 shadow-[0_0_5px_#00ff41] group-hover:w-full transition-all duration-400"></span>
                </Link>
              </li>
              <li className="group">
                <Link to="/support" className="relative text-[#00ff41] font-mono text-base font-medium hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2">
                  <span>&gt;</span>
                  <span>🤖 Help</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ff41] to-cyan-400 shadow-[0_0_5px_#00ff41] group-hover:w-full transition-all duration-400"></span>
                </Link>
              </li>
            </>
          )}
          
          {/* Role-Specific Dashboards - Only show when logged in */}
          {user && (
            <>
              <li className="group">
                <Link to="/admin" className="relative text-[#00ff41] font-mono text-base font-medium hover:text-purple-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2">
                  <span>&gt;</span>
                  <span>👑 Admin</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ff41] to-purple-400 shadow-[0_0_5px_#00ff41] group-hover:w-full transition-all duration-400"></span>
                </Link>
              </li>
              <li className="group">
                <Link to="/developer-dashboard" className="relative text-[#00ff41] font-mono text-base font-medium hover:text-blue-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2">
                  <span>&gt;</span>
                  <span>👨‍💻 Dev Panel</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ff41] to-blue-400 shadow-[0_0_5px_#00ff41] group-hover:w-full transition-all duration-400"></span>
                </Link>
              </li>
              <li className="group">
                <Link to="/client-dashboard" className="relative text-[#00ff41] font-mono text-base font-medium hover:text-orange-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2">
                  <span>&gt;</span>
                  <span>💼 Client</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00ff41] to-orange-400 shadow-[0_0_5px_#00ff41] group-hover:w-full transition-all duration-400"></span>
                </Link>
              </li>
            </>
          )}
          {user ? (
            // Authenticated User Menu
            <li className="flex items-center gap-4 md:border-l-2 md:border-[#00ff41]/30 md:pl-6">
              <Link 
                to="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img 
                  src={userPhoto} 
                  alt={user.displayName} 
                  className="w-8 h-8 rounded-full border-2 border-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                />
                <span className="hidden md:inline text-[#00ff41] font-mono text-sm font-medium">{user.displayName || 'Profile'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 md:px-6 md:py-3 bg-transparent border-2 border-red-500 text-red-500 font-mono font-bold text-sm hover:bg-red-500 hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
              >
                Logout
              </button>
            </li>
          ) : (
            // Non-Authenticated User Menu
            <li>
              <Link 
                to="/auth/login"
                className="relative px-8 py-3 bg-transparent border-2 border-[#00ff41] text-[#00ff41] font-mono font-bold overflow-hidden group hover:scale-105 transition-transform duration-300 clip-path-cyber shadow-[0_0_10px_rgba(0,255,65,0.3)] hover:shadow-[0_0_20px_rgba(0,255,65,0.6)] inline-block"
              >
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">CONNECT</span>
              <span className="absolute inset-0 bg-[#00ff41] -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <div 
          className="md:hidden flex flex-col gap-1.5 cursor-pointer z-50" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`w-6 h-0.5 bg-[#00ff41] shadow-[0_0_5px_#00ff41] transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-[#00ff41] shadow-[0_0_5px_#00ff41] transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-[#00ff41] shadow-[0_0_5px_#00ff41] transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </div>
      </div>

      {/* Animated scanning line */}
      <div className="absolute bottom-0 left-0 w-full h-px overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#00ff41] to-transparent animate-[scan_3s_linear_infinite] opacity-50"></div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .clip-path-cyber {
          clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%);
        }
      `}</style>
    </nav>
  )
}

export default Navbar
