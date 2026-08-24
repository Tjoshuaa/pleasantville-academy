'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Admission = {
  id: number
  child_first_name: string
  child_last_name: string
  date_of_birth: string | null
  gender: string | null
  parent_name: string
  parent_email: string
  parent_phone: string
  address: string | null
  class_applied_for: string
  previous_school: string | null
  message: string | null
  status: string
  created_at: string
  updated_at: string
}

export default function AdminAdmissionsPage() {
  const supabase = createClient()

  const [applications, setApplications] = useState<Admission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  async function loadApplications() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      setError(error.message)
    } else {
      setApplications(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadApplications()
  }, [])

  async function updateStatus(
    id: number,
    status: string
  ) {
    setError('')

    const updatedAt = new Date().toISOString()

    const { error } = await supabase
      .from('admissions')
      .update({
        status,
        updated_at: updatedAt,
      })
      .eq('id', id)

    if (error) {
      setError(error.message)
      return
    }

    setApplications((current) =>
      current.map((application) =>
        application.id === id
          ? {
              ...application,
              status,
              updated_at: updatedAt,
            }
          : application
      )
    )
  }

  async function deleteApplication(
    application: Admission
  ) {
    const confirmed = window.confirm(
      `Delete the application for ${application.child_first_name} ${application.child_last_name}? This cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setError('')

    const { error } = await supabase
      .from('admissions')
      .delete()
      .eq('id', application.id)

    if (error) {
      setError(error.message)
      return
    }

    setApplications((current) =>
      current.filter(
        (item) => item.id !== application.id
      )
    )
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  function statusClass(status: string) {
    if (status === 'pending') {
      return 'bg-yellow-100 text-yellow-700'
    }

    if (status === 'reviewing') {
      return 'bg-blue-100 text-blue-700'
    }

    if (status === 'accepted') {
      return 'bg-green-100 text-green-700'
    }

    if (status === 'rejected') {
      return 'bg-red-100 text-red-700'
    }

    return 'bg-slate-100 text-slate-600'
  }

  const total = applications.length

  const pending = applications.filter(
    (item) => item.status === 'pending'
  ).length

  const reviewing = applications.filter(
    (item) => item.status === 'reviewing'
  ).length

  const accepted = applications.filter(
    (item) => item.status === 'accepted'
  ).length

  const rejected = applications.filter(
    (item) => item.status === 'rejected'
  ).length

  const filteredApplications =
    filter === 'all'
      ? applications
      : applications.filter(
          (item) => item.status === filter
        )

  return (
    <main className="min-h-screen bg-slate-100">

      {/* Header */}

      <header className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6">

          <Link
            href="/admin"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-3xl font-bold text-slate-900">
                  Admissions
                </h1>

                {pending > 0 && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                    {pending} PENDING
                  </span>
                )}

              </div>

              <p className="mt-2 text-slate-500">
                Review and manage admission applications.
              </p>

            </div>

            <button
              type="button"
              onClick={loadApplications}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              {loading
                ? 'Refreshing...'
                : '↻ Refresh'}
            </button>

          </div>

        </div>

      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* SUMMARY */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-2xl bg-white p-6 text-left shadow-sm ${
              filter === 'all'
                ? 'ring-2 ring-slate-900'
                : ''
            }`}
          >

            <p className="text-sm font-medium text-slate-500">
              Total
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {total}
            </p>

          </button>

          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`rounded-2xl bg-white p-6 text-left shadow-sm ${
              filter === 'pending'
                ? 'ring-2 ring-yellow-500'
                : ''
            }`}
          >

            <p className="text-sm font-medium text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {pending}
            </p>

          </button>

          <button
            type="button"
            onClick={() => setFilter('reviewing')}
            className={`rounded-2xl bg-white p-6 text-left shadow-sm ${
              filter === 'reviewing'
                ? 'ring-2 ring-blue-500'
                : ''
            }`}
          >

            <p className="text-sm font-medium text-slate-500">
              Reviewing
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              {reviewing}
            </p>

          </button>

          <button
            type="button"
            onClick={() => setFilter('accepted')}
            className={`rounded-2xl bg-white p-6 text-left shadow-sm ${
              filter === 'accepted'
                ? 'ring-2 ring-green-500'
                : ''
            }`}
          >

            <p className="text-sm font-medium text-slate-500">
              Accepted
            </p>

            <p className="mt-2 text-3xl font-bold text-green-700">
              {accepted}
            </p>

          </button>

          <button
            type="button"
            onClick={() => setFilter('rejected')}
            className={`rounded-2xl bg-white p-6 text-left shadow-sm ${
              filter === 'rejected'
                ? 'ring-2 ring-red-500'
                : ''
            }`}
          >

            <p className="text-sm font-medium text-slate-500">
              Rejected
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {rejected}
            </p>

          </button>

        </div>

        {/* FILTERS */}

        <div className="mt-8 flex flex-wrap items-center gap-3">

          <span className="text-sm font-semibold text-slate-600">
            Showing:
          </span>

          {[
            ['all', 'All'],
            ['pending', 'Pending'],
            ['reviewing', 'Reviewing'],
            ['accepted', 'Accepted'],
            ['rejected', 'Rejected'],
          ].map(([value, label]) => (

            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                filter === value
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>

          ))}

        </div>

        {/* APPLICATIONS */}

        <div className="mt-6">

          {loading ? (

            <div className="rounded-2xl bg-white p-10 text-center">
              Loading applications...
            </div>

          ) : filteredApplications.length === 0 ? (

            <div className="rounded-2xl bg-white p-10 text-center">

              <div className="text-5xl">
                📝
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                No applications yet
              </h2>

              <p className="mt-2 text-slate-500">
                Admission applications submitted through
                the website will appear here.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {filteredApplications.map(
                (application) => (

                  <article
                    key={application.id}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >

                    <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

                      {/* Information */}

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-xl font-bold text-slate-900">
                            {application.child_first_name}{' '}
                            {application.child_last_name}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                              application.status
                            )}`}
                          >
                            {application.status
                              .charAt(0)
                              .toUpperCase() +
                              application.status.slice(1)}
                          </span>

                        </div>

                        <p className="mt-2 text-sm font-semibold text-green-700">
                          Class: {application.class_applied_for}
                        </p>

                        <div className="mt-4 grid gap-2 text-sm text-slate-500 md:grid-cols-2">

                          <p>
                            👨‍👩‍👧 Parent:{' '}
                            {application.parent_name}
                          </p>

                          <p>
                            ✉️ {application.parent_email}
                          </p>

                          <p>
                            📞 {application.parent_phone}
                          </p>

                          {application.gender && (
                            <p>
                              👤 Gender:{' '}
                              {application.gender}
                            </p>
                          )}

                          {application.date_of_birth && (
                            <p>
                              🎂 Date of Birth:{' '}
                              {application.date_of_birth}
                            </p>
                          )}

                          <p>
                            🕐 Applied:{' '}
                            {formatDate(
                              application.created_at
                            )}
                          </p>

                        </div>

                        {application.address && (
                          <div className="mt-5">

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Address
                            </p>

                            <p className="mt-1 text-sm text-slate-600">
                              {application.address}
                            </p>

                          </div>
                        )}

                        {application.previous_school && (
                          <div className="mt-5">

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Previous School
                            </p>

                            <p className="mt-1 text-sm text-slate-600">
                              {application.previous_school}
                            </p>

                          </div>
                        )}

                        {application.message && (
                          <div className="mt-5 rounded-xl bg-slate-50 p-5">

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Parent's Message
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                              {application.message}
                            </p>

                          </div>
                        )}

                      </div>

                      {/* Actions */}

                      <div className="flex flex-col gap-3 lg:w-48">

                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Application Status
                        </label>

                        <select
                          value={application.status}
                          onChange={(event) =>
                            updateStatus(
                              application.id,
                              event.target.value
                            )
                          }
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                        >

                          <option value="pending">
                            Pending
                          </option>

                          <option value="reviewing">
                            Reviewing
                          </option>

                          <option value="accepted">
                            Accepted
                          </option>

                          <option value="rejected">
                            Rejected
                          </option>

                        </select>

                        <a
                          href={`mailto:${application.parent_email}?subject=Admission Application - ${application.child_first_name} ${application.child_last_name}`}
                          className="rounded-lg bg-green-800 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
                        >
                          Email Parent
                        </a>

                        <a
                          href={`tel:${application.parent_phone}`}
                          className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Call Parent
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            deleteApplication(
                              application
                            )
                          }
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </div>

      </section>

    </main>
  )
}
