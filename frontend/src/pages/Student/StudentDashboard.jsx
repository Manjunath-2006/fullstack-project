import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle, TrendingUp, AlertCircle, Clock, BookOpen } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import KpiCard from '../../components/shared/KpiCard'
import AiRecommendations from '../../components/shared/AiRecommendations'
import { performanceApi, scoresApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useLoading } from '../../context/LoadingContext'
import { pageVariants } from '../../animations/variants'
import PageLoader from '../../components/shared/PageLoader'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-black">{label}</p>
      <p className="text-gray-500">{payload[0].value}%</p>
    </div>
  )
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const { wrap } = useLoading()
  const [dash, setDash]     = useState(null)
  const [scores, setScores] = useState([])

  useEffect(() => {
    wrap(() => Promise.all([
      performanceApi.studentDashboard(user.id),
      scoresApi.getAll(user.id),
    ]).then(([d, s]) => { setDash(d.data); setScores(s.data) }))
  }, [user.id])

  if (!dash) return <PageLoader />

  const trendData = [...scores]
    .sort((a, b) => new Date(a.test_date) - new Date(b.test_date))
    .slice(-8)
    .map(s => ({ name: `${s.subject?.slice(0,3)}`, marks: Math.round(s.marks / s.max_marks * 100) }))

  // Subject averages for bar chart
  const subjectMap = {}
  scores.forEach(s => {
    if (!subjectMap[s.subject]) subjectMap[s.subject] = { total: 0, count: 0 }
    subjectMap[s.subject].total += s.marks / s.max_marks * 100
    subjectMap[s.subject].count += 1
  })
  const subjectData = Object.entries(subjectMap).map(([subj, v]) => ({
    subject: subj.split(' ')[0],
    avg: Math.round(v.total / v.count),
  }))

  const BAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']

  const attendancePct = Number(dash.attendance_pct) || 0
  const attendanceColor = attendancePct >= 75 ? 'green' : attendancePct >= 60 ? 'amber' : 'red'

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-black">Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's your academic summary for today</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          <Calendar size={13} className="text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={Calendar}    label="Attendance"  value={`${dash.attendance_pct}%`}                     color={attendanceColor} index={0}
          sub={attendancePct >= 75 ? 'Good standing' : 'Needs improvement'} />
        <KpiCard icon={CheckCircle} label="Tasks Done"  value={`${dash.completed_tasks}/${dash.total_tasks}`} color="green"  index={1}
          sub={`${dash.total_tasks - dash.completed_tasks} remaining`} />
        <KpiCard icon={TrendingUp}  label="Avg Score"   value={`${dash.avg_score}%`}                          color="purple" index={2}
          sub={dash.avg_score >= 75 ? 'Above average' : 'Keep improving'} />
        <KpiCard icon={AlertCircle} label="Overdue"     value={dash.overdue_tasks}                            color={dash.overdue_tasks > 0 ? 'red' : 'green'} index={3}
          sub={dash.overdue_tasks > 0 ? 'Action needed' : 'All on track'} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Score trend chart */}
        <div className="xl:col-span-2 bg-white card-shadow rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-black text-black text-sm uppercase tracking-wide">Score Trend</h2>
              <p className="text-xs text-gray-400 mt-0.5">Your last {trendData.length} test results</p>
            </div>
            {trendData.length > 1 && (() => {
              const diff = trendData[trendData.length-1]?.marks - trendData[0]?.marks
              return (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${diff >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                  {diff >= 0 ? '↑' : '↓'} {Math.abs(diff)}% overall
                </span>
              )
            })()}
          </div>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="marks" stroke="#6366f1" strokeWidth={2.5}
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-gray-300">
              <TrendingUp size={32} className="mb-2 opacity-30" />
              <p className="text-sm">No scores recorded yet</p>
            </div>
          )}
        </div>

        {/* Upcoming deadlines */}
        <div className="bg-white card-shadow rounded-2xl p-5 border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-gray-400" />
            <h2 className="font-black text-black text-sm uppercase tracking-wide">Upcoming</h2>
          </div>
          {dash.upcoming_deadlines?.length > 0 ? (
            <div className="space-y-2 flex-1">
              {dash.upcoming_deadlines.map((t, i) => {
                const due = new Date(t.due_date_time)
                const daysLeft = Math.ceil((due - new Date()) / 86400000)
                const urgent = daysLeft <= 1
                return (
                  <motion.div key={t.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`p-3 rounded-xl border ${urgent ? 'border-red-100 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                    <p className="text-xs font-bold text-black truncate">{t.title}</p>
                    <p className={`text-xs mt-0.5 font-medium ${urgent ? 'text-red-500' : 'text-gray-400'}`}>
                      {daysLeft <= 0 ? '⚠ Due today!' : daysLeft === 1 ? '⚠ Due tomorrow' : `${daysLeft} days left`}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 py-8">
              <CheckCircle size={28} className="mb-2 opacity-30" />
              <p className="text-xs">No upcoming deadlines</p>
            </div>
          )}
        </div>
      </div>

      {/* Subject performance + AI side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Subject bar chart */}
        {subjectData.length > 0 && (
          <div className="xl:col-span-2 bg-white card-shadow rounded-2xl p-5 border border-gray-100">
            <div className="mb-4">
              <h2 className="font-black text-black text-sm uppercase tracking-wide">Subject Performance</h2>
              <p className="text-xs text-gray-400 mt-0.5">Average score per subject</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={subjectData} barSize={32} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                  {subjectData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AI Recommendations */}
        <div className={subjectData.length > 0 ? '' : 'xl:col-span-3'}>
          <AiRecommendations studentId={user.id} />
        </div>
      </div>

    </motion.div>
  )
}
