export default function ProgressBar({ value, max = 100, label, showPct = true, color = 'black' }) {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  const barColor = {
    black:   'bg-black',
    green:   'bg-emerald-500',
    amber:   'bg-amber-400',
    red:     'bg-red-500',
    blue:    'bg-blue-500',
    indigo:  'bg-indigo-500',
  }
  return (
    <div className="w-full">
      {(label || showPct) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-xs text-gray-500 font-medium">{label}</span>}
          {showPct && <span className="text-xs font-bold text-black">{pct}%</span>}
        </div>
      )}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${barColor[color] || barColor.black} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
