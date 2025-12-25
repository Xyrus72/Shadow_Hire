import React, { useState } from 'react'

const TaskDashboard = () => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, title: 'Design Dashboard UI', project: 'Tech Startup', deadline: '2025-01-05', hours: 8 },
      { id: 2, title: 'API Documentation', project: 'E-commerce Co', deadline: '2025-01-08', hours: 5 }
    ],
    inProgress: [
      { id: 3, title: 'React Components Dev', project: 'Tech Startup', deadline: '2025-01-03', hours: 6, timeSpent: 3 },
      { id: 4, title: 'Database Schema Design', project: 'E-commerce Co', deadline: '2025-01-10', hours: 10, timeSpent: 4 }
    ],
    done: [
      { id: 5, title: 'Project Kick-off Call', project: 'Creative Agency', completedOn: '2024-12-20', hours: 1 },
      { id: 6, title: 'Initial Wireframes', project: 'Creative Agency', completedOn: '2024-12-22', hours: 8 }
    ]
  })

  const [newTask, setNewTask] = useState('')
  const [totalHours, setTotalHours] = useState(0)
  const [showBurnoutAlert, setShowBurnoutAlert] = useState(false)

  // Calculate total hours worked today
  const calculateHours = () => {
    const total = [
      ...tasks.inProgress.reduce((sum, task) => sum + (task.timeSpent || 0), 0),
      ...tasks.done.reduce((sum, task) => sum + (task.hours || 0), 0)
    ].reduce((a, b) => a + b, 0)
    
    setTotalHours(total)
    if (total > 8) {
      setShowBurnoutAlert(true)
    }
  }

  const moveTask = (taskId, fromStatus, toStatus) => {
    const task = tasks[fromStatus].find(t => t.id === taskId)
    if (task) {
      setTasks({
        ...tasks,
        [fromStatus]: tasks[fromStatus].filter(t => t.id !== taskId),
        [toStatus]: [...tasks[toStatus], { ...task }]
      })
    }
  }

  const TaskCard = ({ task, status, canMove }) => (
    <div className="bg-[#1a1a1a] border border-[#00ff41]/20 rounded-lg p-4 hover:border-[#00ff41]/50 transition-all cursor-move group">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white font-mono font-bold text-sm flex-1">{task.title}</h4>
        {canMove && (
          <button className="text-[#00ff41]/0 group-hover:text-[#00ff41] transition-all text-xs">→</button>
        )}
      </div>
      <p className="text-[#00ff41]/70 text-xs font-mono mb-3">{task.project}</p>
      
      <div className="space-y-2">
        {task.deadline && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">📅</span>
            <span className="text-gray-400 text-xs font-mono">{new Date(task.deadline).toLocaleDateString()}</span>
          </div>
        )}
        
        {task.hours && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">⏱</span>
            <span className="text-gray-400 text-xs font-mono">
              {status === 'inProgress' && task.timeSpent ? `${task.timeSpent}/${task.hours}h` : `${task.hours}h`}
            </span>
          </div>
        )}

        {status === 'inProgress' && task.timeSpent && (
          <div className="w-full bg-[#0a0a0a] rounded-full h-1.5 mt-2">
            <div
              className="bg-[#00ff41] h-full rounded-full"
              style={{ width: `${(task.timeSpent / task.hours) * 100}%` }}
            />
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
          <div className="text-right">
            <p className="text-2xl font-bold text-[#00ff41] font-mono">{totalHours}h</p>
            <p className="text-gray-400 text-sm font-mono">hours today</p>
          </div>
        </div>

        {/* Burnout Alert */}
        {showBurnoutAlert && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-red-400 font-mono font-bold mb-1">Workload Alert</p>
              <p className="text-red-300/80 text-sm font-mono">You've worked {totalHours} hours today. Consider taking a break to avoid burnout!</p>
              <button className="mt-2 text-red-400 hover:text-red-300 text-sm font-mono underline">Take a break →</button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1a1a] border border-[#00ff41]/20 rounded-lg p-4">
            <p className="text-gray-400 text-xs font-mono mb-2">TO DO</p>
            <p className="text-3xl font-bold text-[#00ff41]">{tasks.todo.length}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#00ff41]/20 rounded-lg p-4">
            <p className="text-gray-400 text-xs font-mono mb-2">IN PROGRESS</p>
            <p className="text-3xl font-bold text-blue-400">{tasks.inProgress.length}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#00ff41]/20 rounded-lg p-4">
            <p className="text-gray-400 text-xs font-mono mb-2">COMPLETED</p>
            <p className="text-3xl font-bold text-green-400">{tasks.done.length}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#00ff41]/20 rounded-lg p-4">
            <p className="text-gray-400 text-xs font-mono mb-2">TOTAL HOURS</p>
            <p className="text-3xl font-bold text-purple-400">
              {tasks.todo.reduce((sum, t) => sum + t.hours, 0) + 
               tasks.inProgress.reduce((sum, t) => sum + t.hours, 0) +
               tasks.done.reduce((sum, t) => sum + t.hours, 0)}h
            </p>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do */}
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.15)] p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#00ff41]/20">
              <h3 className="text-white font-mono font-bold">TO DO</h3>
              <span className="bg-red-500/20 text-red-400 text-xs font-mono px-2 py-1 rounded">{tasks.todo.length}</span>
            </div>
            <div className="space-y-3">
              {tasks.todo.map(task => (
                <div key={task.id} onClick={() => moveTask(task.id, 'todo', 'inProgress')}>
                  <TaskCard task={task} status="todo" canMove />
                </div>
              ))}
              <button className="w-full p-3 border-2 border-dashed border-[#00ff41]/30 text-[#00ff41] font-mono text-sm hover:border-[#00ff41] hover:bg-[#00ff41]/5 transition-all rounded-lg">
                + Add Task
              </button>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.15)] p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#00ff41]/20">
              <h3 className="text-white font-mono font-bold">IN PROGRESS</h3>
              <span className="bg-blue-500/20 text-blue-400 text-xs font-mono px-2 py-1 rounded">{tasks.inProgress.length}</span>
            </div>
            <div className="space-y-3">
              {tasks.inProgress.map(task => (
                <div key={task.id} onClick={() => moveTask(task.id, 'inProgress', 'done')}>
                  <TaskCard task={task} status="inProgress" canMove />
                </div>
              ))}
            </div>
          </div>

          {/* Done */}
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.15)] p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#00ff41]/20">
              <h3 className="text-white font-mono font-bold">DONE</h3>
              <span className="bg-green-500/20 text-green-400 text-xs font-mono px-2 py-1 rounded">{tasks.done.length}</span>
            </div>
            <div className="space-y-3">
              {tasks.done.map(task => (
                <div key={task.id}>
                  <TaskCard task={task} status="done" canMove={false} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Break Reminder */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[#00ff41]/5 via-transparent to-[#00ff41]/5 border border-[#00ff41]/30 rounded-xl">
          <div className="flex items-center gap-4">
            <span className="text-4xl">☕</span>
            <div className="flex-1">
              <h3 className="text-white font-mono font-bold mb-1">Take a Break</h3>
              <p className="text-gray-400 font-mono text-sm">You've been working for 2 hours. Take a 15-minute break to stay productive!</p>
            </div>
            <button className="px-6 py-2 bg-[#00ff41] text-black font-mono font-bold rounded-lg hover:bg-[#0df0a0] transition-all">
              Start Break
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDashboard
