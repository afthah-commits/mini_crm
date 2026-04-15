import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form)
      toast.success('Login successful')
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="muted mt-1 text-sm">Access your lead management dashboard.</p>
        <div className="mt-4 space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="field w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="field w-full"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-4 w-full"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p className="muted mt-4 text-sm">
          No account?{' '}
          <Link to="/register" className="font-medium" style={{ color: 'var(--brand)' }}>
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
