import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Hero({ about, resumeItems }) {
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
  const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

  return (
    <section className="relative overflow-hidden px-5 pb-12 pt-24 sm:px-6 md:pb-16 md:pt-28">
      <div className="absolute inset-0 pointer-events-none bg-grid -z-10" />
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.4fr_1fr] items-center">
        <motion.div initial="hidden" animate="visible" variants={container}>
          <motion.h1 variants={item} className="mb-5 text-4xl font-extrabold leading-tight gradient-text sm:text-5xl md:mb-6 md:text-6xl">
            Ganesh Karadkar
            <br />
            <span className="mt-3 block text-xl font-semibold text-muted sm:text-2xl md:text-3xl">Full-Stack Developer & Backend-Focused Engineer</span>
          </motion.h1>

          <motion.p variants={item} className="mb-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {about.paragraphs?.[0] || 'Building scalable web applications, APIs, and AI-integrated systems with a focus on developer experience and clean architecture.'}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="/projects" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg neon-glow magnetic sm:px-6 sm:py-3">
              View Projects
            </Link>
            <a href={resumeItems?.[0]?.link || '#contact'} className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[var(--secondary)] hover:text-[var(--secondary)] sm:px-6 sm:py-3">
              View Resume
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-300 sm:gap-x-3 sm:text-sm">
            <span>Mern-Stack</span>
            <span aria-hidden="true">•</span>
            <span>Python</span>
            <span aria-hidden="true">•</span>
            <span>JavaScript</span>
            <span aria-hidden="true">•</span>
            <span>Node.js</span>
            <span aria-hidden="true">•</span>
            <span>MongoDB</span>
          </motion.div>
        </motion.div>

        <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-[24px] border border-[rgba(255,255,255,0.04)] bg-[rgba(11,18,32,0.6)] p-6 glass-card sm:rounded-[32px] sm:p-8">
          <div className="relative w-full h-full flex flex-col gap-4">
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] p-1 neon-glow mx-auto">
              <Image
                src="/profile.svg"
                alt="Ganesh Karadkar profile"
                width={144}
                height={144}
                className="w-full h-full rounded-full object-cover"
              />
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
    </section>
  )
}
