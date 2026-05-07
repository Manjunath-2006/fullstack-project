export default function RiskMeter({ probability, size = 120 }) {
  const pct   = Math.round((probability || 0) * 100)
  const color = pct >= 65 ? '#ef4444' : pct >= 35 ? '#f59e0b' : '#10b981'
  const r     = size * 0.43
  const cx    = size / 2
  const cy    = size / 2
  const circ  = 2 * Math.PI * r
  const dash  = circ * (pct / 100)

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="drop-shadow">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={size * 0.083} />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={size * 0.083}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x={cx} y={cy + 5} textAnchor="middle"
          fontSize={size * 0.16} fontWeight="800" fill={color}>{pct}%</text>
      </svg>
      <p className="text-xs text-gray-400 font-medium">Risk Score</p>
    </div>
  )
}
