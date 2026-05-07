import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, Calendar, FileText, ClipboardList, BarChart2 } from 'lucide-react'
import Sidebar from '../../components/shared/Sidebar'
import NavigationLoader from '../../components/shared/NavigationLoader'
import AdminDashboard  from './AdminDashboard'
import UserManagement  from './UserManagement'
import LeaveManagement from './LeaveManagement'
import AdminCalendar   from './AdminCalendar'
import AdminScores     from './AdminScores'

const LINKS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/admin/users',     icon: Users,           label: 'Users'      },
  { to: '/admin/scores',    icon: BarChart2,       label: 'Scores'     },
  { to: '/admin/leaves',    icon: FileText,        label: 'Leaves'     },
  { to: '/admin/calendar',  icon: Calendar,        label: 'Calendar'   },
]

export default function AdminPortal() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar links={LINKS} />
      <NavigationLoader />
      <main className="flex-1 p-8" style={{ marginLeft: '224px' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />}  />
            <Route path="users"     element={<UserManagement />}  />
            <Route path="scores"    element={<AdminScores />}     />
            <Route path="leaves"    element={<LeaveManagement />} />
            <Route path="calendar"  element={<AdminCalendar />}   />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
