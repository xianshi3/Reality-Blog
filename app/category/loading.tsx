export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18181b] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Category filter skeletons */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-white dark:bg-[#23272f] rounded-full animate-pulse flex-shrink-0"
            />
          ))}
        </div>

        {/* Article card skeletons */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-white dark:bg-[#23272f] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
