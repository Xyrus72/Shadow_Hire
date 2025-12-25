import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAuth from '../../../hooks/useAuth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginMethod, setLoginMethod] = useState('gmail') // 'gmail' or 'password'
  const { signInWithGoogle, signIn } = useAuth()
  const navigate = useNavigate()

  const handleGoogleLogin = async (e) => {
    e.preventDefault()

    if (!userType) {
      setError('Please select your role')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await signInWithGoogle()
      const user = result.user

      if (!user.uid || !user.email) {
        throw new Error('Failed to get user information from Google')
      }

      // Send user data to backend for login verification
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          userType
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Login failed')
      }

      const data = await response.json()

      // Store token and user info
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('shadowUser', JSON.stringify({
        id: data.user._id,
        name: data.user.displayName,
        email: data.user.email,
        userType: data.user.userType,
        photoURL: data.user.photoURL
      }))

      console.log('User logged in:', data.user.displayName)

      // Redirect to appropriate dashboard based on user type
      if (data.user.userType === 'freelancer') {
        navigate('/developer-dashboard')
      } else if (data.user.userType === 'client') {
        navigate('/client-dashboard')
      } else {
        navigate('/profile')
      }
    } catch (error) {
      console.error('Google login error:', error.message)
      setError(error.message || 'Failed to login with Gmail')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordLogin = async (e) => {
    e.preventDefault()

    if (!email || !password || !userType) {
      setError('Please fill all fields and select your role')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Sign in with Firebase
      const result = await signIn(email, password)
      const user = result.user

      if (!user.uid || !user.email) {
        throw new Error('Failed to get user information')
      }

      // Send to backend for verification
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          userType
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Login failed')
      }

      const data = await response.json()

      // Store token and user info
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('shadowUser', JSON.stringify({
        id: data.user._id,
        name: data.user.displayName,
        email: data.user.email,
        userType: data.user.userType,
        photoURL: data.user.photoURL
      }))

      console.log('User logged in:', data.user.displayName)

      // Redirect to appropriate dashboard
      if (data.user.userType === 'freelancer') {
        navigate('/developer-dashboard')
      } else if (data.user.userType === 'client') {
        navigate('/client-dashboard')
      } else {
        navigate('/profile')
      }
    } catch (error) {
      console.error('Password login error:', error.message)
      setError(error.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Sign In</h1>
        <p className="text-gray-400 text-center mb-8">Welcome back</p>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Role Selection - Always Required */}
        <div className="mb-6">
          <label className="block text-[#00ff41] font-bold mb-3">Select Your Role</label>
          <div className="space-y-2">
            {[
              { value: 'freelancer', label: '👨‍💻 Freelancer' },
              { value: 'client', label: '💼 Client' },
              { value: 'admin', label: '👑 Admin' }
            ].map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => setUserType(type.value)}
                className={`w-full p-3 rounded border-2 transition ${
                  userType === type.value
                    ? 'bg-[#00ff41] text-black border-[#00ff41] font-bold'
                    : 'bg-[rgba(0,255,65,0.04)] text-gray-300 border-[rgba(0,255,65,0.2)] hover:border-[#00ff41]/50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Login Method Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          <button
            type="button"
            onClick={() => setLoginMethod('gmail')}
            className={`flex-1 py-2 font-semibold transition ${
              loginMethod === 'gmail'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Gmail
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('password')}
            className={`flex-1 py-2 font-semibold transition ${
              loginMethod === 'password'
                ? 'text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Email & Password
          </button>
        </div>

        {/* Gmail Login */}
        {loginMethod === 'gmail' && (
          <form onSubmit={handleGoogleLogin} className="space-y-4">
            <button
              type="submit"
              disabled={isLoading || !userType}
              className="w-full bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Gmail
                </>
              )}
            </button>
          </form>
        )}

        {/* Password Login */}
        {loginMethod === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00ff41] text-black font-bold py-3 rounded-lg hover:bg-[#00dd33] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Sign Up Link */}
        <div className="text-center text-sm text-gray-400 mt-6">
          Don't have an account? 
          <Link to="/auth/register" className="text-[#00ff41] hover:underline ml-1">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
