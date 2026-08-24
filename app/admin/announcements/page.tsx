'use client'

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from 'react'
import Link from 'next/link'
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
  updated_at: string
}

export default function AdminAnnouncementsPage() {
  const supabase = createClient()

  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const [eventDate, setEventDate] = useState('')
  const [published, setPublished] = useState(true)
  const [featured, setFeatured] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const [editingId, setEditingId] = useState<number | null>(null)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadAnnouncements() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('announcements')
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
    loadAnnouncements()
  }, [])

  function resetForm() {
    setEditingId(null)
    setTitle('')
    setContent('')
    setCategory('General')
    setEventDate('')
    setPublished(true)
    setFeatured(false)
    setFile(null)

    const input = document.getElementById(
      'announcement-file'
    ) as HTMLInputElement | null

    if (input) {
      input.value = ''
    }
  }

  function editAnnouncement(item: Announcement) {
    setEditingId(item.id)
    setTitle(item.title)
    setContent(item.content)
    setCategory(item.category || 'General')
    setEventDate(item.event_date || '')
    setPublished(item.published)
    setFeatured(item.featured)
    setFile(null)

    const input = document.getElementById(
      'announcement-file'
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

    const filePath = `announcements/${fileName}`

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
      setError('Please enter an announcement title.')
      return
    }

    if (!content.trim()) {
      setError('Please enter announcement content.')
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
          content: string
          category: string
          event_date: string | null
          published: boolean
          featured: boolean
          image_url?: string
          updated_at: string
        } = {
          title: title.trim(),
          content: content.trim(),
          category,
          event_date: eventDate || null,
          published,
          featured,
          updated_at: new Date().toISOString(),
        }

        if (imageUrl) {
          updateData.image_url = imageUrl
        }

        const { error } = await supabase
          .from('announcements')
          .update(updateData)
          .eq('id', editingId)

        if (error) {
          throw error
        }

        setMessage(
          'Announcement updated successfully.'
        )
      } else {
        const { error } = await supabase
          .from('announcements')
          .insert({
            title: title.trim(),
            content: content.trim(),
            category,
            event_date: eventDate || null,
            published,
            featured,
            image_url: imageUrl,
          })

        if (error) {
          throw error
        }

        setMessage(
          'Announcement created successfully.'
        )
      }

      resetForm()
      await loadAnnouncements()
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

  async function deleteAnnouncement(
    item: Announcement
  ) {
    const confirmed = window.confirm(
      `Delete "${item.title}" permanently?`
    )

    if (!confirmed) {
      return
    }

    setMessage('')
    setError('')

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', item.id)

      if (error) {
        throw error
      }

      if (editingId === item.id) {
        resetForm()
      }

      setMessage(
        'Announcement deleted successfully.'
      )

      await loadAnnouncements()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not delete announcement.'
      )
    }
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
            Announcements
          </h1>

          <p className="mt-2 text-slate-500">
            Publish and manage school news, notices and events.
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
                  ? 'Edit Announcement'
                  : 'Create Announcement'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add important updates for parents and students.
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
                Title
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. 2026/2027 Admission Now Open"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Announcement
              </label>

              <textarea
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                rows={6}
                placeholder="Write the announcement here..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-700"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
              >
                <option>General</option>
                <option>News</option>
                <option>Admissions</option>
                <option>Events</option>
                <option>Academic</option>
                <option>Sports</option>
                <option>Notice</option>
              </select>

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

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Image (optional)
              </label>

              <input
                id="announcement-file"
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
                    : 'Publish Announcement'}
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

        {/* LIST */}

        <div className="mt-8">

          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Existing Announcements
          </h2>

          {loading ? (
            <div className="rounded-xl bg-white p-8 text-center">
              Loading announcements...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center text-slate-500">
              No announcements yet.
            </div>
          ) : (
            <div className="space-y-5">

              {items.map((item) => (

                <article
                  key={item.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >

                  <div className="flex flex-col gap-5 md:flex-row">

                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-40 w-full rounded-xl object-cover md:w-56"
                      />
                    )}

                    <div className="flex-1">

                      <div className="flex flex-wrap gap-2">

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                          {item.category}
                        </span>

                        {item.featured && (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            Featured
                          </span>
                        )}

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.published
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.published
                            ? 'Published'
                            : 'Draft'}
                        </span>

                      </div>

                      <h3 className="mt-3 text-xl font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                        {item.content}
                      </p>

                      {item.event_date && (
                        <p className="mt-3 text-sm font-medium text-slate-500">
                          Event date: {item.event_date}
                        </p>
                      )}

                      <div className="mt-4 flex gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            editAnnouncement(item)
                          }
                          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteAnnouncement(item)
                          }
                          className="rounded-lg border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

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
