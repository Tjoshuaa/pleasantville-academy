'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Enquiry = {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: string
  created_at: string
  updated_at: string
}

export default function AdminEnquiriesPage() {
  const supabase = createClient()

  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  async function loadEnquiries() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setEnquiries(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadEnquiries()
  }, [])

  async function updateStatus(
    id: number,
    status: string
  ) {
    setError('')

    const updatedAt = new Date().toISOString()

    const { error } = await supabase
      .from('enquiries')
      .update({
        status,
        updated_at: updatedAt,
      })
      .eq('id', id)

    if (error) {
      setError(error.message)
      return
    }

    setEnquiries((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              updated_at: updatedAt,
            }
          : item
      )
    )
  }

  async function deleteEnquiry(enquiry: Enquiry) {
    const confirmed = window.confirm(
      `Delete the enquiry from ${enquiry.name}? This cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setError('')

    const { error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', enquiry.id)

    if (error) {
      setError(error.message)
      return
    }

    setEnquiries((current) =>
      current.filter((item) => item.id !== enquiry.id)
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
    if (status === 'new') {
      return 'bg-blue-100 text-blue-700'
    }

    if (status === 'read') {
      return 'bg-yellow-100 text-yellow-700'
    }

    if (status === 'replied') {
      return 'bg-green-100 text-green-700'
    }

    return 'bg-slate-100 text-slate-600'
  }

  const total = enquiries.length

  const newCount = enquiries.filter(
    (item) => item.status === 'new'
  ).length

  const readCount = enquiries.filter(
    (item) => item.status === 'read'
  ).length

  const repliedCount = enquiries.filter(
    (item) => item.status === 'replied'
  ).length

  const filteredEnquiries =
    filter === 'all'
      ? enquiries
      : enquiries.filter(
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
                  Enquiries
                </h1>

                {newCount > 0 && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                    {newCount} NEW
                  </span>
                )}

              </div>

              <p className="mt-2 text-slate-500">
                Manage messages and enquiries submitted through the website.
              </p>

            </div>

            <button
              type="button"
              onClick={loadEnquiries}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : '↻ Refresh'}
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-2xl bg-white p-6 text-left shadow-sm transition hover:shadow-md ${
              filter === 'all'
                ? 'ring-2 ring-slate-900'
                : ''
            }`}
          >

            <p className="text-sm font-medium text-slate-500">
              Total Enquiries
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {total}
            </p>

            <p className="mt-2 text-xs font-semibold text-slate-400">
              View all
            </p>

          </button>

          <button
            type="button"
            onClick={() => setFilter('new')}
            className={`rounded-2xl bg-white p-6 text-left shadow-sm transition hover:shadow-md ${
              filter === 'new'
                ? 'ring-2 ring-blue-500'
                : ''
            }`}
          >

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-slate-500">
                New
              </p>

              {newCount > 0 && (
                <span className="h-3 w-3 animate-pulse rounded-full bg-blue-500" />
              )}

            </div>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              {newCount}
            </p>

            <p className="mt-2 text-xs font-semibold text-slate-400">
              Needs attention
            </p>

          </button>

          <button
            type="button"
            onClick={() => setFilter('read')}
            className={`rounded-2xl bg-white p-6 text-left shadow-sm transition hover:shadow-md ${
              filter === 'read'
                ? 'ring-2 ring-yellow-500'
                : ''
            }`}
          >

            <p className="text-sm font-medium text-slate-500">
              Read
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {readCount}
            </p>

            <p className="mt-2 text-xs font-semibold text-slate-400">
              Viewed enquiries
            </p>

          </button>

          <button
            type="button"
            onClick={() => setFilter('replied')}
            className={`rounded-2xl bg-white p-6 text-left shadow-sm transition hover:shadow-md ${
              filter === 'replied'
                ? 'ring-2 ring-green-500'
                : ''
            }`}
          >

            <p className="text-sm font-medium text-slate-500">
              Replied
            </p>

            <p className="mt-2 text-3xl font-bold text-green-700">
              {repliedCount}
            </p>

            <p className="mt-2 text-xs font-semibold text-slate-400">
              Completed enquiries
            </p>

          </button>

        </div>

        {/* FILTER */}

        <div className="mt-8 flex flex-wrap items-center gap-3">

          <span className="text-sm font-semibold text-slate-600">
            Showing:
          </span>

          {[
            ['all', 'All'],
            ['new', 'New'],
            ['read', 'Read'],
            ['replied', 'Replied'],
          ].map(([value, label]) => (

            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === value
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>

          ))}

        </div>

        {/* ENQUIRIES */}

        <div className="mt-6">

          {loading ? (

            <div className="rounded-2xl bg-white p-10 text-center">
              Loading enquiries...
            </div>

          ) : filteredEnquiries.length === 0 ? (

            <div className="rounded-2xl bg-white p-10 text-center">

              <div className="text-5xl">
                📩
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {filter === 'all'
                  ? 'No enquiries yet'
                  : `No ${filter} enquiries`}
              </h2>

              <p className="mt-2 text-slate-500">
                Messages submitted through the website will appear here.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {filteredEnquiries.map((enquiry) => (

                <article
                  key={enquiry.id}
                  className={`rounded-2xl bg-white p-6 shadow-sm ${
                    enquiry.status === 'new'
                      ? 'border-l-4 border-blue-500'
                      : ''
                  }`}
                >

                  <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-xl font-bold text-slate-900">
                          {enquiry.name}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                            enquiry.status
                          )}`}
                        >
                          {enquiry.status
                            .charAt(0)
                            .toUpperCase() +
                            enquiry.status.slice(1)}
                        </span>

                        {enquiry.status === 'new' && (
                          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                            NEW
                          </span>
                        )}

                      </div>

                      {enquiry.subject && (
                        <h3 className="mt-3 font-semibold text-slate-800">
                          {enquiry.subject}
                        </h3>
                      )}

                      <div className="mt-3 space-y-1 text-sm text-slate-500">

                        <p>
                          ✉️ {enquiry.email}
                        </p>

                        {enquiry.phone && (
                          <p>
                            📞 {enquiry.phone}
                          </p>
                        )}

                        <p>
                          🕐 {formatDate(enquiry.created_at)}
                        </p>

                      </div>

                      <div className="mt-5 rounded-xl bg-slate-50 p-5">

                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                          {enquiry.message}
                        </p>

                      </div>

                    </div>

                    {/* Actions */}

                    <div className="flex flex-col gap-3 lg:w-48">

                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </label>

                      <select
                        value={enquiry.status}
                        onChange={(event) =>
                          updateStatus(
                            enquiry.id,
                            event.target.value
                          )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      >

                        <option value="new">
                          New
                        </option>

                        <option value="read">
                          Read
                        </option>

                        <option value="replied">
                          Replied
                        </option>

                      </select>

                      <a
                        href={`mailto:${enquiry.email}?subject=Re: ${
                          enquiry.subject || 'Your enquiry'
                        }`}
                        onClick={() =>
                          updateStatus(
                            enquiry.id,
                            'replied'
                          )
                        }
                        className="rounded-lg bg-green-800 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
                      >
                        Reply by Email
                      </a>

                      {enquiry.phone && (
                        <a
                          href={`tel:${enquiry.phone}`}
                          className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Call
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          deleteEnquiry(enquiry)
                        }
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>

      </section>

    </main>
  )
}
