'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    // Supabase authentication will be connected in the next step.
    // For now this only validates that both fields are filled.

    if (!email || !password) {
      setError('Please enter your email and password.')
      setLoading(false)
      return
    }

    setError(
      'Admin authentication has not been connected yet. We will connect Supabase next.'
    )

    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12">

      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="mb-8 text-center">

          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to website
          </Link>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Pleasantville Academy
          </h1>

          <p className="mt-2 text-slate-500">
            Administration Portal
          </p>

        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          <h2 className="text-xl font-bold text-slate-900">
            Admin Login
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage the school website.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
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
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />

            </div>

            {/* Password */}
            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />

            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Pleasantville Academy Administration
        </p>

      </div>

    </main>
  )
}
