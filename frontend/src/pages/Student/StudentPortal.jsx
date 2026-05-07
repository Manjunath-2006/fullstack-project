import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { LayoutDashboard, CheckSquare, Calendar, TrendingUp, BookOpen } from 'lucide-react'
import Sidebar from '../../components/shared/Sidebar'
import NavigationLoader from '../../components/shared/NavigationLoader'
import StudentDashboard   from './StudentDashboard'
import StudentTasks       from './StudentTasks'
import StudentAttendance  from './StudentAttendance'
import StudentPerformance from './StudentPerformance'
import AcademicCalendar   from './AcademicCalendar'

const LINKS = [
  { to: '/student/dashboard',   icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/student/tasks',       icon: CheckSquare,     label: 'My Tasks'    },
  { to: '/student/attendance',  icon: BookOpen,        label: 'Attendance'  },
  { to: '/student/performance', icon: TrendingUp,      label: 'Performance' },
  { to: '/student/calendar',    icon: Calendar,        label: 'Calendar'    },
]

export default function StudentPortal() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar links={LINKS} />
      <NavigationLoader />
      <main className="flex-1 p-8" style={{ marginLeft: '224px' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"   element={<StudentDashboard />}  />
            <Route path="tasks"       element={<StudentTasks />}      />
            <Route path="attendance"  element={<StudentAttendance />} />
            <Route path="performance" element={<StudentPerformance />} />
            <Route path="calendar"    element={<AcademicCalendar />}  />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
