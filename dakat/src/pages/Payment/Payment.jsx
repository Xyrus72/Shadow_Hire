import React, { useState } from 'react'

const Payment = () => {
  const [activeTab, setActiveTab] = useState('earnings')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank')

  const earnings = [
    { id: 1, projectName: 'React Dashboard Dev', amount: 500, date: '2024-12-20', status: 'completed', client: 'Tech Startup' },
    { id: 2, projectName: 'UI Mockups', amount: 300, date: '2024-12-15', status: 'completed', client: 'Creative Agency' },
    { id: 3, projectName: 'API Development', amount: 800, date: '2024-12-10', status: 'pending', client: 'E-commerce Co' },
    { id: 4, projectName: 'Content Writing', amount: 150, date: '2024-12-05', status: 'completed', client: 'Marketing Co' }
  ]

  const upcomingPayments = [
    { id: 1, projectName: 'Dashboard - Phase 2', amount: 400, dueDate: '2025-01-05', milestone: 'Design Approval', status: 'in-progress' },
    { id: 2, projectName: 'Video Editing Package', amount: 250, dueDate: '2025-01-08', milestone: 'Final Delivery', status: 'in-progress' },
    { id: 3, projectName: 'Mobile App Dev', amount: 1200, dueDate: '2025-01-15', milestone: 'Beta Release', status: 'not-started' }
  ]

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0)
  const pendingAmount = earnings.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0)
  const upcomingAmount = upcomingPayments.reduce((sum, p) => sum + p.amount, 0)

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500/20 text-green-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'in-progress': return 'bg-blue-500/20 text-blue-400'
      case 'not-started': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white font-mono mb-4">
            <span className="text-[#00ff41]">💰</span> Payments & Earnings
          </h1>
          <p className="text-gray-400 font-mono">Track your income and manage payments securely</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-mono mb-2">TOTAL EARNINGS</p>
            <p className="text-4xl font-bold text-[#00ff41] font-mono mb-2">${totalEarnings}</p>
            <p className="text-xs text-gray-500 font-mono">All time</p>
          </div>

          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-yellow-500/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-mono mb-2">PENDING PAYMENT</p>
            <p className="text-4xl font-bold text-yellow-400 font-mono mb-2">${pendingAmount}</p>
            <p className="text-xs text-yellow-500/70 font-mono">Awaiting approval</p>
          </div>

          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-blue-500/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-mono mb-2">UPCOMING</p>
            <p className="text-4xl font-bold text-blue-400 font-mono mb-2">${upcomingAmount}</p>
            <p className="text-xs text-blue-500/70 font-mono">Next 30 days</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#00ff41]/20">
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-6 py-3 font-mono font-bold transition-all ${
              activeTab === 'earnings'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Earnings History
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 font-mono font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Upcoming Payments
          </button>
          <button
            onClick={() => setActiveTab('payout')}
            className={`px-6 py-3 font-mono font-bold transition-all ${
              activeTab === 'payout'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Payout Methods
          </button>
        </div>

        {/* Content */}
        {activeTab === 'earnings' && (
          <div className="space-y-4">
            {earnings.map((earning) => (
              <div key={earning.id} className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl p-6 hover:border-[#00ff41]/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-mono font-bold mb-2">{earning.projectName}</h3>
                    <div className="flex items-center gap-4">
                      <p className="text-gray-400 text-sm font-mono">{earning.client}</p>
                      <p className="text-gray-500 text-sm font-mono">{new Date(earning.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#00ff41] font-mono mb-2">${earning.amount}</p>
                    <span className={`text-xs font-mono px-3 py-1 rounded ${getStatusColor(earning.status)}`}>
                      {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                    </span>
                  </div>
                </div>

                {earning.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t border-[#00ff41]/20 flex gap-4">
                    <button className="px-4 py-2 bg-[#00ff41] text-black font-mono font-bold rounded-lg hover:bg-[#0df0a0] transition-all text-sm">
                      Release Funds
                    </button>
                    <button className="px-4 py-2 border border-[#00ff41] text-[#00ff41] font-mono font-bold rounded-lg hover:bg-[#00ff41]/10 transition-all text-sm">
                      Request Extension
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingPayments.map((payment) => (
              <div key={payment.id} className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-white font-mono font-bold mb-2">{payment.projectName}</h3>
                    <p className="text-gray-400 text-sm font-mono">Milestone: {payment.milestone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-400 font-mono">${payment.amount}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-mono px-3 py-1 rounded ${getStatusColor(payment.status)}`}>
                      {payment.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                    <p className="text-gray-500 text-sm font-mono">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-32 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${
                      payment.status === 'in-progress' ? 'bg-blue-400 w-1/2' : 'bg-gray-600 w-0'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'payout' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white font-mono mb-8">Add Payout Method</h2>

              <div className="space-y-6">
                {/* Method Selection */}
                <div>
                  <p className="text-white font-mono font-bold mb-4">Select Payment Method</p>
                  <div className="space-y-3">
                    {[
                      { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
                      { id: 'upi', label: 'UPI/Mobile Payment', icon: '📱' },
                      { id: 'wallet', label: 'Digital Wallet', icon: '💳' },
                      { id: 'crypto', label: 'Cryptocurrency', icon: '₿' }
                    ].map((method) => (
                      <label key={method.id} className="flex items-center p-4 border border-[#00ff41]/20 rounded-lg hover:border-[#00ff41]/50 cursor-pointer transition-all">
                        <input
                          type="radio"
                          name="payment-method"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="w-4 h-4 accent-[#00ff41]"
                        />
                        <span className="ml-4 text-2xl">{method.icon}</span>
                        <span className="ml-4 text-white font-mono font-bold">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Form */}
                {selectedPaymentMethod === 'bank' && (
                  <div className="space-y-4 pt-6 border-t border-[#00ff41]/20">
                    <input
                      type="text"
                      placeholder="Account Holder Name"
                      className="w-full bg-[#1a1a1a] border border-[#00ff41]/30 rounded-lg px-4 py-3 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#00ff41]"
                    />
                    <input
                      type="text"
                      placeholder="Account Number"
                      className="w-full bg-[#1a1a1a] border border-[#00ff41]/30 rounded-lg px-4 py-3 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#00ff41]"
                    />
                    <input
                      type="text"
                      placeholder="IFSC Code"
                      className="w-full bg-[#1a1a1a] border border-[#00ff41]/30 rounded-lg px-4 py-3 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#00ff41]"
                    />
                  </div>
                )}

                {selectedPaymentMethod === 'upi' && (
                  <div className="space-y-4 pt-6 border-t border-[#00ff41]/20">
                    <input
                      type="text"
                      placeholder="UPI ID (e.g., name@bankname)"
                      className="w-full bg-[#1a1a1a] border border-[#00ff41]/30 rounded-lg px-4 py-3 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#00ff41]"
                    />
                  </div>
                )}

                {selectedPaymentMethod === 'crypto' && (
                  <div className="space-y-4 pt-6 border-t border-[#00ff41]/20">
                    <input
                      type="text"
                      placeholder="Wallet Address"
                      className="w-full bg-[#1a1a1a] border border-[#00ff41]/30 rounded-lg px-4 py-3 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#00ff41]"
                    />
                    <select className="w-full bg-[#1a1a1a] border border-[#00ff41]/30 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-[#00ff41]">
                      <option>Select Cryptocurrency</option>
                      <option>Bitcoin</option>
                      <option>Ethereum</option>
                      <option>USDT</option>
                      <option>USDC</option>
                    </select>
                  </div>
                )}

                <button className="w-full mt-6 px-6 py-3 bg-[#00ff41] text-black font-mono font-bold rounded-lg hover:bg-[#0df0a0] transition-all">
                  Add Payment Method
                </button>
              </div>

              {/* Security Info */}
              <div className="mt-8 p-4 bg-[#00ff41]/5 border border-[#00ff41]/20 rounded-lg">
                <p className="text-[#00ff41] font-mono text-sm">
                  🔒 Your payment information is encrypted and secure. We never store full account details.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payment
