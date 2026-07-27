import connect from '../../lib/mongodb'
import Project from '../../models/Project'
import Experience from '../../models/Experience'
import Certification from '../../models/Certification'
import Achievement from '../../models/Achievement'
import Qualification from '../../models/Qualification'
import Skill from '../../models/Skill'
import Resume from '../../models/Resume'
import Contact from '../../models/Contact'
import About from '../../models/About'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Router from 'next/router'

const tabs = [
  { key: 'about', label: 'About' },
  { key: 'qualification', label: 'Qualification' },
  { key: 'skills', label: 'Skills' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'resume', label: 'Resume' },
  { key: 'contact', label: 'Contact' },
  { key: 'projects', label: 'Projects' },
  { key: 'experience', label: 'Experience' },
]

const apiPaths = {
  about: '/api/about',
  qualification: '/api/qualification',
  skills: '/api/skills',
  certifications: '/api/certification',
  achievements: '/api/achievement',
  resume: '/api/resume',
  contact: '/api/contact',
  projects: '/api/projects',
  experience: '/api/experience',
}

const emptyResumeForm = { title: '', subtitle: '', year: '', description: '', link: '' }
const emptyCertificationForm = { title: '', issuer: '', date: '', url: '', credentialId: '', image: '', description: '' }
const emptyAchievementForm = { title: '', description: '', category: '', date: '', images: [], link: '', organization: '' }
const emptyExperienceForm = {
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  summary: '',
  highlights: '',
}

function toDateInput(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function isValidImageSource(value) {
  return !value || value.startsWith('/') || /^https?:\/\/[^\s]+$/i.test(value)
}

async function requestJson(url, options) {
  const response = await fetch(url, options)
  const text = await response.text()
  let data = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error(`Server returned an invalid response (${response.status}).`)
    }
  }

  if (!response.ok) {
    const error = new Error(data?.error || `Request failed (${response.status}).`)
    error.status = response.status
    throw error
  }

  return data
}

export default function Admin({ initialData }) {
  const [tab, setTab] = useState('about')
  const [dbError, setDbError] = useState(initialData.dbError || false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
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

  const [certifications, setCertifications] = useState(initialData.certifications)
  const [certificationForm, setCertificationForm] = useState(emptyCertificationForm)
  const [editingCertificationId, setEditingCertificationId] = useState(null)

  const [achievements, setAchievements] = useState(initialData.achievements)
  const [achievementForm, setAchievementForm] = useState(emptyAchievementForm)
  const [editingAchievementId, setEditingAchievementId] = useState(null)
  const achievementUploadRef = useRef(null)
  const certificationUploadRef = useRef(null)

  const [resumeItems, setResumeItems] = useState(initialData.resumeItems)
  const [resumeForm, setResumeForm] = useState(emptyResumeForm)
  const [editingResumeId, setEditingResumeId] = useState(null)

  const [contacts, setContacts] = useState(initialData.contacts)
  const [contactForm, setContactForm] = useState({ type: '', value: '', link: '' })
  const [editingContactId, setEditingContactId] = useState(null)

  const [projects, setProjects] = useState(initialData.initialProjects)
  const [projectForm, setProjectForm] = useState({ title: '', description: '', link: '', image: '', repo: '', tags: '', featured: false })
  const [editingProjectId, setEditingProjectId] = useState(null)

  const [experiences, setExperiences] = useState(initialData.initialExperiences)
  const [experienceForm, setExperienceForm] = useState(emptyExperienceForm)
  const [editingExperienceId, setEditingExperienceId] = useState(null)

  useEffect(() => {
    setDbError(initialData.dbError || false)
    setAbout(initialData.about)
    setQualifications(initialData.qualifications)
    setSkills(initialData.skills)
    setCertifications(initialData.certifications)
    setAchievements(initialData.achievements)
    setResumeItems(initialData.resumeItems)
    setContacts(initialData.contacts)
    setProjects(initialData.initialProjects)
    setExperiences(initialData.initialExperiences)
  }, [initialData])

  function handleRequestError(error) {
    setErrorMessage(error.message || 'Something went wrong.')
    if (error.status === 401) Router.push('/admin/login')
  }

  function clearEditing() {
    setEditingQualificationId(null)
    setEditingSkillId(null)
    setEditingCertificationId(null)
    setEditingAchievementId(null)
    setEditingResumeId(null)
    setEditingContactId(null)
    setEditingProjectId(null)
    setEditingExperienceId(null)
  }

  function resetForms() {
    setQualificationForm({ title: '', institution: '', date: '', description: '', url: '' })
    setSkillForm({ name: '', category: '', level: '', keywords: '' })
    setCertificationForm(emptyCertificationForm)
    setAchievementForm(emptyAchievementForm)
    setResumeForm(emptyResumeForm)
    setContactForm({ type: '', value: '', link: '' })
    setProjectForm({ title: '', description: '', link: '', image: '', repo: '', tags: '', featured: false })
    setExperienceForm(emptyExperienceForm)
    clearEditing()
  }

  async function handleAchievementUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsSaving(true)
    setErrorMessage('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload?folder=achievements', { method: 'POST', body: formData })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Upload failed.')
      }
      const data = await response.json()
      setAchievementForm((prev) => ({ ...prev, images: [...prev.images, data.url] }))
      if (achievementUploadRef.current) achievementUploadRef.current.value = ''
    } catch (error) {
      setErrorMessage(error.message || 'Failed to upload image.')
    } finally {
      setIsSaving(false)
    }
  }

  function removeAchievementImage(index) {
    setAchievementForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  async function handleCertificationUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsSaving(true)
    setErrorMessage('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload?folder=certificates', { method: 'POST', body: formData })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Upload failed.')
      }
      const data = await response.json()
      setCertificationForm((prev) => ({ ...prev, image: data.url }))
      if (certificationUploadRef.current) certificationUploadRef.current.value = ''
    } catch (error) {
      setErrorMessage(error.message || 'Failed to upload image.')
    } finally {
      setIsSaving(false)
    }
  }

  function removeCertificationImage() {
    setCertificationForm((prev) => ({ ...prev, image: '' }))
  }

  async function fetchAbout() {
    try {
      const data = await requestJson(apiPaths.about)
      setAbout(data)
      setAboutForm({ headline: data.headline || 'About Me', paragraphs: (data.paragraphs || []).join('\n\n') })
      setDbError(false)
      setErrorMessage('')
    } catch (error) {
      handleRequestError(error)
    }
  }

  async function fetchList(key) {
    try {
      const data = await requestJson(apiPaths[key])
      switch (key) {
        case 'qualification': setQualifications(data); break
        case 'skills': setSkills(data); break
        case 'certifications': setCertifications(data); break
        case 'achievements': setAchievements(data); break
        case 'resume': setResumeItems(data); break
        case 'contact': setContacts(data); break
        case 'projects': setProjects(data); break
        case 'experience': setExperiences(data); break
      }
      setDbError(false)
      setErrorMessage('')
    } catch (error) {
      handleRequestError(error)
    }
  }

  async function submit(e) {
    e.preventDefault()
    setIsSaving(true)
    setErrorMessage('')

    try {
      if (tab === 'about') {
        const payload = {
          headline: aboutForm.headline,
          paragraphs: aboutForm.paragraphs.split(/\r?\n\s*\n/).map((line) => line.trim()).filter(Boolean),
        }
        await requestJson(apiPaths.about, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        await fetchAbout()
        return
      }

      const payloadMap = {
        qualification: qualificationForm,
        skills: { ...skillForm, keywords: skillForm.keywords.split(',').map((item) => item.trim()).filter(Boolean) },
        certifications: certificationForm,
        achievements: {
          ...achievementForm,
          images: achievementForm.images.filter(Boolean),
        },
        resume: resumeForm,
        contact: contactForm,
        projects: { ...projectForm, tags: projectForm.tags.split(',').map((item) => item.trim()).filter(Boolean) },
        experience: {
          ...experienceForm,
          endDate: experienceForm.current ? '' : experienceForm.endDate,
          highlights: experienceForm.highlights.split('\n').map((item) => item.trim()).filter(Boolean),
        },
      }
      const editingId = {
        qualification: editingQualificationId,
        skills: editingSkillId,
        certifications: editingCertificationId,
        achievements: editingAchievementId,
        resume: editingResumeId,
        contact: editingContactId,
        projects: editingProjectId,
        experience: editingExperienceId,
      }[tab]
      const url = editingId ? `${apiPaths[tab]}/${editingId}` : apiPaths[tab]

      await requestJson(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadMap[tab]),
      })
      resetForms()
      await fetchList(tab)
    } catch (error) {
      handleRequestError(error)
    } finally {
      setIsSaving(false)
    }
  }

  async function editItem(id) {
    setErrorMessage('')
    try {
      const item = await requestJson(`${apiPaths[tab]}/${id}`)
      switch (tab) {
      case 'qualification':
        setQualificationForm({
          title: item.title || '',
          institution: item.institution || '',
          date: toDateInput(item.date),
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
      case 'certifications':
        setCertificationForm({
          title: item.title || '',
          issuer: item.issuer || '',
          date: toDateInput(item.date),
          url: item.url || '',
          credentialId: item.credentialId || '',
          image: item.image || '',
          description: item.description || '',
        })
        setEditingCertificationId(id)
        break
      case 'achievements':
        setAchievementForm({
          title: item.title || '',
          description: item.description || '',
          category: item.category || '',
          date: toDateInput(item.date),
          images: item.images || [],
          link: item.link || '',
          organization: item.organization || '',
        })
        setEditingAchievementId(id)
        break
      case 'resume':
        setResumeForm({
          title: item.title || '',
          subtitle: item.subtitle || '',
          year: item.year || '',
          description: item.description || '',
          link: item.link || '',
        })
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
          location: item.location || '',
          startDate: toDateInput(item.startDate),
          endDate: toDateInput(item.endDate),
          current: Boolean(item.current),
          summary: item.summary || '',
          highlights: (item.highlights || []).join('\n'),
        })
        setEditingExperienceId(id)
        break
      }
    } catch (error) {
      handleRequestError(error)
    }
  }

  async function removeItem(id) {
    const confirmMessage = {
      qualification: 'Delete this qualification?',
      skills: 'Delete this skill?',
      certifications: 'Delete this certification?',
      achievements: 'Delete this achievement?',
      resume: 'Delete this resume item?',
      contact: 'Delete this contact method?',
      projects: 'Delete this project?',
      experience: 'Delete this experience?',
    }[tab]
    if (!confirm(confirmMessage)) return
    try {
      setErrorMessage('')
      await requestJson(`${apiPaths[tab]}/${id}`, { method: 'DELETE' })
      await fetchList(tab)
    } catch (error) {
      handleRequestError(error)
    }
  }

  async function logout() {
    try {
      await requestJson('/api/auth/logout', { method: 'POST' })
      Router.push('/admin/login')
    } catch (error) {
      handleRequestError(error)
    }
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
        {errorMessage && (
          <div role="alert" className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto mb-8 overflow-x-auto pb-4">
        <div className="inline-flex gap-3 rounded-full border border-slate-700 bg-slate-950/70 p-2">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                resetForms()
                setErrorMessage('')
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
              {tab === 'certifications' && (editingCertificationId ? 'Edit Certification' : 'New Certification')}
              {tab === 'achievements' && (editingAchievementId ? 'Edit Achievement' : 'New Achievement')}
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
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={qualificationForm.institution}
                  onChange={(e) => setQualificationForm({ ...qualificationForm, institution: e.target.value })}
                  placeholder="Institution"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  type="date"
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
                  required
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

            {tab === 'certifications' && (
              <>
                <input
                  value={certificationForm.title}
                  onChange={(e) => setCertificationForm({ ...certificationForm, title: e.target.value })}
                  placeholder="Certification Title"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={certificationForm.issuer}
                  onChange={(e) => setCertificationForm({ ...certificationForm, issuer: e.target.value })}
                  placeholder="Issuer (e.g., Google, AWS, Microsoft)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  type="date"
                  value={certificationForm.date}
                  onChange={(e) => setCertificationForm({ ...certificationForm, date: e.target.value })}
                  placeholder="Date Issued"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Certificate Image</label>
                  <div className="space-y-3">
                    {certificationForm.image && (
                      <div className="group relative inline-block">
                        <div className="relative h-40 w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-900 sm:w-72">
                          <Image src={certificationForm.image} alt="Certificate image" fill sizes="288px" unoptimized className="object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={removeCertificationImage}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-sm text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-600 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300">
                      <span>{certificationForm.image ? 'Replace Image' : '+ Add Image'}</span>
                      <input ref={certificationUploadRef} type="file" accept="image/*" className="hidden" onChange={handleCertificationUpload} />
                    </label>
                  </div>
                </div>
                <textarea
                  value={certificationForm.description}
                  onChange={(e) => setCertificationForm({ ...certificationForm, description: e.target.value })}
                  rows={4}
                  placeholder="Description (optional)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={certificationForm.credentialId}
                  onChange={(e) => setCertificationForm({ ...certificationForm, credentialId: e.target.value })}
                  placeholder="Credential ID (optional)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={certificationForm.url}
                  onChange={(e) => setCertificationForm({ ...certificationForm, url: e.target.value })}
                  placeholder="Verification URL (optional)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
              </>
            )}

            {tab === 'achievements' && (
              <>
                <input
                  value={achievementForm.title}
                  onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                  placeholder="Achievement Title"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={achievementForm.category}
                  onChange={(e) => setAchievementForm({ ...achievementForm, category: e.target.value })}
                  placeholder="Category (e.g., Hackathon, Award, Competition)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={achievementForm.organization}
                  onChange={(e) => setAchievementForm({ ...achievementForm, organization: e.target.value })}
                  placeholder="Organization/Event Name (optional)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  type="date"
                  value={achievementForm.date}
                  onChange={(e) => setAchievementForm({ ...achievementForm, date: e.target.value })}
                  placeholder="Date"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Achievement Images</label>
                  <div className="space-y-3">
                    {achievementForm.images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {achievementForm.images.map((img, idx) => (
                          <div key={idx} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
                            <Image src={img} alt={`Achievement image ${idx + 1}`} fill sizes="96px" unoptimized className="object-cover" />
                            <button
                              type="button"
                              onClick={() => removeAchievementImage(idx)}
                              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
                              aria-label={`Remove image ${idx + 1}`}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-600 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300">
                      <span>+ Add Image</span>
                      <input ref={achievementUploadRef} type="file" accept="image/*" className="hidden" onChange={handleAchievementUpload} />
                    </label>
                    {achievementForm.images.length > 0 && (
                      <p className="text-xs text-slate-500">{achievementForm.images.length} image(s) selected</p>
                    )}
                  </div>
                </div>
                <textarea
                  value={achievementForm.description}
                  onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                  rows={4}
                  placeholder="Description"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={achievementForm.link}
                  onChange={(e) => setAchievementForm({ ...achievementForm, link: e.target.value })}
                  placeholder="Link/URL (optional)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
              </>
            )}

            {tab === 'resume' && (
              <>
                <input
                  value={resumeForm.title}
                  onChange={(e) => setResumeForm({ ...resumeForm, title: e.target.value })}
                  placeholder="Resume title (optional)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={resumeForm.subtitle}
                  onChange={(e) => setResumeForm({ ...resumeForm, subtitle: e.target.value })}
                  placeholder="Subtitle (optional)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={resumeForm.year}
                  onChange={(e) => setResumeForm({ ...resumeForm, year: e.target.value })}
                  placeholder="Year (optional)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <textarea
                  value={resumeForm.description}
                  onChange={(e) => setResumeForm({ ...resumeForm, description: e.target.value })}
                  rows={3}
                  placeholder="Description (optional)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <label className="block text-sm text-slate-300">Resume PDF Link</label>
                <input
                  value={resumeForm.link}
                  onChange={(e) => setResumeForm({ ...resumeForm, link: e.target.value })}
                  placeholder="https://.../resume.pdf or /resume.pdf"
                  required
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
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <input
                  value={contactForm.value}
                  onChange={(e) => setContactForm({ ...contactForm, value: e.target.value })}
                  placeholder="Value"
                  required
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
                  required
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
                {!isValidImageSource(projectForm.image) && (
                  <p className="text-sm text-red-300">Use an http(s) image URL or a public path beginning with /.</p>
                )}
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
                  value={experienceForm.location}
                  onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                  placeholder="Location"
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
                  disabled={experienceForm.current}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <label className="inline-flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={experienceForm.current}
                    onChange={(e) => setExperienceForm({ ...experienceForm, current: e.target.checked, endDate: e.target.checked ? '' : experienceForm.endDate })}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                  />
                  I currently work here
                </label>
                <textarea
                  value={experienceForm.summary}
                  onChange={(e) => setExperienceForm({ ...experienceForm, summary: e.target.value })}
                  rows={4}
                  placeholder="Summary"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
                <textarea
                  value={experienceForm.highlights}
                  onChange={(e) => setExperienceForm({ ...experienceForm, highlights: e.target.value })}
                  rows={4}
                  placeholder="Highlights (one per line)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
              </>
            )}

            <div className="flex gap-2">
              <button type="submit" disabled={isSaving || (tab === 'projects' && !isValidImageSource(projectForm.image)) || (tab === 'certifications' && !isValidImageSource(certificationForm.image))} className="flex-1 rounded-lg bg-cyan-500 py-3 font-semibold transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50">
                {isSaving ? 'Saving…' : 'Save'}
              </button>
              {(editingQualificationId || editingSkillId || editingCertificationId || editingAchievementId || editingResumeId || editingContactId || editingProjectId || editingExperienceId) && (
                <button
                  type="button"
                  onClick={resetForms}
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
                      <p className="text-slate-500 text-xs">{formatDate(item.date)}</p>
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

            {tab === 'certifications' && (
              <div className="space-y-3 max-h-[32rem] overflow-y-auto">
                {certifications.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No certifications yet. Add one to get started.</p>
                ) : (
                  certifications.map((item) => (
                    <div key={item._id} className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-cyan-400 transition">
                      {item.image && isValidImageSource(item.image) && (
                        <div className="relative mb-4 h-40 overflow-hidden rounded-2xl bg-slate-900">
                          <Image src={item.image} alt={item.title} fill sizes="(min-width: 768px) 50vw, 100vw" unoptimized className="object-cover" />
                        </div>
                      )}
                      {item.image && !isValidImageSource(item.image) && (
                        <p className="mb-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-200">This certification has an invalid image URL. Edit it to restore the preview.</p>
                      )}
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-bold text-white">{item.title}</h3>
                          <p className="text-slate-400 text-sm">{item.issuer}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => editItem(item._id)} className="px-2 py-1 text-sm bg-amber-600 hover:bg-amber-700 rounded transition">Edit</button>
                          <button onClick={() => removeItem(item._id)} className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition">Delete</button>
                        </div>
                      </div>
                      {item.description && <p className="text-slate-300 text-sm mb-2">{item.description}</p>}
                      {item.credentialId && <p className="text-slate-300 text-sm mb-2">ID: {item.credentialId}</p>}
                      <p className="text-slate-500 text-xs">{formatDate(item.date)}</p>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-cyan-300 hover:text-white text-sm font-semibold">
                          View Certificate
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'achievements' && (
              <div className="space-y-3 max-h-[32rem] overflow-y-auto">
                {achievements.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No achievements yet. Add one to get started.</p>
                ) : (
                  achievements.map((item) => (
                    <div key={item._id} className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-cyan-400 transition">
                      {item.images && item.images.length > 0 && (
                        <div className="mb-4 grid grid-cols-3 gap-2">
                          {item.images.slice(0, 3).map((img, idx) => (
                            isValidImageSource(img) ? (
                              <div key={idx} className="relative h-24 overflow-hidden rounded-lg bg-slate-900">
                                <Image src={img} alt={`${item.title} ${idx + 1}`} fill sizes="150px" unoptimized className="object-cover" />
                              </div>
                            ) : null
                          ))}
                          {item.images.length > 3 && (
                            <div className="relative h-24 overflow-hidden rounded-lg bg-slate-950 flex items-center justify-center">
                              <p className="text-cyan-300 font-semibold text-sm">+{item.images.length - 3} more</p>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-bold text-white">{item.title}</h3>
                          {item.category && <span className="inline-block mt-1 px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full">{item.category}</span>}
                          <p className="text-slate-400 text-sm mt-1">{item.organization}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => editItem(item._id)} className="px-2 py-1 text-sm bg-amber-600 hover:bg-amber-700 rounded transition">Edit</button>
                          <button onClick={() => removeItem(item._id)} className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition">Delete</button>
                        </div>
                      </div>
                      {item.description && <p className="text-slate-300 text-sm mb-2">{item.description}</p>}
                      <p className="text-slate-500 text-xs">{formatDate(item.date)}</p>
                      {item.images && <p className="text-slate-500 text-xs mt-1">{item.images.length} image(s)</p>}
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-cyan-300 hover:text-white text-sm font-semibold">
                          View Details
                        </a>
                      )}
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
                        {item.title && <h3 className="font-bold text-white">{item.title}</h3>}
                        {item.subtitle && <p className="text-sm text-slate-300">{item.subtitle}</p>}
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-cyan-300 font-semibold">Download Resume (PDF)</a>
                        {item.year && <p className="text-slate-400 text-xs mt-1">{item.year}</p>}
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
                      {p.image && isValidImageSource(p.image) && (
                        <div className="relative mb-4 h-40 overflow-hidden rounded-2xl bg-slate-900">
                          <Image src={p.image} alt={p.title} fill sizes="(min-width: 768px) 50vw, 100vw" unoptimized className="object-cover" />
                        </div>
                      )}
                      {p.image && !isValidImageSource(p.image) && (
                        <p className="mb-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-200">This project has an invalid image URL. Edit it to restore the preview.</p>
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
                          <p className="text-slate-400 text-sm">{[e.company, e.location].filter(Boolean).join(' · ')}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => editItem(e._id)} className="px-2 py-1 text-sm bg-amber-600 hover:bg-amber-700 rounded transition">Edit</button>
                          <button onClick={() => removeItem(e._id)} className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition">Delete</button>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{e.summary}</p>
                      <p className="text-slate-500 text-xs">{formatDate(e.startDate)} — {e.current ? 'Present' : formatDate(e.endDate) || 'Present'}</p>
                      {e.highlights?.length > 0 && (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                          {e.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                        </ul>
                      )}
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
    return { redirect: { destination: '/admin/login', permanent: false } }
  }
  const token = match.replace('token=', '')
  const jwt = require('jsonwebtoken')
  try {
    jwt.verify(token, process.env.JWT_SECRET)
  } catch (e) {
    return { redirect: { destination: '/admin/login', permanent: false } }
  }

  if (process.env.MONGODB_URI) {
    try {
      await connect()
      const about = (await About.findOne({}).lean()) || { headline: 'About Me', paragraphs: [] }
      const qualifications = await Qualification.find({}).sort({ date: -1, createdAt: -1 }).lean()
      const skills = await Skill.find({}).sort({ createdAt: -1 }).lean()
      const certifications = await Certification.find({}).sort({ date: -1, createdAt: -1 }).lean()
      const achievements = await Achievement.find({}).sort({ date: -1, createdAt: -1 }).lean()
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
            certifications: JSON.parse(JSON.stringify(certifications)),
            achievements: JSON.parse(JSON.stringify(achievements)),
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
            certifications: [],
            achievements: [],
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
        certifications: [],
        achievements: [],
        resumeItems: [],
        contacts: [],
        initialProjects: [],
        initialExperiences: [],
      },
    },
  }
}
