import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { scoresApi, studentsApi } from '../../services/api'
import { useLoading } from '../../context/LoadingContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { pageVariants } from '../../animations/variants'

const SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Computer Science']

export default function AdminScores() {
  const { wrap } = useLoading()
  const [scores, setScores]     = useState([])
  const [students, setStudents] = useState([])
  const [subject, setSubject]   = useState(SUBJECTS[0])

  useEffect(() => {
    wrap(() => Promise.all([scoresApi.getAll(null, subject), studentsApi.getAll()])
      .then(([s, st]) => { setScores(s.data); setStudents(st.data) }))
  }, [subject])

  const studentName = (id) => students.find(s => s.id === id)?.name || id

  // Per-student average for selected subject
  const studentAvgs = students.map(s => {
    const recs = scores.filter(sc => sc.student_id === s.id)
    const avg  = recs.length ? Math.round(recs.reduce((a, b) => a + b.marks, 0) / recs.length) : 0
    return { name: s.name.split(' ')[0], avg, roll: s.roll_number }
  }).filter(s => s.avg > 0)

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-black">Class Scores</h1>
        <p className="text-gray-500 text-sm mt-1">Overall marks view by subject</p>
      </div>

      {/* Subject tabs */}
      <div className="flex gap-2 flex-wrap">
        {SUBJECTS.map(s => (
          <button key={s} onClick={() => setSubject(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${subject === s ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      {studentAvgs.length > 0 && (
        <div className="bg-white card-shadow rounded-xl p-5 border border-gray-100">
          <h2 className="font-bold text-black mb-4 text-sm uppercase tracking-wide">{subject} — Class Performance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={studentAvgs} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: 'none' }}
                formatter={v => [`${v}%`, 'Avg']} />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                {studentAvgs.map((d, i) => (
                  <Cell key={i} fill={d.avg >= 75 ? '#10b981' : d.avg >= 50 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Scores table */}
      <div className="bg-white card-shadow rounded-xl overflow-hidden border border-gray-100">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-black text-sm uppercase tracking-wide">{subject} — All Records</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['Roll', 'Student', 'Test', 'Marks', 'Max', 'Date'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={s.id || i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-2.5 font-mono text-xs text-gray-500">{s.roll_number}</td>
                <td className="px-5 py-2.5 font-medium text-black">{s.name || studentName(s.student_id)}</td>
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
        {scores.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No scores for {subject}</p>}
      </div>
    </motion.div>
  )
}
