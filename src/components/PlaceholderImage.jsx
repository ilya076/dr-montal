import { Image as ImageIcon } from 'lucide-react'

export default function PlaceholderImage({ label, ariaLabel, className = '', compact = false }) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`group flex h-full min-h-48 w-full items-center justify-center overflow-hidden rounded-3xl border border-teal-200/80 bg-gradient-to-br from-slate-100 via-teal-50 to-teal-100 ${className}`}
    >
      <div className="flex flex-col items-center gap-3 text-center text-teal-700">
        <span className="grid size-12 place-items-center rounded-2xl border border-white/80 bg-white/70 shadow-sm backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1">
          <ImageIcon aria-hidden="true" className={compact ? 'size-5' : 'size-6'} strokeWidth={1.7} />
        </span>
        <span className="px-4 text-sm font-semibold">{label}</span>
      </div>
    </div>
  )
}
