import { useState } from 'react'
import Router from 'next/router'

export default function Login() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  async function submit(e) {
    e.preventDefault()
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user, pass }) })
    if (res.ok) Router.push('/admin')
    else setErr('Invalid credentials')
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <form onSubmit={submit} className="mt-4 bg-white p-4 rounded shadow">
        <input className="w-full p-2 border rounded mb-2" placeholder="User" value={user} onChange={e => setUser(e.target.value)} />
        <input type="password" className="w-full p-2 border rounded mb-2" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
        <div className="flex justify-between items-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Sign in</button>
        </div>
        {err && <div className="text-red-600 mt-2">{err}</div>}
      </form>
    </main>
  )
}
