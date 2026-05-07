import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, CheckCircle, AlertCircle, TrendingUp, UserCheck, BookOpen, Clock } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import KpiCard from '../../components/shared/KpiCard'
import { performanceApi } from '../../services/api'
import { useLoading } from '../../context/LoadingContext'
import { pageVariants } from '../../animations/variants'

import PageLoader from '../../components/shared/PageLoader'

export default function AdminDashboard() {
  const { wrap } = useLoading()
  const [data, setData] = useState(null)

  useEffect(() => {
    // Single request — dashboard now includes analytics
    wrap(() => performanceApi.adminDashboard().then(r => setData(r.data)))
  }, [])

  if (!data) return <PageLoader />

  const taskPie = [
    { name: 'Completed', value: data.task_stats?.completed ?? 0 },
    { name: 'Pending',   value: data.task_stats?.pending   ?? 0 },
    { name: 'Overdue',   value: data.task_stats?.overdue   ?? 0 },
  ].filter(d => d.value > 0)

  const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444']

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-black">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Class-wide overview</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={Users}       label="Students"       value={data.total_students}             color="blue"   index={0} />
        <KpiCard icon={BookOpen}    label="Teachers"       value={data.total_teachers}             color="indigo" index={1} />
        <KpiCard icon={UserCheck}   label="Present Today"  value={data.present_today}              color="green"  index={2} />
        <KpiCard icon={Clock}       label="Pending Leaves" value={data.pending_leaves}             color="amber"  index={3} />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={TrendingUp}  label="Class Avg"      value={`${data.avg_score}%`}            color="purple" index={0} />
        <KpiCard icon={CheckCircle} label="Tasks Done"     value={data.completed_tasks}            color="green"  index={1} />
        <KpiCard icon={AlertCircle} label="Overdue Tasks"  value={data.overdue_tasks}              color="red"    index={2} />
        <KpiCard icon={CheckCircle} label="Completion"     value={`${data.task_completion_rate}%`} color="indigo" index={3} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white card-shadow rounded-xl p-5 border border-gray-100">
          <h2 className="font-bold text-black mb-4 text-sm uppercase tracking-wide">Task Status</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={taskPie} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {taskPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white card-shadow rounded-xl p-5 border border-gray-100">
          <h2 className="font-bold text-black mb-4 text-sm uppercase tracking-wide">Subject Averages</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.subject_averages || []} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="subject" tick={{ fontSize: 9, fill: '#6b7280' }} tickFormatter={v => v.split(' ')[0]} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: 'none' }} />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                {(data.subject_averages || []).map((d, i) => (
                  <Cell key={i} fill={['#6366f1','#10b981','#f59e0b','#ef4444','#06b6d4'][i % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
