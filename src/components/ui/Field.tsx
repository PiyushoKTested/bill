import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  children: ReactNode;
  className?: string;
  hint?: string;
}

export function Field({ label, children, className = '', hint }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-gray-600 mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
    </label>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function TextInput({ invalid, className = '', ...props }: TextInputProps) {
  return (
    <input
      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition ${
        invalid ? 'border-red-300' : 'border-gray-200'
      } ${className}`}
      {...props}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextArea({ className = '', ...props }: TextAreaProps) {
  return (
    <textarea
      className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className = '', children, ...props }: SelectProps) {
  return (
    <select
      className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

interface SegmentedProps<T extends string> {
  options: { value: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
}

export function Segmented<T extends string>({ options, value, onChange, size = 'md' }: SegmentedProps<T>) {
  const pad = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-md font-medium transition flex items-center gap-1.5 ${pad} ${
            value === opt.value
              ? 'bg-white text-orange-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
