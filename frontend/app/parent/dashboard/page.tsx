'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { attendanceAPI, marksAPI } from '@/lib/api/client'
import { AlertCircle, TrendingDown, Award, Calendar, LogOut } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

interface AttendanceStats {
  percentage?: number
  present?: number
  absent?: number
  total?: number
}

interface MarksStats {
  averagePercentage?: number
  totalExams?: number
  passedExams?: number
}

export default function ParentDashboard() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [attendance, setAttendance] = useState<AttendanceStats | null>(null)
  const [marks, setMarks] = useState<MarksStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        // Mock student ID - in real app would come from student data
        const studentId = '65a8e3c9d4f6b2a0c1d2e3f4'
        
        const [attRes, marksRes] = await Promise.all([
          attendanceAPI.getStudentAttendance(studentId).catch(() => ({ data: { statistics: {} } })),
          marksAPI.getMarks(studentId).catch(() => ({ data: { statistics: {} } })),
        ])

        setAttendance(attRes.data.statistics)
        setMarks(marksRes.data.statistics)
        
        // Check if attendance is low
        if (attRes.data.statistics.percentage < 75) {
          setShowAlert(true)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm dark:shadow-slate-900/50 sticky top-0 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Parent Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome, {user?.firstName} {user?.lastName}</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium
                       transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Alert Banner */}
        {showAlert && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-4 animate-scale-in">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-red-900 dark:text-red-300">Low Attendance Alert</h3>
              <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                Your child's attendance is below 75%. Please take necessary action to improve attendance.
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                          animate-fade-in-up stagger-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Attendance</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{attendance?.percentage || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                          animate-fade-in-up stagger-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Average Marks</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{marks?.averagePercentage || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <Award className="text-emerald-600 dark:text-emerald-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                          animate-fade-in-up stagger-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Classes Present</p>
                <p className="text-3xl font-bold text-violet-600 dark:text-violet-400 mt-1">{attendance?.present || 0}</p>
              </div>
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                <TrendingDown className="text-violet-600 dark:text-violet-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                          animate-fade-in-up stagger-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Classes Missed</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{attendance?.absent || 0}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <AlertCircle className="text-amber-600 dark:text-amber-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Student Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attendance Trend */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg animate-fade-in-up stagger-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Attendance Summary</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Present</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{attendance?.present || 0} classes</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                  <div 
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${(attendance?.present || 0) / (attendance?.total || 1) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Absent</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{attendance?.absent || 0} classes</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                  <div 
                    className="bg-red-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${(attendance?.absent || 0) / (attendance?.total || 1) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Classes: {attendance?.total || 0}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Overall Percentage: <strong className="text-slate-900 dark:text-slate-100">{attendance?.percentage || 0}%</strong></p>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg animate-fade-in-up stagger-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Academic Performance</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Average Score</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{marks?.averagePercentage || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${marks?.averagePercentage || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Exams: {marks?.total || 0}</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Performance Status:</strong> {
                    marks?.averagePercentage >= 80 
                      ? '✓ Excellent' 
                      : marks?.averagePercentage >= 70 
                        ? '✓ Good' 
                        : marks?.averagePercentage >= 60 
                          ? '⚠ Needs Improvement' 
                          : '✗ Poor'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mt-8 animate-fade-in-up stagger-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Contact Teachers</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            Send messages to teachers to discuss your child's progress and any concerns.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium
                             transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
            Send Message
          </button>
        </div>
      </main>
    </div>
  )
}
