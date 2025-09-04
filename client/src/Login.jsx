import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token)
        setMessage('Login successful!')
        setIsAuthenticated(true)
        navigate('/dashboard')
      } else {
        setMessage(data.message || 'Login failed')
      }
    } catch (err) {
      setMessage('Error connecting to server')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome back to Mutual Fund Portal
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input-field mt-1"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field mt-1"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className={`text-sm text-center p-3 rounded-lg ${
              message.includes('successful') 
                ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300' 
                : 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}>
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login 