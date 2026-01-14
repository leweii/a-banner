'use client';

import { useState } from 'react';
import { ArtStyle } from '@/lib/prompt';

interface StyleInfo {
  key: ArtStyle;
  name: string;
  description: string;
  color: string;
}

interface StyleSelectorProps {
  value: ArtStyle;
  onChange: (style: ArtStyle) => void;
  styles: StyleInfo[];
}

export default function StyleSelector({ value, onChange, styles }: StyleSelectorProps) {
  const [hoveredStyle, setHoveredStyle] = useState<ArtStyle | null>(null);

  // 计算每个色块在圆形上的位置
  const getPosition = (index: number, total: number) => {
    const angle = (index * 360) / total - 90; // 从顶部开始
    const radius = 80; // 圆形半径
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  const displayStyle = hoveredStyle || value;
  const displayInfo = styles.find((s) => s.key === displayStyle);

  return (
    <div className="w-full flex flex-col items-center py-6">
      <h3 className="title-handwriting text-xl mb-6">选择你的画风 ✨</h3>

      <div className="relative w-[200px] h-[200px]">
        {/* 中心画笔图标和风格名称 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <span className="text-3xl mb-1">🎨</span>
          {displayInfo && (
            <div className="text-center">
              <div className="title-handwriting text-sm font-medium">{displayInfo.name}</div>
              <div className="text-xs text-[var(--text-secondary)] mt-0.5">{displayInfo.description}</div>
            </div>
          )}
        </div>

        {/* 色块圆环 */}
        {styles.map((style, index) => {
          const pos = getPosition(index, styles.length);
          const isSelected = value === style.key;
          const isHovered = hoveredStyle === style.key;

          return (
            <button
              key={style.key}
              onClick={() => onChange(style.key)}
              onMouseEnter={() => setHoveredStyle(style.key)}
              onMouseLeave={() => setHoveredStyle(null)}
              className="absolute w-10 h-10 rounded-full transition-all duration-200 border-2"
              style={{
                backgroundColor: style.color,
                left: `calc(50% + ${pos.x}px - 20px)`,
                top: `calc(50% + ${pos.y}px - 20px)`,
                transform: isHovered ? 'scale(1.3)' : isSelected ? 'scale(1.15)' : 'scale(1)',
                borderColor: isSelected ? 'var(--text-primary)' : 'transparent',
                boxShadow: isSelected
                  ? `0 0 0 3px ${style.color}40, 0 4px 12px ${style.color}60`
                  : isHovered
                    ? `0 4px 12px ${style.color}80`
                    : `0 2px 4px rgba(0,0,0,0.1)`,
                zIndex: isHovered || isSelected ? 20 : 10,
              }}
              title={style.name}
            />
          );
        })}
      </div>
    </div>
  );
}
