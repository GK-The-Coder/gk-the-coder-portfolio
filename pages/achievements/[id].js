import Link from 'next/link'
import Image from 'next/image'
import connect from '../../lib/mongodb'
import Achievement from '../../models/Achievement'
import { motion } from 'framer-motion'
import mongoose from 'mongoose'
import { useState } from 'react'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

export default function AchievementDetail({ achievement, dbError }) {
  const validImages = (achievement?.images || []).filter(img =>
    img && (img.startsWith('/') || /^https?:\/\/[^\s]+$/i.test(img))
  )
  const [selectedImage, setSelectedImage] = useState(validImages[0] || null)

  if (dbError) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl rounded-3xl border border-amber-500/30 bg-amber-500/10 p-10 text-amber-100">
          <h1 className="text-3xl font-bold mb-4">Database unavailable</h1>
          <p className="text-slate-200">Achievement details cannot be loaded right now. Please try again later.</p>
          <Link href="/achievements" className="mt-6 inline-flex text-cyan-300 hover:text-white">Back to achievements</Link>
        </div>
      </main>
    )
  }

  if (!achievement) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-10 text-slate-300">
          <h1 className="text-3xl font-bold mb-4">Achievement not found</h1>
          <p>The achievement you&rsquo;re looking for does not exist or has been removed.</p>
          <Link href="/achievements" className="mt-6 inline-flex text-cyan-300 hover:text-white">Back to achievements</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {achievement.category && (
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">{achievement.category}</p>
            )}
            <h1 className="mt-3 text-5xl font-bold">{achievement.title}</h1>
            {achievement.organization && (
              <p className="mt-3 text-2xl text-cyan-400 font-semibold">{achievement.organization}</p>
            )}
          </div>
          <Link href="/achievements" className="text-cyan-300 hover:text-white font-semibold">Back to all achievements</Link>
        </div>

        {validImages.length > 0 && (
          <div className="mb-10">
            {/* Main Image */}
            <div className="relative h-64 overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.05)] bg-slate-900 shadow-2xl shadow-black/20 sm:h-[420px] sm:rounded-[32px] mb-4">
              <Image src={selectedImage} alt={achievement.title} fill sizes="(min-width: 1152px) 1152px, 100vw" unoptimized className="object-cover" />
            </div>

            {/* Thumbnail Gallery */}
            {validImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {validImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-20 overflow-hidden rounded-lg border-2 transition ${
                      selectedImage === img
                        ? 'border-cyan-400 ring-2 ring-cyan-400/50'
                        : 'border-slate-700 hover:border-cyan-400/50'
                    }`}
                  >
                    <Image src={img} alt={`${achievement.title} ${idx + 1}`} fill sizes="150px" unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <motion.section initial="hidden" animate="visible" variants={itemVariants} className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-[rgba(255,255,255,0.05)] bg-slate-900/80 p-8 glass-card">
              <h2 className="text-3xl font-semibold mb-4">About this Achievement</h2>
              <div className="space-y-4 text-slate-300 leading-8">
                {achievement.description ? (
                  <p>{achievement.description}</p>
                ) : (
                  <p>This achievement represents a significant milestone in my journey as a developer and technologist.</p>
                )}
              </div>
            </section>

            {achievement.link && (
              <section className="grid gap-4">
                <a
                  href={achievement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 px-6 py-4 text-cyan-200 transition hover:bg-cyan-500/20 text-center font-semibold"
                >
                  View More Details →
                </a>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[rgba(255,255,255,0.05)] bg-slate-900/80 p-6 glass-card">
              <h3 className="text-xl font-semibold mb-4">Achievement Details</h3>
              <div className="space-y-4 text-slate-300">
                {achievement.category && (
                  <div>
                    <div className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-1">Category</div>
                    <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-semibold">
                      {achievement.category}
                    </span>
                  </div>
                )}

                {achievement.organization && (
                  <div>
                    <div className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-1">Organization</div>
                    <p className="text-slate-200 font-semibold">{achievement.organization}</p>
                  </div>
                )}

                {achievement.date && (
                  <div>
                    <div className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-1">Date</div>
                    <p className="text-slate-200">
                      {new Date(achievement.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {validImages.length > 0 && (
                  <div>
                    <div className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-1">Photos</div>
                    <p className="text-slate-200">{validImages.length} image{validImages.length !== 1 ? 's' : ''}</p>
                  </div>
                )}

                <div>
                  <div className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-1">Added</div>
                  <p className="text-slate-200">{new Date(achievement.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </aside>
        </motion.section>
      </div>
    </main>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.params
  let achievement = null
  let dbError = false

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { props: { achievement: null, dbError: false } }
    }
    await connect()
    achievement = await Achievement.findById(id).lean()
  } catch (error) {
    console.error('Achievement detail lookup failed:', error.message)
    dbError = true
  }

  return {
    props: {
      achievement: achievement ? JSON.parse(JSON.stringify(achievement)) : null,
      dbError,
    },
  }
}
