'use client';

interface AsciiPreviewProps {
  ascii: string;
  loading?: boolean;
}

export default function AsciiPreview({ ascii, loading }: AsciiPreviewProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">ASCII 预览</label>
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto min-h-[150px]">
        {loading ? (
          <div className="flex items-center justify-center h-[120px]">
            <div className="animate-pulse">生成中...</div>
          </div>
        ) : (
          <pre className="font-mono text-xs md:text-sm whitespace-pre">{ascii || '在上方输入文字预览 ASCII 效果'}</pre>
        )}
      </div>
    </div>
  );
}
