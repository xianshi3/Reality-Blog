interface ErrorDisplayProps {
  status: number;
  message: string;
}

export default function ErrorDisplay({ status, message }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-100 text-red-700 p-6 rounded shadow">
        <h2 className="font-bold text-lg mb-2">数据获取失败</h2>
        <p>状态码：{status}</p>
        <p>错误信息：{message}</p>
      </div>
    </div>
  );
}
