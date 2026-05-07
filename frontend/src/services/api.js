import axios from 'axios'

const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080' })

http.interceptors.request.use((config) => {
  const storedUser = sessionStorage.getItem('ams_user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    if (user?.token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${user.token}`,
      }
    }
  }
  return config
})

// Normalize role to lowercase for frontend compatibility
const normalizeUser = (u) => u ? { ...u, role: u.role?.toString().toLowerCase() } : u

export const authApi = {
  login: async ({ email, password }) => {
    const res = await http.post('/auth/login', { email, password })
    return { data: normalizeUser(res.data) }
  },
  registerAdmin: async (data) => {
    const res = await http.post('/auth/register-admin', data)
    return { data: normalizeUser(res.data) }
  },
}

export const studentsApi = {
  getAll: async () => {
    const res = await http.get('/students')
    return { data: res.data.map(normalizeUser) }
  },
  getOne: async (id) => {
    const res = await http.get(`/students/${id}`)
    return { data: normalizeUser(res.data) }
  },
  create: async (data) => {
    const res = await http.post('/students', data)
    return { data: normalizeUser(res.data) }
  },
}

export const teachersApi = {
  getAll: async () => {
    const res = await http.get('/teachers')
    return { data: res.data.map(normalizeUser) }
  },
  create: async (data) => {
    const res = await http.post('/teachers', data)
    return { data: normalizeUser(res.data) }
  },
}

export const tasksApi = {
  getAll: async (studentId, subject) => {
    const params = {}
    if (studentId) params.student_id = studentId
    if (subject) params.subject = subject
    const res = await http.get('/tasks', { params })
    return { data: res.data }
  },
  create: async (data) => {
    const res = await http.post('/tasks', data)
    return { data: res.data }
  },
  update: async (id, data) => {
    const res = await http.put(`/tasks/${id}`, data)
    return { data: res.data }
  },
  uploadDoc: async (taskId, studentId, formData) => {
    const res = await http.post(`/tasks/${taskId}/documents?student_id=${studentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return { data: res.data }
  },
  getDoc: async (docId) => {
    const res = await http.get(`/tasks/documents/${docId}`)
    return { data: res.data }
  },
  deleteDoc: async (docId, studentId) => {
    const res = await http.delete(`/tasks/documents/${docId}`, { params: { student_id: studentId } })
    return { data: res.data }
  },
}

export const performanceApi = {
  adminDashboard: async () => {
    const res = await http.get('/performance/dashboard')
    return { data: res.data }
  },
  studentDashboard: async (id) => {
    const res = await http.get(`/performance/student-dashboard/${id}`)
    return { data: res.data }
  },
  attendance: async (params) => {
    const res = await http.get('/performance/attendance', { params })
    return { data: res.data }
  },
  attendanceSummary: async (id) => {
    const res = await http.get(`/performance/attendance/${id}/summary`)
    return { data: res.data }
  },
}

export const scoresApi = {
  getAll: async (studentId, subject) => {
    const params = {}
    if (studentId) params.student_id = studentId
    if (subject) params.subject = subject
    const res = await http.get('/scores', { params })
    return { data: res.data }
  },
  summary: async (id) => {
    const res = await http.get(`/scores/summary/${id}`)
    return { data: res.data }
  },
  create: async (data) => {
    const res = await http.post('/scores', data)
    return { data: res.data }
  },
  update: async (id, data) => {
    const res = await http.put(`/scores/${id}`, data)
    return { data: res.data }
  },
  bulkUpload: async (params, formData) => {
    const res = await http.post('/scores/bulk-upload', formData, {
      params,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return { data: res.data }
  },
}

export const leavesApi = {
  getAll: async (applicantId) => {
    const params = applicantId ? { applicant_id: applicantId } : {}
    const res = await http.get('/leaves', { params })
    return { data: res.data }
  },
  apply: async (data) => {
    const res = await http.post('/leaves', data)
    return { data: res.data }
  },
  decide: async (id, data) => {
    const res = await http.put(`/leaves/${id}/decision`, data)
    return { data: res.data }
  },
}

export const calendarApi = {
  getAll: async () => {
    const res = await http.get('/calendar')
    return { data: res.data }
  },
  create: async (data) => {
    const res = await http.post('/calendar', data)
    return { data: res.data }
  },
}

export const analyticsApi = {
  get: async () => {
    const res = await http.get('/performance/dashboard')
    return { data: res.data }
  },
  getRecommendations: async (studentId) => {
    const res = await http.get(`/analytics/recommendations/${studentId}`)
    return { data: res.data }
  },
}
