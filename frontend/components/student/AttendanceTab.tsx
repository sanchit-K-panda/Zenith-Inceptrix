'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface AttendanceRecord {
  _id: string
  date: string
  status: 'present' | 'absent' | 'late'
  subject?: string
  timetable?: {
    subject?: string
  }
}

interface AttendanceStats {
  percentage?: number
  present?: number
  absent?: number
  late?: number
  total?: number
}

interface AttendanceTabProps {
  attendance: AttendanceRecord[]
  statistics?: AttendanceStats
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const getAttendanceColor = (percentage: number) => {
  if (percentage >= 85) return 'text-green-600 dark:text-green-400'
  if (percentage >= 75) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 85) return 'bg-green-500'
  if (percentage >= 75) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'present':
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case 'absent':
      return <XCircle className="w-4 h-4 text-red-500" />
    case 'late':
      return <Clock className="w-4 h-4 text-orange-500" />
    default:
      return null
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'present':
      return <Badge variant="success">Present</Badge>
    case 'absent':
      return <Badge variant="destructive">Absent</Badge>
    case 'late':
      return <Badge variant="warning">Late</Badge>
    default:
      return null
  }
}

export default function AttendanceTab({ attendance, statistics }: AttendanceTabProps) {
  const overallPercentage = statistics?.percentage || 0
  const present = statistics?.present || 0
  const absent = statistics?.absent || 0
  const late = statistics?.late || 0
  const total = statistics?.total || 0

  // Group attendance by subject
  const attendanceBySubject = useMemo(() => {
    const grouped: Record<
      string,
      { present: number; absent: number; late: number; total: number }
    > = {}

    attendance.forEach((record) => {
      const subject = record.subject || record.timetable?.subject || 'Unknown'
      if (!grouped[subject]) {
        grouped[subject] = { present: 0, absent: 0, late: 0, total: 0 }
      }
      grouped[subject].total++
      if (record.status === 'present') grouped[subject].present++
      else if (record.status === 'absent') grouped[subject].absent++
      else if (record.status === 'late') grouped[subject].late++
    })

    return Object.entries(grouped)
      .map(([subject, data]) => ({
        subject,
        ...data,
        percentage: Math.round(((data.present + data.late) / data.total) * 100),
      }))
      .sort((a, b) => a.percentage - b.percentage)
  }, [attendance])

  // Recent attendance records
  const recentAttendance = useMemo(() => {
    return [...attendance]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
  }, [attendance])

  // Calculate monthly trend
  const monthlyTrend = useMemo(() => {
    const now = new Date()
    const thisMonth = attendance.filter((record) => {
      const date = new Date(record.date)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
    const lastMonth = attendance.filter((record) => {
      const date = new Date(record.date)
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      return (
        date.getMonth() === lastMonthDate.getMonth() &&
        date.getFullYear() === lastMonthDate.getFullYear()
      )
    })

    const thisMonthPresent = thisMonth.filter((r) => r.status === 'present' || r.status === 'late').length
    const thisMonthTotal = thisMonth.length
    const thisMonthPercentage = thisMonthTotal > 0 ? (thisMonthPresent / thisMonthTotal) * 100 : 0

    const lastMonthPresent = lastMonth.filter((r) => r.status === 'present' || r.status === 'late').length
    const lastMonthTotal = lastMonth.length
    const lastMonthPercentage = lastMonthTotal > 0 ? (lastMonthPresent / lastMonthTotal) * 100 : 0

    const trend = thisMonthPercentage - lastMonthPercentage

    return {
      thisMonth: Math.round(thisMonthPercentage),
      lastMonth: Math.round(lastMonthPercentage),
      trend: Math.round(trend),
    }
  }, [attendance])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Overview Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Overall Attendance */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className={`text-3xl font-bold ${getAttendanceColor(overallPercentage)}`}>
                  {overallPercentage}%
                </span>
              </div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Overall Attendance</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {present + late} of {total} classes attended
              </p>
              <Progress
                value={overallPercentage}
                className="mt-3 h-2"
                indicatorClassName={getProgressColor(overallPercentage)}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Present */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {present}
                </span>
              </div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Present</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {total > 0 ? Math.round((present / total) * 100) : 0}% of total classes
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Absent */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-3xl font-bold text-red-600 dark:text-red-400">{absent}</span>
              </div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Absent</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {total > 0 ? Math.round((absent / total) * 100) : 0}% of total classes
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    monthlyTrend.trend >= 0
                      ? 'bg-green-100 dark:bg-green-900/50'
                      : 'bg-red-100 dark:bg-red-900/50'
                  }`}
                >
                  {monthlyTrend.trend >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <span
                  className={`text-3xl font-bold ${
                    monthlyTrend.trend >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {monthlyTrend.trend > 0 ? '+' : ''}
                  {monthlyTrend.trend}%
                </span>
              </div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Monthly Trend</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                vs last month ({monthlyTrend.lastMonth}%)
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Subject-wise Attendance & Recent Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject-wise Attendance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-violet-500" />
                Attendance by Subject
              </CardTitle>
              <CardDescription>Your attendance breakdown per subject</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {attendanceBySubject.length > 0 ? (
                attendanceBySubject.map((subject, index) => (
                  <motion.div
                    key={subject.subject}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {subject.subject}
                        </span>
                        {subject.percentage < 75 && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {subject.present + subject.late}/{subject.total}
                        </span>
                        <span
                          className={`font-semibold ${getAttendanceColor(subject.percentage)}`}
                        >
                          {subject.percentage}%
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={subject.percentage}
                      className="h-2"
                      indicatorClassName={getProgressColor(subject.percentage)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No attendance records found
                </div>
              )}

              {/* Warning for low attendance */}
              {attendanceBySubject.some((s) => s.percentage < 75) && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800 dark:text-red-200">
                        Low Attendance Warning
                      </h4>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                        Some subjects have attendance below 75%. This may affect your eligibility
                        for exams.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Attendance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Recent Attendance
              </CardTitle>
              <CardDescription>Your latest attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAttendance.length > 0 ? (
                <div className="space-y-3">
                  {recentAttendance.map((record, index) => (
                    <motion.div
                      key={record._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(record.status)}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {record.subject || record.timetable?.subject || 'Class'}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {formatDate(record.date)}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(record.status)}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No recent attendance records
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Attendance Calendar Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Attendance Overview
            </CardTitle>
            <CardDescription>Visual summary of your attendance this month</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Month Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {(() => {
                const now = new Date()
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
                const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
                const startPadding = firstDay.getDay()
                const days = []

                // Add empty cells for padding
                for (let i = 0; i < startPadding; i++) {
                  days.push(<div key={`empty-${i}`} className="h-10" />)
                }

                // Add days
                for (let day = 1; day <= lastDay.getDate(); day++) {
                  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const dayRecords = attendance.filter((r) => r.date.startsWith(dateStr))
                  const hasPresent = dayRecords.some((r) => r.status === 'present')
                  const hasAbsent = dayRecords.some((r) => r.status === 'absent')
                  const hasLate = dayRecords.some((r) => r.status === 'late')
                  const isToday = day === now.getDate()

                  let bgColor = 'bg-slate-100 dark:bg-slate-800'
                  if (hasAbsent) bgColor = 'bg-red-100 dark:bg-red-900/40'
                  else if (hasLate) bgColor = 'bg-orange-100 dark:bg-orange-900/40'
                  else if (hasPresent) bgColor = 'bg-green-100 dark:bg-green-900/40'

                  days.push(
                    <motion.div
                      key={day}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.01 * day }}
                      className={`h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all cursor-default
                        ${bgColor}
                        ${isToday ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : ''}
                        ${dayRecords.length > 0 ? 'hover:scale-105' : ''}
                      `}
                      title={
                        dayRecords.length > 0
                          ? dayRecords.map((r) => `${r.subject || 'Class'}: ${r.status}`).join('\n')
                          : undefined
                      }
                    >
                      <span
                        className={`
                          ${hasAbsent ? 'text-red-700 dark:text-red-300' : ''}
                          ${hasLate && !hasAbsent ? 'text-orange-700 dark:text-orange-300' : ''}
                          ${hasPresent && !hasAbsent && !hasLate ? 'text-green-700 dark:text-green-300' : ''}
                          ${!hasPresent && !hasAbsent && !hasLate ? 'text-slate-600 dark:text-slate-400' : ''}
                        `}
                      >
                        {day}
                      </span>
                    </motion.div>
                  )
                }

                return days
              })()}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/40" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-100 dark:bg-orange-900/40" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/40" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800" />
                <span className="text-sm text-slate-600 dark:text-slate-400">No Class</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
