export default function Textarea({ label, id, className = '', ...props }) {
  return (
    <label htmlFor={id} className="block text-sm text-slate-200">
      {label}
      <textarea
        id={id}
        className={`mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${className}`}
        {...props}
      />
    </label>
  )
}
