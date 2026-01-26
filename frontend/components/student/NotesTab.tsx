'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  StickyNote,
  Plus,
  Edit3,
  Trash2,
  Filter,
  Search,
  BookOpen,
  User,
  Calendar,
  Download,
  Eye,
  X,
  Save,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { notesAPI } from '@/lib/api/client'

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
  updatedAt?: string
}

interface NotesTabProps {
  notes: Note[]
  onNotesChange?: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function NotesTab({ notes, onNotesChange }: NotesTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'all' | 'personal' | 'shared'>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState({ title: '', subject: '', content: '' })
  const [isLoading, setIsLoading] = useState(false)

  // Get unique subjects
  const subjects = useMemo(() => {
    const subjectSet = new Set(notes.map(note => note.subject).filter(Boolean))
    return Array.from(subjectSet).sort()
  }, [notes])

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject

      const matchesViewMode =
        viewMode === 'all' ||
        (viewMode === 'personal' && !note.isShared) ||
        (viewMode === 'shared' && note.isShared)

      return matchesSearch && matchesSubject && matchesViewMode
    })
  }, [notes, searchQuery, selectedSubject, viewMode])

  // Group notes by subject
  const groupedNotes = useMemo(() => {
    const grouped: Record<string, Note[]> = {}
    filteredNotes.forEach(note => {
      const subject = note.subject || 'General'
      if (!grouped[subject]) grouped[subject] = []
      grouped[subject].push(note)
    })
    return grouped
  }, [filteredNotes])

  const handleCreateNote = async () => {
    if (!formData.title.trim() || !formData.subject.trim()) return

    setIsLoading(true)
    try {
      await notesAPI.createNote({
        title: formData.title,
        subject: formData.subject,
        content: formData.content,
      })
      setIsCreateModalOpen(false)
      setFormData({ title: '', subject: '', content: '' })
      onNotesChange?.()
    } catch (error) {
      console.error('Failed to create note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateNote = async () => {
    if (!selectedNote || !formData.title.trim() || !formData.subject.trim()) return

    setIsLoading(true)
    try {
      await notesAPI.updateNote(selectedNote._id, {
        title: formData.title,
        subject: formData.subject,
        content: formData.content,
      })
      setIsViewModalOpen(false)
      setIsEditMode(false)
      setSelectedNote(null)
      setFormData({ title: '', subject: '', content: '' })
      onNotesChange?.()
    } catch (error) {
      console.error('Failed to update note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    setIsLoading(true)
    try {
      await notesAPI.deleteNote(noteId)
      setIsViewModalOpen(false)
      setSelectedNote(null)
      onNotesChange?.()
    } catch (error) {
      console.error('Failed to delete note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openViewModal = (note: Note) => {
    setSelectedNote(note)
    setFormData({ title: note.title, subject: note.subject, content: note.content || '' })
    setIsViewModalOpen(true)
    setIsEditMode(false)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
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
      {/* Header & Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-indigo-500" />
              Study Notes
            </CardTitle>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Note
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Subject Filter */}
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {(['all', 'personal', 'shared'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    viewMode === mode
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      <AnimatePresence mode="wait">
        {Object.keys(groupedNotes).length > 0 ? (
          <motion.div
            key="notes"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {Object.entries(groupedNotes).map(([subject, subjectNotes]) => (
              <motion.div key={subject} variants={itemVariants}>
                <Card>
                  <CardHeader className="py-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      <CardTitle className="text-lg">{subject}</CardTitle>
                      <Badge variant="secondary" className="ml-2">
                        {subjectNotes.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subjectNotes.map((note, index) => (
                        <motion.div
                          key={note._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="group relative border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"
                          onClick={() => openViewModal(note)}
                        >
                          {/* Shared Badge */}
                          {note.isShared && (
                            <Badge
                              variant="info"
                              className="absolute -top-2 -right-2 text-xs"
                            >
                              Shared
                            </Badge>
                          )}

                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 pr-6 line-clamp-1">
                            {note.title}
                          </h4>

                          {note.content && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                              {note.content}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>
                                {note.creator?.firstName} {note.creator?.lastName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(note.createdAt)}</span>
                            </div>
                          </div>

                          {note.attachments && note.attachments.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                              <a
                                href={note.attachments[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                              >
                                <Download className="w-4 h-4" />
                                Download Attachment
                              </a>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <StickyNote className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No notes found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-center mb-6 max-w-sm">
                  {searchQuery || selectedSubject !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : 'Create your first note to get started with organizing your studies'}
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Note
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Note Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>
              Add a new personal note to your collection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Title
              </label>
              <Input
                placeholder="Enter note title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Subject
              </label>
              <Input
                placeholder="Enter subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Content
              </label>
              <Textarea
                placeholder="Write your note content here... (Markdown supported)"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNote} disabled={isLoading} className="gap-2">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit Note Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Note' : selectedNote?.title}</DialogTitle>
            <DialogDescription className="sr-only">
              {isEditMode ? 'Edit your note' : `View note: ${selectedNote?.title}`}
            </DialogDescription>
          </DialogHeader>

          {selectedNote && (
            <div className="space-y-4 py-4">
              {isEditMode ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="min-h-[200px]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{selectedNote.subject}</Badge>
                    {selectedNote.isShared && <Badge variant="info">Shared by Teacher</Badge>}
                  </div>

                  <ScrollArea className="max-h-[300px]">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                        {selectedNote.content || 'No content'}
                      </p>
                    </div>
                  </ScrollArea>

                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-4 border-t">
                    <span>
                      By {selectedNote.creator?.firstName} {selectedNote.creator?.lastName}
                    </span>
                    <span>{formatDate(selectedNote.createdAt)}</span>
                  </div>

                  {selectedNote.attachments && selectedNote.attachments.length > 0 && (
                    <div className="pt-2">
                      <a
                        href={selectedNote.attachments[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download Attachment
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            {!selectedNote?.isShared && (
              <>
                {isEditMode ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditMode(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateNote} disabled={isLoading} className="gap-2">
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteNote(selectedNote!._id)}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                    <Button onClick={() => setIsEditMode(true)} className="gap-2">
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Button>
                  </>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
