'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { timetableAPI, attendanceAPI, assignmentAPI, notesAPI } from '@/lib/api/client'
import { Users, Clock, FileText, CheckSquare, LogOut, StickyNote, Plus, X, Upload } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export default function TeacherDashboard() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [timetable, setTimetable] = useState([])
  const [assignments, setAssignments] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0 })
  
  // Note upload modal state
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteForm, setNoteForm] = useState({
    title: '',
    subject: '',
    content: '',
    fileUrl: ''
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchData()
  }, [user, router])

  const fetchData = async () => {
    try {
      const [ttRes, assignRes, notesRes] = await Promise.all([
        timetableAPI.getTimetable(),
        assignmentAPI.getAssignments(),
        notesAPI.getNotes(),
      ])

      setTimetable(ttRes.data)
      setAssignments(assignRes.data)
      setNotes(notesRes.data)
      setStats({
        totalClasses: ttRes.data.length,
        totalStudents: ttRes.data.length * 30,
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleUploadNote = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      await notesAPI.createNote({
        title: noteForm.title,
        subject: noteForm.subject,
        content: noteForm.content,
        attachments: noteForm.fileUrl ? [noteForm.fileUrl] : [],
        sharedWith: [] // Will be shared with all students in that subject
      })
      
      setShowNoteModal(false)
      setNoteForm({ title: '', subject: '', content: '', fileUrl: '' })
      fetchData() // Refresh notes
    } catch (error) {
      console.error('Failed to upload note:', error)
    } finally {
      setUploading(false)
    }
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
              Teacher Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome, Dr. {user?.lastName}</p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                          animate-fade-in-up stagger-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Classes</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.totalClasses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Clock className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                          animate-fade-in-up stagger-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Students</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <Users className="text-emerald-600 dark:text-emerald-400" size={24} />
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
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                <FileText className="text-violet-600 dark:text-violet-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 
                          transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                          animate-fade-in-up stagger-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {assignments.reduce((sum, a: any) => sum + (a.submissions?.length || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <CheckSquare className="text-amber-600 dark:text-amber-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Timetable Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-8 animate-fade-in-up stagger-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Classes</h2>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium
                               transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
              + Mark Attendance
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Day</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Time</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Subject</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Class</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Hall</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timetable.length > 0 ? (
                  timetable.map((cls: any) => (
                    <tr key={cls._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{cls.dayOfWeek}</td>
                      <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{cls.startTime} - {cls.endTime}</td>
                      <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-medium">{cls.subject}</td>
                      <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{cls.className} - {cls.section}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{cls.hall}</td>
                      <td className="px-4 py-3">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors">
                          Mark
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No classes assigned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignments Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-8 animate-fade-in-up stagger-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">My Assignments</h2>
          <div className="grid gap-4">
            {assignments.length > 0 ? (
              assignments.map((assignment: any) => (
                <div key={assignment._id} className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 
                                                       transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">{assignment.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{assignment.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                        <span>Subject: {assignment.subject}</span>
                        <span>Submissions: {assignment.submissions?.length || 0}</span>
                      </div>
                    </div>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No assignments created yet</p>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 animate-fade-in-up stagger-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <StickyNote className="text-indigo-600 dark:text-indigo-400" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Notes</h2>
            </div>
            <button
              onClick={() => setShowNoteModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-lg font-medium
                         transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              <Plus size={18} />
              Upload Note
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.length > 0 ? (
              notes.map((note: any) => (
                <div key={note._id} className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-slate-50 dark:bg-slate-700/50
                                                 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500 hover:-translate-y-0.5">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{note.title}</h3>
                  <span className="inline-block px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs rounded-md font-medium mb-2">
                    {note.subject}
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{note.content}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400 col-span-3 text-center py-8">No notes uploaded yet</p>
            )}
          </div>
        </div>
      </main>

      {/* Upload Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-scale-in">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Upload New Note</h3>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUploadNote} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title</label>
                <input
                  type="text"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg 
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                             focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                             transition-all duration-200 outline-none"
                  placeholder="e.g., Introduction to Trees"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subject</label>
                <select
                  value={noteForm.subject}
                  onChange={(e) => setNoteForm({ ...noteForm, subject: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg 
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                             focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                             transition-all duration-200 outline-none"
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Database Management Systems">Database Management Systems</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Computer Networks">Computer Networks</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                <textarea
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg 
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                             focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                             transition-all duration-200 outline-none resize-none"
                  rows={3}
                  placeholder="Brief description of the note content"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">File URL (optional)</label>
                <div className="flex items-center gap-2">
                  <Upload size={18} className="text-slate-400" />
                  <input
                    type="url"
                    value={noteForm.fileUrl}
                    onChange={(e) => setNoteForm({ ...noteForm, fileUrl: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg 
                               bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                               focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                               transition-all duration-200 outline-none"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Paste a Google Drive, Dropbox, or direct file link</p>
              </div>
              
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-300
                             transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg font-medium
                             transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 
                             disabled:opacity-50 disabled:hover:shadow-none"
                >
                  {uploading ? 'Uploading...' : 'Upload Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
