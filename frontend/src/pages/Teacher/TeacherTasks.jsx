import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FileText, Download, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { tasksApi, studentsApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useLoading } from '../../context/LoadingContext'
import { pageVariants, cardVariants } from '../../animations/variants'

export default function TeacherTasks() {
  const { user } = useAuth()
  const { wrap } = useLoading()
  const [tasks, setTasks]       = useState([])
  const [students, setStudents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedAll, setSelectedAll] = useState(false)
  const [form, setForm] = useState({ student_ids: [], title: '', description: '', due_date_time: '' })

  useEffect(() => {
    wrap(() => Promise.all([
      tasksApi.getAll(null, user.subject),
      studentsApi.getAll(),
    ]).then(([t, s]) => { setTasks(t.data); setStudents(s.data) }))
  }, [user.subject])

  const toggleStudent = (id) => {
    setForm(f => ({
      ...f,
      student_ids: f.student_ids.includes(id)
        ? f.student_ids.filter(s => s !== id)
        : [...f.student_ids, id],
    }))
  }

  const toggleAll = () => {
    const all = !selectedAll
    setSelectedAll(all)
    setForm(f => ({ ...f, student_ids: all ? students.map(s => s.id) : [] }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.student_ids.length) { toast.error('Select at least one student'); return }
    if (!form.due_date_time) { toast.error('Please set a due date and time'); return }
    try {
      // Convert local datetime string to ISO only at submit time
      const isoDateTime = new Date(form.due_date_time).toISOString()
      const res = await tasksApi.create({
        ...form,
        due_date_time: isoDateTime,
        subject:       user.subject,
        assigned_by:   user.id,
      })
      setTasks(ts => [...res.data, ...ts])
      toast.success(`Task assigned to ${res.data.length} student(s)!`)
      setForm({ student_ids: [], title: '', description: '', due_date_time: '' })
      setSelectedAll(false); setShowForm(false)
    } catch { toast.error('Failed to assign task') }
  }

  const studentName = (id) => students.find(s => s.id === id)?.name || id

  const openDocument = async (docId, filename) => {
    try {
      const res = await tasksApi.getDoc(docId)
      const { content, filename: name } = res.data
      // Decode base64 and open as blob URL
      const byteChars = atob(content)
      const byteArr   = new Uint8Array(byteChars.length)
      for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i)
      const blob = new Blob([byteArr])
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = name || filename
      a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Failed to open document') }
  }

  // Group by subject (always same subject for teacher)
  const grouped = {}
  tasks.forEach(t => { (grouped[t.subject] = grouped[t.subject] || []).push(t) })

  const STATUS_STYLE = {
    completed: 'bg-black text-white',
    pending:   'bg-gray-100 text-gray-600',
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black">Tasks — {user.subject}</h1>
          <p className="text-gray-500 text-sm mt-1">{tasks.length} tasks assigned</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-add-doc" style={{ width: '150px' }}>
          <span className="btn-add-doc__text">Assign Task</span>
          <span className="btn-add-doc__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none">
              <line y2="19" y1="5" x2="12" x1="12" /><line y2="12" y1="12" x2="19" x1="5" />
            </svg>
          </span>
        </button>
      </div>

      {/* Assign form */}
      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={handleCreate}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 overflow-hidden card-shadow">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Task Title</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Chapter 5 Assignment"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Due Date & Time</label>
                <input required type="datetime-local" value={form.due_date_time}
                  onChange={e => setForm(f => ({ ...f, due_date_time: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Description</label>
                <textarea rows={2} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black resize-none" />
              </div>
            </div>

            {/* Student selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Select Students</label>
                <button type="button" onClick={toggleAll}
                  className="text-xs font-semibold text-black underline underline-offset-2">
                  {selectedAll ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-auto">
                {students.map(s => (
                  <label key={s.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-xs
                    ${form.student_ids.includes(s.id) ? 'border-black bg-black text-white' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400'}`}>
                    <input type="checkbox" className="hidden" checked={form.student_ids.includes(s.id)} onChange={() => toggleStudent(s.id)} />
                    <span className="font-medium truncate">{s.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">{form.student_ids.length} selected</p>
            </div>

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-black px-4 py-2">Cancel</button>
              <button type="submit" className="btn-submit">Assign</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Tasks grouped by subject */}
      {Object.entries(grouped).map(([subj, subTasks]) => (
        <div key={subj} className="bg-white card-shadow rounded-xl overflow-hidden border border-gray-100">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-black text-sm uppercase tracking-wide">{subj}</h2>
            <span className="text-xs text-gray-400">{subTasks.length} tasks</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Student', 'Task', 'Due', 'Status', 'Documents'].map(h => (
                  <th key={h} className="text-left px-5 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subTasks.map((t, i) => {
                const overdue = t.overdue || (t.status !== 'completed' && new Date(t.due_date_time) < new Date())
                return (
                  <motion.tr key={t.id} variants={cardVariants} initial="initial" animate="animate" custom={i}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-2.5 font-medium text-black">{studentName(t.student_id)}</td>
                    <td className="px-5 py-2.5 text-gray-600 max-w-xs">
                      <p className="truncate">{t.title}</p>
                      {t.description && <p className="text-xs text-gray-400 truncate mt-0.5">{t.description}</p>}
                    </td>
                    <td className={`px-5 py-2.5 text-xs font-medium ${overdue ? 'text-black font-bold' : 'text-gray-500'}`}>
                      {new Date(t.due_date_time).toLocaleDateString()}{overdue ? ' ⚠' : ''}
                    </td>
                    <td className="px-5 py-2.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${overdue ? 'bg-gray-800 text-white' : STATUS_STYLE[t.status]}`}>
                        {overdue ? 'Overdue' : t.status}
                      </span>
                    </td>
                    <td className="px-5 py-2.5">
                      {t.documents?.length > 0 ? (
                        <div className="space-y-1">
                          {t.documents.map(doc => (
                            <button
                              key={doc.id}
                              onClick={() => openDocument(doc.id, doc.filename)}
                              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors group"
                            >
                              <FileText size={12} className="flex-shrink-0" />
                              <span className="truncate max-w-[120px] group-hover:underline">{doc.filename}</span>
                              <Download size={11} className="flex-shrink-0 opacity-60" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">No files</span>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ))}
    </motion.div>
  )
}
