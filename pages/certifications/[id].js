import Link from 'next/link'
import Image from 'next/image'
import connect from '../../lib/mongodb'
import Certification from '../../models/Certification'
import { motion } from 'framer-motion'
import mongoose from 'mongoose'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

export default function CertificationDetail({ certification, dbError }) {
  const hasValidImage = certification?.image && (certification.image.startsWith('/') || /^https?:\/\/[^\s]+$/i.test(certification.image))

  if (dbError) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl rounded-3xl border border-amber-500/30 bg-amber-500/10 p-10 text-amber-100">
          <h1 className="text-3xl font-bold mb-4">Database unavailable</h1>
          <p className="text-slate-200">Certification details cannot be loaded right now. Please try again later.</p>
          <Link href="/certifications" className="mt-6 inline-flex text-cyan-300 hover:text-white">Back to certifications</Link>
        </div>
      </main>
    )
  }

  if (!certification) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-10 text-slate-300">
          <h1 className="text-3xl font-bold mb-4">Certification not found</h1>
          <p>The certification you&rsquo;re looking for does not exist or has been removed.</p>
          <Link href="/certifications" className="mt-6 inline-flex text-cyan-300 hover:text-white">Back to certifications</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Professional Certification</p>
            <h1 className="mt-3 text-5xl font-bold">{certification.title}</h1>
            <p className="mt-3 text-2xl text-cyan-400 font-semibold">{certification.issuer}</p>
          </div>
          <Link href="/certifications" className="text-cyan-300 hover:text-white font-semibold">Back to all certifications</Link>
        </div>

        {hasValidImage && (
          <div className="relative mb-10 h-64 overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.05)] bg-slate-900 shadow-2xl shadow-black/20 sm:h-[420px] sm:rounded-[32px]">
            <Image src={certification.image} alt={certification.title} fill sizes="(min-width: 1152px) 1152px, 100vw" unoptimized className="object-cover" />
          </div>
        )}

        <motion.section initial="hidden" animate="visible" variants={itemVariants} className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-[rgba(255,255,255,0.05)] bg-slate-900/80 p-8 glass-card">
              <h2 className="text-3xl font-semibold mb-4">About this Certification</h2>
              <div className="space-y-4 text-slate-300 leading-8">
                {certification.description ? (
                  <p>{certification.description}</p>
                ) : (
                  <>
                    <p>
                      This certification validates professional knowledge and skills in {certification.title}.
                      It demonstrates competency and commitment to staying current with industry standards and best practices.
                    </p>
                    <p>
                      Issued by <strong className="text-cyan-300">{certification.issuer}</strong>, this credential
                      represents successful completion of rigorous training and examination requirements.
                    </p>
                  </>
                )}
              </div>
            </section>

            {certification.url && (
              <section className="grid gap-4">
                <a
                  href={certification.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 px-6 py-4 text-cyan-200 transition hover:bg-cyan-500/20 text-center font-semibold"
                >
                  View Certificate →
                </a>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[rgba(255,255,255,0.05)] bg-slate-900/80 p-6 glass-card">
              <h3 className="text-xl font-semibold mb-4">Certification Details</h3>
              <div className="space-y-4 text-slate-300">
                <div>
                  <div className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-1">Issuing Organization</div>
                  <p className="text-slate-200 font-semibold">{certification.issuer}</p>
                </div>

                {certification.date && (
                  <div>
                    <div className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-1">Issue Date</div>
                    <p className="text-slate-200">
                      {new Date(certification.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {certification.credentialId && (
                  <div>
                    <div className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-2">Credential ID</div>
                    <div className="rounded-lg bg-slate-950/50 px-3 py-2">
                      <p className="text-sm text-slate-300 font-mono break-all">{certification.credentialId}</p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-1">Added</div>
                  <p className="text-slate-200">{new Date(certification.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {certification.url && (
              <div className="rounded-3xl border border-[rgba(255,255,255,0.05)] bg-slate-900/80 p-6 glass-card">
                <h3 className="text-xl font-semibold mb-4">Verification</h3>
                <p className="text-slate-300 text-sm mb-4">
                  This certification can be verified through the issuing organization&rsquo;s platform.
                </p>
                <a
                  href={certification.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:text-white text-sm font-semibold"
                >
                  Verify Certificate →
                </a>
              </div>
            )}
          </aside>
        </motion.section>
      </div>
    </main>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.params
  let certification = null
  let dbError = false

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { props: { certification: null, dbError: false } }
    }
    await connect()
    certification = await Certification.findById(id).lean()
  } catch (error) {
    console.error('Certification detail lookup failed:', error.message)
    dbError = true
  }

  return {
    props: {
      certification: certification ? JSON.parse(JSON.stringify(certification)) : null,
      dbError,
    },
  }
}
