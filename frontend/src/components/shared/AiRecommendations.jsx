import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { analyticsApi } from '../../services/api'
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'

const TYPE = {
  success: { icon: CheckCircle,  border: 'border-l-emerald-500', bg: 'bg-emerald-50',  text: 'text-emerald-700',  badge: 'bg-emerald-100 text-emerald-700' },
  warning: { icon: AlertTriangle, border: 'border-l-red-500',     bg: 'bg-red-50',      text: 'text-red-700',      badge: 'bg-red-100 text-red-700'       },
  caution: { icon: AlertTriangle, border: 'border-l-amber-500',   bg: 'bg-amber-50',    text: 'text-amber-700',    badge: 'bg-amber-100 text-amber-700'   },
  info:    { icon: Info,          border: 'border-l-blue-500',    bg: 'bg-blue-50',     text: 'text-blue-700',     badge: 'bg-blue-100 text-blue-700'     },
}

const RISK = {
  LOW:    { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', bar: 'bg-emerald-500', width: 'w-1/4',  label: 'Low Risk'    },
  MEDIUM: { color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200',     bar: 'bg-amber-500',   width: 'w-2/4',  label: 'Medium Risk' },
  HIGH:   { color: 'text-red-600',     bg: 'bg-red-50 border-red-200',         bar: 'bg-red-500',     width: 'w-3/4',  label: 'High Risk'   },
}

export default function AiRecommendations({ studentId }) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = async () => {
    if (!studentId) return
    setLoading(true)
    try {
      const res = await analyticsApi.getRecommendations(studentId)
      setData(res.data)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  useEffect(() => { load() }, [studentId])

  if (loading) return (
    <div className="bg-white rounded-2xl border border-gray-100 card-shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
          <Brain size={15} className="text-white" />
        </div>
        <div>
          <p className="font-black text-black text-sm">AI Recommendations</p>
          <p className="text-xs text-gray-400">Analyzing your academic data...</p>
        </div>
      </div>
      <div className="space-y-2">
        {[1,2,3].map(i => (
          <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" style={{ animationDelay: `${i*0.1}s` }} />
        ))}
      </div>
    </div>
  )

  if (!data) return null

  const { recommendations, summary } = data
  const risk = RISK[summary.risk_level] || RISK.LOW

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 card-shadow overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <Brain size={15} className="text-white" />
          </div>
          <div>
            <p className="font-black text-black text-sm">AI Recommendations</p>
            <p className="text-xs text-gray-400">Powered by academic analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} disabled={refreshing}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-black">
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setExpanded(v => !v)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-black">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>

            {/* Risk summary strip */}
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Overall Risk Level</span>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${risk.bg} ${risk.color}`}>
                  {risk.label}
                </span>
              </div>
              {/* Risk bar */}
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: undefined }}
                  className={`h-full rounded-full ${risk.bar} ${risk.width} transition-all duration-700`} />
              </div>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                {[
                  { label: 'Avg Score',   value: `${summary.overall_avg}%`,    icon: TrendingUp  },
                  { label: 'Attendance',  value: `${summary.attendance_pct}%`, icon: CheckCircle },
                  { label: 'Overdue',     value: summary.overdue_tasks,        icon: AlertTriangle },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                    <p className="text-base font-black text-black">{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation cards */}
            <div className="p-4 space-y-2">
              {recommendations.map((rec, i) => {
                const cfg = TYPE[rec.type] || TYPE.info
                const Icon = cfg.icon
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex gap-3 p-3.5 rounded-xl border-l-4 ${cfg.border} ${cfg.bg} border border-transparent`}>
                    <Icon size={15} className={`mt-0.5 shrink-0 ${cfg.text}`} />
                    <div className="min-w-0">
                      <span className={`inline-block text-xs font-black uppercase tracking-wide mb-0.5 px-1.5 py-0.5 rounded ${cfg.badge}`}>
                        {rec.category}
                      </span>
                      <p className="text-xs text-gray-700 leading-relaxed">{rec.message}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
