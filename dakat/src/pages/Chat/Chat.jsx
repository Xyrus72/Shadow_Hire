import React, { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import api from '../../services/api'

const Chat = () => {
  const { user } = useAuth()
  const [currentUserId, setCurrentUserId] = useState(null)
  const [activeChat, setActiveChat] = useState(null)
  const [chats, setChats] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Get current user ID from localStorage (MongoDB ID)
  useEffect(() => {
    const shadowUser = JSON.parse(localStorage.getItem('shadowUser') || '{}')
    if (shadowUser?.id) {
      setCurrentUserId(shadowUser.id)
    }
  }, [])

  useEffect(() => {
    if (user && currentUserId) {
      fetchConversations()
    }
  }, [user, currentUserId])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const data = await api.chatAPI.getConversations()
      setChats(Array.isArray(data) ? data : [])
      
      // Update activeChat if it exists in the new data
      if (activeChat && Array.isArray(data)) {
        const updatedChat = data.find(c => c.conversationId === activeChat.conversationId)
        if (updatedChat) {
          setActiveChat(updatedChat)
        } else if (data.length > 0 && !activeChat) {
          setActiveChat(data[0])
        }
      } else if (data.length > 0 && !activeChat) {
        setActiveChat(data[0])
      }
    } catch (err) {
      console.error('Error fetching conversations:', err)
      setError('Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return

    try {
      setLoading(true)
      await api.chatAPI.sendMessage(activeChat.conversationId, {
        content: message,
        attachments: []
      })
      setMessage('')
      // Refresh the conversation
      await fetchConversations()
      // Scroll to bottom after sending
      setTimeout(() => {
        const messagesDiv = document.querySelector('[data-messages]')
        if (messagesDiv) {
          messagesDiv.scrollTop = messagesDiv.scrollHeight
        }
      }, 100)
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const currentChat = activeChat

  const getParticipantName = (chat) => {
    if (!chat.participants) return 'Unknown'
    const otherParticipant = chat.participants.find(p => p._id !== currentUserId)
    return otherParticipant?.displayName || 'Unknown'
  }

  const getParticipantPhoto = (chat) => {
    if (!chat.participants) return 'https://ui-avatars.com/api/?name=Unknown'
    const otherParticipant = chat.participants.find(p => p._id !== currentUserId)
    return otherParticipant?.photoURL || `https://ui-avatars.com/api/?name=${otherParticipant?.displayName || 'Unknown'}`
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-10 flex">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        
        {/* Chats List */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.15)] overflow-hidden">
            <div className="p-4 border-b border-[#00ff41]/20">
              <h2 className="text-xl font-bold text-white font-mono">💬 Messages</h2>
            </div>

            {loading && !chats.length ? (
              <div className="p-4 text-gray-400 text-center">Loading conversations...</div>
            ) : chats.length === 0 ? (
              <div className="p-4 text-gray-400 text-center text-sm">
                No conversations yet. Accept a proposal to start chatting!
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[600px]">
                {chats.map((chat) => {
                  const participantName = getParticipantName(chat)
                  const participantPhoto = getParticipantPhoto(chat)
                  const isSelected = activeChat?.conversationId === chat.conversationId

                  return (
                    <button
                      key={chat._id}
                      onClick={() => setActiveChat(chat)}
                      className={`w-full p-4 border-b border-[#00ff41]/10 flex items-center gap-3 hover:bg-[#00ff41]/5 transition-all text-left ${
                        isSelected ? 'bg-[#00ff41]/10 border-l-2 border-l-[#00ff41]' : ''
                      }`}
                    >
                      <img src={participantPhoto} alt={participantName} className="w-10 h-10 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-mono font-bold truncate">{participantName}</p>
                        {chat.jobId && (
                          <p className="text-[#00ff41]/70 text-xs font-mono truncate">Job Related</p>
                        )}
                        <p className="text-gray-500 text-xs font-mono truncate">{chat.lastMessage || 'No messages yet'}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        {currentChat ? (
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.15)] overflow-hidden flex flex-col h-[700px]">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-[#00ff41]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={getParticipantPhoto(currentChat)} alt={getParticipantName(currentChat)} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-white font-mono font-bold">{getParticipantName(currentChat)}</p>
                    {currentChat.jobId && (
                      <p className="text-[#00ff41]/70 text-xs font-mono">💼 Job Related</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" data-messages>
                {currentChat.messages && currentChat.messages.length > 0 ? (
                  currentChat.messages.map((msg, idx) => {
                    const senderId = typeof msg.senderId === 'string' ? msg.senderId : msg.senderId?._id
                    const isSent = senderId === currentUserId
                    return (
                      <div key={idx} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg font-mono text-sm ${
                            isSent
                              ? 'bg-[#00ff41] text-black'
                              : 'bg-[#1a1a1a] border border-[#00ff41]/30 text-white'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${isSent ? 'text-black/70' : 'text-gray-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p className="font-mono text-center">Start a conversation!</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-[#00ff41]/20">
                {error && (
                  <div className="mb-2 p-2 bg-red-500/20 text-red-300 rounded text-xs font-mono">
                    {error}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#1a1a1a] border border-[#00ff41]/30 rounded-lg px-4 py-2 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#00ff41]"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !message.trim()}
                    className="px-6 py-2 bg-[#00ff41] text-black font-mono font-bold rounded-lg hover:bg-[#0df0a0] transition-all disabled:opacity-50"
                  >
                    {loading ? '...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.15)] h-[700px] flex items-center justify-center">
              <p className="text-gray-500 font-mono text-center">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
