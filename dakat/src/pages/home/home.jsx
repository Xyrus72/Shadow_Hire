import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Banner from './Banner/banner'
import Content from './Content/content'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const clientLogos = [
    {
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    },
    {
      name: 'Apple',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    },
    {
      name: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    },
    {
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    },
    {
      name: 'Netflix',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    },
    {
      name: 'Stripe',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Stripe_Logo%2C_revised_2016.svg',
    },
    {
      name: 'Slack',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png',
    },
  ]

  const tickerPhrases = [
    'Deploy in hours, not weeks.',
    'Encrypted collab. Zero noise.',
    'Shadow teams. Elite output.',
    '24/7 rotation. No downtime.',
    'Red-team rigor. Blue-team calm.',
    'Stealth pipelines. Loud results.',
    'Humans + automation = unfair edge.',
  ]

  const stats = [
    { label: 'Avg kickoff', value: '48h' },
    { label: 'Security score', value: 'A+' },
    { label: 'Deploy frequency', value: '11x / wk' },
    { label: 'Retention', value: '94%' },
  ]

  const steps = [
    {
      title: 'Signal in',
      detail: 'Drop mission scope, stack, and risk posture. No sales calls.',
    },
    {
      title: 'Assemble quietly',
      detail: 'We spin a vetted shadow pod with NDAs, opsec, and on-call ready.',
    },
    {
      title: 'Ship & rotate',
      detail: '24/7 handoffs, observability wired, velocity dashboards live.',
    },
    {
      title: 'Scale or vanish',
      detail: 'Scale headcount or wind down with zero vendor lock.',
    },
  ]

  const stacks = ['TypeScript', 'Go', 'Rust', 'Python', 'Kubernetes', 'PostgreSQL', 'Next.js', 'AWS', 'GCP', 'Azure', 'Terraform', 'Snowflake']

  const services = [
    {
      title: 'Shadow pods',
      detail: 'Cross-functional squads that ship features, harden infra, and keep pager duty covered 24/7.',
      tags: ['Pods', 'On-call', 'Delivery'],
    },
    {
      title: 'Stealth staff aug',
      detail: 'Senior ICs and leads embedded into your stack with NDAs, security posture, and zero overhead.',
      tags: ['ICs', 'Tech leads', 'Security cleared'],
    },
    {
      title: 'Red/blue readiness',
      detail: 'Offensive and defensive operators to pen test, monitor, and harden your most sensitive paths.',
      tags: ['AppSec', 'SOC', 'Pen test'],
    },
  ]

  return (
    <div className="bg-black min-h-screen">
      <Banner />
      
      {/* Premium Features Section - Only visible when logged in */}
      {user && (
        <section className="relative py-16 border-t border-b border-[#00ff41]/30">
          <div className="absolute inset-0 bg-gradient-to-r from-[#001a0a]/20 via-transparent to-[#001a0a]/20"></div>
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-mono font-bold text-[#00ff41] mb-2">
                Welcome back, {user.displayName}!
              </h2>
              <p className="text-gray-400">Access your workspace and start working</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Jobs */}
              <button
                onClick={() => navigate('/jobs')}
                className="group relative p-6 rounded-lg border border-[#00ff41]/30 bg-black/50 hover:bg-black/80 hover:border-[#00ff41]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] text-left"
              >
                <div className="text-3xl mb-3">💼</div>
                <h3 className="font-mono font-bold text-[#00ff41] mb-2">Jobs</h3>
                <p className="text-sm text-gray-400">Find projects and apply</p>
              </button>

              {/* Tasks */}
              <button
                onClick={() => navigate('/dashboard')}
                className="group relative p-6 rounded-lg border border-[#00ff41]/30 bg-black/50 hover:bg-black/80 hover:border-[#00ff41]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] text-left"
              >
                <div className="text-3xl mb-3">📋</div>
                <h3 className="font-mono font-bold text-[#00ff41] mb-2">Tasks</h3>
                <p className="text-sm text-gray-400">Track milestones and progress</p>
              </button>

              {/* Chat */}
              <button
                onClick={() => navigate('/chat')}
                className="group relative p-6 rounded-lg border border-[#00ff41]/30 bg-black/50 hover:bg-black/80 hover:border-[#00ff41]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] text-left"
              >
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-mono font-bold text-[#00ff41] mb-2">Chat</h3>
                <p className="text-sm text-gray-400">Message your team securely</p>
              </button>

              {/* Payment */}
              <button
                onClick={() => navigate('/payment')}
                className="group relative p-6 rounded-lg border border-[#00ff41]/30 bg-black/50 hover:bg-black/80 hover:border-[#00ff41]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] text-left"
              >
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-mono font-bold text-[#00ff41] mb-2">Payment</h3>
                <p className="text-sm text-gray-400">Manage earnings and escrow</p>
              </button>

              {/* Reviews */}
              <button
                onClick={() => navigate('/ratings')}
                className="group relative p-6 rounded-lg border border-[#00ff41]/30 bg-black/50 hover:bg-black/80 hover:border-[#00ff41]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] text-left"
              >
                <div className="text-3xl mb-3">⭐</div>
                <h3 className="font-mono font-bold text-[#00ff41] mb-2">Reviews</h3>
                <p className="text-sm text-gray-400">Build your reputation</p>
              </button>

              {/* Shop */}
              <button
                onClick={() => navigate('/shop')}
                className="group relative p-6 rounded-lg border border-[#00ff41]/30 bg-black/50 hover:bg-black/80 hover:border-[#00ff41]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] text-left"
              >
                <div className="text-3xl mb-3">🛍️</div>
                <h3 className="font-mono font-bold text-[#00ff41] mb-2">Shop</h3>
                <p className="text-sm text-gray-400">Browse tech discounts</p>
              </button>

              {/* Help */}
              <button
                onClick={() => navigate('/support')}
                className="group relative p-6 rounded-lg border border-[#00ff41]/30 bg-black/50 hover:bg-black/80 hover:border-[#00ff41]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] text-left"
              >
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="font-mono font-bold text-[#00ff41] mb-2">Help</h3>
                <p className="text-sm text-gray-400">AI support 24/7</p>
              </button>

              {/* Profile */}
              <button
                onClick={() => navigate('/profile')}
                className="group relative p-6 rounded-lg border border-[#00ff41]/30 bg-black/50 hover:bg-black/80 hover:border-[#00ff41]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] text-left"
              >
                <div className="text-3xl mb-3">👤</div>
                <h3 className="font-mono font-bold text-[#00ff41] mb-2">Profile</h3>
                <p className="text-sm text-gray-400">Update your settings</p>
              </button>
            </div>
          </div>
        </section>
      )}
      
      <Content 
        clientLogos={clientLogos}
        tickerPhrases={tickerPhrases}
        stats={stats}
        steps={steps}
        stacks={stacks}
        services={services}
      />

      {/* About Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#020805] to-black"></div>
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,255,65,0.15) 0%, transparent 50%)'}}></div>
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(0,255,65,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Glowing orb behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00ff41]/5 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Section label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,255,65,0.08)] border border-[rgba(0,255,65,0.25)] mb-8">
            <span className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"></span>
            <span className="text-xs uppercase tracking-[0.3em] text-[#00ff41] font-mono font-bold">About Us</span>
          </div>

          {/* Main heading */}
          <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-bold font-mono mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff41] via-[#0df0a0] to-[#00ff41] drop-shadow-[0_0_30px_rgba(0,255,65,0.5)]">
              Shadow Hire
            </span>
          </h2>

          {/* Description */}
          <p className="relative text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8 font-mono">
            Connects <span className="text-[#00ff41] font-bold">elite developers</span> with 
            <span className="text-white font-bold"> high-impact projects</span>.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {['Secure', 'Stealthy', 'Always On'].map((feature, idx) => (
              <div 
                key={feature}
                className="group relative px-6 py-3 rounded-lg border border-[#00ff41]/30 bg-gradient-to-br from-[#001a0a] to-black hover:border-[#00ff41]/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,65,0.2)] hover:scale-105"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00ff41]/0 via-[#00ff41]/5 to-[#00ff41]/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center gap-2 text-gray-200 font-mono font-bold">
                  <span className="text-[#00ff41]">{['🔒', '👻', '⚡'][idx]}</span>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Terminal-style quote */}
          <div className="relative inline-block px-8 py-4 rounded-lg border border-[#00ff41]/20 bg-black/50 backdrop-blur-sm">
            <div className="absolute top-2 left-4 flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70"></span>
            </div>
            <p className="text-sm text-gray-400 font-mono mt-4">
              <span className="text-[#00ff41]">$</span> echo "Where talent meets opportunity in the digital underground"
            </p>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-[#00ff41]/20"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-[#00ff41]/20"></div>
      </section>
    </div>
  )
}

export default Home
