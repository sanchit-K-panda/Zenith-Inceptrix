'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { timetableAPI, attendanceAPI, marksAPI, assignmentAPI, notesAPI } from '@/lib/api/client'
import { Calendar, BookOpen, Award, FileText, LogOut, Download, StickyNote } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import WeeklyCalendar from '@/components/WeeklyCalendar'

export default function StudentDashboard() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [timetable, setTimetable] = useState([])
  const [attendance, setAttendance] = useState(null)
  const [marks, setMarks] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const [ttRes, attRes, marksRes, assignRes, notesRes] = await Promise.all([
          timetableAPI.getMyTimetable(),
          attendanceAPI.getMyAttendance(),
          marksAPI.getMyMarks(),
          assignmentAPI.getAssignments(),
          notesAPI.getStudentNotes(),
        ])

        setTimetable(ttRes.data)
        setAttendance(attRes.data.statistics)
        setMarks(marksRes.data.statistics)
        setAssignments(assignRes.data)
        setNotes(notesRes.data)
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm dark:shadow-slate-800/50 sticky top-0 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Student Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome, {user?.firstName} {user?.lastName}</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium
                         transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
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
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
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
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center">
                <Award className="text-emerald-600 dark:text-emerald-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                          animate-fade-in-up stagger-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Assignments</p>
                <p className="text-3xl font-bold text-violet-600 dark:text-violet-400 mt-1">{assignments.length}</p>
              </div>
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/50 rounded-xl flex items-center justify-center">
                <FileText className="text-violet-600 dark:text-violet-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                          animate-fade-in-up stagger-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Classes</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{timetable.length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
                <BookOpen className="text-amber-600 dark:text-amber-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Calendar Timetable */}
        <div className="mb-8 animate-fade-in-up stagger-2">
          <WeeklyCalendar timetable={timetable} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg animate-fade-in-up stagger-3">
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-slate-100">Recent Assignments</h3>
            {assignments.length > 0 ? (
              assignments.slice(0, 3).map((assignment: any) => (
                <div key={assignment._id} className="mb-3 pb-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{assignment.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{assignment.subject}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm">No assignments</p>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg animate-fade-in-up stagger-4">
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-slate-100">Attendance Trend</h3>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{attendance?.percentage || 0}%</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {attendance?.present || 0} Present / {attendance?.total || 0} Classes
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg animate-fade-in-up stagger-5">
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-slate-100">Academic Performance</h3>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{marks?.averagePercentage || 0}%</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Average Score</p>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mt-8 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
              <StickyNote className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Study Notes</h2>
          </div>
          
          {notes.length > 0 ? (
            <div className="space-y-6">
              {/* Group notes by subject */}
              {Object.entries(
                notes.reduce((acc: any, note: any) => {
                  const subject = note.subject || 'General';
                  if (!acc[subject]) acc[subject] = [];
                  acc[subject].push(note);
                  return acc;
                }, {})
              ).map(([subject, subjectNotes]: [string, any]) => (
                <div key={subject}>
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">{subject}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjectNotes.map((note: any) => (
                      <div
                        key={note._id}
                        className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50 
                                   transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-0.5"
                      >
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{note.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{note.content}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                          <span>By {note.creator?.firstName} {note.creator?.lastName}</span>
                          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                        {note.attachments && note.attachments.length > 0 && (
                          <a
                            href={note.attachments[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium
                                       transition-colors"
                          >
                            <Download size={16} />
                            Download File
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">No notes available yet</p>
          )}
        </div>
      </main>
    </div>
  )
}
