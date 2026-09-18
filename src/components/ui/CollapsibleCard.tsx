import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  accent?: string;
}

export function CollapsibleCard({ title, icon, children, defaultOpen = false, accent = 'text-orange-600' }: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
          {icon && <span className={accent}>{icon}</span>}
          {title}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">{children}</div>
      )}
    </div>
  );
}
