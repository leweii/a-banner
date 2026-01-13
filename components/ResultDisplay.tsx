'use client';

interface ResultDisplayProps {
  imageUrl: string | null;
  loading?: boolean;
  onDownload: () => void;
}

export default function ResultDisplay({ imageUrl, loading, onDownload }: ResultDisplayProps) {
  if (loading) {
    return (
      <div className="w-full bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">AI 正在生成艺术图片...</p>
        <p className="text-sm text-gray-400 mt-2">大约需要 3-5 秒</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500">完成验证后点击生成按钮</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-gray-100 rounded-lg p-4">
        <img src={imageUrl} alt="Generated Art" className="w-full rounded-lg" />
      </div>
      <button
        onClick={onDownload}
        className="mt-4 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
      >
        下载图片
      </button>
    </div>
  );
}
