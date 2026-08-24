'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type EventItem = {
  id: number
  title: string
  description: string
  event_date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  image_url: string | null
  featured: boolean
}

export default function Events() {
  const supabase = createClient()

  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('featured', { ascending: false })
        .order('event_date', { ascending: true })
        .limit(6)

      if (!error) {
        setEvents(data || [])
      }

      setLoading(false)
    }

    loadEvents()
  }, [])

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-NG', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  function formatTime(time: string | null) {
    if (!time) return ''

    const [hours, minutes] = time.split(':')
    const date = new Date()

    date.setHours(Number(hours), Number(minutes), 0, 0)

    return date.toLocaleTimeString('en-NG', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <section
      id="events"
      className="bg-gray-50 py-20"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="mb-12 text-center">

          <p className="font-semibold uppercase tracking-wider text-green-700">
            What's Happening
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-800 md:text-5xl">
            Upcoming Events
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-gray-600">
            Stay informed about upcoming activities, meetings,
            celebrations, and important events at Pleasantville Academy.
          </p>

        </div>

        {/* Loading */}

        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-2xl bg-white"
              />
            ))}

          </div>
        )}

        {/* Events */}

        {!loading && events.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {events.map((event) => (

              <article
                key={event.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                {event.image_url ? (
                  <div className="h-56 overflow-hidden">

                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center bg-green-100">

                    <span className="text-5xl">
                      📅
                    </span>

                  </div>
                )}

                <div className="p-6">

                  {event.featured && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      Featured Event
                    </span>
                  )}

                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    {event.title}
                  </h3>

                  <div className="mt-4 space-y-2">

                    <p className="text-sm font-semibold text-green-800">
                      📅 {formatDate(event.event_date)}
                    </p>

                    {(event.start_time || event.end_time) && (
                      <p className="text-sm text-gray-600">
                        🕐 {formatTime(event.start_time)}
                        {event.start_time && event.end_time
                          ? ' – '
                          : ''}
                        {formatTime(event.end_time)}
                      </p>
                    )}

                    {event.location && (
                      <p className="text-sm text-gray-600">
                        📍 {event.location}
                      </p>
                    )}

                  </div>

                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-gray-600">
                    {event.description}
                  </p>

                </div>

              </article>

            ))}

          </div>
        )}

        {/* Empty state */}

        {!loading && events.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              📅
            </div>

            <h3 className="mt-4 text-xl font-bold text-green-800">
              No upcoming events
            </h3>

            <p className="mt-2 text-gray-600">
              Check back soon for upcoming activities and events.
            </p>

          </div>
        )}

      </div>
    </section>
  )
}
