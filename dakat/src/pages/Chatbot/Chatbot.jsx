import React, { useState } from 'react'

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi! 👋 I\'m Shadow Assistant. How can I help you today?', time: 'now' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const faqs = [
    { question: 'How do payments work?', answer: 'Payments are held in escrow and released after you complete work and the client approves it.' },
    { question: 'How can I track my hours?', answer: 'Use the Task Dashboard to log your work hours. This is important for after-hours work tracking.' },
    { question: 'Can I use the office space?', answer: 'Yes! Full-time workers get access to our physical co-working office with quiet workspace.' },
    { question: 'How do ratings work?', answer: 'Both clients and freelancers can rate each other after completing projects. This builds trust!' }
  ]

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages([...messages, userMessage])
    setInput('')

    // Simulate bot typing
    setIsTyping(true)
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        sender: 'bot',
        text: generateBotResponse(input),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }

  const generateBotResponse = (userText) => {
    const text = userText.toLowerCase()
    
    if (text.includes('payment') || text.includes('money') || text.includes('earn')) {
      return 'Payments are secure and handled through our escrow system. Clients deposit funds upfront, and you receive them after project approval. Would you like to know more about payout methods?'
    } else if (text.includes('job') || text.includes('match') || text.includes('work')) {
      return 'Our AI matching system finds jobs based on your skills and availability. You can filter by after-hours work to balance your day job! Check out your Job Matching dashboard.'
    } else if (text.includes('hour') || text.includes('time') || text.includes('break')) {
      return 'Your Task Dashboard tracks all work hours. We also have burnout protection features that remind you to take breaks! Your health matters to us.'
    } else if (text.includes('rating') || text.includes('review') || text.includes('trust')) {
      return 'Ratings build your reputation! Both clients and freelancers rate each other. A high rating (4+⭐) helps you attract better projects.'
    } else if (text.includes('office') || text.includes('location') || text.includes('space')) {
      return 'We offer physical co-working offices for full-timers! Quiet workspace after hours, meeting rooms, and a supportive community. Very unique feature!'
    } else if (text.includes('drop') || text.includes('transport') || text.includes('ride')) {
      return 'Our Shuvidha service picks you up from home/office and drops you safely at night. Perfect for late-hour workers who commute!'
    } else if (text.includes('gadget') || text.includes('laptop') || text.includes('discount')) {
      return 'Check out our Gadget Discount Shop! Exclusive discounts on laptops, keyboards, mice, headphones, and more - only for registered workers!'
    } else {
      return 'I\'m here to help with payments, job matching, task tracking, ratings, office features, and more! What would you like to know?'
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-4xl mx-auto px-4 flex flex-col h-[calc(100vh-120px)]">
        
        {/* Chat Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🤖</div>
          <h1 className="text-3xl font-bold text-white font-mono mb-2">
            Shadow <span className="text-[#00ff41]">Assistant</span>
          </h1>
          <p className="text-gray-400 font-mono">24/7 AI Support</p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md px-6 py-4 rounded-xl font-mono text-sm ${
                msg.sender === 'user'
                  ? 'bg-[#00ff41] text-black'
                  : 'bg-[#1a1a1a] border border-[#00ff41]/30 text-white'
              }`}>
                <p className="mb-2">{msg.text}</p>
                <p className={`text-xs ${msg.sender === 'user' ? 'text-black/70' : 'text-gray-400'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#1a1a1a] border border-[#00ff41]/30 text-white px-6 py-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Suggestions */}
        {messages.length === 1 && (
          <div className="mb-6">
            <p className="text-gray-400 font-mono text-sm mb-3">Quick questions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {faqs.map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(faq.question)}
                  className="text-left p-3 bg-[#1a1a1a] border border-[#00ff41]/20 rounded-lg hover:border-[#00ff41] hover:bg-[#00ff41]/5 transition-all text-white font-mono text-xs"
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about payments, jobs, hours tracking..."
              className="flex-1 bg-[#0a0a0a] border border-[#00ff41]/30 rounded-lg px-4 py-3 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-[#00ff41]"
            />
            <button
              onClick={handleSendMessage}
              disabled={isTyping || !input.trim()}
              className="px-6 py-3 bg-[#00ff41] text-black font-mono font-bold rounded-lg hover:bg-[#0df0a0] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Send
            </button>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '💰', label: 'Payments' },
            { icon: '⏱️', label: 'Time Track' },
            { icon: '🤝', label: 'Ratings' },
            { icon: '🏢', label: 'Office' }
          ].map((feature, idx) => (
            <div key={idx} className="text-center p-2">
              <div className="text-3xl mb-1">{feature.icon}</div>
              <p className="text-gray-400 text-xs font-mono">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Chatbot
