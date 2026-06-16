export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none'
  const variants = {
    primary: 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white neon-glow',
    secondary: 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-white',
    ghost: 'bg-transparent text-[var(--secondary)]',
  }
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  )
}
