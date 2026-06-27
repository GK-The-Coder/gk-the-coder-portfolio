import Link from 'next/link'
import Image from 'next/image'
import connect from '../../lib/mongodb'
import Project from '../../models/Project'
import { motion } from 'framer-motion'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

export default function ProjectDetail({ project, dbError }) {
  if (dbError) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl rounded-3xl border border-amber-500/30 bg-amber-500/10 p-10 text-amber-100">
          <h1 className="text-3xl font-bold mb-4">Database unavailable</h1>
          <p className="text-slate-200">Project details cannot be loaded right now. Please try again later.</p>
          <Link href="/projects" className="mt-6 inline-flex text-cyan-300 hover:text-white">Back to projects</Link>
        </div>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-10 text-slate-300">
          <h1 className="text-3xl font-bold mb-4">Project not found</h1>
          <p>The project you’re looking for does not exist or has been removed.</p>
          <Link href="/projects" className="mt-6 inline-flex text-cyan-300 hover:text-white">Back to projects</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Project case study</p>
            <h1 className="mt-3 text-5xl font-bold">{project.title}</h1>
          </div>
          <Link href="/projects" className="text-cyan-300 hover:text-white font-semibold">Back to all projects</Link>
        </div>

        {project.image ? (
          <div className="relative mb-10 h-64 overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.05)] bg-slate-900 shadow-2xl shadow-black/20 sm:h-[420px] sm:rounded-[32px]">
            <Image src={project.image} alt={project.title} fill sizes="(min-width: 1152px) 1152px, 100vw" unoptimized className="object-cover" />
          </div>
        ) : null}

        <motion.section initial="hidden" animate="visible" variants={itemVariants} className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-[rgba(255,255,255,0.05)] bg-slate-900/80 p-8 glass-card">
              <h2 className="text-3xl font-semibold mb-4">Overview</h2>
              <p className="text-slate-300 leading-8">{project.description || 'No description has been added for this project yet.'}</p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              {project.link ? (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 px-6 py-4 text-cyan-200 transition hover:bg-cyan-500/20">
                  Live link
                </a>
              ) : null}
              {project.repo ? (
                <a href={project.repo} target="_blank" rel="noopener noreferrer" className="rounded-3xl border border-violet-400/20 bg-violet-500/10 px-6 py-4 text-violet-200 transition hover:bg-violet-500/20">
                  Repository
                </a>
              ) : null}
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[rgba(255,255,255,0.05)] bg-slate-900/80 p-6 glass-card">
              <h3 className="text-xl font-semibold mb-4">Project details</h3>
              <div className="space-y-3 text-slate-300">
                {project.tags?.length > 0 ? (
                  <div>
                    <div className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs text-slate-200">{tag}</span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div>
                  <div className="text-sm uppercase tracking-[0.24em] text-slate-500">Created</div>
                  <p className="text-slate-300">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[rgba(255,255,255,0.05)] bg-slate-900/80 p-6 glass-card">
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <p className="text-slate-300">Want help turning this into a case study or adding multimedia cards? I can make the admin support richer project details next.</p>
            </div>
          </aside>
        </motion.section>
      </div>
    </main>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.params
  let project = null
  let dbError = false

  try {
    await connect()
    project = await Project.findById(id).lean()
  } catch (error) {
    console.error('Project detail lookup failed:', error.message)
    dbError = true
  }

  return {
    props: {
      project: project ? JSON.parse(JSON.stringify(project)) : null,
      dbError,
    },
  }
}
