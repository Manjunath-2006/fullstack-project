import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { performanceApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useLoading } from '../../context/LoadingContext'
import { pageVariants } from '../../animations/variants'

import PageLoader from '../../components/shared/PageLoader'

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

export default function StudentAttendance() {
  const { user } = useAuth()
  const { wrap } = useLoading()
  const [records, setRecords] = useState([])
  const [summary, setSummary] = useState(null)
  const [viewDate, setViewDate] = useState(new Date())

  useEffect(() => {
    wrap(() => Promise.all([
      performanceApi.attendance(user.id),
      performanceApi.attendanceSummary(user.id),
    ]).then(([r, s]) => {
      setRecords(r.data)
      setSummary(s.data)
    }))
  }, [user.id])

  if (!summary) return <PageLoader />

  // Build lookup: "YYYY-MM-DD" → status
  const lookup = {}
  records.forEach(r => { lookup[r.date] = r.status })

  // Calendar grid for current view month
  const year  = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()   // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date().toISOString().split('T')[0]

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const pct = summary.percentage
  const pctColor = pct >= 75 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-500' : 'text-red-500'
  const badgeCls = pct >= 75
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : pct >= 60
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-red-50 text-red-600 border-red-200'

  const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  // Month stats
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
  const monthRecs = records.filter(r => r.date.startsWith(monthStr))
  const monthPresent = monthRecs.filter(r => r.status === 'present').length
  const monthAbsent  = monthRecs.filter(r => r.status === 'absent').length

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-black">Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">Monthly attendance calendar</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white card-shadow rounded-xl p-5 border border-gray-100 col-span-2 xl:col-span-1">
          <p className={`text-5xl font-black ${pctColor}`}>{pct}%</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Overall Attendance</p>
          <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeCls}`}>
            {pct >= 75 ? 'Good Standing' : pct >= 60 ? 'Needs Improvement' : 'Critical'}
          </span>
        </div>
        {[
          { label: 'Total Days', value: summary.total_days,  color: 'text-black'         },
          { label: 'Present',    value: summary.present,     color: 'text-emerald-600'   },
          { label: 'Absent',     value: summary.absent,      color: 'text-red-500'       },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white card-shadow rounded-xl p-5 border border-gray-100 text-center">
            <p className={`text-3xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Monthly calendar */}
      <div className="bg-white card-shadow rounded-xl border border-gray-100 overflow-hidden">
        {/* Calendar header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <div className="text-center">
            <h2 className="font-bold text-black text-base">{MONTHS[month]} {year}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {monthPresent} present · {monthAbsent} absent this month
            </p>
          </div>
          <button onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS.map(d => (
            <div key={d} className="py-2.5 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="h-14 border-b border-r border-gray-50" />

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const status  = lookup[dateStr]
            const isToday = dateStr === today
            const isWeekend = new Date(year, month, day).getDay() % 6 === 0

            let cellBg = ''
            let dotColor = ''
            if (status === 'present') { cellBg = 'bg-emerald-50'; dotColor = 'bg-emerald-500' }
            else if (status === 'absent') { cellBg = 'bg-red-50'; dotColor = 'bg-red-400' }
            else if (isWeekend) { cellBg = 'bg-gray-50' }

            return (
              <motion.div key={dateStr}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.008 }}
                className={`h-14 border-b border-r border-gray-50 flex flex-col items-center justify-center gap-1 relative
                  ${cellBg} ${isToday ? 'ring-2 ring-inset ring-indigo-400' : ''}`}>
                <span className={`text-sm font-semibold leading-none
                  ${isToday ? 'text-indigo-600' : isWeekend ? 'text-gray-400' : 'text-gray-700'}`}>
                  {day}
                </span>
                {dotColor && (
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                )}
                {status && (
                  <span className={`text-xs font-medium leading-none
                    ${status === 'present' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {status === 'present' ? 'P' : 'A'}
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 px-6 py-3 border-t border-gray-100 bg-gray-50">
          {[
            { color: 'bg-emerald-500', label: 'Present' },
            { color: 'bg-red-400',     label: 'Absent'  },
            { color: 'ring-2 ring-indigo-400 bg-white', label: 'Today', ring: true },
          ].map(({ color, label, ring }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${ring ? 'ring-2 ring-indigo-400 bg-white' : color}`} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <span className="text-xs text-gray-500">No record</span>
          </div>
        </div>
      </div>

      {/* Recent records table */}
      <div className="bg-white card-shadow rounded-xl overflow-hidden border border-gray-100">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-black text-sm uppercase tracking-wide">Recent Records</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Date</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Day</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {[...records]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 10)
              .map((r, i) => {
                const d = new Date(r.date)
                return (
                  <tr key={r.id || i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-2.5 text-gray-700 font-medium">{r.date}</td>
                    <td className="px-5 py-2.5 text-gray-500">{DAYS[d.getDay()]}</td>
                    <td className="px-5 py-2.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                        ${r.status === 'present'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-600 border border-red-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'present' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
