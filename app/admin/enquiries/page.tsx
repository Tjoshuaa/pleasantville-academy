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

    const { error } = await supabase
      .from('enquiries')
      .update({
        status,
        updated_at: new Date().toISOString(),
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
              updated_at: new Date().toISOString(),
            }
          : item
      )
    )
  }

  async function deleteEnquiry(enquiry: Enquiry) {
    const confirmed = window.confirm(
      `Delete the enquiry from ${enquiry.name}?`
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

  return (
    <main className="min-h-screen bg-slate-100">

      <header className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6">

          <Link
            href="/admin"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Enquiries
          </h1>

          <p className="mt-2 text-slate-500">
            Manage messages and enquiries submitted through the website.
          </p>

        </div>

      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* SUMMARY */}

        <div className="mb-8 grid gap-5 sm:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Total Enquiries
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {enquiries.length}
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              New
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              {
                enquiries.filter(
                  (item) => item.status === 'new'
                ).length
              }
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Replied
            </p>

            <p className="mt-2 text-3xl font-bold text-green-700">
              {
                enquiries.filter(
                  (item) => item.status === 'replied'
                ).length
              }
            </p>

          </div>

        </div>

        {/* ENQUIRIES */}

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            Loading enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center">

            <div className="text-5xl">
              📩
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No enquiries yet
            </h2>

            <p className="mt-2 text-slate-500">
              Messages submitted through the website will appear here.
            </p>

          </div>
        ) : (
          <div className="space-y-5">

            {enquiries.map((enquiry) => (

              <article
                key={enquiry.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
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

      </section>

    </main>
  )
}
