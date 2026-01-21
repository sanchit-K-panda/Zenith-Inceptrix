'use client'

import { useMemo } from 'react'
import { Clock, MapPin, User } from 'lucide-react'

interface ClassItem {
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

interface WeeklyCalendarProps {
  timetable: ClassItem[]
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00'
]

// Helper to parse time string to minutes
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + (minutes || 0)
}

// Helper to get current day and time
const getCurrentDayAndTime = () => {
  const now = new Date()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const day = days[now.getDay()]
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return { day, time: `${hours}:${minutes}` }
}

// Determine class status based on day and time
const getClassStatus = (cls: ClassItem): 'ongoing' | 'cancelled' | 'rescheduled' | 'upcoming' => {
  // If status is explicitly set, use it
  if (cls.status) return cls.status
  
  const { day: currentDay, time: currentTime } = getCurrentDayAndTime()
  const currentMinutes = timeToMinutes(currentTime)
  const startMinutes = timeToMinutes(cls.startTime)
  const endMinutes = timeToMinutes(cls.endTime)
  
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const currentDayIndex = dayOrder.indexOf(currentDay)
  const classDayIndex = dayOrder.indexOf(cls.dayOfWeek)
  
  // If class is on current day
  if (cls.dayOfWeek === currentDay) {
    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
      return 'ongoing'
    }
  }
  
  // If class day is after current day, or same day but hasn't started
  if (classDayIndex > currentDayIndex || 
      (classDayIndex === currentDayIndex && currentMinutes < startMinutes)) {
    return 'upcoming'
  }
  
  return 'upcoming'
}

// Get status-based styles
const getStatusStyles = (status: string) => {
  switch (status) {
    case 'ongoing':
      return {
        bg: 'bg-green-100 dark:bg-green-900/40',
        border: 'border-green-300 dark:border-green-700',
        text: 'text-green-800 dark:text-green-300',
        badge: 'bg-green-500',
        label: 'Ongoing'
      }
    case 'cancelled':
      return {
        bg: 'bg-red-100 dark:bg-red-900/40',
        border: 'border-red-300 dark:border-red-700',
        text: 'text-red-800 dark:text-red-300',
        badge: 'bg-red-500',
        label: 'Cancelled'
      }
    case 'rescheduled':
      return {
        bg: 'bg-orange-100 dark:bg-orange-900/40',
        border: 'border-orange-300 dark:border-orange-700',
        text: 'text-orange-800 dark:text-orange-300',
        badge: 'bg-orange-500',
        label: 'Rescheduled'
      }
    default: // upcoming
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-300',
        badge: 'bg-blue-500',
        label: 'Upcoming'
      }
  }
}

// Calculate position and height for class block
const getClassPosition = (startTime: string, endTime: string) => {
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTime)
  const dayStartMinutes = timeToMinutes('08:00')
  const dayEndMinutes = timeToMinutes('18:00')
  const totalMinutes = dayEndMinutes - dayStartMinutes
  
  const top = ((startMinutes - dayStartMinutes) / totalMinutes) * 100
  const height = ((endMinutes - startMinutes) / totalMinutes) * 100
  
  return { top: `${Math.max(0, top)}%`, height: `${Math.min(height, 100 - top)}%` }
}

export default function WeeklyCalendar({ timetable }: WeeklyCalendarProps) {
  // Group classes by day
  const classesByDay = useMemo(() => {
    const grouped: Record<string, ClassItem[]> = {}
    DAYS.forEach(day => {
      grouped[day] = timetable.filter(cls => cls.dayOfWeek === day)
    })
    return grouped
  }, [timetable])

  const { day: currentDay } = getCurrentDayAndTime()

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Weekly Timetable</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your class schedule for this week</p>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-slate-600 dark:text-slate-400">Ongoing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-slate-600 dark:text-slate-400">Upcoming</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-xs text-slate-600 dark:text-slate-400">Rescheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-xs text-slate-600 dark:text-slate-400">Cancelled</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
            <div className="p-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50">
              Time
            </div>
            {DAYS.map(day => (
              <div
                key={day}
                className={`p-3 text-center text-sm font-semibold border-l border-slate-200 dark:border-slate-700
                  ${day === currentDay 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300'
                  }`}
              >
                {day.slice(0, 3)}
                {day === currentDay && (
                  <span className="ml-1 text-xs text-blue-500 dark:text-blue-400">(Today)</span>
                )}
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="grid grid-cols-7" style={{ minHeight: '500px' }}>
            {/* Time Column */}
            <div className="bg-slate-50 dark:bg-slate-900/30">
              {TIME_SLOTS.map((time, idx) => (
                <div
                  key={time}
                  className="h-[50px] px-2 flex items-start pt-1 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800"
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {DAYS.map(day => (
              <div
                key={day}
                className={`relative border-l border-slate-200 dark:border-slate-700
                  ${day === currentDay ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
              >
                {/* Hour lines */}
                {TIME_SLOTS.map((time, idx) => (
                  <div
                    key={time}
                    className="h-[50px] border-b border-slate-100 dark:border-slate-800"
                  />
                ))}

                {/* Class Blocks */}
                <div className="absolute inset-0">
                  {classesByDay[day]?.map(cls => {
                    const status = getClassStatus(cls)
                    const styles = getStatusStyles(status)
                    const position = getClassPosition(cls.startTime, cls.endTime)
                    const teacherName = cls.teacher?.userId 
                      ? `${cls.teacher.userId.firstName || ''} ${cls.teacher.userId.lastName || ''}`.trim()
                      : ''

                    return (
                      <div
                        key={cls._id}
                        className={`absolute left-1 right-1 rounded-lg border ${styles.bg} ${styles.border} ${styles.text}
                                   overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]`}
                        style={{ top: position.top, height: position.height, minHeight: '45px' }}
                      >
                        {/* Status indicator */}
                        <div className={`absolute top-0 left-0 w-1 h-full ${styles.badge}`}></div>
                        
                        <div className="p-2 pl-3">
                          <p className="font-semibold text-sm truncate">{cls.subject}</p>
                          
                          <div className="flex items-center gap-1 mt-1">
                            <Clock size={10} className="opacity-70" />
                            <span className="text-xs opacity-80">{cls.startTime} - {cls.endTime}</span>
                          </div>
                          
                          {cls.hall && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin size={10} className="opacity-70" />
                              <span className="text-xs opacity-80 truncate">{cls.hall}</span>
                            </div>
                          )}
                          
                          {teacherName && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <User size={10} className="opacity-70" />
                              <span className="text-xs opacity-80 truncate">{teacherName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
