import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GadgetShop = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [filterCategory, setFilterCategory] = useState('all')
  const [freelancerBalance, setFreelancerBalance] = useState(2450)

  const gadgets = [
    {
      id: 1,
      name: 'Pro Laptop - 15" OLED',
      category: 'laptop',
      originalPrice: 2499,
      discountedPrice: 1999,
      discount: 20,
      image: '💻',
      specs: 'Intel i7, 16GB RAM, 512GB SSD',
      rating: 4.8,
      reviews: 324
    },
    {
      id: 2,
      name: 'Mechanical Keyboard - RGB',
      category: 'keyboard',
      originalPrice: 199,
      discountedPrice: 129,
      discount: 35,
      image: '⌨️',
      specs: '80% Layout, Hotswap, Wireless',
      rating: 4.9,
      reviews: 587
    },
    {
      id: 3,
      name: 'Ergonomic Mouse',
      category: 'mouse',
      originalPrice: 89,
      discountedPrice: 49,
      discount: 45,
      image: '🖱️',
      specs: 'Vertical Design, Precision Tracking',
      rating: 4.6,
      reviews: 412
    },
    {
      id: 4,
      name: 'Studio Headphones',
      category: 'headphones',
      originalPrice: 399,
      discountedPrice: 249,
      discount: 38,
      image: '🎧',
      specs: 'Active Noise Cancelling, 40h Battery',
      rating: 4.7,
      reviews: 856
    },
    {
      id: 5,
      name: 'Ultrabook - Lightweight',
      category: 'laptop',
      originalPrice: 1999,
      discountedPrice: 1599,
      discount: 20,
      image: '💻',
      specs: 'AMD Ryzen 5, 8GB RAM, 256GB SSD, 2.2kg',
      rating: 4.8,
      reviews: 213
    },
    {
      id: 6,
      name: 'Wireless Mouse - Silent',
      category: 'mouse',
      originalPrice: 59,
      discountedPrice: 39,
      discount: 34,
      image: '🖱️',
      specs: 'Silent Clicks, 18-Month Battery',
      rating: 4.5,
      reviews: 325
    },
    {
      id: 7,
      name: 'Gaming Keyboard - Compact',
      category: 'keyboard',
      originalPrice: 149,
      discountedPrice: 99,
      discount: 34,
      image: '⌨️',
      specs: '60% Layout, Programmable Keys',
      rating: 4.7,
      reviews: 478
    },
    {
      id: 8,
      name: 'Wireless Earbuds - Pro',
      category: 'headphones',
      originalPrice: 299,
      discountedPrice: 179,
      discount: 40,
      image: '🎧',
      specs: 'Spatial Audio, 8h Playback',
      rating: 4.9,
      reviews: 1203
    }
  ]

  const filteredGadgets = filterCategory === 'all' 
    ? gadgets 
    : gadgets.filter(g => g.category === filterCategory)

  const addToCart = (gadget) => {
    if (gadget.discountedPrice > freelancerBalance - getTotalPrice()) {
      alert(`❌ Insufficient balance! You need $${gadget.discountedPrice} but have $${(freelancerBalance - getTotalPrice()).toFixed(2)} remaining.`)
      return
    }
    setCartItems([...cartItems, gadget])
  }

  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index))
  }

  const checkout = () => {
    const total = getTotalPrice()
    if (total > freelancerBalance) {
      alert('❌ Insufficient balance!')
      return
    }
    setFreelancerBalance(freelancerBalance - total)
    alert(`✅ Purchase successful! ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} purchased for $${total}. New balance: $${(freelancerBalance - total).toFixed(2)}`)
    setCartItems([])
  }

  const getTotalSavings = () => {
    return cartItems.reduce((sum, item) => sum + (item.originalPrice - item.discountedPrice), 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.discountedPrice, 0)
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white font-mono mb-4">
                <span className="text-[#00ff41]">🛍️</span> Gadget Discount Shop
              </h1>
              <p className="text-gray-400 font-mono mb-6">Exclusive discounts for Shadow Hire workers</p>
              
              <div className="inline-block bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-lg px-4 py-2">
                <p className="text-[#00ff41] font-mono text-sm">✨ 20-45% OFF on all products • Registered workers only</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#00ff41]/20 to-[#00ff41]/5 border border-[#00ff41]/50 rounded-lg p-6 text-right">
              <p className="text-gray-400 font-mono text-sm mb-2">YOUR WALLET BALANCE</p>
              <p className="text-3xl font-bold text-[#00ff41] font-mono">${freelancerBalance.toFixed(2)}</p>
              <p className="text-gray-500 font-mono text-xs mt-2">💰 Earned from completed tasks</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-3 px-3 py-1 text-xs bg-[#00ff41] text-black font-mono rounded hover:bg-[#0df0a0] transition-all"
              >
                View Tasks
              </button>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="bg-gradient-to-r from-[#00ff41]/10 via-transparent to-[#00ff41]/10 border border-[#00ff41]/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 font-mono mb-2">CART SUMMARY</p>
                <div className="flex gap-12">
                  <div>
                    <p className="text-[#00ff41] font-mono font-bold">${getTotalPrice()}</p>
                    <p className="text-xs text-gray-400 font-mono">Total Price</p>
                  </div>
                  <div>
                    <p className="text-green-400 font-mono font-bold">${getTotalSavings()}</p>
                    <p className="text-xs text-gray-400 font-mono">You Save</p>
                  </div>
                  <div>
                    <p className="text-purple-400 font-mono font-bold">{cartItems.length}</p>
                    <p className="text-xs text-gray-400 font-mono">Items</p>
                  </div>
                  <div>
                    <p className={`font-mono font-bold ${getTotalPrice() > freelancerBalance ? 'text-red-400' : 'text-green-400'}`}>
                      ${(freelancerBalance - getTotalPrice()).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">Remaining</p>
                  </div>
                </div>
              </div>
              <button
                onClick={checkout}
                disabled={getTotalPrice() > freelancerBalance}
                className="px-8 py-3 bg-[#00ff41] text-black font-mono font-bold rounded-lg hover:bg-[#0df0a0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getTotalPrice() > freelancerBalance ? '❌ Insufficient Balance' : 'Checkout'}
              </button>
            </div>

            {/* Cart Items List */}
            <div className="mt-4 pt-4 border-t border-[#00ff41]/30">
              <p className="text-gray-400 font-mono text-sm mb-3">ITEMS IN CART:</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-black/50 p-2 rounded">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{item.image}</span>
                      <div>
                        <p className="text-white font-mono text-sm">{item.name}</p>
                        <p className="text-gray-500 text-xs font-mono">${item.discountedPrice}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="px-2 py-1 text-red-400 hover:bg-red-600/20 rounded text-xs"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8">
          <p className="text-gray-400 font-mono text-sm mb-4">FILTER BY CATEGORY</p>
          <div className="flex gap-3 flex-wrap">
            {[
              { id: 'all', label: 'All Products' },
              { id: 'laptop', label: '💻 Laptops' },
              { id: 'keyboard', label: '⌨️ Keyboards' },
              { id: 'mouse', label: '🖱️ Mouse' },
              { id: 'headphones', label: '🎧 Headphones' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-6 py-2 rounded-lg font-mono font-bold transition-all ${
                  filterCategory === cat.id
                    ? 'bg-[#00ff41] text-black'
                    : 'border border-[#00ff41]/30 text-[#00ff41] hover:border-[#00ff41]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredGadgets.map((gadget) => (
            <div key={gadget.id} className="group relative bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.15)] hover:shadow-[0_0_80px_rgba(0,255,65,0.25)] transition-all overflow-hidden">
              
              {/* Discount Badge */}
              <div className="absolute top-4 right-4 bg-red-500 text-white font-mono font-bold text-xs px-3 py-1 rounded-lg z-10">
                -{gadget.discount}%
              </div>

              {/* Product Image */}
              <div className="p-8 text-center bg-[#1a1a1a]/50">
                <div className="text-6xl mb-4">{gadget.image}</div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-white font-mono font-bold mb-2 text-sm">{gadget.name}</h3>
                <p className="text-gray-400 text-xs font-mono mb-4 line-clamp-2">{gadget.specs}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#00ff41]">★</span>
                  <span className="text-white font-mono text-sm">{gadget.rating}</span>
                  <span className="text-gray-500 text-xs font-mono">({gadget.reviews})</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-bold text-[#00ff41] font-mono">${gadget.discountedPrice}</span>
                    <span className="text-gray-500 line-through text-sm font-mono">${gadget.originalPrice}</span>
                  </div>
                  <p className="text-green-400 text-xs font-mono">Save ${gadget.originalPrice - gadget.discountedPrice}</p>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(gadget)}
                  className="w-full px-4 py-2 bg-[#00ff41] text-black font-mono font-bold rounded-lg hover:bg-[#0df0a0] transition-all transform group-hover:scale-105"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] border border-[#00ff41]/30 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white font-mono mb-8">Why Shop With Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-white font-mono font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-400 text-sm font-mono">All transactions are encrypted & protected</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-white font-mono font-bold mb-2">Fast Shipping</h3>
              <p className="text-gray-400 text-sm font-mono">Delivered within 2-3 business days</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">↩️</div>
              <h3 className="text-white font-mono font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-400 text-sm font-mono">30-day return policy, no questions asked</p>
            </div>
          </div>
        </div>

        {/* Exclusive Deals */}
        <div className="bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 border border-purple-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white font-mono mb-4">🎁 This Week's Flash Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#1a1a1a]/50 border border-purple-500/20 rounded-lg">
              <p className="text-[#00ff41] font-mono font-bold mb-1">Mechanical Keyboard Bundle</p>
              <p className="text-gray-400 text-sm font-mono">Get keyboard + mousepad for $99 (Save $80!)</p>
            </div>
            <div className="p-4 bg-[#1a1a1a]/50 border border-purple-500/20 rounded-lg">
              <p className="text-[#00ff41] font-mono font-bold mb-1">Laptop Accessories Pack</p>
              <p className="text-gray-400 text-sm font-mono">Mouse + Headphones + Cable for $149 (Save $140!)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GadgetShop
