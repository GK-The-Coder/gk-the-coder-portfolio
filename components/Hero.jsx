import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero({ about, resumeItems }) {
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
  const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

  return (
    <section className="relative pt-28 pb-16 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-grid -z-10" />
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.4fr_1fr] items-center">
        <motion.div initial="hidden" animate="visible" variants={container}>
          <motion.h1 variants={item} className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 gradient-text">
            Ganesh Karadkar
            <br />
            <span className="text-2xl md:text-3xl font-semibold text-muted block mt-3">Full-Stack Developer & Backend-Focused Engineer</span>
          </motion.h1>

          <motion.p variants={item} className="text-lg text-slate-300 mb-6 max-w-2xl">
            {about.paragraphs?.[0] || 'Building scalable web applications, APIs, and AI-integrated systems with a focus on developer experience and clean architecture.'}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-4 items-center">
            <Link href="/projects" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-3 text-sm font-semibold text-white shadow-lg neon-glow magnetic">
              View Projects
            </Link>
            <a href={resumeItems?.[0]?.link || '#contact'} className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-[var(--secondary)] hover:text-[var(--secondary)]">
              View Resume
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-6 flex gap-3 flex-wrap text-sm text-slate-300">
            <span>JavaScript</span>
            <span>•</span>
            <span>React</span>
            <span>•</span>
            <span>Next.js</span>
            <span>•</span>
            <span>Node.js</span>
            <span>•</span>
            <span>MongoDB</span>
          </motion.div>
        </motion.div>

        <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-[32px] border border-[rgba(255,255,255,0.04)] bg-[rgba(11,18,32,0.6)] p-8 glass-card">
          <div className="relative w-full h-full flex flex-col gap-4">
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] p-1 neon-glow mx-auto">
              <img src="/profile.svg" alt="profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-center">Current focus</h3>
            <ul className="space-y-2 text-slate-300">
              <li>Full-Stack Web Development</li>
              <li>Backend System Design & APIs</li>
              <li>AI-Powered Applications</li>
            </ul>
          </div>
        </motion.aside>
      </div>

      {/* floating tech icons */}
      <div className="absolute right-8 top-44 flex flex-col gap-6">
        <div className="w-12 h-12 rounded-lg bg-[var(--card)] flex items-center justify-center neon-glow float">⚛️</div>
        <div className="w-12 h-12 rounded-lg bg-[var(--card)] flex items-center justify-center neon-glow float" style={{ animationDelay: '0.6s' }}>🔷</div>
        <div className="w-12 h-12 rounded-lg bg-[var(--card)] flex items-center justify-center neon-glow float" style={{ animationDelay: '1.2s' }}>🟦</div>
      </div>
    </section>
  )
}
