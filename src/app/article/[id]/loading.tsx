export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18181b] py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Reading progress bar skeleton */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />

        {/* Title skeleton */}
        <div className="h-10 bg-white dark:bg-[#23272f] rounded-lg animate-pulse w-3/4" />

        {/* Meta skeleton */}
        <div className="flex gap-3">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-white dark:bg-[#23272f] rounded animate-pulse"
              style={{ width: `${50 + Math.random() * 40}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
