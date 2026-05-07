import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Circle, Paperclip, X, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { tasksApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useLoading } from '../../context/LoadingContext'
import { pageVariants, cardVariants } from '../../animations/variants'

function isOverdue(task) {
  return task.status !== 'completed' && new Date(task.due_date_time) < new Date()
}

export default function StudentTasks() {
  const { user } = useAuth()
  const { wrap } = useLoading()
  const [tasks, setTasks]   = useState([])
  const [filter, setFilter] = useState('all')
  const fileRefs = useRef({})

  useEffect(() => {
    wrap(() => tasksApi.getAll(user.id).then(r => setTasks(r.data)))
  }, [user.id])

  const markComplete = async (id) => {
    try {
      const res = await tasksApi.update(id, { status: 'completed' })
      setTasks(ts => ts.map(t => t.id === id ? { ...res.data, overdue: false, documents: t.documents } : t))
      toast.success('Task completed!')
    } catch { toast.error('Update failed') }
  }

  const handleUpload = async (taskId, file) => {
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await tasksApi.uploadDoc(taskId, user.id, fd)
      setTasks(ts => ts.map(t => t.id === taskId
        ? { ...t, documents: [...(t.documents || []), res.data] }
        : t))
      toast.success('Document uploaded!')
    } catch { toast.error('Upload failed') }
  }

  const handleRemoveDoc = async (taskId, docId) => {
    try {
      await tasksApi.deleteDoc(docId, user.id)
      setTasks(ts => ts.map(t => t.id === taskId
        ? { ...t, documents: t.documents.filter(d => d.id !== docId) }
        : t))
      toast.success('Document removed')
    } catch { toast.error('Remove failed') }
  }

  const counts = {
    all:       tasks.length,
    pending:   tasks.filter(t => t.status === 'pending' && !isOverdue(t)).length,
    overdue:   tasks.filter(t => isOverdue(t)).length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  const filtered = tasks.filter(t => {
    if (filter === 'pending')   return t.status === 'pending' && !isOverdue(t)
    if (filter === 'overdue')   return isOverdue(t)
    if (filter === 'completed') return t.status === 'completed'
    return true
  })

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-black">My Tasks</h1>
        <p className="text-gray-500 text-sm mt-1">{tasks.length} tasks assigned</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all',       label: `All (${counts.all})` },
          { key: 'pending',   label: `Pending (${counts.pending})` },
          { key: 'overdue',   label: `Overdue (${counts.overdue})` },
          { key: 'completed', label: `Completed (${counts.completed})` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${filter === key ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Task cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((task, i) => {
            const overdue = isOverdue(task)
            const docs    = task.documents || []
            return (
              <motion.div key={task.id} variants={cardVariants} initial="initial" animate="animate"
                exit={{ opacity: 0, scale: 0.95 }} custom={i}
                className={`bg-white rounded-xl p-4 border-2 space-y-3 card-shadow
                  ${overdue ? 'border-gray-800' : task.status === 'completed' ? 'border-gray-200' : 'border-gray-100'}`}>

                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-black text-sm">{task.title}</p>
                    {task.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{task.description}</p>}
                  </div>
                  {overdue ? <AlertCircle size={16} className="text-black flex-shrink-0" />
                    : task.status === 'completed' ? <CheckCircle size={16} className="text-black flex-shrink-0" />
                    : <Circle size={16} className="text-gray-300 flex-shrink-0" />}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">{task.subject}</span>
                  <span className={`text-xs font-medium ${overdue ? 'text-black font-bold' : 'text-gray-400'}`}>
                    {overdue ? '⚠ Overdue' : `Due ${new Date(task.due_date_time).toLocaleDateString()}`}
                  </span>
                </div>

                {/* Documents */}
                {docs.length > 0 && (
                  <div className="space-y-1">
                    {docs.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={12} className="text-gray-500 flex-shrink-0" />
                          <span className="text-xs text-gray-700 truncate">{doc.filename}</span>
                        </div>
                        {task.status !== 'completed' && (
                          <button onClick={() => handleRemoveDoc(task.id, doc.id)}
                            className="text-gray-400 hover:text-black transition-colors ml-2 flex-shrink-0">
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {task.status !== 'completed' && (
                  <div className="flex items-center gap-2 pt-1">
                    {/* Add Document button */}
                    <input type="file" ref={el => fileRefs.current[task.id] = el}
                      className="hidden" onChange={e => handleUpload(task.id, e.target.files[0])} />
                    <button className="btn-add-doc" onClick={() => fileRefs.current[task.id]?.click()}>
                      <span className="btn-add-doc__text">Add Doc</span>
                      <span className="btn-add-doc__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24"
                          strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
                          stroke="currentColor" height="24" fill="none">
                          <line y2="19" y1="5" x2="12" x1="12" />
                          <line y2="12" y1="12" x2="19" x1="5" />
                        </svg>
                      </span>
                    </button>

                    {/* Submit button */}
                    <button className="btn-submit" onClick={() => markComplete(task.id)}>
                      Submit
                    </button>
                  </div>
                )}

                {task.status === 'completed' && (
                  <div className="flex items-center gap-1.5 text-xs text-black font-bold pt-1">
                    <CheckCircle size={12} /> Submitted
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <CheckCircle size={32} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No tasks in this category</p>
        </div>
      )}
    </motion.div>
  )
}
