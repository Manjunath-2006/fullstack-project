import { motion } from 'framer-motion'

export default function KpiCard({ icon: Icon, label, value, sub, index = 0, color = 'default' }) {
  const iconBg = {
    default: 'bg-black',
    blue:    'bg-blue-600',
    green:   'bg-emerald-500',
    amber:   'bg-amber-500',
    red:     'bg-red-500',
    purple:  'bg-violet-600',
    indigo:  'bg-indigo-600',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.06, duration: 0.3 } }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="bg-white card-shadow rounded-xl p-5 flex items-center gap-4 border border-gray-100"
    >
      <div className={`${iconBg[color] || iconBg.default} p-3 rounded-lg flex-shrink-0`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-black leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}
