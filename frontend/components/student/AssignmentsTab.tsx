'use client'

import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Calendar,
  Clock,
  Upload,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter,
  Search,
  ChevronDown,
  Paperclip,
  Send,
  BookOpen,
  Eye,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
import { assignmentAPI } from '@/lib/api/client'

interface Assignment {
  _id: string
  title: string
  subject: string
  description?: string
  dueDate: string
  maxMarks?: number
  submissions?: {
    student: string
    submittedAt: string
    fileUrl?: string
    grade?: number
    feedback?: string
  }[]
  createdAt?: string
}

interface AssignmentsTabProps {
  assignments: Assignment[]
  studentId?: string
  onAssignmentsChange?: () => void
}

type SubmissionStatus = 'pending' | 'submitted' | 'late' | 'graded'

const getSubmissionStatus = (
  assignment: Assignment,
  studentId?: string
): { status: SubmissionStatus; submission?: any } => {
  const submission = assignment.submissions?.find((s) => s.student === studentId)
  const now = new Date()
  const dueDate = new Date(assignment.dueDate)

  if (submission) {
    if (submission.grade !== undefined) {
      return { status: 'graded', submission }
    }
    const submittedAt = new Date(submission.submittedAt)
    if (submittedAt > dueDate) {
      return { status: 'late', submission }
    }
    return { status: 'submitted', submission }
  }

  if (now > dueDate) {
    return { status: 'late' }
  }

  return { status: 'pending' }
}

const getStatusConfig = (status: SubmissionStatus) => {
  switch (status) {
    case 'submitted':
      return {
        variant: 'success' as const,
        label: 'Submitted',
        icon: CheckCircle,
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-900/20',
      }
    case 'late':
      return {
        variant: 'warning' as const,
        label: 'Late',
        icon: AlertCircle,
        color: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
      }
    case 'graded':
      return {
        variant: 'info' as const,
        label: 'Graded',
        icon: CheckCircle,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
      }
    default:
      return {
        variant: 'secondary' as const,
        label: 'Pending',
        icon: Clock,
        color: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-50 dark:bg-slate-800/50',
      }
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

export default function AssignmentsTab({
  assignments,
  studentId,
  onAssignmentsChange,
}: AssignmentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get unique subjects
  const subjects = useMemo(() => {
    const subjectSet = new Set(assignments.map((a) => a.subject).filter(Boolean))
    return Array.from(subjectSet).sort()
  }, [assignments])

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesSearch =
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSubject = selectedSubject === 'all' || assignment.subject === selectedSubject

      const { status } = getSubmissionStatus(assignment, studentId)
      const matchesStatus = statusFilter === 'all' || status === statusFilter

      return matchesSearch && matchesSubject && matchesStatus
    })
  }, [assignments, searchQuery, selectedSubject, statusFilter, studentId])

  // Stats
  const stats = useMemo(() => {
    let submitted = 0
    let pending = 0
    let late = 0
    let graded = 0

    assignments.forEach((assignment) => {
      const { status } = getSubmissionStatus(assignment, studentId)
      if (status === 'submitted') submitted++
      else if (status === 'pending') pending++
      else if (status === 'late') late++
      else if (status === 'graded') graded++
    })

    return { submitted, pending, late, graded, total: assignments.length }
  }, [assignments, studentId])

  const completionRate = stats.total > 0 
    ? Math.round(((stats.submitted + stats.graded) / stats.total) * 100) 
    : 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDaysRemaining = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diff = due.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = async () => {
    if (!selectedAssignment || !selectedFile) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      await assignmentAPI.submitAssignment(selectedAssignment._id, formData)
      setIsSubmitModalOpen(false)
      setSelectedFile(null)
      setSelectedAssignment(null)
      onAssignmentsChange?.()
    } catch (error) {
      console.error('Failed to submit assignment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openSubmitModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsSubmitModalOpen(true)
  }

  const openViewModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsViewModalOpen(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Submitted</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.submitted + stats.graded}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500/30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-500/30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Late/Missing</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.late}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500/30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Completion</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {completionRate}%
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-500/30" />
              </div>
              <Progress value={completionRate} className="mt-2 h-1.5" indicatorClassName="bg-blue-500" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-500" />
            Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Subject Filter */}
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <BookOpen className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <AnimatePresence mode="wait">
        {filteredAssignments.length > 0 ? (
          <motion.div
            key="assignments"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filteredAssignments.map((assignment, index) => {
              const { status, submission } = getSubmissionStatus(assignment, studentId)
              const statusConfig = getStatusConfig(status)
              const StatusIcon = statusConfig.icon
              const daysRemaining = getDaysRemaining(assignment.dueDate)

              return (
                <motion.div key={assignment._id} variants={itemVariants}>
                  <Card
                    className={`transition-all duration-200 hover:shadow-md cursor-pointer group ${statusConfig.bg}`}
                    onClick={() => openViewModal(assignment)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Status Icon */}
                        <div
                          className={`hidden sm:flex w-12 h-12 rounded-xl items-center justify-center ${statusConfig.bg}`}
                        >
                          <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {assignment.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  {assignment.subject}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  Due: {formatDate(assignment.dueDate)}
                                </span>
                              </div>
                            </div>
                            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                          </div>

                          {assignment.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-1">
                              {assignment.description}
                            </p>
                          )}

                          {/* Footer with deadline warning or grade */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                            <div className="flex items-center gap-2">
                              {status === 'pending' && daysRemaining > 0 && (
                                <span
                                  className={`text-sm font-medium ${
                                    daysRemaining <= 2
                                      ? 'text-red-600 dark:text-red-400'
                                      : daysRemaining <= 5
                                      ? 'text-orange-600 dark:text-orange-400'
                                      : 'text-slate-600 dark:text-slate-400'
                                  }`}
                                >
                                  {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                                </span>
                              )}
                              {status === 'pending' && daysRemaining <= 0 && (
                                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                  Overdue!
                                </span>
                              )}
                              {status === 'graded' && submission?.grade !== undefined && (
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                  Grade: {submission.grade}
                                  {assignment.maxMarks && `/${assignment.maxMarks}`}
                                </span>
                              )}
                              {(status === 'submitted' || status === 'late') && (
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  Submitted: {formatDateTime(submission?.submittedAt)}
                                </span>
                              )}
                            </div>

                            {status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openSubmitModal(assignment)
                                }}
                                className="gap-1.5"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                Submit
                              </Button>
                            )}

                            {(status === 'submitted' || status === 'late' || status === 'graded') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openViewModal(assignment)
                                }}
                                className="gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
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
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No assignments found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">
                  {searchQuery || selectedSubject !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : 'No assignments have been assigned yet'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Modal */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              Upload your assignment file for {selectedAssignment?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                {selectedAssignment?.title}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {selectedAssignment?.subject} • Due: {selectedAssignment && formatDate(selectedAssignment.dueDate)}
              </p>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                selectedFile
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt,.zip"
              />
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto">
                    <Paperclip className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                    }}
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    Click to upload your file
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    PDF, DOC, DOCX, TXT, or ZIP (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Assignment Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedAssignment?.title}</DialogTitle>
            <DialogDescription className="sr-only">
              Assignment details for {selectedAssignment?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedAssignment && (
            <div className="space-y-4 py-4">
              {/* Status */}
              {(() => {
                const { status, submission } = getSubmissionStatus(selectedAssignment, studentId)
                const statusConfig = getStatusConfig(status)
                return (
                  <Badge variant={statusConfig.variant} className="mb-2">
                    {statusConfig.label}
                  </Badge>
                )
              })()}

              {/* Details */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Subject</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {selectedAssignment.subject}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Due Date</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {formatDateTime(selectedAssignment.dueDate)}
                  </span>
                </div>
                {selectedAssignment.maxMarks && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Max Marks</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {selectedAssignment.maxMarks}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedAssignment.description && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Description
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedAssignment.description}
                  </p>
                </div>
              )}

              {/* Submission Info */}
              {(() => {
                const { status, submission } = getSubmissionStatus(selectedAssignment, studentId)
                if (submission) {
                  return (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Your Submission
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Submitted At</span>
                          <span className="text-slate-900 dark:text-slate-100">
                            {formatDateTime(submission.submittedAt)}
                          </span>
                        </div>
                        {submission.grade !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Grade</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {submission.grade}
                              {selectedAssignment.maxMarks && `/${selectedAssignment.maxMarks}`}
                            </span>
                          </div>
                        )}
                        {submission.feedback && (
                          <div className="mt-3">
                            <span className="text-slate-500 dark:text-slate-400 block mb-1">
                              Feedback
                            </span>
                            <p className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-slate-700 dark:text-slate-300">
                              {submission.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }
                return null
              })()}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedAssignment &&
              getSubmissionStatus(selectedAssignment, studentId).status === 'pending' && (
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false)
                    openSubmitModal(selectedAssignment)
                  }}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Submit
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
