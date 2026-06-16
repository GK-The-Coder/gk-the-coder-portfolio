import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import connect from '../lib/mongodb'
import About from '../models/About'
import Qualification from '../models/Qualification'
import Skill from '../models/Skill'
import Resume from '../models/Resume'
import Contact from '../models/Contact'

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

export default function Home({ about, qualifications, skills, resumeItems, contacts, dbError }) {
  return (
    <>
      <Head>
        <title>Ganesh Karadkar | Full-Stack Developer</title>
        <meta
          name="description"
          content="Ganesh Karadkar is a Full-Stack Developer and Backend-Focused Engineer building scalable web applications and AI-powered systems."
        />
      </Head>
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
      >
      <motion.nav variants={itemVariants} className="fixed w-full top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-bold">Ganesh Karadkar</div>
          <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
            <Link href="#about" className="hover:text-white transition">About</Link>
            <Link href="#qualification" className="hover:text-white transition">Qualification</Link>
            <Link href="#skills" className="hover:text-white transition">Skills</Link>
            <Link href="#resume" className="hover:text-white transition">Resume</Link>
            <Link href="#contact" className="hover:text-white transition">Contact</Link>
            <Link href="/projects" className="text-cyan-300 hover:text-white transition">Projects</Link>
            <Link href="/experience" className="text-cyan-300 hover:text-white transition">Experience</Link>
          </div>
        </div>
      </motion.nav>

      {dbError && (
        <div className="mt-20 border-t border-b border-amber-500/40 bg-amber-500/10 px-6 py-3 text-center text-amber-100 backdrop-blur-sm">
          <p className="text-sm font-medium">Database connection failed. Page is rendering with fallback content. Check Atlas IP access and your MONGODB_URI.</p>
        </div>
      )}

      <Hero about={about} resumeItems={resumeItems} />

      <motion.section id="about" variants={itemVariants} className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">About Me</h2>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-8">
              <h3 className="text-xl font-semibold mb-4">{about.headline || 'Backend-focused developer'}</h3>
              {about.paragraphs?.length > 0 ? (
                <div className="space-y-4 text-slate-300 leading-8">
                  {about.paragraphs.slice(0, 1).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-slate-300 leading-8">
                  Focused on creating performant web applications, intelligent systems, and developer-grade backend architectures while pursuing B.Tech in Computer Engineering.
                </p>
              )}
            </div>
            <div className="space-y-4 text-slate-300 leading-8">
              {about.paragraphs?.length > 1 ? (
                about.paragraphs.slice(1).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : about.paragraphs?.length === 1 ? null : (
                <p>No about content added yet. Use the admin dashboard to manage this section.</p>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section id="qualification" variants={itemVariants} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Qualification</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {qualifications.length > 0 ? (
              qualifications.map((item) => (
                <motion.div key={item._id} variants={itemVariants} className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-6">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="text-slate-400">{item.institution}</p>
                    </div>
                    <span className="text-slate-500">{item.date}</span>
                  </div>
                  <p className="text-slate-300">{item.description}</p>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-cyan-300 hover:text-white font-semibold">
                      View credential
                    </a>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-slate-400">No qualifications added yet. Use the admin dashboard to add them.</p>
            )}
          </div>
        </div>
      </motion.section>

      <motion.section id="skills" variants={itemVariants} className="py-20 px-6 bg-slate-900/70 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <span key={skill._id} className="rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-sm text-slate-200">
                  {skill.name}{skill.level ? ` · ${skill.level}` : ''}
                </span>
              ))
            ) : (
              <p className="text-slate-400">No skills added yet. Use the admin dashboard to manage your tech stack.</p>
            )}
          </div>
        </div>
      </motion.section>

      <motion.section id="resume" variants={itemVariants} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold">Resume</h2>
            <Link href="/projects" className="text-cyan-300 hover:text-white font-semibold">View full projects page</Link>
          </div>
          <div className="grid gap-6">
            {resumeItems.length > 0 && resumeItems[0].link ? (
              <div className="rounded-[12px] border border-slate-800 bg-slate-900/80 p-6 inline-block">
                <a href={resumeItems[0].link} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-white font-semibold">
                  View Resume (PDF)
                </a>
              </div>
            ) : (
              <p className="text-slate-400">No resume uploaded. Add a PDF link via the admin dashboard.</p>
            )}
          </div>
        </div>
      </motion.section>

      <motion.section id="contact" variants={itemVariants} className="py-20 px-6 bg-slate-900/70 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {contacts.length > 0 ? (
              contacts.map((item) => (
                <motion.a
                  key={item._id}
                  href={item.link || '#'}
                  target={item.link ? '_blank' : undefined}
                  rel={item.link ? 'noopener noreferrer' : undefined}
                  className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-6 transition hover:border-cyan-400"
                  variants={itemVariants}
                >
                  <p className="text-sm text-slate-500 uppercase tracking-[0.2em] mb-3">{item.type}</p>
                  <p className="text-lg font-semibold text-white">{item.value}</p>
                </motion.a>
              ))
            ) : (
              <p className="text-slate-400">No contact methods added yet. Add them in the admin dashboard.</p>
            )}
          </div>
        </div>
      </motion.section>

      <motion.footer variants={itemVariants} className="py-10 px-6 border-t border-slate-800 text-center text-slate-500">
        <p>© 2026 Ganesh Karadkar. All rights reserved.</p>
      </motion.footer>
    </motion.main>
    </>
  )
}

export async function getServerSideProps() {
  let dbError = false
  let about = { headline: 'About Me', paragraphs: [] }
  let qualifications = []
  let skills = []
  let resumeItems = []
  let contacts = []

  try {
    await connect()
    about = (await About.findOne({}).lean()) || about
    qualifications = await Qualification.find({}).sort({ date: -1, createdAt: -1 }).lean()
    skills = await Skill.find({}).sort({ createdAt: -1 }).lean()
    resumeItems = await Resume.find({}).sort({ createdAt: -1 }).lean()
    contacts = await Contact.find({}).sort({ createdAt: -1 }).lean()
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    dbError = true
  }

  return {
    props: {
      about: JSON.parse(JSON.stringify(about)),
      qualifications: JSON.parse(JSON.stringify(qualifications)),
      skills: JSON.parse(JSON.stringify(skills)),
      resumeItems: JSON.parse(JSON.stringify(resumeItems)),
      contacts: JSON.parse(JSON.stringify(contacts)),
      dbError,
    },
  }
}
