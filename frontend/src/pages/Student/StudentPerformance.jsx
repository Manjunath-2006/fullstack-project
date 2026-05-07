import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { scoresApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useLoading } from '../../context/LoadingContext'
import { pageVariants } from '../../animations/variants'

import PageLoader from '../../components/shared/PageLoader'

export default function StudentPerformance() {
  const { user } = useAuth()
  const { wrap } = useLoading()
  const [scores, setScores]   = useState([])
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    wrap(() => Promise.all([scoresApi.getAll(user.id), scoresApi.summary(user.id)])
      .then(([s, sm]) => { setScores(s.data); setSummary(sm.data) }))
  }, [user.id])

  if (!summary) return <PageLoader />

  const subjectData = Object.entries(summary.by_subject).map(([subj, avg]) => ({ subject: subj.split(' ')[0], avg }))

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-black">Performance</h1>
        <p className="text-gray-500 text-sm mt-1">Subject-wise scores and trends</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Average Score', value: `${summary.avg_marks}%` },
          { label: 'Total Tests',   value: summary.total_tests     },
          { label: 'Subjects',      value: Object.keys(summary.by_subject).length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white card-shadow rounded-xl p-4 text-center border border-gray-100">
            <p className="text-3xl font-black text-black">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white card-shadow rounded-xl p-5 border border-gray-100">
        <h2 className="font-bold text-black mb-4 text-sm uppercase tracking-wide">Subject Averages</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={subjectData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: 'none' }}
              formatter={v => [`${v}%`, 'Avg']} />
            <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
              {subjectData.map((d, i) => (
                <Cell key={i} fill={['#6366f1','#10b981','#f59e0b','#ef4444','#06b6d4'][i % 5]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white card-shadow rounded-xl overflow-hidden border border-gray-100">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-black text-sm uppercase tracking-wide">All Test Scores</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['Subject','Test','Marks','Max','Date'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...scores].sort((a,b) => new Date(b.test_date)-new Date(a.test_date)).map((s,i) => (
              <tr key={s.id||i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-2.5 font-medium text-black">{s.subject}</td>
                <td className="px-5 py-2.5 text-gray-600">{s.test_name}</td>
                <td className="px-5 py-2.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold
                    ${s.marks>=75?'bg-emerald-50 text-emerald-700':s.marks>=50?'bg-amber-50 text-amber-700':'bg-red-50 text-red-600'}`}>
                    {s.marks}
                  </span>
                </td>
                <td className="px-5 py-2.5 text-gray-400">{s.max_marks}</td>
                <td className="px-5 py-2.5 text-gray-500">{s.test_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
