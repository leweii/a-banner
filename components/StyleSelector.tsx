'use client';

import { ArtStyle } from '@/lib/prompt';

interface StyleInfo {
  key: ArtStyle;
  name: string;
  description: string;
}

interface StyleSelectorProps {
  value: ArtStyle;
  onChange: (style: ArtStyle) => void;
  styles: StyleInfo[];
}

export default function StyleSelector({ value, onChange, styles }: StyleSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">选择艺术风格</label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {styles.map((style) => (
          <button
            key={style.key}
            onClick={() => onChange(style.key)}
            className={`p-4 rounded-lg border-2 transition-all ${
              value === style.key
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">{style.name}</div>
            <div className="text-xs text-gray-500 mt-1">{style.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
