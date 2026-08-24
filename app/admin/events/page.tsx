'use client'

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from 'react'
import Link from 'next/link'
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
  published: boolean
  featured: boolean
  created_at: string
  updated_at: string
}

export default function AdminEventsPage() {
  const supabase = createClient()

  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [location, setLocation] = useState('')
  const [published, setPublished] = useState(true)
  const [featured, setFeatured] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const [editingId, setEditingId] = useState<number | null>(null)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadEvents() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setEvents(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadEvents()
  }, [])

  function resetForm() {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setEventDate('')
    setStartTime('')
    setEndTime('')
    setLocation('')
    setPublished(true)
    setFeatured(false)
    setFile(null)

    const input = document.getElementById(
      'event-file'
    ) as HTMLInputElement | null

    if (input) {
      input.value = ''
    }
  }

  function editEvent(event: EventItem) {
    setEditingId(event.id)
    setTitle(event.title)
    setDescription(event.description)
    setEventDate(event.event_date)
    setStartTime(event.start_time || '')
    setEndTime(event.end_time || '')
    setLocation(event.location || '')
    setPublished(event.published)
    setFeatured(event.featured)
    setFile(null)

    const input = document.getElementById(
      'event-file'
    ) as HTMLInputElement | null

    if (input) {
      input.value = ''
    }

    setMessage('')
    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setFile(event.target.files?.[0] || null)
  }

  async function uploadImage(selectedFile: File) {
    const extension =
      selectedFile.name.split('.').pop()?.toLowerCase() || 'jpg'

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${extension}`

    const filePath = `events/${fileName}`

    const { error } = await supabase.storage
      .from('gallery')
      .upload(filePath, selectedFile)

    if (error) {
      throw error
    }

    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setMessage('')
    setError('')

    if (!title.trim()) {
      setError('Please enter an event title.')
      return
    }

    if (!description.trim()) {
      setError('Please enter an event description.')
      return
    }

    if (!eventDate) {
      setError('Please select an event date.')
      return
    }

    setSaving(true)

    try {
      let imageUrl: string | null = null

      if (file) {
        imageUrl = await uploadImage(file)
      }

      if (editingId) {
        const updateData: {
          title: string
          description: string
          event_date: string
          start_time: string | null
          end_time: string | null
          location: string | null
          published: boolean
          featured: boolean
          image_url?: string
          updated_at: string
        } = {
          title: title.trim(),
          description: description.trim(),
          event_date: eventDate,
          start_time: startTime || null,
          end_time: endTime || null,
          location: location.trim() || null,
          published,
          featured,
          updated_at: new Date().toISOString(),
        }

        if (imageUrl) {
          updateData.image_url = imageUrl
        }

        const { error } = await supabase
          .from('events')
          .update(updateData)
          .eq('id', editingId)

        if (error) {
          throw error
        }

        setMessage('Event updated successfully.')
      } else {
        const { error } = await supabase
          .from('events')
          .insert({
            title: title.trim(),
            description: description.trim(),
            event_date: eventDate,
            start_time: startTime || null,
            end_time: endTime || null,
            location: location.trim() || null,
            image_url: imageUrl,
            published,
            featured,
          })

        if (error) {
          throw error
        }

        setMessage('Event created successfully.')
      }

      resetForm()
      await loadEvents()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function deleteEvent(event: EventItem) {
    const confirmed = window.confirm(
      `Delete "${event.title}" permanently?`
    )

    if (!confirmed) {
      return
    }

    setMessage('')
    setError('')

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id)

      if (error) {
        throw error
      }

      if (editingId === event.id) {
        resetForm()
      }

      setMessage('Event deleted successfully.')

      await loadEvents()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not delete event.'
      )
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
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
            Events Management
          </h1>

          <p className="mt-2 text-slate-500">
            Manage upcoming school events and activities.
          </p>

        </div>

      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* FORM */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                {editingId
                  ? 'Edit Event'
                  : 'Create Event'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add school events for parents and students.
              </p>

            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Cancel
              </button>
            )}

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Event Title
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Pleasantville Academy Open Day"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={5}
                placeholder="Describe the event..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Event Date
              </label>

              <input
                type="date"
                value={eventDate}
                onChange={(event) =>
                  setEventDate(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Location
              </label>

              <input
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="e.g. Pleasantville Academy"
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Start Time
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(event) =>
                  setStartTime(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                End Time
              </label>

              <input
                type="time"
                value={endTime}
                onChange={(event) =>
                  setEndTime(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Event Image (optional)
              </label>

              <input
                id="event-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-slate-300 p-3"
              />

            </div>

            <div className="flex flex-wrap gap-6 md:col-span-2">

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={published}
                  onChange={(event) =>
                    setPublished(event.target.checked)
                  }
                />

                <span className="text-sm font-medium text-slate-700">
                  Published
                </span>

              </label>

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) =>
                    setFeatured(event.target.checked)
                  }
                />

                <span className="text-sm font-medium text-slate-700">
                  Featured
                </span>

              </label>

            </div>

            <div className="md:col-span-2">

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-green-800 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Save Changes'
                    : 'Create Event'}
              </button>

            </div>

          </form>

          {message && (
            <div className="mt-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

        </div>

        {/* EVENTS */}

        <div className="mt-8">

          <h2 className="mb-5 text-xl font-bold text-slate-900">
            School Events
          </h2>

          {loading ? (
            <div className="rounded-xl bg-white p-8 text-center">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center text-slate-500">
              No events yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">

              {events.map((event) => (

                <article
                  key={event.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >

                  {event.image_url && (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="h-56 w-full object-cover"
                    />
                  )}

                  <div className="p-6">

                    <div className="flex flex-wrap gap-2">

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        {formatDate(event.event_date)}
                      </span>

                      {event.featured && (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                          Featured
                        </span>
                      )}

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          event.published
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {event.published
                          ? 'Published'
                          : 'Draft'}
                      </span>

                    </div>

                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                      {event.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {event.description}
                    </p>

                    {event.location && (
                      <p className="mt-4 text-sm font-medium text-slate-500">
                        📍 {event.location}
                      </p>
                    )}

                    {(event.start_time || event.end_time) && (
                      <p className="mt-2 text-sm font-medium text-slate-500">
                        🕐 {event.start_time || ''}
                        {event.start_time && event.end_time
                          ? ' – '
                          : ''}
                        {event.end_time || ''}
                      </p>
                    )}

                    <div className="mt-5 flex gap-3">

                      <button
                        type="button"
                        onClick={() => editEvent(event)}
                        className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteEvent(event)}
                        className="rounded-lg border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
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
