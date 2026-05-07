import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar({ links }) {
  const { user, logout } = useAuth()

  return (
    <aside className="w-56 min-h-screen flex flex-col p-5 gap-0.5 fixed left-0 top-0 z-20 bg-white border-r border-gray-100">
      {/* Brand */}
      <div className="flex items-center gap-2.5 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
          <GraduationCap size={16} className="text-white" />
        </div>
        <div>
          <p className="font-black text-black text-sm leading-none">EduTrack</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to.split('/').length === 3}>
            {({ isActive }) => (
              <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.12 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}>
                <Icon size={16} />
                {label}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-black truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <motion.button whileHover={{ x: 2 }} onClick={logout}
          className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-black transition-colors">
          <LogOut size={14} /> Sign out
        </motion.button>
      </div>
    </aside>
  )
}
