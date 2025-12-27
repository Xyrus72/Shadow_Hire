import React, { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('announcements')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Announcements state
  const [announcements, setAnnouncements] = useState([])
  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [announcementContent, setAnnouncementContent] = useState('')

  // Messages state
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [messageSubject, setMessageSubject] = useState('')
  const [messageContent, setMessageContent] = useState('')

  // Client messages state
  const [clientMessages, setClientMessages] = useState([])
  const [selectedClientMessage, setSelectedClientMessage] = useState(null)

  // User management state
  const [allUsers, setAllUsers] = useState([])
  const [searchEmail, setSearchEmail] = useState('')

  // Freelancer payment state
  const [freelancers, setFreelancers] = useState([])
  const [tasks, setTasks] = useState([])
  const [selectedFreelancer, setSelectedFreelancer] = useState('')
  const [selectedTask, setSelectedTask] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank')
  const [allFreelancers, setAllFreelancers] = useState([])

  // Milestone state
  const [jobs, setJobs] = useState([])
  const [milestoneApprovalNotes, setMilestoneApprovalNotes] = useState('')
  const [selectedMilestone, setSelectedMilestone] = useState(null)

  const token = localStorage.getItem('authToken')
  const adminId = localStorage.getItem('shadowUser') ? JSON.parse(localStorage.getItem('shadowUser')).id : ''

  // ========== FETCH FUNCTIONS ==========

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/admin/announcements', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements || [])
      }
    } catch (err) {
      console.error('Error fetching announcements:', err)
      setMessage('Error fetching announcements')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
        setAllUsers(data.users || [])
      }
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const fetchClientMessages = async () => {
    try {
      console.log('📨 Fetching client messages...')
      const response = await fetch('http://localhost:5000/api/admin/messages-admin/all', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Messages received:', data)
        setClientMessages(data.messages || [])
        if (data.messages?.length === 0) {
          console.log('⚠️ No messages in response')
        }
      } else {
        const errorData = await response.json()
        console.error('❌ Fetch failed with status', response.status, ':', errorData)
        setMessage('Error fetching client messages: ' + (errorData.message || response.statusText))
      }
    } catch (err) {
      console.error('❌ Error fetching client messages:', err)
      setMessage('Error fetching client messages: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchJobsWithMilestones = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        // Filter jobs that have milestones
        const jobsWithMilestones = Array.isArray(data) ? data.filter(job => job.milestones && job.milestones.length > 0) : []
        setJobs(jobsWithMilestones)
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setMessage('Error fetching jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'announcements') {
      fetchAnnouncements()
    } else if (activeTab === 'messages') {
      fetchUsers()
      fetchClientMessages()
    } else if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'payments') {
      fetchFreelancers()
    } else if (activeTab === 'milestones') {
      fetchJobsWithMilestones()
    }
  }, [activeTab])

  // ========== ANNOUNCEMENT HANDLERS ==========

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault()
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      setMessage('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: announcementTitle,
          content: announcementContent,
          adminId
        })
      })

      const data = await response.json()
      if (response.ok) {
        setMessage('âœ… Announcement created successfully')
        setAnnouncementTitle('')
        setAnnouncementContent('')
        fetchAnnouncements()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('âŒ ' + (data.message || 'Error creating announcement'))
      }
    } catch (err) {
      console.error('Error:', err)
      setMessage('âŒ Error creating announcement')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/admin/announcements/${announcementId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setMessage('âœ… Announcement deleted')
        fetchAnnouncements()
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      console.error('Error:', err)
      setMessage('âŒ Error deleting announcement')
    } finally {
      setLoading(false)
    }
  }

  // ========== MESSAGE HANDLERS ==========

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!selectedUser || !messageSubject.trim() || !messageContent.trim()) {
      setMessage('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const selectedUserData = users.find(u => u._id === selectedUser)
      
      const response = await fetch('http://localhost:5000/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: selectedUser,
          recipientEmail: selectedUserData?.email,
          subject: messageSubject,
          message: messageContent,
          senderId: adminId,
          senderName: user?.displayName || 'Admin'
        })
      })

      const data = await response.json()
      if (response.ok) {
        setMessage('âœ… Message sent successfully')
        setSelectedUser('')
        setMessageSubject('')
        setMessageContent('')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('âŒ ' + (data.message || 'Error sending message'))
      }
    } catch (err) {
      console.error('Error:', err)
      setMessage('âŒ Error sending message')
    } finally {
      setLoading(false)
    }
  }
  const handleMarkMessageAsRead = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchClientMessages()
        setMessage('✅ Message marked as read')
        setTimeout(() => setMessage(''), 2000)
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }
  // ========== USER MANAGEMENT HANDLERS ==========

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to delete ${userEmail}? This action cannot be undone.`)) return

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/admin/users/email/${userEmail}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setMessage('âœ… User deleted successfully')
        fetchUsers()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('âŒ Error deleting user')
      }
    } catch (err) {
      console.error('Error:', err)
      setMessage('âŒ Error deleting user')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchUsers = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchEmail(query)
    if (query.trim()) {
      const filtered = allUsers.filter(u => 
        u.email?.toLowerCase().includes(query) || 
        u.displayName?.toLowerCase().includes(query)
      )
      setUsers(filtered)
    } else {
      setUsers(allUsers)
    }
  }

  // ========== FREELANCER PAYMENT HANDLERS ==========

  const fetchFreelancers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        const freelancersList = data.users.filter(u => u.userType === 'freelancer')
        setAllFreelancers(freelancersList)
        setFreelancers(freelancersList)
      }
    } catch (err) {
      console.error('Error fetching freelancers:', err)
    }
  }

  const fetchTasksByFreelancer = async (freelancerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/freelancer/${freelancerId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setTasks([])
    }
  }

  // ========== MILESTONE HANDLERS ==========

  const handleApproveMilestone = async () => {
    if (!selectedMilestone) return

    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:5000/api/jobs/${selectedMilestone.jobId}/milestone/${selectedMilestone._id}/approve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ adminNotes: milestoneApprovalNotes })
        }
      )

      if (response.ok) {
        setMessage('✅ Milestone approved!')
        setMilestoneApprovalNotes('')
        setSelectedMilestone(null)
        await fetchJobsWithMilestones()
        
        // Release payment for this milestone
        await releaseMilestonePayment(selectedMilestone.jobId, selectedMilestone._id)
      } else {
        const errorData = await response.json()
        setMessage('❌ Error: ' + (errorData.error || 'Failed to approve milestone'))
      }
    } catch (err) {
      console.error('Error:', err)
      setMessage('❌ Error approving milestone')
    } finally {
      setLoading(false)
    }
  }

  const releaseMilestonePayment = async (jobId, milestoneId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/payments/milestone/${jobId}/${milestoneId}/release`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        setMessage('✅ Milestone approved and payment released to freelancer!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      console.error('Error releasing payment:', err)
    }
  }

  const handleRejectMilestone = async () => {
    if (!selectedMilestone) return
    if (!window.confirm('Are you sure you want to reject this milestone?')) return

    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:5000/api/jobs/${selectedMilestone.jobId}/milestone/${selectedMilestone._id}/reject`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ adminNotes: milestoneApprovalNotes })
        }
      )

      if (response.ok) {
        setMessage('✅ Milestone rejected and sent back for revision')
        setMilestoneApprovalNotes('')
        setSelectedMilestone(null)
        await fetchJobsWithMilestones()
      } else {
        setMessage('❌ Error rejecting milestone')
      }
    } catch (err) {
      console.error('Error:', err)
      setMessage('❌ Error rejecting milestone')
    } finally {
      setLoading(false)
    }
  }

  const handleFreelancerSelect = (e) => {
    const freelancerId = e.target.value
    setSelectedFreelancer(freelancerId)
    setSelectedTask('')
    setPaymentAmount('')
    if (freelancerId) {
      fetchTasksByFreelancer(freelancerId)
    } else {
      setTasks([])
    }
  }

  const handlePayFreelancer = async (e) => {
    e.preventDefault()
    if (!selectedFreelancer || !paymentAmount || !paymentMethod) {
      setMessage('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const freelancer = allFreelancers.find(f => f._id === selectedFreelancer)
      
      const response = await fetch('http://localhost:5000/api/admin/pay-freelancer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          freelancerId: selectedFreelancer,
          taskId: selectedTask || null,
          amount: parseFloat(paymentAmount),
          paymentMethod: paymentMethod,
          freelancerEmail: freelancer?.email
        })
      })

      const data = await response.json()
      if (response.ok) {
        setMessage('âœ… Payment processed successfully')
        setSelectedFreelancer('')
        setSelectedTask('')
        setPaymentAmount('')
        setPaymentMethod('bank')
        setTasks([])
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('âŒ ' + (data.message || 'Error processing payment'))
      }
    } catch (err) {
      console.error('Error:', err)
      setMessage('âŒ Error processing payment')
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
          <p className="text-gray-400 font-mono">Manage announcements, send messages, and control users</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded font-mono text-sm ${
            message.includes('âœ…') ? 'bg-green-900/30 border border-green-500 text-green-400' : 'bg-red-900/30 border border-red-500 text-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-[#00ff41]/30 overflow-x-auto">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-6 py-3 font-mono text-sm transition whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ðŸ“¢ Announcements
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 font-mono text-sm transition whitespace-nowrap ${
              activeTab === 'messages'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ðŸ’¬ Send Messages
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-mono text-sm transition whitespace-nowrap ${
              activeTab === 'users'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ðŸ‘¥ User Management
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-3 font-mono text-sm transition whitespace-nowrap ${
              activeTab === 'payments'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ðŸ’° Freelancer Payments
          </button>          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-6 py-3 font-mono text-sm transition whitespace-nowrap ${
              activeTab === 'milestones'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📋 Milestone Approval
          </button>        </div>

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Create Announcement Form */}
            <div className="lg:col-span-1 bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white font-mono mb-4">Create Announcement</h2>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 font-mono mb-2">Title</label>
                  <input
                    type="text"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    placeholder="Announcement title"
                    className="w-full bg-black border border-[#00ff41]/50 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff41]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 font-mono mb-2">Content</label>
                  <textarea
                    value={announcementContent}
                    onChange={(e) => setAnnouncementContent(e.target.value)}
                    placeholder="Announcement content"
                    rows="5"
                    className="w-full bg-black border border-[#00ff41]/50 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff41] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00ff41] text-black font-mono font-bold py-2 rounded hover:bg-[#00dd33] transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Announcement'}
                </button>
              </form>
            </div>

            {/* Announcements List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-white font-mono mb-4">Recent Announcements</h2>
              {announcements.length === 0 ? (
                <div className="bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-6 text-gray-400 font-mono text-center">
                  No announcements yet
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div key={announcement._id} className="bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-bold font-mono">{announcement.title}</h3>
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement._id)}
                        className="text-red-400 hover:text-red-300 text-sm font-mono"
                      >
                        âœ• Delete
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{announcement.content}</p>
                    <p className="text-gray-500 text-xs font-mono">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-8">
            {/* Client Messages Section */}
            <div className="bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white font-mono">
                  📨 Client Messages ({clientMessages.filter(m => !m.isRead).length} unread)
                </h2>
                <button
                  onClick={() => {
                    console.log('🔄 Refreshing client messages...')
                    fetchClientMessages()
                  }}
                  className="bg-[#00ff41] text-black text-xs font-mono font-bold px-3 py-1 rounded hover:bg-[#00dd33] transition"
                >
                  Refresh
                </button>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {clientMessages.length === 0 ? (
                  <div className="bg-black/50 border border-[#00ff41]/20 rounded-lg p-6 text-gray-400 font-mono text-center">
                    No messages from clients
                  </div>
                ) : (
                  clientMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`border rounded-lg p-4 ${
                        msg.isRead
                          ? 'bg-black/30 border-[#00ff41]/20'
                          : 'bg-[#00ff41]/5 border-[#00ff41]/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-white font-mono font-bold">{msg.senderName}</p>
                          <p className="text-[#00ff41] text-sm font-mono font-bold">{msg.subject}</p>
                        </div>
                        {!msg.isRead && (
                          <span className="bg-[#00ff41] text-black text-xs font-mono font-bold px-2 py-1 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-3 whitespace-pre-wrap">{msg.message}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-500 text-xs font-mono">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                        {!msg.isRead && (
                          <button
                            onClick={() => handleMarkMessageAsRead(msg._id)}
                            className="text-[#00ff41] hover:text-white text-xs font-mono px-3 py-1 border border-[#00ff41]/50 rounded hover:border-[#00ff41] transition"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Send Message to Users Section */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Send Message Form */}
              <div className="lg:col-span-1 bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white font-mono mb-4">Send Message</h2>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 font-mono mb-2">Select User</label>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full bg-black border border-[#00ff41]/50 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff41]"
                    >
                      <option value="">Choose a user...</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.displayName || u.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 font-mono mb-2">Subject</label>
                    <input
                      type="text"
                      value={messageSubject}
                      onChange={(e) => setMessageSubject(e.target.value)}
                      placeholder="Message subject"
                      className="w-full bg-black border border-[#00ff41]/50 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff41]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 font-mono mb-2">Message</label>
                    <textarea
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Message content"
                      rows="4"
                      className="w-full bg-black border border-[#00ff41]/50 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff41] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00ff41] text-black font-mono font-bold py-2 rounded hover:bg-[#00dd33] transition disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Users List */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-white font-mono mb-4">Users ({users.length})</h2>
                <div className="space-y-3">
                  {users.length === 0 ? (
                    <div className="bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-6 text-gray-400 font-mono text-center">
                      No users found
                    </div>
                  ) : (
                    users.map((u) => (
                      <div key={u._id} className="bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="text-white font-mono font-bold">{u.displayName}</p>
                          <p className="text-gray-400 text-sm font-mono">{u.email}</p>
                          <p className="text-gray-500 text-xs">Role: <span className="text-[#00ff41]">{u.userType}</span></p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white font-mono mb-4">Search & Delete Users</h2>
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchEmail}
                onChange={handleSearchUsers}
                className="w-full bg-black border border-[#00ff41]/50 rounded px-4 py-2 text-white font-mono mb-6 focus:outline-none focus:border-[#00ff41]"
              />

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-[#00ff41]/30">
                    <tr>
                      <th className="px-4 py-3 text-[#00ff41] font-mono text-sm">Name</th>
                      <th className="px-4 py-3 text-[#00ff41] font-mono text-sm">Email</th>
                      <th className="px-4 py-3 text-[#00ff41] font-mono text-sm">Role</th>
                      <th className="px-4 py-3 text-[#00ff41] font-mono text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#00ff41]/20">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-4 text-gray-400 text-center font-mono">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-800/50 transition">
                          <td className="px-4 py-3 text-white font-mono text-sm">{u.displayName}</td>
                          <td className="px-4 py-3 text-gray-300 font-mono text-sm">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-[#00ff41]/20 text-[#00ff41] rounded text-xs font-mono">
                              {u.userType}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDeleteUser(u._id, u.email)}
                              disabled={loading}
                              className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-red-100 rounded text-xs font-mono transition disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <p className="text-gray-500 text-sm font-mono mt-4">
                Total Users: <span className="text-[#00ff41]">{users.length}</span>
              </p>
            </div>
          </div>
        )}

        {/* Freelancer Payments Tab */}
        {activeTab === 'payments' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Pay Freelancer Form */}
            <div className="lg:col-span-1 bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white font-mono mb-4">ðŸ’° Pay Freelancer</h2>
              <form onSubmit={handlePayFreelancer} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 font-mono mb-2">Select Freelancer</label>
                  <select
                    value={selectedFreelancer}
                    onChange={handleFreelancerSelect}
                    className="w-full bg-black border border-[#00ff41]/50 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff41]"
                  >
                    <option value="">Choose a freelancer...</option>
                    {freelancers.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.displayName} ({f.email})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedFreelancer && tasks.length > 0 && (
                  <div>
                    <label className="block text-sm text-gray-300 font-mono mb-2">Select Task (Optional)</label>
                    <select
                      value={selectedTask}
                      onChange={(e) => setSelectedTask(e.target.value)}
                      className="w-full bg-black border border-[#00ff41]/50 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff41]"
                    >
                      <option value="">General Payment</option>
                      {tasks.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.title} - {t.progress}% complete
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedTask && (
                  <div className="bg-black/50 border border-[#00ff41]/20 rounded p-3">
                    {tasks.find(t => t._id === selectedTask) && (
                      <div className="text-xs text-gray-400 font-mono space-y-1">
                        <p><span className="text-[#00ff41]">Progress:</span> {tasks.find(t => t._id === selectedTask).progress}%</p>
                        <p><span className="text-[#00ff41]">Status:</span> {tasks.find(t => t._id === selectedTask).status}</p>
                        <p><span className="text-[#00ff41]">Hours:</span> {tasks.find(t => t._id === selectedTask).actualHours} / {tasks.find(t => t._id === selectedTask).estimatedHours}</p>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-300 font-mono mb-2">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="100.00"
                    className="w-full bg-black border border-[#00ff41]/50 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff41]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 font-mono mb-2">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-black border border-[#00ff41]/50 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00ff41]"
                  >
                    <option value="bank">ðŸ¦ Bank Transfer</option>
                    <option value="upi">ðŸ“± UPI</option>
                    <option value="crypto">â‚¿ Crypto</option>
                    <option value="wallet">ðŸ’³ Wallet</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedFreelancer || !paymentAmount}
                  className="w-full bg-[#00ff41] text-black font-mono font-bold py-2 rounded hover:bg-[#00dd33] transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Pay Freelancer'}
                </button>
              </form>
            </div>

            {/* Freelancers & Tasks List */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white font-mono mb-4">Active Freelancers ({freelancers.length})</h2>
                <div className="space-y-3">
                  {freelancers.length === 0 ? (
                    <div className="bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-6 text-gray-400 font-mono text-center">
                      No freelancers found
                    </div>
                  ) : (
                    freelancers.map((f) => (
                      <div key={f._id} className="bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-white font-mono font-bold">{f.displayName}</p>
                            <p className="text-gray-400 text-sm font-mono">{f.email}</p>
                          </div>
                          <span className="text-right">
                            <p className="text-[#00ff41] font-mono font-bold">â­ {f.averageRating?.toFixed(1) || 0}</p>
                            <p className="text-gray-500 text-xs font-mono">{f.totalReviews} reviews</p>
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-black/50 rounded p-2">
                            <p className="text-gray-500 text-xs font-mono">Completed</p>
                            <p className="text-[#00ff41] font-mono font-bold">{f.projectsCompleted}</p>
                          </div>
                          <div className="bg-black/50 rounded p-2">
                            <p className="text-gray-500 text-xs font-mono">Hours</p>
                            <p className="text-[#00ff41] font-mono font-bold">{f.totalHoursWorked}</p>
                          </div>
                          <div className="bg-black/50 rounded p-2">
                            <p className="text-gray-500 text-xs font-mono">Earnings</p>
                            <p className="text-[#00ff41] font-mono font-bold">${f.totalEarnings?.toFixed(2) || 0}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {selectedFreelancer && tasks.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-white font-mono mb-4">Work Progress</h2>
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task._id} className="bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-white font-mono font-bold">{task.title}</p>
                            <p className="text-gray-400 text-sm font-mono">{task.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-mono ${
                            task.status === 'done' ? 'bg-green-900/50 text-green-400' :
                            task.status === 'in_progress' ? 'bg-blue-900/50 text-blue-400' :
                            task.status === 'blocked' ? 'bg-red-900/50 text-red-400' :
                            'bg-gray-900/50 text-gray-400'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-xs font-mono">Progress</span>
                            <span className="text-[#00ff41] font-mono text-sm">{task.progress}%</span>
                          </div>
                          <div className="w-full bg-black border border-[#00ff41]/30 rounded h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-[#00ff41] to-cyan-400 h-full transition-all duration-500"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 font-mono">
                          <p><span className="text-[#00ff41]">Hours:</span> {task.actualHours} / {task.estimatedHours}</p>
                          <p><span className="text-[#00ff41]">Deadline:</span> {new Date(task.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Milestones Approval Tab */}
        {activeTab === 'milestones' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Jobs List */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-white font-mono mb-4">📋 Jobs with Pending Milestones</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {loading ? (
                  <p className="text-gray-400">Loading jobs...</p>
                ) : jobs.length === 0 ? (
                  <p className="text-gray-400">No jobs with milestones</p>
                ) : (
                  jobs.map(job => (
                    <div key={job._id} className="bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-4">
                      <h3 className="text-white font-bold text-sm mb-2">{job.title}</h3>
                      <p className="text-gray-400 text-xs mb-3">Client: {job.clientId?.displayName || 'Unknown'}</p>
                      
                      {/* Milestones List */}
                      <div className="space-y-2">
                        {job.milestones && job.milestones.map((milestone, idx) => (
                          <button
                            key={milestone._id}
                            onClick={() => setSelectedMilestone({ ...milestone, jobId: job._id, clientId: job.clientId, freelancerId: job.assignedTo })}
                            className={`w-full text-left p-2 rounded text-xs transition-all ${
                              selectedMilestone?.id === milestone._id
                                ? 'bg-[#00ff41]/20 border border-[#00ff41] text-[#00ff41]'
                                : 'bg-black/50 border border-gray-600 text-gray-400 hover:border-[#00ff41]'
                            }`}
                          >
                            <p className="font-bold">Task {idx + 1}: {milestone.title}</p>
                            <p className="text-xs opacity-70">💰 ${milestone.payment} | Status: {milestone.status}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Milestone Details & Approval */}
            <div>
              <h2 className="text-xl font-bold text-white font-mono mb-4">✅ Approve Milestone</h2>
              {selectedMilestone ? (
                <div className="bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-4 space-y-4">
                  <div>
                    <p className="text-gray-400 text-xs">TASK TITLE</p>
                    <p className="text-white font-bold">{selectedMilestone.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">PAYMENT</p>
                    <p className="text-[#00ff41] font-bold text-lg">${selectedMilestone.payment}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">STATUS</p>
                    <p className="text-yellow-400 font-bold capitalize">{selectedMilestone.status}</p>
                  </div>
                  {selectedMilestone.submittedWork && (
                    <div>
                      <p className="text-gray-400 text-xs">SUBMITTED WORK</p>
                      <p className="text-gray-300 text-xs bg-black/50 p-2 rounded">{selectedMilestone.submittedWork}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-gray-400 text-xs block mb-2">ADMIN NOTES (optional)</label>
                    <textarea
                      value={milestoneApprovalNotes}
                      onChange={(e) => setMilestoneApprovalNotes(e.target.value)}
                      placeholder="Add approval notes..."
                      className="w-full bg-black border-2 border-[#00ff41]/30 rounded px-3 py-2 text-[#00ff41] placeholder-gray-600 focus:border-[#00ff41] focus:outline-none text-xs"
                      rows="3"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveMilestone()}
                      className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded text-xs hover:bg-green-700 transition-all"
                    >
                      ✓ Approve & Release Payment
                    </button>
                    <button
                      onClick={() => handleRejectMilestone()}
                      className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded text-xs hover:bg-red-700 transition-all"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900/50 border border-[#00ff41]/30 rounded-lg p-8 text-center">
                  <p className="text-gray-400">Select a milestone to review</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard

