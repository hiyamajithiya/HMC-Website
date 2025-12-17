export default function DocumentsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-36"></div>
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-36"></div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4 items-center">
        <div className="h-10 bg-gray-200 rounded w-64"></div>
        <div className="h-10 bg-gray-200 rounded w-48"></div>
      </div>

      {/* Breadcrumb */}
      <div className="h-6 bg-gray-200 rounded w-48"></div>

      {/* Folders and Documents grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-border-light p-4 text-center">
            <div className="h-12 w-12 bg-gray-200 rounded mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-lg border border-border-light">
        <div className="divide-y divide-border-light">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
