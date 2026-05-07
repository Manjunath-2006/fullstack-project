import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { leavesApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useLoading } from '../../context/LoadingContext'
import { pageVariants } from '../../animations/variants'
import toast from 'react-hot-toast'

export default function LeaveApply() {
  const { user } = useAuth()
  const { wrap } = useLoading()
  const [leaves, setLeaves]   = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]       = useState({ from_date: '', to_date: '', reason: '' })

  useEffect(() => {
    wrap(() => leavesApi.getAll(user.id).then(r => setLeaves(r.data)))
  }, [user.id])

  const apply = async (e) => {
    e.preventDefault()
    try {
      const res = await leavesApi.apply({ applicant_id: user.id, applicant_role: 'teacher', ...form })
      setLeaves(l => [res.data, ...l])
      toast.success('Leave application submitted!')
      setForm({ from_date: '', to_date: '', reason: '' }); setShowForm(false)
    } catch { toast.error('Failed') }
  }

  const STATUS_STYLE = { pending: 'bg-gray-100 text-gray-600', approved: 'bg-black text-white', rejected: 'bg-gray-200 text-gray-400' }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black">Leave Requests</h1>
          <p className="text-gray-500 text-sm mt-1">Apply and track your leave applications</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-signin" style={{ width: '130px', fontSize: '12px' }}>
          Apply Leave
        </button>
      </div>

      {showForm && (
        <motion.form onSubmit={apply}
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-2 gap-4 overflow-hidden card-shadow">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">From Date</label>
            <input type="date" required value={form.from_date} onChange={e => setForm(f => ({ ...f, from_date: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">To Date</label>
            <input type="date" required value={form.to_date} onChange={e => setForm(f => ({ ...f, to_date: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Reason</label>
            <textarea required rows={2} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black resize-none" />
          </div>
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-black px-4 py-2">Cancel</button>
            <button type="submit" className="btn-submit">Submit</button>
          </div>
        </motion.form>
      )}

      <div className="space-y-3">
        {leaves.map(l => (
          <div key={l.id} className="bg-white card-shadow rounded-xl p-4 border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-black">{l.from_date} → {l.to_date}</p>
              <p className="text-xs text-gray-500 mt-1">{l.reason}</p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${STATUS_STYLE[l.status]}`}>
              {l.status}
            </span>
          </div>
        ))}
        {leaves.length === 0 && <p className="text-center py-12 text-gray-400 text-sm">No leave requests yet</p>}
      </div>
    </motion.div>
  )
}
