export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="h-8 bg-gray-200 rounded w-28"></div>

      {/* Settings sections */}
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-border-light p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-36"></div>
                  <div className="h-3 bg-gray-200 rounded w-52"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
