'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useEffect } from 'react'
import { BookOpen, Users, BarChart3, Zap } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (user) {
      // Redirect to appropriate dashboard
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
      }
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm dark:shadow-slate-900/50 sticky top-0 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
           <strong><em>Zenith</em></strong>
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium 
                         transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 
                         active:translate-y-0"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 animate-fade-in-up">
          Intelligent Timetable & Academic Management
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto animate-fade-in-up stagger-1">
          A comprehensive solution for students, teachers, and parents to manage academics, track attendance, and optimize timetables with AI-powered insights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1
                          animate-fade-in-up stagger-1">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Smart Timetable</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">AI-optimized class scheduling with automatic conflict resolution</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1
                          animate-fade-in-up stagger-2">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Role-Based Access</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Customized dashboards for students, teachers, and parents</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1
                          animate-fade-in-up stagger-3">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-violet-600 dark:text-violet-400" size={24} />
            </div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Analytics</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time attendance, marks, and performance tracking</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1
                          animate-fade-in-up stagger-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="text-amber-600 dark:text-amber-400" size={24} />
            </div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Notifications</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Instant alerts for attendance, assignments, and performance</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-8 mb-12 max-w-2xl mx-auto animate-fade-in-up stagger-3">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Key Features</h3>
          <ul className="space-y-3 text-left">
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">✓</span>
              <span className="text-slate-700 dark:text-slate-300">Student Dashboard: View timetable, attendance, assignments, and marks</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">✓</span>
              <span className="text-slate-700 dark:text-slate-300">Teacher Dashboard: Mark attendance, upload assignments and marks</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">✓</span>
              <span className="text-slate-700 dark:text-slate-300">Parent Dashboard: Monitor child's progress and attendance</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">✓</span>
              <span className="text-slate-700 dark:text-slate-300">AI Timetable Optimization: Auto-detect and resolve conflicts</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">✓</span>
              <span className="text-slate-700 dark:text-slate-300">Notes & Collaboration: Share notes and educational resources</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">✓</span>
              <span className="text-slate-700 dark:text-slate-300">Direct Messaging: Teacher-parent communication</span>
            </li>
          </ul>
        </div>

        <button
          onClick={() => router.push('/login')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-lg 
                     transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 
                     active:translate-y-0 animate-fade-in-up stagger-4"
        >
          Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2 font-medium">Zenith © 2026</p>
          
        </div>
      </footer>
    </div>
  )
}
