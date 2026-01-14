'use client';

import { FontName } from '@/lib/figlet';

interface FontSelectorProps {
  value: FontName;
  onChange: (font: FontName) => void;
  fonts: FontName[];
}

export default function FontSelector({ value, onChange, fonts }: FontSelectorProps) {
  return (
    <div className="w-full paper-lined p-4 rounded-lg h-full flex flex-col">
      <label htmlFor="font-selector" className="title-handwriting text-lg mb-3">
        选择字体
      </label>
      <select
        id="font-selector"
        value={value}
        onChange={(e) => onChange(e.target.value as FontName)}
        className="select-journal w-full"
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
