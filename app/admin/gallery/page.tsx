'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type GalleryItem = {
  id: number
  title: string
  image_url: string | null
  category: string | null
  featured: boolean
  created_at: string
}

export default function GalleryAdminPage() {
  const supabase = createClient()

  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadGallery() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setItems(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadGallery()
  }, [])

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
            Gallery Management
          </h1>

          <p className="mt-2 text-slate-500">
            Manage Pleasantville Academy gallery images.
          </p>

        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">

        {loading && (
          <div className="rounded-xl bg-white p-8">
            Loading gallery...
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {items.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >

                <div className="h-64 bg-green-50">

                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-center">
                      <div>
                        <div className="text-4xl">📷</div>

                        <p className="mt-3 font-semibold text-green-800">
                          Photo coming soon
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                <div className="p-5">

                  <h2 className="font-bold text-lg text-slate-900">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.category}
                  </p>

                  <div className="mt-4 flex gap-2">

                    <button
                      type="button"
                      className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="flex-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </main>
  )
}
