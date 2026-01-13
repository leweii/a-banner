'use client';

import { useState, useEffect, useRef } from 'react';

interface AsciiPreviewProps {
  ascii: string;
  loading?: boolean;
}

export default function AsciiPreview({ ascii, loading }: AsciiPreviewProps) {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Auto-fit ASCII to container width
  useEffect(() => {
    if (!ascii || !containerRef.current || !preRef.current) {
      setScale(1);
      return;
    }

    const container = containerRef.current;
    const pre = preRef.current;

    // Reset scale to measure natural width
    setScale(1);

    // Wait for render
    requestAnimationFrame(() => {
      const containerWidth = container.clientWidth - 32; // padding
      const preWidth = pre.scrollWidth;

      if (preWidth > containerWidth) {
        const newScale = Math.max(0.5, containerWidth / preWidth);
        setScale(newScale);
      } else {
        setScale(1);
      }
    });
  }, [ascii]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">ASCII 预览</label>
        {ascii && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.max(0.3, s - 0.1))}
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
              title="缩小"
            >
              -
            </button>
            <span className="text-xs text-gray-500 w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(2, s + 0.1))}
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
              title="放大"
            >
              +
            </button>
          </div>
        )}
      </div>
      <div
        ref={containerRef}
        className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto min-h-[200px] max-h-[400px]"
      >
        {loading ? (
          <div className="flex items-center justify-center h-[160px]">
            <div className="animate-pulse text-lg">生成中...</div>
          </div>
        ) : ascii ? (
          <pre
            ref={preRef}
            className="font-mono leading-tight"
            style={{
              fontSize: `${scale * 14}px`,
              transformOrigin: 'top left',
            }}
          >
            {ascii}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-[160px] text-gray-500">
            在上方输入文字预览 ASCII 效果
          </div>
        )}
      </div>
    </div>
  );
}
