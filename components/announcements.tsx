'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Announcement = {
  id: number
  title: string
  content: string
  category: string | null
  image_url: string | null
  event_date: string | null
  published: boolean
  featured: boolean
  created_at: string
}

export default function Announcements() {
  const supabase = createClient()

  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnnouncements() {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('published', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6)

      if (!error) {
        setItems(data || [])
      }

      setLoading(false)
    }

    loadAnnouncements()
  }, [])

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <section
      id="announcements"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="mb-12 text-center">

          <p className="font-semibold uppercase tracking-wider text-green-700">
            Stay Updated
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-800 md:text-5xl">
            School News & Announcements
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-gray-600">
            Keep up with the latest news, events, admission updates,
            and important announcements from Pleasantville Academy.
          </p>

        </div>

        {/* Loading */}

        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-2xl bg-green-50"
              />
            ))}

          </div>
        )}

        {/* Announcements */}

        {!loading && items.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {items.map((item) => (

              <article
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Image */}

                {item.image_url ? (
                  <div className="h-56 overflow-hidden">

                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center bg-green-50">

                    <span className="text-4xl">
                      📰
                    </span>

                  </div>
                )}

                {/* Content */}

                <div className="p-6">

                  <div className="flex flex-wrap gap-2">

                    {item.category && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        {item.category}
                      </span>
                    )}

                    {item.featured && (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        Featured
                      </span>
                    )}

                  </div>

                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-600">
                    {item.content}
                  </p>

                  {item.event_date && (
                    <div className="mt-4 border-t pt-4">

                      <p className="text-sm font-semibold text-green-800">
                        Event Date
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(item.event_date)}
                      </p>

                    </div>
                  )}

                  <p className="mt-4 text-xs text-gray-400">
                    Published {formatDate(item.created_at)}
                  </p>

                </div>

              </article>

            ))}

          </div>
        )}

        {/* No announcements */}

        {!loading && items.length === 0 && (
          <div className="rounded-2xl bg-green-50 p-10 text-center">

            <div className="text-4xl">
              📰
            </div>

            <h3 className="mt-4 text-xl font-bold text-green-800">
              No announcements at the moment
            </h3>

            <p className="mt-2 text-gray-600">
              Check back soon for the latest news and updates
              from Pleasantville Academy.
            </p>

          </div>
        )}

      </div>
    </section>
  )
}
