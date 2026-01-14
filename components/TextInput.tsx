'use client';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export default function TextInput({ value, onChange, maxLength = 50 }: TextInputProps) {
  return (
    <div className="w-full paper-lined p-4 rounded-lg">
      <label htmlFor="text-input" className="title-handwriting text-lg flex items-center gap-2 mb-3">
        <span>📝</span> 输入文字
      </label>
      <input
        id="text-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder="在这里写点什么..."
        className="input-journal"
      />
      <p className="text-sm text-[var(--text-secondary)] mt-2 title-handwriting-en">
        {value.length}/{maxLength} characters
      </p>
    </div>
  );
}
