'use client';

import { FontName } from '@/lib/figlet';

interface FontSelectorProps {
  value: FontName;
  onChange: (font: FontName) => void;
  fonts: FontName[];
}

export default function FontSelector({ value, onChange, fonts }: FontSelectorProps) {
  return (
    <div className="w-full">
      <label htmlFor="font-selector" className="block text-sm font-medium mb-2">
        选择字体
      </label>
      <select
        id="font-selector"
        value={value}
        onChange={(e) => onChange(e.target.value as FontName)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {fonts.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
}
