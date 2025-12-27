import React, { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'

const Payment = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('earnings')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [earnings, setEarnings] = useState([])
  const [payments, setPayments] = useState([])
  const [profile, setProfile] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchPaymentData()
  }, [user])

  const fetchPaymentData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const shadowUser = JSON.parse(localStorage.getItem('shadowUser') || '{}')
      const userId = shadowUser.id

      if (!userId || !token) {
        setMessage('Authentication required')
        return
      }

      // Fetch user profile for total earnings
      const profileRes = await fetch('http://localhost:5000/api/users/profile', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (profileRes.ok) {
        const data = await profileRes.json()
        setProfile(data)
      }

      // Fetch freelancer earnings
      const earningsRes = await fetch('http://localhost:5000/api/payments/earnings', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (earningsRes.ok) {
        const data = await earningsRes.json()
        setEarnings(data.payments || [])
      }

      // Fetch all payments for this user
      const paymentsRes = await fetch(`http://localhost:5000/api/payments?userId=${userId}&role=freelancer`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (paymentsRes.ok) {
        const data = await paymentsRes.json()
        setPayments(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Error fetching payment data:', err)
      setMessage('Error loading payment data')
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setMessage('❌ Please enter a valid amount')
      return
    }

    if (parseFloat(withdrawAmount) > (profile?.totalEarnings || 0)) {
      setMessage('❌ Insufficient earnings')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:5000/api/payments/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          paymentMethod: selectedPaymentMethod
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessage('✅ Withdrawal processed successfully!')
        setWithdrawAmount('')
        setTimeout(() => {
          fetchPaymentData()
          setMessage('')
        }, 2000)
      } else {
        setMessage('❌ ' + (data.error || 'Withdrawal failed'))
      }
    } catch (err) {
      console.error('Error withdrawing:', err)
      setMessage('❌ Error processing withdrawal')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'released': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'escrow': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'refunded': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const releasedEarnings = earnings.filter(e => e.status === 'released').reduce((sum, e) => sum + e.amount, 0)
  const escrowEarnings = payments.filter(p => p.status === 'escrow').reduce((sum, p) => sum + p.amount, 0)
  const totalEarnings = profile?.totalEarnings || 0
  const availableForWithdraw = totalEarnings

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white font-mono mb-4">
            <span className="text-[#00ff41]">💰</span> Payments & Earnings
          </h1>
          <p className="text-gray-400 font-mono">Track your income and manage withdrawals</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className="mb-6 p-4 bg-[#00ff41]/10 border border-[#00ff41]/50 rounded-lg text-[#00ff41] font-mono text-sm">
            {message}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-mono mb-2">💸 TOTAL EARNINGS</p>
            <p className="text-4xl font-bold text-[#00ff41] font-mono mb-2">${totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-gray-500 font-mono">All time</p>
          </div>

          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-yellow-500/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-mono mb-2">⏳ IN ESCROW</p>
            <p className="text-4xl font-bold text-yellow-400 font-mono mb-2">${escrowEarnings.toLocaleString()}</p>
            <p className="text-xs text-yellow-500/70 font-mono">Awaiting client release</p>
          </div>

          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-green-500/30 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-mono mb-2">✅ AVAILABLE</p>
            <p className="text-4xl font-bold text-green-400 font-mono mb-2">${availableForWithdraw.toLocaleString()}</p>
            <p className="text-xs text-green-500/70 font-mono">Ready to withdraw</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#00ff41]/20 overflow-x-auto">
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-6 py-3 font-mono font-bold transition-all whitespace-nowrap ${
              activeTab === 'earnings'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Released Earnings
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-mono font-bold transition-all whitespace-nowrap ${
              activeTab === 'pending'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Pending Payments
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`px-6 py-3 font-mono font-bold transition-all whitespace-nowrap ${
              activeTab === 'withdraw'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Withdraw
          </button>
        </div>

        {/* Content Sections */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-mono">Loading payment data...</p>
          </div>
        ) : (
          <>
            {/* Released Earnings Tab */}
            {activeTab === 'earnings' && (
              <div className="space-y-4">
                {earnings.filter(e => e.status === 'released').length === 0 ? (
                  <div className="bg-gray-900/50 border border-[#00ff41]/20 rounded-lg p-8 text-center">
                    <p className="text-gray-400 font-mono">No released payments yet</p>
                  </div>
                ) : (
                  earnings.filter(e => e.status === 'released').map((earning) => (
                    <div key={earning._id} className={`bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-all`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-mono font-bold mb-2">{earning.jobId?.title || 'Project Payment'}</h3>
                          <div className="flex items-center gap-4">
                            <p className="text-gray-400 text-sm font-mono">{earning.clientId?.displayName || 'Client'}</p>
                            <p className="text-gray-500 text-sm font-mono">{new Date(earning.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400 font-mono mb-2">${earning.amount.toLocaleString()}</p>
                          <span className={`text-xs font-mono px-3 py-1 rounded border ${getStatusColor(earning.status)}`}>
                            Released
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pending Payments Tab */}
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {payments.filter(p => p.status === 'escrow' || p.status === 'pending').length === 0 ? (
                  <div className="bg-gray-900/50 border border-[#00ff41]/20 rounded-lg p-8 text-center">
                    <p className="text-gray-400 font-mono">No pending payments</p>
                  </div>
                ) : (
                  payments.filter(p => p.status === 'escrow' || p.status === 'pending').map((payment) => (
                    <div key={payment._id} className={`bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/50 transition-all`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-mono font-bold mb-2">{payment.jobId?.title || 'Project Payment'}</h3>
                          <div className="flex items-center gap-4">
                            <p className="text-gray-400 text-sm font-mono">{payment.clientId?.displayName || 'Client'}</p>
                            <p className="text-gray-500 text-sm font-mono">{new Date(payment.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-yellow-400 font-mono mb-2">${payment.amount.toLocaleString()}</p>
                          <span className={`text-xs font-mono px-3 py-1 rounded border capitalize ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 font-mono mt-2">⏳ Awaiting client release - milestone will trigger payment</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Withdraw Tab */}
            {activeTab === 'withdraw' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl p-8 space-y-8">
                  {/* Available Balance */}
                  <div className="bg-[#00ff41]/5 border border-[#00ff41]/30 rounded-lg p-6">
                    <p className="text-gray-400 text-sm font-mono mb-2">AVAILABLE BALANCE</p>
                    <p className="text-5xl font-bold text-[#00ff41] font-mono">${availableForWithdraw.toLocaleString()}</p>
                  </div>

                  {/* Withdrawal Method Selection */}
                  <div>
                    <p className="text-white font-mono font-bold mb-4">Select Withdrawal Method</p>
                    <div className="space-y-3">
                      {[
                        { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
                        { id: 'upi', label: 'UPI / Mobile Wallet', icon: '📱' },
                        { id: 'wallet', label: 'Digital Wallet', icon: '💳' },
                        { id: 'crypto', label: 'Cryptocurrency', icon: '₿' }
                      ].map((method) => (
                        <label key={method.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id
                            ? 'border-[#00ff41] bg-[#00ff41]/5'
                            : 'border-[#00ff41]/20 hover:border-[#00ff41]/50'
                        }`}>
                          <input
                            type="radio"
                            name="payment-method"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="w-4 h-4 accent-[#00ff41]"
                          />
                          <span className="ml-4 text-2xl">{method.icon}</span>
                          <span className="ml-4 text-white font-mono font-bold flex-1">{method.label}</span>
                          {selectedPaymentMethod === method.id && (
                            <span className="text-[#00ff41] font-mono text-sm">✓ Selected</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Withdrawal Amount */}
                  <div>
                    <label className="text-white font-mono font-bold mb-3 block">Withdrawal Amount</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-3 text-[#00ff41] font-mono">$</span>
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full bg-black border border-[#00ff41]/50 rounded-lg px-4 py-3 pl-8 text-white font-mono focus:outline-none focus:border-[#00ff41]"
                        />
                      </div>
                      <button
                        onClick={() => setWithdrawAmount(availableForWithdraw.toString())}
                        className="px-4 py-3 bg-[#00ff41]/20 text-[#00ff41] font-mono font-bold rounded-lg hover:bg-[#00ff41]/30 transition-all"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  {/* Withdraw Button */}
                  <button
                    onClick={handleWithdraw}
                    disabled={loading || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                    className="w-full px-6 py-3 bg-[#00ff41] text-black font-mono font-bold rounded-lg hover:bg-[#0df0a0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : `Withdraw $${withdrawAmount || '0'}`}
                  </button>

                  {/* Info */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-300 font-mono text-sm">
                      ℹ️ Withdrawals typically process within 2-5 business days. Ensure your {selectedPaymentMethod} details are correct.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Payment
