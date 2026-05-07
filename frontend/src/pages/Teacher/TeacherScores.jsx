import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { scoresApi, studentsApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useLoading } from '../../context/LoadingContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { pageVariants, cardVariants } from '../../animations/variants'
import toast from 'react-hot-toast'

export default function TeacherScores() {
  const { user } = useAuth()
  const { wrap } = useLoading()
  const [scores, setScores]     = useState([])
  const [students, setStudents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState(null)
  const [form, setForm]         = useState({ student_id: '', test_name: '', marks: '', max_marks: 100, test_date: '' })
  const [uploadParams, setUploadParams] = useState({ test_name: '', test_date: '', max_marks: 100 })
  const fileRef = useRef()

  useEffect(() => {
    wrap(() => Promise.all([scoresApi.getAll(null, user.subject), studentsApi.getAll()])
      .then(([s, st]) => { setScores(s.data); setStudents(st.data) }))
  }, [user.subject])

  const studentName = (id) => students.find(s => s.id === id)?.name || id

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        const res = await scoresApi.update(editId, { marks: Number(form.marks), max_marks: Number(form.max_marks) })
        setScores(ss => ss.map(s => s.id === editId ? res.data : s))
        toast.success('Score updated!')
      } else {
        const res = await scoresApi.create({ ...form, subject: user.subject, marks: Number(form.marks), max_marks: Number(form.max_marks) })
        setScores(ss => [res.data, ...ss])
        toast.success('Score added!')
      }
      setForm({ student_id: '', test_name: '', marks: '', max_marks: 100, test_date: '' })
      setEditId(null); setShowForm(false)
    } catch { toast.error('Failed') }
  }

  const handleBulkUpload = async (file) => {
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await scoresApi.bulkUpload({
        subject:   user.subject,
        test_name: uploadParams.test_name || 'Bulk Test',
        test_date: uploadParams.test_date || new Date().toISOString().split('T')[0],
        max_marks: uploadParams.max_marks,
      }, fd)
      toast.success(`Uploaded ${res.data.uploaded} records!`)
      const fresh = await scoresApi.getAll(null, user.subject)
      setScores(fresh.data)
    } catch { toast.error('Upload failed') }
  }

  // Per-student averages for chart
  const chartData = students.map(s => {
    const recs = scores.filter(sc => sc.student_id === s.id)
    return { name: s.name.split(' ')[0], avg: recs.length ? Math.round(recs.reduce((a,b)=>a+b.marks,0)/recs.length) : 0 }
  }).filter(d => d.avg > 0)

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black">Scores — {user.subject}</h1>
          <p className="text-gray-500 text-sm mt-1">{scores.length} records</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(v => !v)} className="btn-add-doc" style={{ width: '130px' }}>
            <span className="btn-add-doc__text">Add Score</span>
            <span className="btn-add-doc__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2"
                strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none">
                <line y2="19" y1="5" x2="12" x1="12" /><line y2="12" y1="12" x2="19" x1="5" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* CSV upload */}
      <div className="bg-white card-shadow rounded-xl p-5 border border-gray-100">
        <h2 className="font-bold text-black mb-1 text-sm uppercase tracking-wide">Bulk Upload via CSV</h2>
        <p className="text-xs text-gray-400 mb-4">
          Format: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">roll_number,name,marks</code>
        </p>
        <div className="flex items-end gap-4">
          <div className="grid grid-cols-3 gap-3 flex-1">
            {[
              { key: 'test_name', label: 'Test Name',  placeholder: 'Mid-Term', type: 'text'   },
              { key: 'test_date', label: 'Test Date',  placeholder: '',          type: 'date'   },
              { key: 'max_marks', label: 'Max Marks',  placeholder: '100',       type: 'number' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">{label}</label>
                <input
                  type={type}
                  value={uploadParams[key]}
                  placeholder={placeholder}
                  onChange={e => setUploadParams(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-indigo-400"
                />
              </div>
            ))}
          </div>
          {/* Upload button — aligned to bottom of inputs */}
          <div className="flex-shrink-0">
            <input
              type="file"
              accept=".csv"
              ref={fileRef}
              className="hidden"
              onChange={e => { handleBulkUpload(e.target.files[0]); e.target.value = '' }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload CSV
            </button>
          </div>
        </div>
      </div>

      {/* Manual add form */}
      {showForm && (
        <motion.form onSubmit={handleSubmit}
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-2 gap-4 overflow-hidden card-shadow">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Student</label>
            <select required value={form.student_id} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))}
              disabled={!!editId}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black disabled:opacity-60">
              <option value="">Select student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_number})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Test Name</label>
            <input required value={form.test_name} onChange={e => setForm(f => ({ ...f, test_name: e.target.value }))}
              disabled={!!editId} placeholder="e.g. Unit Test 1"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black disabled:opacity-60" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Marks</label>
            <input required type="number" min="0" value={form.marks}
              onChange={e => setForm(f => ({ ...f, marks: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">Test Date</label>
            <input required type="date" value={form.test_date} onChange={e => setForm(f => ({ ...f, test_date: e.target.value }))}
              disabled={!!editId}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black disabled:opacity-60" />
          </div>
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => { setShowForm(false); setEditId(null) }} className="text-sm text-gray-500 hover:text-black px-4 py-2">Cancel</button>
            <button type="submit" className="btn-submit">{editId ? 'Update' : 'Add Score'}</button>
          </div>
        </motion.form>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white card-shadow rounded-xl p-5 border border-gray-100">
          <h2 className="font-bold text-black mb-4 text-sm uppercase tracking-wide">Class Performance</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: 'none' }} />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.avg >= 75 ? '#10b981' : d.avg >= 50 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Scores table */}
      <div className="bg-white card-shadow rounded-xl overflow-hidden border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Roll', 'Student', 'Test', 'Marks', 'Date', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <motion.tr key={s.id} variants={cardVariants} initial="initial" animate="animate" custom={i}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-2.5 font-mono text-xs text-gray-500">{s.roll_number}</td>
                <td className="px-5 py-2.5 font-medium text-black">{s.name || studentName(s.student_id)}</td>
                <td className="px-5 py-2.5 text-gray-600">{s.test_name}</td>
                <td className="px-5 py-2.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold
                    ${s.marks>=75?'bg-emerald-50 text-emerald-700':s.marks>=50?'bg-amber-50 text-amber-700':'bg-red-50 text-red-600'}`}>
                    {s.marks}/{s.max_marks}
                  </span>
                </td>
                <td className="px-5 py-2.5 text-gray-500">{s.test_date}</td>
                <td className="px-5 py-2.5">
                  <button onClick={() => {
                    setForm({ student_id: s.student_id, test_name: s.test_name, marks: s.marks, max_marks: s.max_marks, test_date: s.test_date })
                    setEditId(s.id); setShowForm(true)
                  }} className="text-xs text-gray-500 hover:text-black font-semibold">Edit</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
