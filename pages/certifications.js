import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import connect from '../lib/mongodb'
import Certification from '../models/Certification'
import CertificationCard from '../components/ui/CertificationCard'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function Certifications({ certifications, dbError }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <Head>
        <title>Certifications | Ganesh Karadkar</title>
        <meta
          name="description"
          content="Professional certifications and credentials earned by Ganesh Karadkar"
        />
      </Head>
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
      >
        <motion.nav variants={itemVariants} className="fixed top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
            <Link href="/" className="text-base font-bold sm:text-xl" onClick={() => setMobileMenuOpen(false)}>
              Ganesh Karadkar
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-200 transition hover:border-cyan-400 hover:text-white md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden="true" className="text-2xl leading-none">{mobileMenuOpen ? '×' : '☰'}</span>
            </button>
            <div className="hidden items-center gap-4 text-sm text-slate-300 md:flex">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <Link href="/projects" className="hover:text-white transition">Projects</Link>
              <Link href="/certifications" className="text-cyan-300 hover:text-white transition">Certifications</Link>
              <Link href="/experience" className="hover:text-white transition">Experience</Link>
              <Link href="/achievements" className="text-cyan-300 hover:text-white transition">Achievements</Link>
            </div>
          </div>
          {mobileMenuOpen && (
            <div id="mobile-navigation" className="grid grid-cols-2 gap-1 border-t border-slate-800 bg-slate-950 px-5 py-3 text-sm text-slate-300 md:hidden">
              <Link href="/" className="rounded-lg px-3 py-2 hover:bg-slate-900 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/projects" className="rounded-lg px-3 py-2 hover:bg-slate-900 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Projects</Link>
              <Link href="/certifications" className="rounded-lg px-3 py-2 text-cyan-300 hover:bg-slate-900 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Certifications</Link>
              <Link href="/experience" className="rounded-lg px-3 py-2 hover:bg-slate-900 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Experience</Link>
              <Link href="/achievements" className="rounded-lg px-3 py-2 text-cyan-300 hover:bg-slate-900 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Achievements</Link>
            </div>
          )}
        </motion.nav>

        {dbError && (
          <div className="mt-20 border-t border-b border-amber-500/40 bg-amber-500/10 px-6 py-3 text-center text-amber-100 backdrop-blur-sm">
            <p className="text-sm font-medium">Database connection failed. Page is rendering with fallback content.</p>
          </div>
        )}

        <div className="pt-24 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={itemVariants} className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">Certifications</h1>
              <p className="text-slate-400 text-lg">Professional credentials and certifications that validate my technical expertise</p>
            </motion.div>

            {certifications.length === 0 ? (
              <motion.div variants={itemVariants} className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-12 text-center">
                <p className="text-slate-400 text-lg mb-4">No certifications added yet.</p>
                <p className="text-slate-500 text-sm">Check back soon for updates on professional credentials!</p>
              </motion.div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {certifications.map((cert) => (
                  <CertificationCard
                    key={cert._id}
                    id={cert._id}
                    title={cert.title}
                    issuer={cert.issuer}
                    date={cert.date}
                    image={cert.image}
                    credentialId={cert.credentialId}
                    description={cert.description}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <motion.footer variants={itemVariants} className="py-10 px-6 border-t border-slate-800 text-center text-slate-500">
          <p>© 2026 Ganesh Karadkar. All rights reserved.</p>
        </motion.footer>
      </motion.main>
    </>
  )
}

export async function getServerSideProps() {
  let dbError = false
  let certifications = []

  try {
    await connect()
    certifications = await Certification.find({}).sort({ date: -1, createdAt: -1 }).lean()
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    dbError = true
  }

  return {
    props: {
      certifications: JSON.parse(JSON.stringify(certifications)),
      dbError,
    },
  }
}
