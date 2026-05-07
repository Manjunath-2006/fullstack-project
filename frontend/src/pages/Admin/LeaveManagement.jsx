import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { leavesApi, studentsApi, teachersApi } from '../../services/api'
import { useLoading } from '../../context/LoadingContext'
import { pageVariants, cardVariants } from '../../animations/variants'
import toast from 'react-hot-toast'

export default function LeaveManagement() {
  const { wrap } = useLoading()
  const [leaves, setLeaves]     = useState([])
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [filter, setFilter]     = useState('pending')

  useEffect(() => {
    wrap(() => Promise.all([leavesApi.getAll(), studentsApi.getAll(), teachersApi.getAll()])
      .then(([l, s, t]) => { setLeaves(l.data); setStudents(s.data); setTeachers(t.data) }))
  }, [])

  const decide = async (id, status) => {
    try {
      const res = await leavesApi.decide(id, { status })
      setLeaves(ls => ls.map(l => l.id === id ? res.data : l))
      toast.success(`Leave ${status}`)
    } catch { toast.error('Failed') }
  }

  const getName = (id, role) => {
    if (role === 'student') return students.find(s => s.id === id)?.name || id
    return teachers.find(t => t.id === id)?.name || id
  }

  const filtered = leaves.filter(l => filter === 'all' || l.status === filter)

  const STATUS_STYLE = {
    pending:  'bg-gray-100 text-gray-600',
    approved: 'bg-black text-white',
    rejected: 'bg-gray-200 text-gray-400',
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-black">Leave Management</h1>
        <p className="text-gray-500 text-sm mt-1">{leaves.filter(l => l.status === 'pending').length} pending requests</p>
      </div>

      <div className="flex gap-2">
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize
              ${filter === f ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
            {f} ({f === 'all' ? leaves.length : leaves.filter(l => l.status === f).length})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((l, i) => (
          <motion.div key={l.id} variants={cardVariants} initial="initial" animate="animate" custom={i}
            className="bg-white card-shadow rounded-xl p-5 border border-gray-100 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {getName(l.applicant_id, l.applicant_role)[0]}
                </div>
                <div>
                  <p className="font-bold text-black text-sm">{getName(l.applicant_id, l.applicant_role)}</p>
                  <p className="text-xs text-gray-400 capitalize">{l.applicant_role}</p>
                </div>
                <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLE[l.status]}`}>
                  {l.status}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-semibold">Period:</span> {l.from_date} → {l.to_date}
              </p>
              <p className="text-xs text-gray-500">{l.reason}</p>
            </div>

            {l.status === 'pending' && (
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => decide(l.id, 'approved')}
                  className="px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                  Approve
                </button>
                <button onClick={() => decide(l.id, 'rejected')}
                  className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                  Reject
                </button>
              </div>
            )}
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-12 text-gray-400 text-sm">No {filter} requests</p>
        )}
      </div>
    </motion.div>
  )
}
