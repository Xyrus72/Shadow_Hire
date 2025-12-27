import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { taskAPI } from '../../services/api'
import api, { getAuthToken } from '../../services/api'
import useAuth from '../../hooks/useAuth'
import { checkTasksInDatabase, checkProposalStatus, getAllTasks } from '../../utils/debug'

const JobTasksPage = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [job, setJob] = useState(null)
  const [tasks, setTasks] = useState({
    pending: [],
    accepted: [],
    todo: [],
    inProgress: [],
    done: [],
    blocked: []
  })
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(0)
  const [paymentRequests, setPaymentRequests] = useState({})  // Track pending payment requests per task

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log('[JobTasksPage] ===== FETCHING DATA =====')
        console.log('[JobTasksPage] jobId from URL:', jobId)
        console.log('[JobTasksPage] user:', user)

        // Fetch job details
        const jobResponse = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        })
        if (!jobResponse.ok) {
          throw new Error(`Failed to fetch job: ${jobResponse.status}`)
        }
        const jobData = await jobResponse.json()
        console.log('[JobTasksPage] Job data fetched:', jobData)
        setJob(jobData)

        // Fetch tasks for this job
        console.log('[JobTasksPage] Fetching tasks with URL:', `http://localhost:5000/api/tasks?jobId=${jobId}`)
        const tasksResponse = await fetch(`http://localhost:5000/api/tasks?jobId=${jobId}`, {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        })
        if (!tasksResponse.ok) {
          throw new Error(`Failed to fetch tasks: ${tasksResponse.status}`)
        }
        const tasksData = await tasksResponse.json()
        
        console.log('[JobTasksPage] Raw tasks response:', tasksData)
        console.log('[JobTasksPage] Number of tasks returned:', Array.isArray(tasksData) ? tasksData.length : 'NOT AN ARRAY')

        // Ensure tasksData is an array
        const taskArray = Array.isArray(tasksData) ? tasksData : []

        // Group tasks by status
        const grouped = {
          pending: taskArray.filter(t => t.status === 'pending'),
          accepted: taskArray.filter(t => t.status === 'accepted'),
          todo: taskArray.filter(t => t.status === 'todo'),
          inProgress: taskArray.filter(t => t.status === 'in_progress'),
          done: taskArray.filter(t => t.status === 'done'),
          blocked: taskArray.filter(t => t.status === 'blocked')
        }
        console.log('[JobTasksPage] Grouped tasks breakdown:', {
          pending: grouped.pending.length,
          accepted: grouped.accepted.length,
          todo: grouped.todo.length,
          inProgress: grouped.inProgress.length,
          done: grouped.done.length,
          blocked: grouped.blocked.length,
          total: taskArray.length
        })
        setTasks(grouped)

        // Fetch balance
        try {
          const balanceData = await api.userAPI.getBalance()
          setBalance(balanceData.availableBalance || 0)
        } catch (balanceError) {
          console.error('Error fetching balance:', balanceError)
        }
      } catch (error) {
        console.error('[JobTasksPage] Error fetching data:', error)
        alert(`Error loading job tasks: ${error.message}`)
      } finally {
        setLoading(false)
        console.log('[JobTasksPage] ===== FETCH COMPLETE =====')
      }
    }

    if (user && jobId) {
      fetchData()
    }
  }, [user, jobId])

  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log('[handleTaskStatusUpdate] Task updated successfully:', responseData)

        // Create a new state object with immutable updates
        setTasks(prevTasks => {
          // Flatten all tasks
          const allTasks = [
            ...prevTasks.pending,
            ...prevTasks.accepted,
            ...prevTasks.todo,
            ...prevTasks.inProgress,
            ...prevTasks.done,
            ...prevTasks.blocked
          ]

          // Find and update the task
          const updatedAllTasks = allTasks.map(t =>
            t._id === taskId ? { ...t, status: newStatus } : t
          )

          // Regroup tasks
          return {
            pending: updatedAllTasks.filter(t => t.status === 'pending'),
            accepted: updatedAllTasks.filter(t => t.status === 'accepted'),
            todo: updatedAllTasks.filter(t => t.status === 'todo'),
            inProgress: updatedAllTasks.filter(t => t.status === 'in_progress'),
            done: updatedAllTasks.filter(t => t.status === 'done'),
            blocked: updatedAllTasks.filter(t => t.status === 'blocked')
          }
        })

        // Task marked as done - ready for payment request
        if (newStatus === 'done') {
          console.log('Task marked as done, ready for payment request')
        }
      } else {
        const errorData = await response.json()
        console.error('Failed to update task status:', errorData)
        alert(`Error updating task: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating task status:', error)
      alert(`Error: ${error.message}`)
    }
  }

  const handleRequestPayment = async (taskId, amount) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/request-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          taskId: taskId,
          amount: amount,
          jobId: jobId
        })
      })

      if (response.ok) {
        const paymentData = await response.json()
        setPaymentRequests(prev => ({
          ...prev,
          [taskId]: paymentData.status
        }))
        alert(`✅ Payment request submitted! Admin will review and approve shortly.`)
      } else {
        alert('❌ Failed to request payment')
      }
    } catch (error) {
      console.error('Error requesting payment:', error)
      alert('❌ Error submitting payment request')
    }
  }

  const TaskCard = ({ task }) => (
    <div className="bg-[#1a1a1a] border border-[#00ff41]/20 rounded-lg p-4 hover:border-[#00ff41]/50 transition-all cursor-pointer group hover:shadow-lg hover:shadow-[#00ff41]/20">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-white font-mono font-bold text-sm group-hover:text-[#00ff41] transition-colors">{task.title}</h4>
          <p className="text-[#00ff41]/70 text-xs font-mono mt-1">Status: <span className="font-bold">{task.status}</span></p>
        </div>
        {task.estimatedBudget && (
          <div className="text-right ml-3">
            <p className="text-gray-400 text-xs mb-1">Budget</p>
            <p className="text-[#00ff41] font-bold text-sm">${task.estimatedBudget}</p>
          </div>
        )}
      </div>

      {/* Main Action Button - Click to move to In Progress */}
      {task.status !== 'done' && (
        <button
          onClick={() => handleTaskStatusUpdate(task._id, 'in_progress')}
          className={`w-full py-2 rounded text-xs font-mono transition-all mb-2 font-bold ${
            task.status === 'in_progress'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
              : 'bg-[#00ff41]/20 text-[#00ff41] hover:bg-[#00ff41]/40 border border-[#00ff41]/30'
          }`}
        >
          {task.status === 'in_progress' ? '▶ IN PROGRESS' : '→ MOVE TO IN PROGRESS'}
        </button>
      )}

      {/* Status Buttons */}
      <div className="flex gap-2 flex-wrap mb-3">
        <button
          onClick={() => handleTaskStatusUpdate(task._id, 'pending')}
          className={`px-2 py-1 rounded text-xs font-mono transition-all ${
            task.status === 'pending'
              ? 'bg-yellow-500 text-black font-bold'
              : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
          }`}
        >
          ⏳ Pending
        </button>
        <button
          onClick={() => handleTaskStatusUpdate(task._id, 'done')}
          className={`px-2 py-1 rounded text-xs font-mono transition-all ${
            task.status === 'done'
              ? 'bg-green-500 text-black font-bold'
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
          }`}
        >
          ✓ Done
        </button>
      </div>

      {/* Payment Request Button */}
      {task.status === 'done' && task.estimatedBudget && (
        <button
          onClick={() => handleRequestPayment(task._id, task.estimatedBudget)}
          className="w-full px-2 py-2 rounded text-xs font-mono bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all border border-purple-500/30 font-bold"
        >
          💰 Request Payment
        </button>
      )}

      {/* Payment Status */}
      {paymentRequests[task._id] && (
        <div className={`text-xs font-mono p-2 rounded mb-3 ${
          paymentRequests[task._id] === 'pending_approval'
            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
            : paymentRequests[task._id] === 'released'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {paymentRequests[task._id] === 'pending_approval' ? '⏳ Pending Admin Approval' : paymentRequests[task._id] === 'released' ? '✅ Payment Released' : '❌ Payment Failed'}
        </div>
      )}

    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[#00ff41] font-mono">Loading tasks...</p>
        </div>
      </div>
    )
  }

  const totalTasks = Object.values(tasks).flat().length
  const completedTasks = tasks.done.length
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-[#00ff41] hover:text-cyan-400 font-mono mb-2 text-sm"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-white font-mono mb-2">
              Job <span className="text-[#00ff41]">Tasks</span>
            </h1>
            {job && <p className="text-gray-400 font-mono">{job.title}</p>}
          </div>
          <div className="text-right space-y-2">
            <div>
              <p className="text-2xl font-bold text-[#00ff41] font-mono">${balance.toFixed(2)}</p>
              <p className="text-gray-400 text-sm font-mono">💰 Available Balance</p>
            </div>
            <button
              onClick={async () => {
                console.log('🔍 DEBUG BUTTON CLICKED');
                const dbInfo = await checkTasksInDatabase(jobId);
                const jobInfo = await checkProposalStatus(jobId);
                const allTasks = await getAllTasks();
                if (dbInfo && jobInfo) {
                  alert(`✅ Debug Info Logged!\n\nFor this Job:\n  Tasks: ${dbInfo.taskDetails?.length || 0}\n  Milestones: ${jobInfo.milestones?.length || 0}\n\nTotal in DB: ${dbInfo.totalTasksInDatabase}\n\nCheck console for full details.`);
                }
              }}
              className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded text-xs font-mono hover:bg-purple-500/30"
            >
              🔍 Debug
            </button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-[#00ff41]/10 to-cyan-500/10 border-2 border-[#00ff41]/30 rounded-lg">
          <h2 className="text-[#00ff41] font-bold font-mono mb-4">📊 Milestone Progress</h2>
          <div className="grid grid-cols-5 gap-3 mb-4">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Total</p>
              <p className="text-3xl font-bold text-cyan-400">{totalTasks}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-400">{completedTasks}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">In Progress</p>
              <p className="text-3xl font-bold text-blue-400">{tasks.inProgress.length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-400">{tasks.pending.length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Progress</p>
              <p className="text-3xl font-bold text-[#00ff41]">{completionPercent}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/70 rounded-full h-3 overflow-hidden border border-[#00ff41]/20">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-[#00ff41] transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pending */}
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#00ff41]/20">
              <h3 className="text-white font-mono font-bold">PENDING</h3>
              <span className="bg-yellow-500/20 text-yellow-400 text-xs font-mono px-2 py-1 rounded font-bold">{tasks.pending.length}</span>
            </div>
            <div className="space-y-3">
              {tasks.pending.length > 0 ? (
                tasks.pending.map(task => <TaskCard key={task._id} task={task} />)
              ) : (
                <div className="text-center py-8">
                  {Object.values(tasks).flat().length === 0 ? (
                    <>
                      <p className="text-gray-500 text-sm font-mono mb-3">📭 No tasks yet</p>
                      <p className="text-yellow-500/60 text-xs font-mono">💡 Tasks will appear here once you accept a job with milestones</p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-xs font-mono">All tasks are in progress or completed!</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#00ff41]/20">
              <h3 className="text-white font-mono font-bold">IN PROGRESS</h3>
              <span className="bg-blue-500/20 text-blue-400 text-xs font-mono px-2 py-1 rounded">{tasks.inProgress.length}</span>
            </div>
            <div className="space-y-3">
              {tasks.inProgress.length > 0 ? (
                tasks.inProgress.map(task => <TaskCard key={task._id} task={task} />)
              ) : (
                <p className="text-gray-500 text-xs font-mono text-center py-4">No in progress tasks</p>
              )}
            </div>
          </div>

          {/* Done */}
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#00ff41]/20">
              <h3 className="text-white font-mono font-bold">COMPLETED</h3>
              <span className="bg-green-500/20 text-green-400 text-xs font-mono px-2 py-1 rounded">{tasks.done.length}</span>
            </div>
            <div className="space-y-3">
              {tasks.done.length > 0 ? (
                tasks.done.map(task => <TaskCard key={task._id} task={task} />)
              ) : (
                <p className="text-gray-500 text-xs font-mono text-center py-4">No completed tasks</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobTasksPage
