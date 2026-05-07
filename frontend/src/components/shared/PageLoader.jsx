export default function PageLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title */}
      <div className="space-y-2">
        <div className="h-7 w-52 bg-gray-100 rounded-lg" />
        <div className="h-4 w-36 bg-gray-100 rounded" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 card-shadow">
            <div className="w-11 h-11 bg-gray-100 rounded-lg flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-16 bg-gray-100 rounded" />
              <div className="h-6 w-10 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white border border-gray-100 rounded-xl p-5 card-shadow">
          <div className="h-4 w-28 bg-gray-100 rounded mb-5" />
          <div className="h-48 bg-gray-50 rounded-lg" />
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 card-shadow">
          <div className="h-4 w-24 bg-gray-100 rounded mb-5" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-50 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Table row */}
      <div className="bg-white border border-gray-100 rounded-xl card-shadow overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <div className="h-4 w-32 bg-gray-100 rounded" />
        </div>
        <div className="divide-y divide-gray-50">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3">
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
              <div className="h-4 w-16 bg-gray-100 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
