import Link from 'next/link'
import connect from '../lib/mongodb'
import Experience from '../models/Experience'
import { motion } from 'framer-motion'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
}

export default function ExperiencePage({ experiences, dbError }) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold">Experience</h1>
            <p className="text-slate-400 mt-2">A dedicated page for all your experience entries.</p>
          </div>
          <Link href="/" className="text-cyan-300 hover:text-white font-semibold">Back to home</Link>
        </div>
        {dbError && (
          <div className="mb-6 rounded-3xl border border-amber-500/40 bg-amber-500/10 p-6 text-amber-100">
            Database connection failed. Experience entries are not available right now.
          </div>
        )}
        <div className="space-y-6">
          {experiences.length > 0 ? (
            experiences.map((item) => (
              <motion.div key={item._id} initial="hidden" animate="visible" variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/20">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{item.title}</h2>
                    <p className="text-slate-400">{[item.company, item.location].filter(Boolean).join(' · ')}</p>
                  </div>
                  <span className="text-slate-400">{formatDate(item.startDate)} — {item.current ? 'Present' : formatDate(item.endDate) || 'Present'}</span>
                </div>
                <p className="text-slate-300">{item.summary}</p>
                {item.highlights?.length > 0 && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
                    {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                  </ul>
                )}
              </motion.div>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
              No experience entries found yet. Add them from the admin dashboard.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export async function getServerSideProps() {
  let experiences = []
  let dbError = false
  try {
    await connect()
    experiences = await Experience.find({}).sort({ startDate: -1 }).lean()
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    dbError = true
  }
  return { props: { experiences: JSON.parse(JSON.stringify(experiences)), dbError } }
}
