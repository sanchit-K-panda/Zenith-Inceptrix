import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const apiClient = axios.create({
  baseURL: API_URL,
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (data: any) => apiClient.post('/auth/register', data),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data: any) => apiClient.put('/auth/profile', data),
}

// Timetable endpoints
export const timetableAPI = {
  getTimetable: (params?: any) => apiClient.get('/timetable', { params }),
  getMyTimetable: () => apiClient.get('/timetable/my-timetable'),
  createTimetable: (data: any) => apiClient.post('/timetable', data),
  updateTimetable: (id: string, data: any) =>
    apiClient.put(`/timetable/${id}`, data),
}

// Attendance endpoints
export const attendanceAPI = {
  markAttendance: (data: any) => apiClient.post('/attendance/mark', data),
  getStudentAttendance: (studentId: string) =>
    apiClient.get(`/attendance/student/${studentId}`),
  getMyAttendance: () => apiClient.get('/attendance/my-attendance'),
  updateAttendance: (id: string, data: any) =>
    apiClient.put(`/attendance/${id}`, data),
}

// Assignment endpoints
export const assignmentAPI = {
  createAssignment: (data: any) => apiClient.post('/assignments', data),
  getAssignments: (params?: any) =>
    apiClient.get('/assignments', { params }),
  submitAssignment: (id: string, data: any) =>
    apiClient.post(`/assignments/${id}/submit`, data),
  gradeAssignment: (id: string, submissionIndex: number, data: any) =>
    apiClient.put(`/assignments/${id}/grade/${submissionIndex}`, data),
}

// Marks endpoints
export const marksAPI = {
  uploadMarks: (data: any) => apiClient.post('/marks', data),
  getMarks: (studentId: string) =>
    apiClient.get(`/marks/student/${studentId}`),
  getMyMarks: () => apiClient.get('/marks/my-marks'),
  updateMarks: (id: string, data: any) =>
    apiClient.put(`/marks/${id}`, data),
}

// Notes endpoints
export const notesAPI = {
  createNote: (data: any) => apiClient.post('/notes', data),
  getNotes: (params?: any) => apiClient.get('/notes', { params }),
  getStudentNotes: (params?: any) => apiClient.get('/notes/student', { params }),
  updateNote: (id: string, data: any) =>
    apiClient.put(`/notes/${id}`, data),
  deleteNote: (id: string) => apiClient.delete(`/notes/${id}`),
}

// Messages endpoints
export const messagesAPI = {
  sendMessage: (data: any) => apiClient.post('/messages/send', data),
  getConversation: (userId: string) =>
    apiClient.get(`/messages/conversation/${userId}`),
  getConversations: () => apiClient.get('/messages/conversations'),
}

// Optimization endpoints
export const optimizationAPI = {
  optimizeTimetable: () =>
    apiClient.post('/optimization/optimize-timetable', {}),
  getOptimizationLogs: (params?: any) =>
    apiClient.get('/optimization/logs', { params }),
}
