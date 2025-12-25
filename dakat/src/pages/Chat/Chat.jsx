import React, { useState } from 'react'

const Chat = () => {
  const [activeChat, setActiveChat] = useState(1)
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  // Mock chat data
  const chats = [
    {
      id: 1,
      name: 'Tech Startup',
      avatar: 'https://ui-avatars.com/api/?name=TechStartup',
      lastMessage: 'Looks great! Let\'s proceed with payment',
      unread: 2,
      messages: [
        { id: 1, sender: 'Tech Startup', text: 'Hi! Interested in React project?', time: '10:30 AM', isSent: false },
        { id: 2, sender: 'You', text: 'Yes! I\'d love to discuss the requirements', time: '10:35 AM', isSent: true },
        { id: 3, sender: 'Tech Startup', text: 'Great! Here\'s the design file', time: '10:40 AM', isSent: false, file: { name: 'design.figma', type: 'file' } },
        { id: 4, sender: 'You', text: 'Perfect! I\'ll start tomorrow after office hours', time: '10:45 AM', isSent: true },
        { id: 5, sender: 'Tech Startup', text: 'Looks great! Let\'s proceed with payment', time: '11:00 AM', isSent: false }
      ]
    },
    {
      id: 2,
      name: 'Creative Agency',
      avatar: 'https://ui-avatars.com/api/?name=CreativeAgency',
      lastMessage: 'When can you deliver the mockups?',
      unread: 1,
      messages: [
        { id: 1, sender: 'Creative Agency', text: 'Hi! Do you have experience with UI design?', time: '9:00 AM', isSent: false },
        { id: 2, sender: 'You', text: 'Yes, 3+ years in UI/UX design', time: '9:15 AM', isSent: true },
        { id: 3, sender: 'Creative Agency', text: 'When can you deliver the mockups?', time: '9:30 AM', isSent: false }
      ]
    },
    {
      id: 3,
      name: 'E-commerce Co',
      avatar: 'https://ui-avatars.com/api/?name=EcommerceCo',
      lastMessage: 'Payment released! Great work 🎉',
      unread: 0,
      messages: [
        { id: 1, sender: 'E-commerce Co', text: 'Project completed successfully!', time: 'Yesterday', isSent: false },
        { id: 2, sender: 'E-commerce Co', text: 'Payment released! Great work 🎉', time: 'Yesterday', isSent: false }
      ]
    }
  ]

  const currentChat = chats.find(c => c.id === activeChat)

  const handleSendMessage = () => {
    if (message.trim() || selectedFile) {
      // Add message logic here
      setMessage('')
      setSelectedFile(null)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-10 flex">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        
        {/* Chats List */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.15)] overflow-hidden">
            <div className="p-4 border-b border-[#00ff41]/20">
              <h2 className="text-xl font-bold text-white font-mono">Messages</h2>
            </div>

            <div className="overflow-y-auto max-h-[600px]">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`w-full p-4 border-b border-[#00ff41]/10 flex items-center gap-3 hover:bg-[#00ff41]/5 transition-all text-left ${
                    activeChat === chat.id ? 'bg-[#00ff41]/10 border-l-2 border-l-[#00ff41]' : ''
                  }`}
                >
                  <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-mono font-bold truncate">{chat.name}</p>
                    <p className="text-gray-500 text-xs font-mono truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="bg-[#00ff41] text-black text-xs font-mono font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        {currentChat && (
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.15)] overflow-hidden flex flex-col h-[700px]">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-[#00ff41]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={currentChat.avatar} alt={currentChat.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-white font-mono font-bold">{currentChat.name}</p>
                    <p className="text-[#00ff41]/70 text-xs font-mono">Online</p>
                  </div>
                </div>
                <button className="text-[#00ff41] hover:text-[#0df0a0] transition-all">⋮</button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentChat.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg font-mono text-sm ${
                        msg.isSent
                          ? 'bg-[#00ff41] text-black'
                          : 'bg-[#1a1a1a] border border-[#00ff41]/30 text-white'
                      }`}
                    >
                      {msg.file ? (
                        <div>
                          <p className="mb-2">📎 {msg.file.name}</p>
                          <p className="text-xs opacity-70">Click to download</p>
                        </div>
                      ) : (
                        msg.text
                      )}
                      <p className={`text-xs mt-1 ${msg.isSent ? 'text-black/70' : 'text-gray-400'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-[#00ff41]/20">
                {selectedFile && (
                  <div className="mb-2 flex items-center gap-2 p-2 bg-[#1a1a1a] border border-[#00ff41]/30 rounded">
                    <span className="text-[#00ff41] font-mono text-sm">📎 {selectedFile}</span>
                    <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-[#00ff41]">✕</button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button className="text-[#00ff41] hover:text-[#0df0a0] text-xl">📎</button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#1a1a1a] border border-[#00ff41]/30 rounded-lg px-4 py-2 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#00ff41]"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-2 bg-[#00ff41] text-black font-mono font-bold rounded-lg hover:bg-[#0df0a0] transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
