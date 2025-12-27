import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { taskAPI } from '../../services/api'
import api, { getAuthToken } from '../../services/api'
import useAuth from '../../hooks/useAuth'

const TaskDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState({
    pending: [],
    accepted: [],
    todo: [],
    inProgress: [],
    done: [],
    blocked: []
  })
  
  const [acceptedJobs, setAcceptedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalHours, setTotalHours] = useState(0)
  const [showBurnoutAlert, setShowBurnoutAlert] = useState(false)
  const [approvalRequests, setApprovalRequests] = useState([])
  const [freelancerEarnings, setFreelancerEarnings] = useState(0)
  const [showApprovalModal, setShowApprovalModal] = useState(null)
  const [balance, setBalance] = useState(0)

  // Fetch tasks from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch tasks
        const tasksData = await taskAPI.getTasks()
        
        // Group tasks by status
        const grouped = {
          pending: tasksData.filter(t => t.status === 'pending'),
          accepted: tasksData.filter(t => t.status === 'accepted'),
          todo: tasksData.filter(t => t.status === 'todo'),
          inProgress: tasksData.filter(t => t.status === 'in_progress'),
          done: tasksData.filter(t => t.status === 'done'),
          blocked: tasksData.filter(t => t.status === 'blocked')
        }
        
        setTasks(grouped)
        
        // Calculate total hours
        const total = tasksData.reduce((sum, task) => sum + (task.actualHours || 0), 0)
        setTotalHours(total)
        
        if (total > 8) {
          setShowBurnoutAlert(true)
        }

        // Fetch accepted jobs (jobs where freelancer is assigned)
        try {
          const jobsData = await api.jobAPI.getAcceptedJobs()
          setAcceptedJobs(Array.isArray(jobsData) ? jobsData : [])
        } catch (jobError) {
          console.error('Error fetching accepted jobs:', jobError)
        }

        // Fetch balance
        try {
          const balanceData = await api.userAPI.getBalance()
          setBalance(balanceData.availableBalance || 0)
        } catch (balanceError) {
          console.error('Error fetching balance:', balanceError)
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
      // Refresh every 30 seconds
      const interval = setInterval(fetchData, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const TaskCard = ({ task, status, canMove }) => (
    <div className="bg-[#1a1a1a] border border-[#00ff41]/20 rounded-lg p-4 hover:border-[#00ff41]/50 transition-all cursor-move group">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white font-mono font-bold text-sm flex-1">{task.title}</h4>
        {canMove && (
          <button className="text-[#00ff41]/0 group-hover:text-[#00ff41] transition-all text-xs">→</button>
        )}
      </div>
      <p className="text-[#00ff41]/70 text-xs font-mono mb-3">{task.jobId?.title || 'Unknown Project'}</p>
      
      <div className="space-y-2">
        {task.deadline && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">📅</span>
            <span className="text-gray-400 text-xs font-mono">{new Date(task.deadline).toLocaleDateString()}</span>
          </div>
        )}

        {(status === 'in_progress' || status === 'inProgress') && task.estimatedHours && (
          <div className="w-full bg-[#0a0a0a] rounded-full h-1.5 mt-2">
            <div
              className="bg-[#00ff41] h-full rounded-full"
              style={{ width: `${(task.actualHours / task.estimatedHours) * 100}%` }}
            />
          </div>
        )}

        {task.progress !== undefined && (
          <div className="mt-2 pt-2 border-t border-[#00ff41]/20">
            <p className="text-[#00ff41] text-xs font-mono mb-1">Progress: {task.progress}%</p>
            <div className="w-full bg-[#0a0a0a] rounded-full h-1.5">
              <div
                className="bg-[#00ff41] h-full rounded-full"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white font-mono mb-2">
              Task <span className="text-[#00ff41]">Dashboard</span>
            </h1>
            <p className="text-gray-400 font-mono">Manage your projects & track work hours</p>
          </div>
          <div className="text-right space-y-2">
            <div>
              <p className="text-2xl font-bold text-[#00ff41] font-mono">${balance.toFixed(2)}</p>
              <p className="text-gray-400 text-sm font-mono">💰 Available Balance</p>
            </div>
            {approvalRequests.filter(r => r.status === 'pending_admin').length > 0 && (
              <div className="text-lg font-bold text-yellow-400 font-mono">
                ⏳ {approvalRequests.filter(r => r.status === 'pending_admin').length} pending approval{approvalRequests.filter(r => r.status === 'pending_admin').length > 1 ? 's' : ''}
              </div>
            )}
            <p className="text-gray-400 text-sm font-mono">{totalHours}h worked</p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-[#00ff41] font-mono">Loading tasks...</p>
          </div>
        )}

        {/* Burnout Alert */}
        {!loading && showBurnoutAlert && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-red-400 font-mono font-bold mb-1">Workload Alert</p>
              <p className="text-red-300/80 text-sm font-mono">You've worked {totalHours} hours. Consider taking a break to avoid burnout!</p>
              <button className="mt-2 text-red-400 hover:text-red-300 text-sm font-mono underline">Take a break →</button>
            </div>
          </div>
        )}

        {/* Accepted Jobs Section */}
        {!loading && acceptedJobs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#00ff41] font-mono mb-4">
              💼 Accepted Jobs from Clients
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {acceptedJobs.map(job => (
                <div key={job._id} className="bg-gradient-to-r from-cyan-500/10 to-[#00ff41]/10 border-2 border-[#00ff41]/50 rounded-lg p-5 hover:border-[#00ff41] transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#00ff41]">{job.title}</h3>
                      <p className="text-gray-300 text-sm mt-1">{job.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-black/50 border border-[#00ff41]/20 rounded p-2">
                      <p className="text-gray-400 text-xs">Budget</p>
                      <p className="text-[#00ff41] font-bold">${job.totalBudget}</p>
                    </div>
                    <div className="bg-black/50 border border-[#00ff41]/20 rounded p-2">
                      <p className="text-gray-400 text-xs">Milestones</p>
                      <p className="text-[#00ff41] font-bold">{job.milestones?.length || 0}</p>
                    </div>
                  </div>

                  {/* Client Info */}
                  {job.clientId && (
                    <div className="flex items-center gap-3 bg-black/60 border border-[#00ff41]/30 rounded p-3">
                      <img 
                        src={job.clientId.photoURL || `https://ui-avatars.com/api/?name=${job.clientId.displayName}`} 
                        alt={job.clientId.displayName}
                        className="w-10 h-10 rounded-full border border-[#00ff41]"
                      />
                      <div className="flex-1">
                        <p className="text-[#00ff41] font-bold text-sm">👤 {job.clientId.displayName}</p>
                        <p className="text-gray-400 text-xs">{job.clientId.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-[#00ff41]/20">
                    <p className="text-[#00ff41]/80 text-xs font-mono">
                      📅 Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/job-tasks/${job._id}`)}
                    className="mt-4 w-full bg-[#00ff41] text-black font-bold py-2 rounded-lg hover:bg-[#00ff41]/80 transition-all font-mono text-sm"
                  >
                    ⚡ View Tasks ({job.milestones?.length || 0})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Break Reminder */}
        {!loading && (
          <div className="mt-8 p-6 bg-gradient-to-r from-[#00ff41]/5 via-transparent to-[#00ff41]/5 border border-[#00ff41]/30 rounded-xl">
            <div className="flex items-center gap-4">
              <span className="text-4xl">☕</span>
              <div className="flex-1">
                <h3 className="text-white font-mono font-bold mb-1">Stay Productive</h3>
                <p className="text-gray-400 font-mono text-sm">You've logged {totalHours} total hours on tasks. Keep up the great work!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskDashboard
