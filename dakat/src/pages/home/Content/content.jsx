import React from 'react'

const Content = ({ clientLogos, tickerPhrases, stats, steps, stacks, services }) => {
  return (
    <>
      {/* Scrolling command ribbon */}
      <div className="border-y border-[#00ff41]/30 bg-gradient-to-r from-black via-[#041004] to-black shadow-[0_0_25px_rgba(0,255,65,0.15)]">
        <div className="command-ribbon flex items-center gap-6 py-2 px-4 w-max uppercase tracking-widest" aria-label="Shadow Hire ticker">
          {[...tickerPhrases, ...tickerPhrases].map((phrase, idx) => (
            <span key={`${phrase}-${idx}`} className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[rgba(0,255,65,0.08)] border border-[rgba(0,255,65,0.25)] text-gray-200 font-mono text-sm whitespace-nowrap shadow-[0_0_18px_rgba(0,255,65,0.15)]">
              <span className="text-[#00ff41]">$</span> {phrase}
            </span>
          ))}
        </div>
      </div>

      {/* Main content section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="space-y-12">
          {/* Section 1 */}
          <section className="space-y-4">
            <h3 className="text-3xl font-bold text-[#00ff41] font-mono">Why Shadow Hire?</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Want to earn extra income without leaving your day job? Shadow Hire connects professionals like you with remote freelance opportunities. Work on your own schedule, from anywhere—your office, home, or coffee shop. Take on projects that match your skills and availability. No long-term commitments. No corporate overhead. Just you, your skills, and real clients paying real money.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Whether you're a developer, designer, marketer, or specialist looking to build a side income or transition into full-time freelancing, Shadow Hire gives you access to vetted projects and clients who value quality work and respect your time.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#001a0a] to-black border border-[#00ff41]/20 p-6 rounded-lg hover:border-[#00ff41]/50 transition-all duration-300">
                <h4 className="text-xl font-bold text-[#00ff41] mb-2 font-mono">Flexibility</h4>
                <p className="text-gray-400">Choose projects that fit your schedule. Work evenings, weekends, or whenever you want. No fixed hours. Full control over how much you earn.</p>
              </div>
              <div className="bg-gradient-to-br from-[#001a0a] to-black border border-[#00ff41]/20 p-6 rounded-lg hover:border-[#00ff41]/50 transition-all duration-300">
                <h4 className="text-xl font-bold text-[#00ff41] mb-2 font-mono">Real Income</h4>
                <p className="text-gray-400">Competitive rates. Direct payments. No middlemen taking cuts. Keep more of what you earn. Transparent pricing from day one.</p>
              </div>
              <div className="bg-gradient-to-br from-[#001a0a] to-black border border-[#00ff41]/20 p-6 rounded-lg hover:border-[#00ff41]/50 transition-all duration-300">
                <h4 className="text-xl font-bold text-[#00ff41] mb-2 font-mono">Quality Clients</h4>
                <p className="text-gray-400">Vetted projects and serious clients. No scams. Professional environment. Build your portfolio while earning on your terms.</p>
              </div>
            </div>
          </section>

          {/* How it Works for Freelancers */}
          <section className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-[#00ff41]/70 font-mono">Get Started</p>
              <h3 className="text-3xl font-bold text-white font-mono">Your Path to Extra Income</h3>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative p-6 rounded-lg border border-[#00ff41]/20 bg-gradient-to-br from-[#060606] to-black hover:border-[#00ff41]/40 transition-all">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#00ff41]/20 flex items-center justify-center">
                  <span className="text-[#00ff41] font-bold text-sm">1</span>
                </div>
                <h4 className="text-lg font-bold text-[#00ff41] mb-2 font-mono">Sign Up</h4>
                <p className="text-gray-400 text-sm">Create your profile in minutes. Showcase your skills and availability.</p>
              </div>
              
              <div className="relative p-6 rounded-lg border border-[#00ff41]/20 bg-gradient-to-br from-[#060606] to-black hover:border-[#00ff41]/40 transition-all">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#00ff41]/20 flex items-center justify-center">
                  <span className="text-[#00ff41] font-bold text-sm">2</span>
                </div>
                <h4 className="text-lg font-bold text-[#00ff41] mb-2 font-mono">Browse Projects</h4>
                <p className="text-gray-400 text-sm">Explore freelance opportunities that match your skills and schedule.</p>
              </div>
              
              <div className="relative p-6 rounded-lg border border-[#00ff41]/20 bg-gradient-to-br from-[#060606] to-black hover:border-[#00ff41]/40 transition-all">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#00ff41]/20 flex items-center justify-center">
                  <span className="text-[#00ff41] font-bold text-sm">3</span>
                </div>
                <h4 className="text-lg font-bold text-[#00ff41] mb-2 font-mono">Get Hired</h4>
                <p className="text-gray-400 text-sm">Apply for projects, get accepted, and start working immediately.</p>
              </div>
              
              <div className="relative p-6 rounded-lg border border-[#00ff41]/20 bg-gradient-to-br from-[#060606] to-black hover:border-[#00ff41]/40 transition-all">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#00ff41]/20 flex items-center justify-center">
                  <span className="text-[#00ff41] font-bold text-sm">4</span>
                </div>
                <h4 className="text-lg font-bold text-[#00ff41] mb-2 font-mono">Get Paid</h4>
                <p className="text-gray-400 text-sm">Complete work, get instant payments. Transparent rates, no hidden fees.</p>
              </div>
            </div>
          </section>

          {/* Why Choose Shadow Hire */}
          <section className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-[#00ff41]/70 font-mono">The Difference</p>
              <h3 className="text-3xl font-bold text-white font-mono">Work Without Compromise</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4 p-6 rounded-lg border border-[#00ff41]/20 bg-gradient-to-br from-[#060606] to-black hover:border-[#00ff41]/40 transition-all">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#00ff41]/20 text-[#00ff41]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1 font-mono">Keep Your Day Job</h4>
                  <p className="text-gray-400 text-sm">Earn extra without commitment. Work when it suits you—evenings, weekends, or lunch breaks.</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-lg border border-[#00ff41]/20 bg-gradient-to-br from-[#060606] to-black hover:border-[#00ff41]/40 transition-all">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#00ff41]/20 text-[#00ff41]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1 font-mono">Grow Your Skills</h4>
                  <p className="text-gray-400 text-sm">Work on diverse projects. Build your portfolio. Transition to full-time freelancing when ready.</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-lg border border-[#00ff41]/20 bg-gradient-to-br from-[#060606] to-black hover:border-[#00ff41]/40 transition-all">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#00ff41]/20 text-[#00ff41]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1 font-mono">Work from Anywhere</h4>
                  <p className="text-gray-400 text-sm">Remote only. Your office, home, cafe—complete projects from anywhere in the world.</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-lg border border-[#00ff41]/20 bg-gradient-to-br from-[#060606] to-black hover:border-[#00ff41]/40 transition-all">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#00ff41]/20 text-[#00ff41]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1 font-mono">Transparent Earnings</h4>
                  <p className="text-gray-400 text-sm">Know exactly what you'll earn before accepting. Direct payments. No hidden fees or middlemen.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Client logo marquee */}
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-widest text-[#00ff41]/70 font-mono">Trusted Network</p>
                <h3 className="text-3xl font-bold text-white font-mono">Teams we power</h3>
              </div>
              <span className="text-xs text-gray-500 font-mono bg-[#001a0a] border border-[#00ff41]/20 px-3 py-1 rounded-full">Live feed</span>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-[#00ff41]/20 bg-gradient-to-br from-[#050505] via-black to-[#050505] p-4 shadow-[0_0_30px_rgba(0,255,65,0.15)]">
              {/* Edge fades */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />

              <div className="logo-marquee flex items-center gap-10 w-max" aria-label="Client logos scroller">
                {[...clientLogos, ...clientLogos].map((client, idx) => (
                  <div
                    key={`${client.name}-${idx}`}
                    className="flex items-center justify-center h-16 w-32 md:w-40 bg-white/5 border border-white/5 rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,65,0.08)] hover:border-[#00ff41]/30 transition-all"
                  >
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      className="max-h-10 max-w-[120px] object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Proof in numbers */}
          <section className="grid md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="relative overflow-hidden p-5 border border-[#00ff41]/25 rounded-lg bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-black">
                <div className="absolute inset-[-40%] bg-radial-gradient pointer-events-none" style={{background: 'radial-gradient(circle at 30% 30%, rgba(0, 255, 65, 0.08), transparent 55%)', filter: 'blur(18px)', opacity: 0.8}}></div>
                <div className="relative">
                  <p className="text-sm uppercase tracking-widest text-[#00ff41]/70 font-mono">{stat.label}</p>
                  <p className="text-3xl font-bold text-white font-mono mt-2">{stat.value}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Our services */}
          <section className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#00ff41]/70 font-mono">Our services</p>
                <h3 className="text-3xl font-bold text-white font-mono">What we deploy</h3>
              </div>
              <span className="text-xs text-gray-400 font-mono">Modular pods. Zero drag.</span>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {services.map((service) => (
                <div key={service.title} className="relative overflow-hidden h-full p-6 rounded-xl border border-[#00ff41]/25 bg-gradient-to-br from-[#060606] via-[#0a0f0a] to-[#040404] hover:border-[#00ff41]/40 transition-colors">
                  <div className="absolute inset-[-40%] pointer-events-none" style={{background: 'radial-gradient(circle at 30% 30%, rgba(0, 255, 65, 0.08), transparent 55%)', filter: 'blur(18px)', opacity: 0.8}}></div>
                  <div className="relative space-y-3">
                    <h4 className="text-xl font-bold text-white font-mono">{service.title}</h4>
                    <p className="text-gray-400 leading-relaxed">{service.detail}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {service.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-3 py-1 rounded text-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(0,255,65,0.18)] text-gray-200 font-mono backdrop-blur">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#00ff41]/70 font-mono">Playbook</p>
                <h3 className="text-3xl font-bold text-white font-mono">How Shadow Hire works</h3>
              </div>
              <span className="text-xs text-gray-400 font-mono">Ops-first, zero fluff.</span>
            </div>

            <div className="relative grid gap-6 lg:grid-cols-2">
              {steps.map((step, idx) => (
                <div key={step.title} className="relative p-6 rounded-xl border border-[#00ff41]/20 bg-gradient-to-br from-[#060606] via-[#0a0f0a] to-[#040404] hover:border-[#00ff41]/40 transition-colors">
                  <div className="absolute inset-y-0 left-4 w-px bg-gradient-to-b from-[#00ff41]/0 via-[#00ff41]/60 to-[#00ff41]/0" />
                  <div className="relative flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#00ff41] to-[#0df0a0] text-black font-bold font-mono shadow-[0_0_20px_rgba(0,255,65,0.35)] flex-shrink-0">{idx + 1}</div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold text-white font-mono">{step.title}</h4>
                      <p className="text-gray-400">{step.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stack coverage */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)] text-[#00ff41] text-xs font-mono font-bold uppercase tracking-widest">Stacks</span>
              <p className="text-gray-300">Full-spectrum operators across modern product, data, and infra.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {stacks.map((stack) => (
                <span key={stack} className="inline-flex items-center px-3 py-1 rounded text-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(0,255,65,0.18)] text-gray-200 font-mono backdrop-blur">{stack}</span>
              ))}
            </div>
          </section>

          {/* Become our client */}
          <section className="space-y-6">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-[0.35em] text-[#00ff41]/70 font-mono">Become our client</p>
                <h3 className="text-3xl font-bold text-white font-mono">Build with a shadow pod</h3>
                <p className="text-gray-400 max-w-3xl">Tell us the mission, stack, and risk posture. We spin up a secure pod, wire observability, and ship without slowing your roadmap.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono bg-[#001a0a] border border-[#00ff41]/25 px-3 py-1 rounded-full">24/7 coverage · Security-first · Pod or IC</div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="relative overflow-hidden p-6 rounded-xl border border-[#00ff41]/25 bg-gradient-to-br from-[#050505] via-[#080b07] to-[#020202]">
                <div className="absolute inset-[-40%] pointer-events-none" style={{background: 'radial-gradient(circle at 30% 30%, rgba(0, 255, 65, 0.08), transparent 55%)', filter: 'blur(18px)', opacity: 0.8}}></div>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)] text-[#00ff41] text-xs font-mono font-bold uppercase tracking-widest">Dev hiring</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)] text-[#00ff41] text-xs font-mono font-bold uppercase tracking-widest">Ops-ready</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)] text-[#00ff41] text-xs font-mono font-bold uppercase tracking-widest">Security cleared</span>
                  </div>
                  <ul className="flex flex-col gap-3 text-gray-200 font-mono text-sm">
                    <li className="flex gap-2"><span className="text-[#00ff41] font-bold flex-shrink-0">▪</span><span>Founder-speed kickoff: scope to staffed pod in 48 hours.</span></li>
                    <li className="flex gap-2"><span className="text-[#00ff41] font-bold flex-shrink-0">▪</span><span>Senior-only ICs: leads, staff, and principal-level builders.</span></li>
                    <li className="flex gap-2"><span className="text-[#00ff41] font-bold flex-shrink-0">▪</span><span>Red/blue cover: appsec, SRE, and incident playbooks on day one.</span></li>
                    <li className="flex gap-2"><span className="text-[#00ff41] font-bold flex-shrink-0">▪</span><span>Transparent velocity: daily burn, risk, and release notes.</span></li>
                    <li className="flex gap-2"><span className="text-[#00ff41] font-bold flex-shrink-0">▪</span><span>Exit-friendly: unwind clean with zero lock-in and handover docs.</span></li>
                  </ul>
                </div>
              </div>

              <div className="relative overflow-hidden p-6 rounded-xl border border-[#00ff41]/25 bg-gradient-to-br from-[#060606] via-[#0c120c] to-[#020202]">
                <div className="absolute inset-[-40%] pointer-events-none" style={{background: 'radial-gradient(circle at 30% 30%, rgba(0, 255, 65, 0.08), transparent 55%)', filter: 'blur(18px)', opacity: 0.8}}></div>
                <div className="relative space-y-3">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-[#00ff41]/70 font-mono">Start the intake</p>
                    <p className="text-gray-300">Share the essentials; we respond with a pod plan in one business day.</p>
                  </div>
                  <div className="space-y-2">
                    <input className="w-full px-4 py-2 rounded text-sm border border-[rgba(0,255,65,0.2)] bg-[rgba(0,255,65,0.05)] text-gray-200 font-mono placeholder-gray-400 backdrop-blur transition-all focus:outline-none focus:border-[rgba(0,255,65,0.5)] focus:bg-[rgba(0,255,65,0.08)] focus:shadow-[0_0_15px_rgba(0,255,65,0.15)]" placeholder="Work email" />
                    <input className="w-full px-4 py-2 rounded text-sm border border-[rgba(0,255,65,0.2)] bg-[rgba(0,255,65,0.05)] text-gray-200 font-mono placeholder-gray-400 backdrop-blur transition-all focus:outline-none focus:border-[rgba(0,255,65,0.5)] focus:bg-[rgba(0,255,65,0.08)] focus:shadow-[0_0_15px_rgba(0,255,65,0.15)]" placeholder="What do you need to ship?" />
                    <input className="w-full px-4 py-2 rounded text-sm border border-[rgba(0,255,65,0.2)] bg-[rgba(0,255,65,0.05)] text-gray-200 font-mono placeholder-gray-400 backdrop-blur transition-all focus:outline-none focus:border-[rgba(0,255,65,0.5)] focus:bg-[rgba(0,255,65,0.08)] focus:shadow-[0_0_15px_rgba(0,255,65,0.15)]" placeholder="Tech stack & timeline" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="inline-flex justify-center items-center px-4 py-2 rounded bg-gradient-to-r from-[#00ff41] to-[#0df0a0] text-black font-bold font-mono border border-[rgba(0,255,65,0.35)] shadow-[0_10px_25px_rgba(0,255,65,0.25),0_0_15px_rgba(0,255,65,0.2)] transition-all hover:shadow-[0_12px_28px_rgba(0,255,65,0.3),0_0_18px_rgba(0,255,65,0.25)] hover:scale-105 active:scale-95">Request a pod</button>
                    <button className="inline-flex justify-center items-center px-4 py-2 rounded border-2 border-dashed border-[rgba(0,255,65,0.35)] text-gray-300 font-mono bg-[rgba(0,255,65,0.05)] transition-all hover:border-[rgba(0,255,65,0.6)] hover:text-[#00ff41] hover:bg-[rgba(0,255,65,0.08)] hover:shadow-[0_8px_20px_rgba(0,255,65,0.15)]">Talk to an architect</button>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">Private intake. Mutual NDA available.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="grid gap-5 p-6 rounded-lg border border-[#00ff41]/25 bg-gradient-to-br from-[rgba(0,255,65,0.08)] to-[rgba(0,0,0,0.8)] shadow-[0_0_30px_rgba(0,255,65,0.18)] md:grid-cols-3 md:items-center">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-widest text-[#00ff41]/70 font-mono">Launch a shadow pod</p>
              <h3 className="text-3xl md:text-4xl font-bold text-white font-mono">Ready for your next ship window?</h3>
              <p className="text-gray-300 max-w-3xl">Drop your mission spec. We assemble, secure, and deploy a pod that moves at founder speed and enterprise rigor.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:col-span-2">
              <button className="inline-flex justify-center items-center px-4 py-2 rounded bg-gradient-to-r from-[#00ff41] to-[#0df0a0] text-black font-bold font-mono border border-[rgba(0,255,65,0.35)] shadow-[0_10px_25px_rgba(0,255,65,0.25),0_0_15px_rgba(0,255,65,0.2)] transition-all hover:shadow-[0_12px_28px_rgba(0,255,65,0.3),0_0_18px_rgba(0,255,65,0.25)] hover:scale-105 active:scale-95">Start in 48 hours</button>
              <button className="inline-flex justify-center items-center px-4 py-2 rounded border-2 border-dashed border-[rgba(0,255,65,0.35)] text-gray-300 font-mono bg-[rgba(0,255,65,0.05)] transition-all hover:border-[rgba(0,255,65,0.6)] hover:text-[#00ff41] hover:bg-[rgba(0,255,65,0.08)] hover:shadow-[0_8px_20px_rgba(0,255,65,0.15)]">See security posture</button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Content
