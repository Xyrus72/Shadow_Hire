import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-black/95 border-t-2 border-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.3)] mt-20">
      {/* Top scanning line effect */}
      <div className="relative w-full h-px overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#00ff41] to-transparent animate-[scan_3s_linear_infinite] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              {/* Omen-Inspired Phantom */}
              <div className="relative w-14 h-14">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-[0_0_20px_rgba(0,255,65,0.8)] group-hover:drop-shadow-[0_0_30px_rgba(0,255,65,1)] transition-all duration-500">
                  <defs>
                    <linearGradient id="omenCloakF" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#001a0a" stopOpacity="0.9"/>
                      <stop offset="50%" stopColor="#003311" stopOpacity="0.95"/>
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.98"/>
                    </linearGradient>
                    <radialGradient id="omenGlowF" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00ff41" stopOpacity="1"/>
                      <stop offset="50%" stopColor="#00ff41" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#00ff41" stopOpacity="0"/>
                    </radialGradient>
                    <filter id="smokeBlurF">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
                    </filter>
                  </defs>
                  <circle cx="30" cy="92" r="3" fill="#00ff41" opacity="0.2" filter="url(#smokeBlurF)" className="animate-pulse"/>
                  <circle cx="70" cy="95" r="2.5" fill="#00ff41" opacity="0.15" filter="url(#smokeBlurF)" className="animate-pulse"/>
                  <path d="M50 5 Q30 8 22 25 L18 40 Q16 50 18 60 L22 75 Q28 82 38 85 L50 88 L62 85 Q72 82 78 75 L82 60 Q84 50 82 40 L78 25 Q70 8 50 5 Z" fill="url(#omenCloakF)" stroke="#003311" strokeWidth="1.5" opacity="0.95"/>
                  <ellipse cx="50" cy="40" rx="25" ry="30" fill="#000000" opacity="1"/>
                  <circle cx="42" cy="38" r="4" fill="url(#omenGlowF)" className="animate-pulse"/>
                  <circle cx="58" cy="38" r="4" fill="url(#omenGlowF)" className="animate-pulse"/>
                  <ellipse cx="42" cy="38" rx="6" ry="8" fill="#00ff41" opacity="0.3" className="animate-pulse"/>
                  <ellipse cx="58" cy="38" rx="6" ry="8" fill="#00ff41" opacity="0.3" className="animate-pulse"/>
                  <path d="M50 15 Q50 10 50 5 Q50 2 50 0" stroke="#00ff41" strokeWidth="1.2" opacity="0.25" strokeLinecap="round" filter="url(#smokeBlurF)" className="animate-pulse"/>
                </svg>
                <div className="absolute inset-0 rounded-full opacity-15 blur-xl animate-pulse" style={{background: 'radial-gradient(circle, rgba(0,255,65,0.4) 0%, transparent 70%)'}}></div>
              </div>
              <h3 className="text-2xl font-bold text-[#00ff41] font-mono animate-pulse">
                SHADOW HIRE
              </h3>
            </div>
            <p className="text-gray-400 font-mono text-sm">
              Connect with top freelancers in the digital underground. Where talent meets opportunity.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[#00ff41] hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_10px_rgba(0,255,65,0.5)]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-[#00ff41] hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_10px_rgba(0,255,65,0.5)]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-[#00ff41] hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_10px_rgba(0,255,65,0.5)]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#00ff41] font-mono font-bold mb-4 text-lg flex items-center gap-2">
              <span>&gt;</span>
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2">
              {['Browse Jobs', 'Find Talent', 'How It Works', 'Pricing'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-[#00ff41] font-mono text-sm transition-all duration-300 hover:translate-x-2 inline-block hover:shadow-[0_0_5px_rgba(0,255,65,0.3)]">
                    → {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[#00ff41] font-mono font-bold mb-4 text-lg flex items-center gap-2">
              <span>&gt;</span>
              <span>Resources</span>
            </h4>
            <ul className="space-y-2">
              {['Documentation', 'API Access', 'Support', 'Community'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-[#00ff41] font-mono text-sm transition-all duration-300 hover:translate-x-2 inline-block hover:shadow-[0_0_5px_rgba(0,255,65,0.3)]">
                    → {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[#00ff41] font-mono font-bold mb-4 text-lg flex items-center gap-2">
              <span>&gt;</span>
              <span>Stay Connected</span>
            </h4>
            <p className="text-gray-400 font-mono text-sm mb-4">
              Subscribe for updates and exclusive opportunities.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="your@email.com"
                className="flex-1 bg-black border border-[#00ff41] text-[#00ff41] font-mono text-sm px-3 py-2 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.5)] transition-all"
              />
              <button className="bg-[#00ff41] text-black font-mono font-bold px-4 py-2 hover:bg-cyan-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,65,0.7)] hover:scale-105">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#00ff41]/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 font-mono text-sm">
            © 2025 <span className="text-[#00ff41]">SHADOW HIRE</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-mono">
            <a href="#" className="text-gray-400 hover:text-[#00ff41] transition-all duration-300">
              Privacy Policy
            </a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-gray-400 hover:text-[#00ff41] transition-all duration-300">
              Terms of Service
            </a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-gray-400 hover:text-[#00ff41] transition-all duration-300">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>

      {/* Glowing line animation at bottom */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#00ff41] to-transparent opacity-50 animate-pulse"></div>

      <style jsx="true">{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </footer>
  )
}

export default Footer