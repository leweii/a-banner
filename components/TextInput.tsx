'use client';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export default function TextInput({ value, onChange, maxLength = 50 }: TextInputProps) {
  return (
    <div className="w-full">
      <label htmlFor="text-input" className="block text-sm font-medium mb-2">
        输入文字
      </label>
      <input
        id="text-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder="输入要转换的文字..."
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
      />
      <p className="text-sm text-gray-500 mt-1">
        {value.length}/{maxLength} 字符
      </p>
    </div>
  );
}
