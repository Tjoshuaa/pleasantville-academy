'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">

          {/* Left Branding Section */}
          <div className="hidden bg-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">

            <div>
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-slate-900">
                PA
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Pleasantville Academy
              </p>

              <h1 className="mt-6 text-4xl font-bold leading-tight">
                Administration
                <br />
                Portal
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                Securely manage your school website, announcements,
                admissions, events, enquiries and gallery.
              </p>
            </div>

            <div>
              <div className="h-px w-full bg-slate-800" />

              <p className="mt-6 text-sm text-slate-500">
                Pleasantville Academy Administration
              </p>
            </div>

          </div>

          {/* Login Section */}
          <div className="p-8 sm:p-12 lg:p-14">

            <div className="mb-8 lg:hidden">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
                PA
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Pleasantville Academy
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to access the Pleasantville administration portal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                </div>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In to Admin'}
              </button>

            </form>

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <Link
                href="/"
                className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
              >
                ← Back to Pleasantville Academy
              </Link>
            </div>

          </div>

        </div>
      </div>
    </main>
  )
}
