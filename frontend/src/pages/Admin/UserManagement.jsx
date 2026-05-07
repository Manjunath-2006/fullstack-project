import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { studentsApi, teachersApi, performanceApi } from '../../services/api'
import { useLoading } from '../../context/LoadingContext'
import ProgressBar from '../../components/shared/ProgressBar'
import { pageVariants, cardVariants } from '../../animations/variants'
import toast from 'react-hot-toast'

const GRADES = ['9th', '10th', '11th', '12th']
const SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Computer Science']

export default function UserManagement() {
  const { wrap } = useLoading()
  const navigate = useNavigate()
  const [tab, setTab]           = useState('students')
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [summaries, setSummaries] = useState({})
  const [search, setSearch]     = useState('')
  const [showForm, setShowForm] = useState(false)
  const [sForm, setSForm]       = useState({ roll_number:'', name:'', email:'', grade:'', phone:'', password:'' })
  const [tForm, setTForm]       = useState({ name:'', email:'', subject:'', phone:'', password:'' })

  useEffect(() => {
    wrap(() => Promise.all([studentsApi.getAll(), teachersApi.getAll()])
      .then(([s, t]) => {
        setStudents(s.data); setTeachers(t.data)
        s.data.forEach(st => {
          performanceApi.attendanceSummary(st.id).then(a =>
            setSummaries(prev => ({ ...prev, [st.id]: a.data })))
        })
      }))
  }, [])

  const addStudent = async (e) => {
    e.preventDefault()
    try {
      const res = await studentsApi.create(sForm)
      setStudents(s => [...s, res.data])
      toast.success(`Student added! Login: ${sForm.email} / ${sForm.password || 'student123'}`)
      setSForm({ roll_number:'', name:'', email:'', grade:'', phone:'', password:'' })
      setShowForm(false)
    } catch { toast.error('Failed to add student') }
  }

  const addTeacher = async (e) => {
    e.preventDefault()
    try {
      const res = await teachersApi.create(tForm)
      setTeachers(t => [...t, res.data])
      toast.success(`Teacher added! Login: ${tForm.email} / ${tForm.password || 'teacher123'}`)
      setTForm({ name:'', email:'', subject:'', phone:'', password:'' })
      setShowForm(false)
    } catch { toast.error('Failed to add teacher') }
  }

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.roll_number?.includes(search))
  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.subject?.toLowerCase().includes(search.toLowerCase()))

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">{students.length} students · {teachers.length} teachers</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="btn-add-doc" style={{ width: '140px' }}>
          <span className="btn-add-doc__text">Add User</span>
          <span className="btn-add-doc__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none">
              <line y2="19" y1="5" x2="12" x1="12" /><line y2="12" y1="12" x2="19" x1="5" />
            </svg>
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['students', 'teachers'].map(t => (
          <button key={t} onClick={() => { setTab(t); setShowForm(false) }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-all capitalize
              ${tab === t ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showForm && tab === 'students' && (
        <motion.form onSubmit={addStudent}
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-3 gap-4 overflow-hidden card-shadow">
          {[
            { key:'roll_number', label:'Roll Number', placeholder:'S016' },
            { key:'name',        label:'Full Name',   placeholder:'John Doe' },
            { key:'email',       label:'Email',       placeholder:'john@student.edu', type:'email' },
            { key:'grade',       label:'Grade',       placeholder:'', type:'select', options: GRADES },
            { key:'phone',       label:'Phone',       placeholder:'9876543210' },
            { key:'password',    label:'Password',    placeholder:'student123' },
          ].map(({ key, label, placeholder, type, options }) => (
            <div key={key}>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">{label}</label>
              {type === 'select' ? (
                <select value={sForm[key]} onChange={e => setSForm(f => ({ ...f, [key]: e.target.value }))} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black">
                  <option value="">Select</option>
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input type={type || 'text'} required={key !== 'phone' && key !== 'password'}
                  value={sForm[key]} placeholder={placeholder}
                  onChange={e => setSForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black" />
              )}
            </div>
          ))}
          <div className="col-span-3 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-black px-4 py-2">Cancel</button>
            <button type="submit" className="btn-submit">Add Student</button>
          </div>
        </motion.form>
      )}

      {showForm && tab === 'teachers' && (
        <motion.form onSubmit={addTeacher}
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-3 gap-4 overflow-hidden card-shadow">
          {[
            { key:'name',     label:'Full Name',  placeholder:'Prof. Jane Smith' },
            { key:'email',    label:'Email',      placeholder:'jane@school.edu', type:'email' },
            { key:'subject',  label:'Subject',    placeholder:'', type:'select', options: SUBJECTS },
            { key:'phone',    label:'Phone',      placeholder:'9876543210' },
            { key:'password', label:'Password',   placeholder:'teacher123' },
          ].map(({ key, label, placeholder, type, options }) => (
            <div key={key}>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">{label}</label>
              {type === 'select' ? (
                <select value={tForm[key]} onChange={e => setTForm(f => ({ ...f, [key]: e.target.value }))} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black">
                  <option value="">Select</option>
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input type={type || 'text'} required={key !== 'phone' && key !== 'password'}
                  value={tForm[key]} placeholder={placeholder}
                  onChange={e => setTForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-black" />
              )}
            </div>
          ))}
          <div className="col-span-3 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-black px-4 py-2">Cancel</button>
            <button type="submit" className="btn-submit">Add Teacher</button>
          </div>
        </motion.form>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-3 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-black" />
      </div>

      {/* Students table */}
      {tab === 'students' && (
        <div className="bg-white card-shadow rounded-xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Roll','Student','Grade','Attendance','Email',''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, i) => {
                const att = summaries[s.id]
                return (
                  <motion.tr key={s.id} variants={cardVariants} initial="initial" animate="animate" custom={i}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/students/${s.id}`)}>
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{s.roll_number}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold">{s.name[0]}</div>
                        <div>
                          <p className="font-semibold text-black text-sm">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{s.grade}</td>
                    <td className="px-5 py-3 w-36">
                      {att && <><ProgressBar value={att.percentage} showPct={false} /><p className="text-xs text-gray-500 mt-0.5">{att.percentage}%</p></>}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{s.email}</td>
                    <td className="px-5 py-3"><ChevronRight size={14} className="text-gray-400" /></td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Teachers table */}
      {tab === 'teachers' && (
        <div className="bg-white card-shadow rounded-xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Teacher','Subject','Email','Phone'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((t, i) => (
                <motion.tr key={t.id} variants={cardVariants} initial="initial" animate="animate" custom={i}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-black text-xs font-bold">{t.name[0]}</div>
                      <p className="font-semibold text-black">{t.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">{t.subject}</span></td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{t.email}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{t.phone || '—'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}
