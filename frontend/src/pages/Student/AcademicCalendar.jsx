import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { calendarApi, leavesApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useLoading } from '../../context/LoadingContext'
import { pageVariants } from '../../animations/variants'
import toast from 'react-hot-toast'

const TYPE_STYLE = {
  holiday: 'bg-black text-white',
  exam:    'bg-gray-800 text-white',
  meeting: 'bg-gray-200 text-black',
  event:   'bg-gray-100 text-black',
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AcademicCalendar() {
  const { user } = useAuth()
  const { wrap } = useLoading()
  const [events, setEvents]   = useState([])
  const [leaves, setLeaves]   = useState([])
  const [showLeave, setShowLeave] = useState(false)
  const [leaveForm, setLeaveForm] = useState({ from_date: '', to_date: '', reason: '' })

  useEffect(() => {
    wrap(() => Promise.all([
      calendarApi.getAll(),
      leavesApi.getAll(user.id),
    ]).then(([e, l]) => { setEvents(e.data); setLeaves(l.data) }))
  }, [user.id])

  const applyLeave = async (e) => {
    e.preventDefault()
    try {
      const res = await leavesApi.apply({
        applicant_id:   user.id,
        applicant_role: 'student',
        ...leaveForm,
      })
      setLeaves(l => [res.data, ...l])
      toast.success('Leave application submitted!')
      setLeaveForm({ from_date: '', to_date: '', reason: '' })
      setShowLeave(false)
    } catch { toast.error('Failed to apply') }
  }

  // Group events by month
  const grouped = {}
  events.forEach(ev => {
    const d = new Date(ev.date)
    const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
    ;(grouped[key] = grouped[key] || []).push(ev)
  })

  const STATUS_STYLE = {
    pending:  'bg-gray-100 text-gray-600',
    approved: 'bg-black text-white',
    rejected: 'bg-gray-200 text-gray-500 line-through',
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black">Academic Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">Upcoming events, exams, and holidays</p>
        </div>
        <button onClick={() => setShowLeave(v => !v)}
          className="btn-signin" style={{ width: '140px', fontSize: '12px' }}>
          Apply Leave
        </button>
      </div>

      {/* Leave form */}
      {showLeave && (
        <motion.form onSubmit={applyLeave}
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-2 gap-4 overflow-hidden card-shadow">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">From Date</label>
            <input type="date" required value={leaveForm.from_date}
              onChange={e => setLeaveForm(f => ({ ...f, from_date: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">To Date</label>
            <input type="date" required value={leaveForm.to_date}
              onChange={e => setLeaveForm(f => ({ ...f, to_date: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Reason</label>
            <textarea required rows={2} value={leaveForm.reason}
              onChange={e => setLeaveForm(f => ({ ...f, reason: e.target.value }))}
              placeholder="Reason for leave..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black resize-none" />
          </div>
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowLeave(false)} className="text-sm text-gray-500 hover:text-black px-4 py-2">Cancel</button>
            <button type="submit" className="btn-submit">Submit</button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Calendar events */}
        <div className="xl:col-span-2 space-y-5">
          {Object.entries(grouped).map(([month, evs]) => (
            <div key={month} className="bg-white border border-gray-100 rounded-xl card-shadow overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-black text-sm uppercase tracking-wide">{month}</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {evs.map(ev => (
                  <div key={ev.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="text-center w-10 flex-shrink-0">
                      <p className="text-lg font-black text-black leading-none">{new Date(ev.date).getDate()}</p>
                      <p className="text-xs text-gray-400">{MONTHS[new Date(ev.date).getMonth()]}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black">{ev.title}</p>
                      <p className="text-xs text-gray-400">{ev.category}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${TYPE_STYLE[ev.type] || 'bg-gray-100 text-gray-600'}`}>
                      {ev.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="text-gray-400 text-sm text-center py-12">No events scheduled</p>}
        </div>

        {/* Leave requests */}
        <div className="bg-white border border-gray-100 rounded-xl card-shadow overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="font-bold text-black text-sm uppercase tracking-wide">My Leave Requests</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {leaves.length > 0 ? leaves.map(l => (
              <div key={l.id} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-black">{l.from_date} → {l.to_date}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[l.status]}`}>
                    {l.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{l.reason}</p>
              </div>
            )) : (
              <p className="text-gray-400 text-sm text-center py-8">No leave requests</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
