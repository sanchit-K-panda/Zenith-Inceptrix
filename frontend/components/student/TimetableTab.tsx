'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Clock, MapPin, User, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

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
  timetableId?: string
  date?: string
  status?: 'present' | 'absent' | 'late'
}

interface TimetableTabProps {
  timetable: TimetableEntry[]
  attendance?: AttendanceRecord[]
}

const getNextDateForDay = (dayOfWeek: string): Date => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayIndex = days.indexOf(dayOfWeek)
  const today = new Date()
  const todayDayIndex = today.getDay()
  const daysUntilTarget = (dayIndex - todayDayIndex + 7) % 7
  
  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + daysUntilTarget)
  return targetDate
}

const formatTimeForCalendar = (date: Date, time: string): string => {
  const [hours, minutes] = time.split(':')
  const formattedDate = new Date(date)
  formattedDate.setHours(parseInt(hours), parseInt(minutes || '0'), 0)
  return formattedDate.toISOString()
}

const getStatusColor = (status?: string, attendanceStatus?: string) => {
  if (attendanceStatus === 'present') return '#22c55e' // Green
  if (attendanceStatus === 'absent') return '#ef4444' // Red
  if (status === 'rescheduled' || status === 'cancelled') return '#f97316' // Orange
  return '#3b82f6' // Blue default
}

const getStatusBadge = (status?: string, attendanceStatus?: string) => {
  if (attendanceStatus === 'present') {
    return { variant: 'success' as const, label: 'Present', icon: CheckCircle }
  }
  if (attendanceStatus === 'absent') {
    return { variant: 'destructive' as const, label: 'Absent', icon: XCircle }
  }
  if (status === 'rescheduled') {
    return { variant: 'warning' as const, label: 'Rescheduled', icon: AlertCircle }
  }
  if (status === 'cancelled') {
    return { variant: 'destructive' as const, label: 'Cancelled', icon: XCircle }
  }
  if (status === 'ongoing') {
    return { variant: 'success' as const, label: 'Ongoing', icon: CheckCircle }
  }
  return { variant: 'info' as const, label: 'Upcoming', icon: Calendar }
}

export default function TimetableTab({ timetable, attendance = [] }: TimetableTabProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimetableEntry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Convert timetable to FullCalendar events
  const calendarEvents = useMemo(() => {
    return timetable.map((entry) => {
      const date = getNextDateForDay(entry.dayOfWeek)
      const attendanceRecord = attendance.find(a => a.timetableId === entry._id)
      const backgroundColor = getStatusColor(entry.status, attendanceRecord?.status)
      
      return {
        id: entry._id,
        title: entry.subject,
        start: formatTimeForCalendar(date, entry.startTime),
        end: formatTimeForCalendar(date, entry.endTime),
        backgroundColor,
        borderColor: backgroundColor,
        textColor: '#ffffff',
        extendedProps: {
          ...entry,
          attendanceStatus: attendanceRecord?.status,
        },
      }
    })
  }, [timetable, attendance])

  const handleEventClick = (info: any) => {
    const entry = info.event.extendedProps as TimetableEntry & { attendanceStatus?: string }
    setSelectedEvent(entry)
    setIsModalOpen(true)
  }

  const selectedEventStatus = selectedEvent 
    ? getStatusBadge(selectedEvent.status, (selectedEvent as any).attendanceStatus)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Weekly Timetable
            </CardTitle>
            {/* Legend */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-slate-600 dark:text-slate-400">Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-slate-600 dark:text-slate-400">Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-slate-600 dark:text-slate-400">Changed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-600 dark:text-slate-400">Scheduled</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="fullcalendar-wrapper">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridWeek,timeGridDay',
              }}
              events={calendarEvents}
              eventClick={handleEventClick}
              slotMinTime="07:00:00"
              slotMaxTime="19:00:00"
              allDaySlot={false}
              weekends={false}
              height="auto"
              eventDisplay="block"
              slotDuration="00:30:00"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false,
                hour12: false,
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }}
            />
          </div>

          {/* Custom Styles for FullCalendar */}
          <style jsx global>{`
            .fullcalendar-wrapper .fc {
              --fc-border-color: rgb(226 232 240);
              --fc-today-bg-color: rgba(59, 130, 246, 0.05);
              font-family: inherit;
            }
            
            .dark .fullcalendar-wrapper .fc {
              --fc-border-color: rgb(51 65 85);
              --fc-page-bg-color: rgb(30 41 59);
              --fc-neutral-bg-color: rgb(30 41 59);
            }
            
            .fullcalendar-wrapper .fc-toolbar-title {
              font-size: 1.125rem !important;
              font-weight: 600 !important;
            }
            
            .fullcalendar-wrapper .fc-button {
              background-color: rgb(241 245 249) !important;
              border: 1px solid rgb(226 232 240) !important;
              color: rgb(51 65 85) !important;
              font-weight: 500 !important;
              padding: 0.5rem 1rem !important;
              border-radius: 0.5rem !important;
              transition: all 0.2s !important;
            }
            
            .dark .fullcalendar-wrapper .fc-button {
              background-color: rgb(51 65 85) !important;
              border-color: rgb(71 85 105) !important;
              color: rgb(226 232 240) !important;
            }
            
            .fullcalendar-wrapper .fc-button:hover {
              background-color: rgb(226 232 240) !important;
            }
            
            .dark .fullcalendar-wrapper .fc-button:hover {
              background-color: rgb(71 85 105) !important;
            }
            
            .fullcalendar-wrapper .fc-button-active {
              background-color: rgb(59 130 246) !important;
              border-color: rgb(59 130 246) !important;
              color: white !important;
            }
            
            .fullcalendar-wrapper .fc-event {
              border-radius: 0.375rem !important;
              padding: 2px 6px !important;
              font-size: 0.75rem !important;
              font-weight: 500 !important;
              cursor: pointer !important;
              transition: transform 0.15s, box-shadow 0.15s !important;
            }
            
            .fullcalendar-wrapper .fc-event:hover {
              transform: scale(1.02);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .fullcalendar-wrapper .fc-col-header-cell {
              font-weight: 600;
              text-transform: uppercase;
              font-size: 0.75rem;
              color: rgb(100 116 139);
            }
            
            .dark .fullcalendar-wrapper .fc-col-header-cell {
              color: rgb(148 163 184);
            }
            
            .fullcalendar-wrapper .fc-timegrid-slot {
              height: 2.5rem !important;
            }
            
            .fullcalendar-wrapper .fc-timegrid-slot-label {
              font-size: 0.75rem;
              color: rgb(100 116 139);
            }
            
            .dark .fullcalendar-wrapper .fc-timegrid-slot-label {
              color: rgb(148 163 184);
            }
          `}</style>
        </CardContent>
      </Card>

      {/* Class Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedEvent?.subject}</DialogTitle>
            <DialogDescription className="sr-only">
              Class details for {selectedEvent?.subject}
            </DialogDescription>
          </DialogHeader>
          
          <AnimatePresence mode="wait">
            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 pt-2"
              >
                {/* Status Badge */}
                {selectedEventStatus && (
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedEventStatus.variant} className="flex items-center gap-1.5 px-3 py-1">
                      <selectedEventStatus.icon className="w-3.5 h-3.5" />
                      {selectedEventStatus.label}
                    </Badge>
                  </div>
                )}

                {/* Class Details */}
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Time</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {selectedEvent.startTime} - {selectedEvent.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Day</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {selectedEvent.dayOfWeek}
                      </p>
                    </div>
                  </div>

                  {selectedEvent.hall && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Hall / Room</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {selectedEvent.hall}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.teacher?.userId && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Teacher</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {selectedEvent.teacher.userId.firstName} {selectedEvent.teacher.userId.lastName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
