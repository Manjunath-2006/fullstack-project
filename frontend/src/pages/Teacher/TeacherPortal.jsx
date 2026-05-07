import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ClipboardList, BarChart2, Calendar, FileText } from 'lucide-react'
import Sidebar from '../../components/shared/Sidebar'
import NavigationLoader from '../../components/shared/NavigationLoader'
import TeacherTasks  from './TeacherTasks'
import TeacherScores from './TeacherScores'
import AcademicCalendar from '../Student/AcademicCalendar'
import LeaveApply from './LeaveApply'

const LINKS = [
  { to: '/teacher/tasks',    icon: ClipboardList, label: 'Tasks'    },
  { to: '/teacher/scores',   icon: BarChart2,     label: 'Scores'   },
  { to: '/teacher/calendar', icon: Calendar,      label: 'Calendar' },
  { to: '/teacher/leave',    icon: FileText,      label: 'Leave'    },
]

export default function TeacherPortal() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar links={LINKS} />
      <NavigationLoader />
      <main className="flex-1 p-8" style={{ marginLeft: '224px' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route index element={<Navigate to="tasks" replace />} />
            <Route path="tasks"    element={<TeacherTasks />}      />
            <Route path="scores"   element={<TeacherScores />}     />
            <Route path="calendar" element={<AcademicCalendar />}  />
            <Route path="leave"    element={<LeaveApply />}        />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
