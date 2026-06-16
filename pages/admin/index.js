import connect from '../../lib/mongodb'
import Project from '../../models/Project'
import Experience from '../../models/Experience'
import Qualification from '../../models/Qualification'
import Skill from '../../models/Skill'
import Resume from '../../models/Resume'
import Contact from '../../models/Contact'
import About from '../../models/About'
import { useState, useEffect } from 'react'
import Router from 'next/router'

const tabs = [
  { key: 'about', label: 'About' },
  { key: 'qualification', label: 'Qualification' },
  { key: 'skills', label: 'Skills' },
  { key: 'resume', label: 'Resume' },
  { key: 'contact', label: 'Contact' },
  { key: 'projects', label: 'Projects' },
  { key: 'experience', label: 'Experience' },
]

const apiPaths = {
  about: '/api/about',
  qualification: '/api/qualification',
  skills: '/api/skills',
  resume: '/api/resume',
  contact: '/api/contact',
  projects: '/api/projects',
  experience: '/api/experience',
}

export default function Admin({ initialData }) {
  const [tab, setTab] = useState('about')
  const [dbError, setDbError] = useState(initialData.dbError || false)
  const [about, setAbout] = useState(initialData.about)
  const [aboutForm, setAboutForm] = useState({
    headline: initialData.about?.headline || 'About Me',
    paragraphs: (initialData.about?.paragraphs || []).join('\n\n'),
  })

  const [qualifications, setQualifications] = useState(initialData.qualifications)
  const [qualificationForm, setQualificationForm] = useState({ title: '', institution: '', date: '', description: '', url: '' })
  const [editingQualificationId, setEditingQualificationId] = useState(null)

  const [skills, setSkills] = useState(initialData.skills)
  const [skillForm, setSkillForm] = useState({ name: '', category: '', level: '', keywords: '' })
  const [editingSkillId, setEditingSkillId] = useState(null)

  const [resumeItems, setResumeItems] = useState(initialData.resumeItems)
  const [resumeForm, setResumeForm] = useState({ link: '' })
  const [editingResumeId, setEditingResumeId] = useState(null)

  const [contacts, setContacts] = useState(initialData.contacts)
  const [contactForm, setContactForm] = useState({ type: '', value: '', link: '' })
  const [editingContactId, setEditingContactId] = useState(null)

  const [projects, setProjects] = useState(initialData.initialProjects)
  const [projectForm, setProjectForm] = useState({ title: '', description: '', link: '', image: '', repo: '', tags: '', featured: false })
  const [editingProjectId, setEditingProjectId] = useState(null)

  const [experiences, setExperiences] = useState(initialData.initialExperiences)
  const [experienceForm, setExperienceForm] = useState({ title: '', company: '', startDate: '', endDate: '', summary: '' })
  const [editingExperienceId, setEditingExperienceId] = useState(null)

  useEffect(() => {
    setDbError(initialData.dbError || false)
    setAbout(initialData.about)
    setQualifications(initialData.qualifications)
    setSkills(initialData.skills)
    setResumeItems(initialData.resumeItems)
    setContacts(initialData.contacts)
    setProjects(initialData.initialProjects)
    setExperiences(initialData.initialExperiences)
  }, [initialData])

  async function fetchAbout() {
    const res = await fetch(apiPaths.about)
    const data = await res.json()
    setAbout(data)
    setAboutForm({ headline: data.headline || 'About Me', paragraphs: (data.paragraphs || []).join('\n\n') })
  }

  async function fetchList(key) {
    const res = await fetch(apiPaths[key])
    const data = await res.json()
    switch (key) {
      case 'qualification':
        setQualifications(data)
        break
      case 'skills':
        setSkills(data)
        break
      case 'resume':
        setResumeItems(data)
        break
      case 'contact':
        setContacts(data)
        break
      case 'projects':
        setProjects(data)
        break
      case 'experience':
        setExperiences(data)
        break
    }
  }

  async function submit(e) {
    e.preventDefault()

    if (tab === 'about') {
      const payload = {
        headline: aboutForm.headline,
        paragraphs: aboutForm.paragraphs
          .split(/\r?\n\s*\n/)
          .map((line) => line.trim())
          .filter(Boolean),
      }
      const res = await fetch(apiPaths.about, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok) {
        alert(result.error || 'Unable to save About content.')
        return
      }
      fetchAbout()
      return
    }

    const payloadMap = {
      qualification: qualificationForm,
      skills: { ...skillForm, keywords: skillForm.keywords.split(',').map((k) => k.trim()).filter(Boolean) },
      resume: resumeForm,
      contact: contactForm,
      projects: {
        ...projectForm,
        tags: projectForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      },
      experience: experienceForm,
    }

    const payload = payloadMap[tab]
    const editingId = {
      qualification: editingQualificationId,
      skills: editingSkillId,
      resume: editingResumeId,
      contact: editingContactId,
      projects: editingProjectId,
      experience: editingExperienceId,
    }[tab]

    const url = editingId ? `${apiPaths[tab]}/${editingId}` : apiPaths[tab]
    const method = editingId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const result = await res.json()
    if (!res.ok) {
      alert(result.error || 'Unable to save item.')
      return
    }

    setQualificationForm({ title: '', institution: '', date: '', description: '', url: '' })
    setSkillForm({ name: '', category: '', level: '', keywords: '' })
    setResumeForm({ link: '' })
    setContactForm({ type: '', value: '', link: '' })
    setProjectForm({ title: '', description: '', link: '', image: '', repo: '', tags: '', featured: false })
    setExperienceForm({ title: '', company: '', startDate: '', endDate: '', summary: '' })
    setEditingQualificationId(null)
    setEditingSkillId(null)
    setEditingResumeId(null)
    setEditingContactId(null)
    setEditingProjectId(null)
    setEditingExperienceId(null)

    if (tab === 'about') {
      fetchAbout()
    } else {
      fetchList(tab)
    }
  }

  async function editItem(id) {
    const res = await fetch(`${apiPaths[tab]}/${id}`)
    const item = await res.json()

    switch (tab) {
      case 'qualification':
        setQualificationForm({
          title: item.title || '',
          institution: item.institution || '',
          date: item.date || '',
          description: item.description || '',
          url: item.url || '',
        })
        setEditingQualificationId(id)
        break
      case 'skills':
        setSkillForm({
          name: item.name || '',
          category: item.category || '',
          level: item.level || '',
          keywords: (item.keywords || []).join(', '),
        })
        setEditingSkillId(id)
        break
      case 'resume':
        setResumeForm({ link: item.link || '' })
        setEditingResumeId(id)
        break
      case 'contact':
        setContactForm({ type: item.type || '', value: item.value || '', link: item.link || '' })
        setEditingContactId(id)
        break
      case 'projects':
        setProjectForm({
          title: item.title || '',
          description: item.description || '',
          link: item.link || '',
          image: item.image || '',
          repo: item.repo || '',
          tags: (item.tags || []).join(', '),
          featured: Boolean(item.featured),
        })
        setEditingProjectId(id)
        break
      case 'experience':
        setExperienceForm({
          title: item.title || '',
          company: item.company || '',
          startDate: item.startDate || '',
          endDate: item.endDate || '',
          summary: item.summary || '',
        })
        setEditingExperienceId(id)
        break
    }
  }

  async function removeItem(id) {
    const confirmMessage = {
      qualification: 'Delete this qualification?',
      skills: 'Delete this skill?',
      resume: 'Delete this resume item?',
      contact: 'Delete this contact method?',
      projects: 'Delete this project?',
      experience: 'Delete this experience?',
    }[tab]
    if (!confirm(confirmMessage)) return
    await fetch(`${apiPaths[tab]}/${id}`, { method: 'DELETE' })
    fetchList(tab)
  }

  async function logout() {
    await fetch('/api/auth/logout')
    Router.push('/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Manage all sections of Ganesh Karadkar’s portfolio</p>
          </div>
          <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition">
            Logout
          </button>
        </div>
        {dbError && (
          <div className="mt-6 rounded-3xl border border-amber-500/40 bg-amber-500/10 p-5 text-amber-100">
            <p className="font-semibold">Database connection failed.</p>
            <p className="text-sm">Admin data is unavailable while MongoDB Atlas cannot be reached.</p>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto mb-8 overflow-x-auto pb-4">
        <div className="inline-flex gap-3 rounded-full border border-slate-700 bg-slate-950/70 p-2">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setTab(item.key)
                if (item.key === 'about') fetchAbout()
                else fetchList(item.key)
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === item.key ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form onSubmit={submit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
            <h2 className="text-xl font-bold">
              {tab === 'about' && 'Edit About'}
              {tab === 'qualification' && (editingQualificationId ? 'Edit Qualification' : 'New Qualification')}
              {tab === 'skills' && (editingSkillId ? 'Edit Skill' : 'New Skill')}
              {tab === 'resume' && (editingResumeId ? 'Edit Resume Item' : 'New Resume Item')}
              {tab === 'contact' && (editingContactId ? 'Edit Contact' : 'New Contact')}
              {tab === 'projects' && (editingProjectId ? 'Edit Project' : 'New Project')}
              {tab === 'experience' && (editingExperienceId ? 'Edit Experience' : 'New Experience')}
            </h2>

            {tab === 'about' && (
              <>
                <label className="block text-sm text-slate-300">Headline</label>
                <input
                  value={aboutForm.headline}
                  onChange={(e) => setAboutForm({ ...aboutForm, headline: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <label className="block text-sm text-slate-300">Paragraphs</label>
                <textarea
                  value={aboutForm.paragraphs}
                  onChange={(e) => setAboutForm({ ...aboutForm, paragraphs: e.target.value })}
                  rows={8}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Separate paragraphs with a blank line"
                />
              </>
            )}

            {tab === 'qualification' && (
              <>
                <input
                  value={qualificationForm.title}
                  onChange={(e) => setQualificationForm({ ...qualificationForm, title: e.target.value })}
                  placeholder="Qualification Title"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={qualificationForm.institution}
                  onChange={(e) => setQualificationForm({ ...qualificationForm, institution: e.target.value })}
                  placeholder="Institution"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={qualificationForm.date}
                  onChange={(e) => setQualificationForm({ ...qualificationForm, date: e.target.value })}
                  placeholder="Date"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <textarea
                  value={qualificationForm.description}
                  onChange={(e) => setQualificationForm({ ...qualificationForm, description: e.target.value })}
                  rows={4}
                  placeholder="Description"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={qualificationForm.url}
                  onChange={(e) => setQualificationForm({ ...qualificationForm, url: e.target.value })}
                  placeholder="URL"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
              </>
            )}

            {tab === 'skills' && (
              <>
                <input
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="Skill Name"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  placeholder="Category"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                  placeholder="Level"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={skillForm.keywords}
                  onChange={(e) => setSkillForm({ ...skillForm, keywords: e.target.value })}
                  placeholder="Keywords (comma separated)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
              </>
            )}

            {tab === 'resume' && (
              <>
                <label className="block text-sm text-slate-300">Resume PDF Link</label>
                <input
                  value={resumeForm.link}
                  onChange={(e) => setResumeForm({ ...resumeForm, link: e.target.value })}
                  placeholder="https://.../resume.pdf or /resume.pdf"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <p className="text-xs text-slate-400 mt-1">Provide a public URL or upload the PDF to <span className="italic">public/</span> and use <span className="font-mono">/resume.pdf</span>.</p>
              </>
            )}

            {tab === 'contact' && (
              <>
                <input
                  value={contactForm.type}
                  onChange={(e) => setContactForm({ ...contactForm, type: e.target.value })}
                  placeholder="Contact Type"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={contactForm.value}
                  onChange={(e) => setContactForm({ ...contactForm, value: e.target.value })}
                  placeholder="Value"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={contactForm.link}
                  onChange={(e) => setContactForm({ ...contactForm, link: e.target.value })}
                  placeholder="Link (optional)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
              </>
            )}

            {tab === 'projects' && (
              <>
                <input
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="Project Title"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  rows={4}
                  placeholder="Description"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  placeholder="Image URL"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={projectForm.repo}
                  onChange={(e) => setProjectForm({ ...projectForm, repo: e.target.value })}
                  placeholder="Repository URL"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={projectForm.link}
                  onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                  placeholder="Live project URL"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  placeholder="Tags (comma separated e.g. Next.js, API, MongoDB)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <label className="inline-flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                  />
                  Mark as featured
                </label>
              </>
            )}

            {tab === 'experience' && (
              <>
                <input
                  value={experienceForm.title}
                  onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                  placeholder="Job Title"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={experienceForm.company}
                  onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                  placeholder="Company"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  type="date"
                  value={experienceForm.startDate || ''}
                  onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                  placeholder="Start Date"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  type="date"
                  value={experienceForm.endDate || ''}
                  onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                  placeholder="End Date"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <textarea
                  value={experienceForm.summary}
                  onChange={(e) => setExperienceForm({ ...experienceForm, summary: e.target.value })}
                  rows={4}
                  placeholder="Summary"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
              </>
            )}

            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-semibold transition">
                Save
              </button>
              {(editingQualificationId || editingSkillId || editingResumeId || editingContactId || editingProjectId || editingExperienceId) && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingQualificationId(null)
                    setEditingSkillId(null)
                    setEditingResumeId(null)
                    setEditingContactId(null)
                    setEditingProjectId(null)
                    setEditingExperienceId(null)
                    setQualificationForm({ title: '', institution: '', date: '', description: '', url: '' })
                    setSkillForm({ name: '', category: '', level: '', keywords: '' })
                    setResumeForm({ title: '', subtitle: '', year: '', description: '', link: '' })
                    setContactForm({ type: '', value: '', link: '' })
                    setProjectForm({ title: '', description: '', link: '', image: '', repo: '', tags: '', featured: false })
                    setExperienceForm({ title: '', company: '', startDate: '', endDate: '', summary: '' })
                  }}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-bold mb-4">{tabs.find((item) => item.key === tab)?.label}</h2>
            {tab === 'about' && (
              <div className="rounded-[32px] border border-slate-700 bg-slate-900/80 p-6">
                <h3 className="text-2xl font-semibold mb-2">{about.headline}</h3>
                <div className="space-y-3 text-slate-300">
                  {about.paragraphs && about.paragraphs.length > 0 ? (
                    about.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                  ) : (
                    <p>No about content added yet.</p>
                  )}
                </div>
              </div>
            )}

            {tab === 'qualification' && (
              <div className="space-y-3 max-h-[32rem] overflow-y-auto">
                {qualifications.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No qualifications yet. Add one to get started.</p>
                ) : (
                  qualifications.map((item) => (
                    <div key={item._id} className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-cyan-400 transition">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-bold text-white">{item.title}</h3>
                          <p className="text-slate-400 text-sm">{item.institution}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => editItem(item._id)} className="px-2 py-1 text-sm bg-amber-600 hover:bg-amber-700 rounded transition">Edit</button>
                          <button onClick={() => removeItem(item._id)} className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition">Delete</button>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{item.description}</p>
                      <p className="text-slate-500 text-xs">{item.date}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'skills' && (
              <div className="space-y-3 max-h-[32rem] overflow-y-auto">
                {skills.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No skills yet. Add one to get started.</p>
                ) : (
                  skills.map((item) => (
                    <div key={item._id} className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-cyan-400 transition">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-bold text-white">{item.name}</h3>
                          <p className="text-slate-400 text-sm">{item.category} {item.level ? `· ${item.level}` : ''}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => editItem(item._id)} className="px-2 py-1 text-sm bg-amber-600 hover:bg-amber-700 rounded transition">Edit</button>
                          <button onClick={() => removeItem(item._id)} className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition">Delete</button>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">{(item.keywords || []).join(', ')}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'resume' && (
              <div className="space-y-3 max-h-[32rem] overflow-y-auto">
                {resumeItems.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No resume uploaded yet. Add a PDF link to publish.</p>
                ) : (
                  resumeItems.map((item) => (
                    <div key={item._id} className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-cyan-400 transition flex items-center justify-between">
                      <div>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-cyan-300 font-semibold">Download Resume (PDF)</a>
                        {item.link && <p className="text-slate-400 text-xs mt-1">{item.link}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editItem(item._id)} className="px-2 py-1 text-sm bg-amber-600 hover:bg-amber-700 rounded transition">Edit</button>
                        <button onClick={() => removeItem(item._id)} className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition">Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'contact' && (
              <div className="space-y-3 max-h-[32rem] overflow-y-auto">
                {contacts.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No contact methods yet. Add one to get started.</p>
                ) : (
                  contacts.map((item) => (
                    <div key={item._id} className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-cyan-400 transition">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-bold text-white">{item.type}</h3>
                          <p className="text-slate-400 text-sm">{item.value}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => editItem(item._id)} className="px-2 py-1 text-sm bg-amber-600 hover:bg-amber-700 rounded transition">Edit</button>
                          <button onClick={() => removeItem(item._id)} className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition">Delete</button>
                        </div>
                      </div>
                      {item.link && <p className="text-slate-500 text-xs">{item.link}</p>}
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'projects' && (
              <div className="space-y-3 max-h-[32rem] overflow-y-auto">
                {projects.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No projects yet. Add one to get started.</p>
                ) : (
                  projects.map((p) => (
                    <div key={p._id} className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-cyan-400 transition">
                      {p.image && (
                        <div className="mb-4 overflow-hidden rounded-2xl bg-slate-900">
                          <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />
                        </div>
                      )}
                      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-white">{p.title}</h3>
                            {p.featured && <span className="rounded-full bg-cyan-500/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">Featured</span>}
                          </div>
                          <p className="text-slate-400 text-sm">{p.link || p.repo || 'No link provided'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => editItem(p._id)} className="px-2 py-1 text-sm bg-amber-600 hover:bg-amber-700 rounded transition">Edit</button>
                          <button onClick={() => removeItem(p._id)} className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition">Delete</button>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm mb-3">{p.description}</p>
                      {p.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {p.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-[rgba(255,255,255,0.05)] px-3 py-1 text-[11px] text-slate-300">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'experience' && (
              <div className="space-y-3 max-h-[32rem] overflow-y-auto">
                {experiences.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No experience yet. Add one to get started.</p>
                ) : (
                  experiences.map((e) => (
                    <div key={e._id} className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-cyan-400 transition">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-bold text-white">{e.title}</h3>
                          <p className="text-slate-400 text-sm">{e.company}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => editItem(e._id)} className="px-2 py-1 text-sm bg-amber-600 hover:bg-amber-700 rounded transition">Edit</button>
                          <button onClick={() => removeItem(e._id)} className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition">Delete</button>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{e.summary}</p>
                      <p className="text-slate-500 text-xs">{e.startDate} — {e.endDate || 'Present'}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export async function getServerSideProps(ctx) {
  const { req } = ctx
  const cookie = req.headers.cookie || ''
  const match = cookie.split(';').map((s) => s.trim()).find((s) => s.startsWith('token='))
  if (!match) {
    return { redirect: { destination: '/', permanent: false } }
  }
  const token = match.replace('token=', '')
  const jwt = require('jsonwebtoken')
  try {
    jwt.verify(token, process.env.JWT_SECRET)
  } catch (e) {
    return { redirect: { destination: '/', permanent: false } }
  }

  if (process.env.MONGODB_URI) {
    try {
      await connect()
      const about = (await About.findOne({}).lean()) || { headline: 'About Me', paragraphs: [] }
      const qualifications = await Qualification.find({}).sort({ date: -1, createdAt: -1 }).lean()
      const skills = await Skill.find({}).sort({ createdAt: -1 }).lean()
      const resumeItems = await Resume.find({}).sort({ createdAt: -1 }).lean()
      const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean()
      const projects = await Project.find({}).sort({ createdAt: -1 }).lean()
      const experiences = await Experience.find({}).sort({ startDate: -1 }).lean()

      return {
        props: {
          initialData: {
            about: JSON.parse(JSON.stringify(about)),
            qualifications: JSON.parse(JSON.stringify(qualifications)),
            skills: JSON.parse(JSON.stringify(skills)),
            resumeItems: JSON.parse(JSON.stringify(resumeItems)),
            contacts: JSON.parse(JSON.stringify(contacts)),
            initialProjects: JSON.parse(JSON.stringify(projects)),
            initialExperiences: JSON.parse(JSON.stringify(experiences)),
            dbError: false,
          },
        },
      }
    } catch (error) {
      console.error('MongoDB connection failed in admin:', error.message)
      return {
        props: {
          initialData: {
            about: { headline: 'About Me', paragraphs: [] },
            qualifications: [],
            skills: [],
            resumeItems: [],
            contacts: [],
            initialProjects: [],
            initialExperiences: [],
            dbError: true,
          },
        },
      }
    }
  }

  return {
    props: {
      initialData: {
        about: { headline: 'About Me', paragraphs: [] },
        qualifications: [],
        skills: [],
        resumeItems: [],
        contacts: [],
        initialProjects: [],
        initialExperiences: [],
      },
    },
  }
}
