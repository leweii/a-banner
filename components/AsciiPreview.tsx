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
      <div className="flex items-center justify-between mb-3">
        <label className="title-handwriting text-lg flex items-center gap-2">
          <span>✨</span> ASCII 预览
        </label>
        {ascii && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.max(0.3, s - 0.1))}
              className="w-7 h-7 flex items-center justify-center text-sm bg-[var(--highlight-blue)] hover:bg-[var(--highlight-pink)] rounded-full transition-colors"
              title="缩小"
            >
              -
            </button>
            <span className="text-xs text-[var(--text-secondary)] w-12 text-center title-handwriting-en">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(2, s + 0.1))}
              className="w-7 h-7 flex items-center justify-center text-sm bg-[var(--highlight-blue)] hover:bg-[var(--highlight-pink)] rounded-full transition-colors"
              title="放大"
            >
              +
            </button>
          </div>
        )}
      </div>
      <div
        ref={containerRef}
        className="paper-grid p-4 rounded-lg overflow-auto min-h-[200px] max-h-[400px]"
      >
        {loading ? (
          <div className="flex items-center justify-center h-[160px]">
            <div className="animate-pulse title-handwriting text-lg text-[var(--text-secondary)]">
              生成中...
            </div>
          </div>
        ) : ascii ? (
          <pre
            ref={preRef}
            className="leading-tight text-[var(--text-primary)]"
            style={{
              fontSize: `${scale * 14}px`,
              transformOrigin: 'top left',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {ascii}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-[160px] text-[var(--text-secondary)] title-handwriting">
            在上方输入文字预览 ASCII 效果 ~
          </div>
        )}
      </div>
    </div>
  );
}
