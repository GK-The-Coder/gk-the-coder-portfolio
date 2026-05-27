import Link from 'next/link'
import connect from '../lib/mongodb'
import Project from '../models/Project'
import { motion } from 'framer-motion'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

export default function Projects({ projects, dbError }) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold">Projects</h1>
            <p className="text-slate-400 mt-2">A dedicated page for all your project entries.</p>
          </div>
          <Link href="/" className="text-cyan-300 hover:text-white font-semibold">Back to home</Link>
        </div>
        {dbError && (
          <div className="mb-6 rounded-3xl border border-amber-500/40 bg-amber-500/10 p-6 text-amber-100">
            Database connection failed. Projects are not available right now.
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {projects.length > 0 ? (
            projects.map((project) => (
              <motion.div key={project._id} initial="hidden" animate="visible" variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-black/20">
                {project.image ? (
                  <div className="h-56 overflow-hidden bg-slate-800">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                ) : null}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-3">{project.title}</h2>
                  <p className="text-slate-300 mb-4">{project.description}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-white font-semibold">
                      View project →
                    </a>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
              No projects found yet. Add them from the admin dashboard.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export async function getServerSideProps() {
  let projects = []
  let dbError = false
  try {
    await connect()
    projects = await Project.find({}).sort({ createdAt: -1 }).lean()
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    dbError = true
  }
  return { props: { projects: JSON.parse(JSON.stringify(projects)), dbError } }
}
