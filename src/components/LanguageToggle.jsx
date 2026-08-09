export default function LanguageToggle({ language, options, onChange, label, compact = false }) {
  return (
    <div
      className={`inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 ${compact ? 'w-full justify-between' : ''}`}
      role="group"
      aria-label={label}
    >
      {options.map(({ code, label: optionLabel }) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          aria-pressed={language === code}
          className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            language === code
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-500 hover:bg-white hover:text-teal-700'
          }`}
        >
          {optionLabel}
        </button>
      ))}
    </div>
  )
}
