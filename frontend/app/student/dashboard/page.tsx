'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/lib/store/authStore'
import {
  timetableAPI,
  attendanceAPI,
  marksAPI,
  assignmentAPI,
  notesAPI,
} from '@/lib/api/client'
import {
  Calendar,
  BookOpen,
  Award,
  FileText,
  LogOut,
  StickyNote,
  BarChart3,
  GraduationCap,
  User,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import TimetableTab from '@/components/student/TimetableTab'
import NotesTab from '@/components/student/NotesTab'
import AssignmentsTab from '@/components/student/AssignmentsTab'
import AttendanceTab from '@/components/student/AttendanceTab'

interface AttendanceStats {
  percentage?: number
  present?: number
  absent?: number
  late?: number
  total?: number
}

interface MarksStats {
  averagePercentage?: number
  totalExams?: number
  passedExams?: number
}

interface Assignment {
  _id: string
  title: string
  subject: string
  dueDate: string
  description?: string
  maxMarks?: number
  submissions?: any[]
}

interface Note {
  _id: string
  title: string
  subject: string
  content?: string
  attachments?: string[]
  isShared?: boolean
  creator?: {
    firstName?: string
    lastName?: string
    role?: string
  }
  createdAt?: string
}

interface TimetableEntry {
  _id: string
  subject: string
  dayOfWeek: string
  startTime: string
  endTime: string
  hall?: string
  teacher?: {
    userId?: {
      firstName?: string
      lastName?: string
    }
  }
  status?: 'ongoing' | 'cancelled' | 'rescheduled' | 'upcoming'
}

interface AttendanceRecord {
  _id: string
  date: string
  status: 'present' | 'absent' | 'late'
  subject?: string
  timetableId?: string
  timetable?: {
    subject?: string
  }
}

const tabConfig = [
  { id: 'timetable', label: 'Timetable', icon: Calendar },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'assignments', label: 'Assignments', icon: FileText },
  { id: 'attendance', label: 'Attendance', icon: BarChart3 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function StudentDashboard() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [activeTab, setActiveTab] = useState('timetable')
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null)
  const [marks, setMarks] = useState<MarksStats | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [ttRes, attRes, marksRes, assignRes, notesRes] = await Promise.all([
        timetableAPI.getMyTimetable(),
        attendanceAPI.getMyAttendance(),
        marksAPI.getMyMarks(),
        assignmentAPI.getAssignments(),
        notesAPI.getStudentNotes(),
      ])

      setTimetable(ttRes.data)
      setAttendance(attRes.data.records || attRes.data || [])
      setAttendanceStats(attRes.data.statistics)
      setMarks(marksRes.data.statistics)
      setAssignments(assignRes.data)
      setNotes(notesRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchData()
  }, [user, router, fetchData])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const refreshNotes = () => {
    notesAPI.getStudentNotes().then((res) => setNotes(res.data))
  }

  const refreshAssignments = () => {
    assignmentAPI.getAssignments().then((res) => setAssignments(res.data))
  }

  // Calculate pending assignments
  const pendingAssignments = assignments.filter((a) => {
    const submission = a.submissions?.find((s: any) => s.student === user?.id)
    return !submission && new Date(a.dueDate) > new Date()
  }).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 font-medium">Loading your dashboard...</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Please wait a moment</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-slate-800/50 sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Student Dashboard
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <User className="w-3.5 h-3.5" />
                <span>
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl font-medium
                         transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400
                         border border-slate-200 dark:border-slate-700"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  onClick={() => setActiveTab('attendance')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Attendance
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {attendanceStats?.percentage || 0}%
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Avg. Marks
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {marks?.averagePercentage || 0}%
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-violet-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  onClick={() => setActiveTab('assignments')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Pending
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-violet-600 dark:text-violet-400">
                      {pendingAssignments}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-100 dark:bg-violet-900/50 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  onClick={() => setActiveTab('timetable')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Classes
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
                      {timetable.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-2 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
              <TabsList className="w-full grid grid-cols-4 h-auto p-0 bg-transparent">
                {tabConfig.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center justify-center gap-2 py-3 px-2 sm:px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 rounded-xl transition-all duration-300"
                  >
                    <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline font-medium">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab Content with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="timetable" className="mt-0">
                  <TimetableTab timetable={timetable} attendance={attendance} />
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <NotesTab notes={notes} onNotesChange={refreshNotes} />
                </TabsContent>

                <TabsContent value="assignments" className="mt-0">
                  <AssignmentsTab
                    assignments={assignments}
                    studentId={user?.id}
                    onAssignmentsChange={refreshAssignments}
                  />
                </TabsContent>

                <TabsContent value="attendance" className="mt-0">
                  <AttendanceTab attendance={attendance} statistics={attendanceStats || undefined} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>© 2026 Smart Academic Dashboard. All rights reserved.</p>
      </footer>
    </div>
  )
}

