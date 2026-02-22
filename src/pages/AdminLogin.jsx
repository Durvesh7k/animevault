import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [shakeKey, setShakeKey] = useState(0)
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!email || !password) { triggerError('Please enter your email and password.'); return }
    setLoading(true)
    setError('')
    try {
      await login(email.trim(), password)
      navigate('/admin', { replace: true })
    } catch (err) {
      triggerError(err.message || 'Invalid credentials. Please try again.')
      setPassword('')
    }
    setLoading(false)
  }

  const triggerError = (msg) => {
    setShakeKey(k => k + 1)
    setError(msg)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative">
      {/* Mesh bg */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="mesh-blob-1" />
        <div className="mesh-blob-2" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md glass rounded-3xl p-10 overflow-hidden">
        {/* Rotating conic glow inside card */}
        <div className="absolute -top-1/2 -left-1/2 w-[220%] h-[220%] pointer-events-none animate-spin-slow"
             style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(124,58,237,0.07) 60deg, transparent 120deg)' }} />

        {/* Logo */}
        <div className="relative text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl
                          shadow-[0_8px_32px_rgba(124,58,237,0.45)]"
               style={{ background: 'linear-gradient(135deg,#7c3aed,#0891b2)' }}>
            🔐
          </div>
          <h1 className="font-display font-black text-2xl grad-text-accent mb-1">Admin Portal</h1>
          <p className="text-slate-600 text-xs tracking-wide">AnimeVault · Supabase Auth</p>
        </div>

        {/* Error */}
        {error && (
          <div key={shakeKey} className="flex items-center gap-2 px-4 py-3 mb-5 rounded-xl text-sm
                                         bg-red-500/10 border border-red-500/30 text-red-300 animate-shake">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Form */}
        <form className="relative flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[0.7rem] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
              Email
            </label>
            <input
              type="email" placeholder="admin@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              autoFocus autoComplete="email"
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-[0.7rem] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <input
              type="password" placeholder="Your password"
              value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              className="form-input"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="btn-grad w-full py-3 mt-1 rounded-xl text-base"
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p className="relative text-center text-[0.7rem] text-slate-700 mt-6 leading-relaxed">
          Create your admin user in Supabase Dashboard → Authentication → Users
        </p>
      </div>
    </div>
  )
}
