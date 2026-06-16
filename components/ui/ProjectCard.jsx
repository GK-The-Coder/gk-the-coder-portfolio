import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ProjectCard({ id, title, description, image, link, repo, tags = [], featured }) {
  const excerpt = description ? (description.length > 130 ? `${description.slice(0, 130)}...` : description) : 'No description available yet.'

  return (
    <motion.article whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 220 }} className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.04)] bg-[rgba(11,18,32,0.6)] glass-card">
      {image ? (
        <div className="relative h-56 bg-slate-800 overflow-hidden">
          <img src={image} alt={title} loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {featured && <div className="absolute left-4 top-4 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary)]/90 text-white neon-glow">Featured</div>}
        </div>
      ) : (
        <div className="h-56 bg-gradient-to-br from-[var(--card)] to-[var(--bg)] flex items-center justify-center text-slate-400">
          No image
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          {featured && <span className="rounded-full bg-[var(--secondary)]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200">Featured</span>}
        </div>

        <p className="text-slate-300 text-sm mb-4">{excerpt}</p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {tags.length > 0 ? (
            tags.slice(0, 6).map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.07)] text-slate-300">{t}</span>
            ))
          ) : (
            <span className="text-xs px-2 py-1 rounded-full bg-[rgba(255,255,255,0.03)] text-slate-500">No tags yet</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white neon-glow text-sm font-semibold">
              Live demo
            </a>
          ) : (
            <button disabled className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(255,255,255,0.03)] text-slate-500 text-sm">No live demo</button>
          )}
          {repo ? (
            <a href={repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-white text-sm transition">
              Code
            </a>
          ) : null}
          <Link href={`/projects/${encodeURIComponent(id)}`} className="text-sm text-slate-300 hover:text-white font-semibold">Read details →</Link>
        </div>
      </div>
    </motion.article>
  )
}
