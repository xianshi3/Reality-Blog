interface ErrorDisplayProps {
  status: number;
  message: string;
}

export default function ErrorDisplay({ status, message }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-[#1a1a1a]">
      <div className="max-w-md w-full bg-white/30 dark:bg-[#2c2c2c]/30 backdrop-blur-md border border-red-200 dark:border-red-400 rounded-2xl shadow-xl p-6 text-center">
        <div className="text-5xl mb-4 text-red-500 animate-bounce">❌</div>
        <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">数据获取失败</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
          <strong>状态码：</strong>{status}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
          <strong>错误信息：</strong>{message}
        </p>
      </div>
    </div>
  );
}
