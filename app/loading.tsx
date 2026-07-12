export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18181b]">
      {/* Header skeleton */}
      <div className="h-16 bg-white dark:bg-[#23272f] border-b border-gray-100 dark:border-gray-800" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Left sidebar skeleton */}
          <div className="hidden lg:block w-64 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 bg-white dark:bg-[#23272f] rounded-2xl animate-pulse" />
            ))}
          </div>

          {/* Main content skeleton */}
          <div className="flex-1 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-white dark:bg-[#23272f] rounded-2xl animate-pulse" />
            ))}
          </div>

          {/* Right sidebar skeleton */}
          <div className="hidden xl:block w-72 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 bg-white dark:bg-[#23272f] rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
