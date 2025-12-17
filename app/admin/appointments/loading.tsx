export default function AppointmentsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-40"></div>
        <div className="h-10 bg-gray-200 rounded w-36"></div>
      </div>

      {/* Calendar/List toggle */}
      <div className="flex gap-2">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>

      {/* Appointments list */}
      <div className="bg-white rounded-lg border border-border-light">
        <div className="p-4 border-b border-border-light">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="divide-y divide-border-light">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
