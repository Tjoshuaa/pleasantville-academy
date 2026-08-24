'use client'

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type GalleryItem = {
  id: number
  title: string
  image_url: string | null
  category: string | null
  featured: boolean
  media_type: 'image' | 'video'
  created_at: string
}

export default function GalleryAdminPage() {
  const supabase = createClient()

  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('School Life')
  const [featured, setFeatured] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const [editingId, setEditingId] = useState<number | null>(null)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadGallery() {
    setLoading(true)

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

  function resetForm() {
    setEditingId(null)
    setTitle('')
    setCategory('School Life')
    setFeatured(false)
    setFile(null)

    const input = document.getElementById(
      'gallery-file'
    ) as HTMLInputElement | null

    if (input) input.value = ''
  }

  function editItem(item: GalleryItem) {
    setEditingId(item.id)
    setTitle(item.title)
    setCategory(item.category || 'School Life')
    setFeatured(item.featured)
    setFile(null)

    const input = document.getElementById(
      'gallery-file'
    ) as HTMLInputElement | null

    if (input) input.value = ''

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
    const selectedFile =
      event.target.files?.[0] || null

    setFile(selectedFile)
  }

  function getMediaType(selectedFile: File) {
    if (selectedFile.type.startsWith('video/')) {
      return 'video' as const
    }

    return 'image' as const
  }

  async function uploadMedia(selectedFile: File) {
    const extension =
      selectedFile.name
        .split('.')
        .pop()
        ?.toLowerCase() || 'jpg'

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${extension}`

    const filePath = `gallery/${fileName}`

    const { error } = await supabase.storage
      .from('gallery')
      .upload(filePath, selectedFile)

    if (error) throw error

    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath)

    return {
      url: data.publicUrl,
      mediaType: getMediaType(selectedFile),
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setMessage('')
    setError('')

    if (!title.trim()) {
      setError('Please enter a title.')
      return
    }

    if (!editingId && !file) {
      setError('Please select an image or video.')
      return
    }

    setSaving(true)

    try {
      let mediaUrl: string | null = null
      let mediaType: 'image' | 'video' = 'image'

      if (file) {
        const uploaded = await uploadMedia(file)

        mediaUrl = uploaded.url
        mediaType = uploaded.mediaType
      }

      if (editingId) {
        const updateData: {
          title: string
          category: string
          featured: boolean
          image_url?: string
          media_type?: 'image' | 'video'
        } = {
          title: title.trim(),
          category,
          featured,
        }

        if (mediaUrl) {
          updateData.image_url = mediaUrl
          updateData.media_type = mediaType
        }

        const { error } = await supabase
          .from('gallery')
          .update(updateData)
          .eq('id', editingId)

        if (error) throw error

        setMessage(
          'Gallery item updated successfully.'
        )
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert({
            title: title.trim(),
            image_url: mediaUrl,
            category,
            featured,
            media_type: mediaType,
          })

        if (error) throw error

        setMessage(
          mediaType === 'video'
            ? 'Gallery video uploaded successfully.'
            : 'Gallery image uploaded successfully.'
        )
      }

      resetForm()
      await loadGallery()
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

  async function deleteItem(item: GalleryItem) {
    const confirmed = window.confirm(
      `Delete "${item.title}"?`
    )

    if (!confirmed) return

    setMessage('')
    setError('')

    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', item.id)

      if (error) throw error

      if (editingId === item.id) {
        resetForm()
      }

      setMessage('Gallery item deleted.')

      await loadGallery()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not delete gallery item.'
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
            Gallery Management
          </h1>

          <p className="mt-2 text-slate-500">
            Upload, edit and manage Pleasantville Academy
            photographs and videos.
          </p>

        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                {editingId
                  ? 'Edit Gallery Item'
                  : 'Add Gallery Media'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? 'Change the title, category or replace the image/video.'
                  : 'Add a new photograph or video to the school gallery.'}
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
                {editingId
                  ? 'Replace Image or Video (optional)'
                  : 'Image or Video'}
              </label>

              <input
                id="gallery-file"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-slate-300 p-3"
              />

              <p className="mt-2 text-xs text-slate-500">
                You can upload JPG, PNG, WEBP and other
                supported image formats, as well as MP4,
                WebM and other browser-supported video formats.
              </p>

              {file && (
                <p className="mt-2 text-sm font-medium text-green-700">
                  Selected: {file.name}
                </p>
              )}

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Title
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="School Marching Day"
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
                <option>School Life</option>
                <option>Classroom</option>
                <option>Sports</option>
                <option>Events</option>
                <option>Activities</option>
                <option>Campus</option>
              </select>

            </div>

            <label className="flex items-center gap-3 md:col-span-2">

              <input
                type="checkbox"
                checked={featured}
                onChange={(event) =>
                  setFeatured(event.target.checked)
                }
              />

              <span className="text-sm font-medium text-slate-700">
                Featured media
              </span>

            </label>

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
                    : 'Upload Media'}
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

        <div className="mt-8">

          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Current Gallery
          </h2>

          {loading ? (
            <div className="rounded-xl bg-white p-8 text-center">
              Loading...
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {items.map((item) => (

                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >

                  <div className="relative h-64 bg-slate-900">

                    {item.media_type === 'video' ? (
                      <>
                        <video
                          src={item.image_url || undefined}
                          controls
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />

                        <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                          🎥 Video
                        </span>
                      </>
                    ) : item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-center">
                        <div>
                          <div className="text-4xl">
                            📷
                          </div>

                          <p className="mt-3 font-semibold text-green-800">
                            Photo coming soon
                          </p>
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h3 className="font-bold text-slate-900">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.category}
                        </p>

                      </div>

                      {item.featured && (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-700">
                          Featured
                        </span>
                      )}

                    </div>

                    <div className="mt-4 flex gap-2">

                      <button
                        type="button"
                        onClick={() => editItem(item)}
                        className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteItem(item)}
                        className="flex-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
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
