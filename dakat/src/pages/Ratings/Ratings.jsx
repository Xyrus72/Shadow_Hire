import React, { useState } from 'react'

const Ratings = () => {
  const [activeTab, setActiveTab] = useState('given')
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [ratingText, setRatingText] = useState('')

  const givenRatings = [
    {
      id: 1,
      clientName: 'Tech Startup',
      project: 'React Dashboard Development',
      rating: 5,
      comment: 'Excellent work! Delivered on time and exceeded expectations. Will hire again!',
      date: '2024-12-20',
      avatar: 'https://ui-avatars.com/api/?name=TechStartup'
    },
    {
      id: 2,
      clientName: 'Creative Agency',
      project: 'UI/UX Design Mockups',
      rating: 4,
      comment: 'Great designs but needed some revisions. Communication was smooth.',
      date: '2024-12-15',
      avatar: 'https://ui-avatars.com/api/?name=CreativeAgency'
    }
  ]

  const receivedRatings = [
    {
      id: 1,
      clientName: 'Tech Startup',
      rating: 5,
      comment: 'Perfect freelancer! Professional, responsive, and delivers quality work.',
      date: '2024-12-20',
      avatar: 'https://ui-avatars.com/api/?name=TechStartup',
      verified: true
    },
    {
      id: 2,
      clientName: 'E-commerce Co',
      rating: 4,
      comment: 'Good work overall. Some delays in the beginning but recovered well.',
      date: '2024-12-10',
      avatar: 'https://ui-avatars.com/api/?name=EcommerceCo',
      verified: true
    },
    {
      id: 3,
      clientName: 'Creative Agency',
      rating: 5,
      comment: 'Fantastic collaboration! Very detail-oriented and flexible with changes.',
      date: '2024-12-05',
      avatar: 'https://ui-avatars.com/api/?name=CreativeAgency',
      verified: true
    }
  ]

  const averageRating = (receivedRatings.reduce((sum, r) => sum + r.rating, 0) / receivedRatings.length).toFixed(1)
  const ratingDistribution = {
    5: receivedRatings.filter(r => r.rating === 5).length,
    4: receivedRatings.filter(r => r.rating === 4).length,
    3: receivedRatings.filter(r => r.rating === 3).length,
    2: receivedRatings.filter(r => r.rating === 2).length,
    1: receivedRatings.filter(r => r.rating === 1).length,
  }

  const RatingStars = ({ rating, onChange, interactive = false }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onChange(star)}
          className={`text-3xl transition-all ${
            star <= rating ? 'text-[#00ff41]' : 'text-gray-600'
          } ${interactive ? 'cursor-pointer hover:scale-125' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white font-mono mb-4">
            Ratings & <span className="text-[#00ff41]">Reviews</span>
          </h1>
          <p className="text-gray-400 font-mono">Build trust through quality work</p>
        </div>

        {/* Rating Summary Card */}
        <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.15)] p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Side - Overall Rating */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-7xl font-bold text-[#00ff41] font-mono mb-4">{averageRating}</div>
              <RatingStars rating={Math.round(parseFloat(averageRating))} />
              <p className="text-gray-400 font-mono mt-4">Based on {receivedRatings.length} reviews</p>
            </div>

            {/* Right Side - Rating Distribution */}
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-[#00ff41] font-mono font-bold w-4">{star}</span>
                  <span className="text-[#00ff41]">★</span>
                  <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00ff41]"
                      style={{ width: `${(ratingDistribution[star] / receivedRatings.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-400 font-mono text-sm w-12 text-right">{ratingDistribution[star]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#00ff41]/20">
          <button
            onClick={() => setActiveTab('given')}
            className={`px-6 py-3 font-mono font-bold transition-all ${
              activeTab === 'given'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Ratings Given ({givenRatings.length})
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`px-6 py-3 font-mono font-bold transition-all ${
              activeTab === 'received'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Ratings Received ({receivedRatings.length})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'given' ? (
            <>
              {givenRatings.map((rating) => (
                <div key={rating.id} className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl p-6 hover:border-[#00ff41]/50 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={rating.avatar} alt={rating.clientName} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-mono font-bold">{rating.clientName}</h3>
                        <span className="text-gray-500 text-sm font-mono">{new Date(rating.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[#00ff41]/70 text-sm font-mono mb-3">{rating.project}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <RatingStars rating={rating.rating} />
                  </div>
                  
                  <p className="text-gray-300 font-mono text-sm">{rating.comment}</p>
                </div>
              ))}

              {givenRatings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 font-mono mb-4">You haven't given any ratings yet</p>
                </div>
              )}
            </>
          ) : (
            <>
              {receivedRatings.map((rating) => (
                <div key={rating.id} className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl p-6 hover:border-[#00ff41]/50 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={rating.avatar} alt={rating.clientName} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-mono font-bold">{rating.clientName}</h3>
                          {rating.verified && (
                            <span className="text-[#00ff41] text-xs font-mono bg-[#00ff41]/10 px-2 py-1 rounded">✓ Verified</span>
                          )}
                        </div>
                        <span className="text-gray-500 text-sm font-mono">{new Date(rating.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <RatingStars rating={rating.rating} />
                  </div>
                  
                  <p className="text-gray-300 font-mono text-sm">{rating.comment}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Rating Form Modal */}
        {showRatingForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-white font-mono mb-6">Rate This Client</h2>
              
              <div className="mb-6">
                <p className="text-gray-400 font-mono text-sm mb-4">How was your experience?</p>
                <RatingStars rating={selectedRating} onChange={setSelectedRating} interactive />
              </div>

              <div className="mb-6">
                <textarea
                  value={ratingText}
                  onChange={(e) => setRatingText(e.target.value)}
                  placeholder="Share your experience (optional)"
                  className="w-full bg-[#1a1a1a] border border-[#00ff41]/30 rounded-lg px-4 py-3 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#00ff41] h-24 resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowRatingForm(false)}
                  className="flex-1 px-4 py-2 border border-[#00ff41] text-[#00ff41] font-mono font-bold rounded-lg hover:bg-[#00ff41]/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setShowRatingForm(false); setSelectedRating(0); setRatingText('') }}
                  className="flex-1 px-4 py-2 bg-[#00ff41] text-black font-mono font-bold rounded-lg hover:bg-[#0df0a0] transition-all"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Rating Button */}
        {activeTab === 'given' && (
          <button
            onClick={() => setShowRatingForm(true)}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-[#00ff41] text-black font-mono font-bold text-2xl hover:bg-[#0df0a0] transition-all shadow-[0_0_30px_rgba(0,255,65,0.3)]"
          >
            +
          </button>
        )}
      </div>
    </div>
  )
}

export default Ratings
