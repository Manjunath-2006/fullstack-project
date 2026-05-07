import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoadingProvider } from './context/LoadingContext'
import Login         from './pages/Login'
import StudentPortal from './pages/Student/StudentPortal'
import TeacherPortal from './pages/Teacher/TeacherPortal'
import AdminPortal   from './pages/Admin/AdminPortal'

function AppRoutes() {
  const { user } = useAuth()
  const normalizedRole = user?.role?.toString?.().toLowerCase()

  if (!user) return <Routes><Route path="*" element={<Login />} /></Routes>

  const home = normalizedRole === 'admin' ? '/admin' : normalizedRole === 'teacher' ? '/teacher' : '/student'

  return (
    <Routes>
      <Route path="/student/*" element={user.role === 'student' ? <StudentPortal /> : <Navigate to={home} replace />} />
      <Route path="/teacher/*" element={user.role === 'teacher' ? <TeacherPortal /> : <Navigate to={home} replace />} />
      <Route path="/admin/*"   element={user.role === 'admin'   ? <AdminPortal />   : <Navigate to={home} replace />} />
      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{
            style: { borderRadius: '8px', background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '13px', color: '#111' }
          }} />
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  )
}
