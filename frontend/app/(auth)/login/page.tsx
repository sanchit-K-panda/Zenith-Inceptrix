'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authAPI } from '@/lib/api/client'
import { useAuthStore } from '@/lib/store/authStore'
import ThemeToggle from '@/components/ThemeToggle'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login(formData.email, formData.password)
      const { token, user } = response.data

      login(user, token)

      // Redirect based on role
      switch (user.role) {
        case 'student':
          router.push('/student/dashboard')
          break
        case 'teacher':
          router.push('/teacher/dashboard')
          break
        case 'parent':
          router.push('/parent/dashboard')
          break
        case 'admin':
          router.push('/admin/dashboard')
          break
        default:
          router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Academic Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Intelligent Timetable & Academic Management</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg 
                           bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                           focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                           transition-all duration-200 outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg 
                           bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                           focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                           transition-all duration-200 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold 
                         transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 
                         active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-100 dark:border-slate-700 pt-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-semibold">Demo Credentials:</p>
            <div className="space-y-2 text-sm bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <p className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Student:</span> <span className="font-mono text-slate-700 dark:text-slate-300">student1@dashboard.com</span></p>
              <p className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Teacher:</span> <span className="font-mono text-slate-700 dark:text-slate-300">teacher1@dashboard.com</span></p>
              <p className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Parent:</span> <span className="font-mono text-slate-700 dark:text-slate-300">parent1@dashboard.com</span></p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">Password for all: Role@123 (e.g., Student@123)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
