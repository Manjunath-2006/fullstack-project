import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLoading } from '../context/LoadingContext'
import { authApi } from '../services/api'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const { wrap }  = useLoading()

  const [mode, setMode]   = useState('login')   // 'login' | 'register'
  const [show, setShow]   = useState(false)
  const [showC, setShowC] = useState(false)

  const [loginForm, setLoginForm]       = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirm: '' })

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await wrap(() => login(loginForm.email, loginForm.password), 'Signing in...')
      toast.success('Welcome back!')
    } catch {
      toast.error('Invalid email or password.')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (registerForm.password !== registerForm.confirm) {
      toast.error('Passwords do not match.')
      return
    }
    if (registerForm.password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    try {
      await wrap(async () => {
        await authApi.registerAdmin({
          name:     registerForm.name,
          email:    registerForm.email,
          password: registerForm.password,
        })
      }, 'Creating account...')
      toast.success('Admin account created! Please sign in.')
      setMode('login')
      setLoginForm({ email: registerForm.email, password: '' })
      setRegisterForm({ name: '', email: '', password: '', confirm: '' })
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Registration failed.'
      toast.error(msg)
    }
  }

  const inputCls = "w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-black focus:bg-white transition-all"

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 border-r border-gray-100 flex-col items-center justify-center p-16">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }} className="flex flex-col items-center">

          {/* Boxes animation */}
          <div className="boxes mb-20">
            {[1,2,3,4].map(n => (
              <div key={n} className="box">
                <div /><div /><div /><div />
              </div>
            ))}
          </div>

          {/* Logo + name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-xl">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h1 className="text-5xl font-black text-black">EduTrack</h1>
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Mode toggle — Web-Potato button style */}
          <div className="flex gap-4 justify-center mb-8">
            {[
              { key: 'login',    label: 'Sign In'  },
              { key: 'register', label: 'Register' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`btn-toggle ${mode === key ? 'active' : ''}`}
              >
                <span>{label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── Sign In ── */}
            {mode === 'login' && (
              <motion.div key="login"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <div className="mb-7">
                  <h2 className="text-2xl font-black text-black">Welcome back</h2>
                  <p className="text-gray-500 text-sm mt-1">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 block">Email</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-3.5 text-gray-400" />
                      <input type="email" required value={loginForm.email}
                        onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="your@email.edu" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 block">Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-3.5 text-gray-400" />
                      <input type={show ? 'text' : 'password'} required value={loginForm.password}
                        onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-black focus:bg-white transition-all" />
                      <button type="button" onClick={() => setShow(v => !v)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-black transition-colors">
                        {show ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-signin mt-2">Sign In</button>
                </form>
              </motion.div>
            )}

            {/* ── Register Admin ── */}
            {mode === 'register' && (
              <motion.div key="register"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <div className="mb-7">
                  <h2 className="text-2xl font-black text-black">Create Admin Account</h2>
                  <p className="text-gray-500 text-sm mt-1">Register a new administrator</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 block">Full Name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-3.5 text-gray-400" />
                      <input type="text" required value={registerForm.name}
                        onChange={e => setRegisterForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Dr. Jane Smith" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 block">Email</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-3.5 text-gray-400" />
                      <input type="email" required value={registerForm.email}
                        onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="admin@school.edu" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 block">Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-3.5 text-gray-400" />
                      <input type={show ? 'text' : 'password'} required value={registerForm.password}
                        onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                        placeholder="Min. 6 characters"
                        className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-black focus:bg-white transition-all" />
                      <button type="button" onClick={() => setShow(v => !v)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-black transition-colors">
                        {show ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 block">Confirm Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-3.5 text-gray-400" />
                      <input type={showC ? 'text' : 'password'} required value={registerForm.confirm}
                        onChange={e => setRegisterForm(f => ({ ...f, confirm: e.target.value }))}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-black focus:bg-white transition-all" />
                      <button type="button" onClick={() => setShowC(v => !v)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-black transition-colors">
                        {showC ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-signin mt-2">Create Account</button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
