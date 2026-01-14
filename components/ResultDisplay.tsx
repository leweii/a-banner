'use client';

interface ResultDisplayProps {
  imageUrl: string | null;
  loading?: boolean;
  onDownload: () => void;
}

export default function ResultDisplay({ imageUrl, loading, onDownload }: ResultDisplayProps) {
  if (loading) {
    return (
      <div className="w-full paper-card p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--highlight-pink)] border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-[var(--highlight-blue)] border-b-transparent animate-spin" style={{ animationDirection: 'reverse' }}></div>
        </div>
        <p className="title-handwriting text-lg">AI 正在创作中...</p>
        <p className="text-sm text-[var(--text-secondary)] mt-2 title-handwriting-en">Just a moment ~</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full paper-card p-8 flex flex-col items-center justify-center min-h-[300px]">
        <span className="text-4xl mb-4">🖼️</span>
        <p className="title-handwriting text-[var(--text-secondary)]">完成验证后点击生成按钮</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="photo-sticker max-w-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Generated Art" className="w-full" />
      </div>
      <button
        onClick={onDownload}
        className="mt-6 btn-journal flex items-center gap-2"
      >
        <span>💾</span> 保存到相册
      </button>
    </div>
  );
}
