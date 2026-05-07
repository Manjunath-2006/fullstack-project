import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { calendarApi } from '../../services/api'
import { useLoading } from '../../context/LoadingContext'
import { pageVariants, cardVariants } from '../../animations/variants'
import toast from 'react-hot-toast'

const TYPES = ['holiday', 'exam', 'meeting', 'event']
const TYPE_STYLE = {
  holiday: 'bg-black text-white',
  exam:    'bg-gray-800 text-white',
  meeting: 'bg-gray-200 text-black',
  event:   'bg-gray-100 text-black',
}

export default function AdminCalendar() {
  const { wrap } = useLoading()
  const [events, setEvents]   = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]       = useState({ title: '', date: '', category: '', type: 'event' })

  useEffect(() => {
    wrap(() => calendarApi.getAll().then(r => setEvents(r.data)))
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const res = await calendarApi.create(form)
      setEvents(ev => [...ev, res.data].sort((a, b) => a.date.localeCompare(b.date)))
      toast.success('Event added!')
      setForm({ title: '', date: '', category: '', type: 'event' })
      setShowForm(false)
    } catch { toast.error('Failed to add event') }
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black">Academic Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">Manage events, exams, and holidays</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-add-doc" style={{ width: '140px' }}>
          <span className="btn-add-doc__text">Add Event</span>
          <span className="btn-add-doc__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none">
              <line y2="19" y1="5" x2="12" x1="12" /><line y2="12" y1="12" x2="19" x1="5" />
            </svg>
          </span>
        </button>
      </div>

      {showForm && (
        <motion.form onSubmit={handleAdd}
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-2 gap-4 overflow-hidden card-shadow">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Title</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Mid-Term Exams"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Date</label>
            <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Category</label>
            <input required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              placeholder="e.g. Exam / Holiday"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Type</label>
            <select required value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black">
              {TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
          </div>
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-black px-4 py-2">Cancel</button>
            <button type="submit" className="btn-submit">Add Event</button>
          </div>
        </motion.form>
      )}

      <div className="bg-white card-shadow rounded-xl overflow-hidden border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Date', 'Title', 'Category', 'Type'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((ev, i) => (
              <motion.tr key={ev.id} variants={cardVariants} initial="initial" animate="animate" custom={i}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-gray-600">{ev.date}</td>
                <td className="px-5 py-3 font-semibold text-black">{ev.title}</td>
                <td className="px-5 py-3 text-gray-500">{ev.category}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${TYPE_STYLE[ev.type] || 'bg-gray-100 text-gray-600'}`}>
                    {ev.type}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
