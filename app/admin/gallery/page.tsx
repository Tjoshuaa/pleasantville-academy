'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
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
    setFile(event.target.files?.[0] || null)
  }

  async function uploadImage(selectedFile: File) {
    const extension =
      selectedFile.name.split('.').pop()?.toLowerCase() || 'jpg'

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

    return data.publicUrl
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
      setError('Please select an image.')
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
          category: string
          featured: boolean
          image_url?: string
        } = {
          title: title.trim(),
          category,
          featured,
        }

        if (imageUrl) {
          updateData.image_url = imageUrl
        }

        const { error } = await supabase
          .from('gallery')
          .update(updateData)
          .eq('id', editingId)

        if (error) throw error

        setMessage('Gallery item updated successfully.')
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert({
            title: title.trim(),
            image_url: imageUrl,
            category,
            featured,
          })

        if (error) throw error

        setMessage('Gallery image uploaded successfully.')
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
            Upload, edit and manage Pleasantville Academy photographs.
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
                  : 'Add Gallery Image'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? 'Change the title, category or replace the image.'
                  : 'Add a new photograph to the school gallery.'}
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
                  ? 'Replace Image (optional)'
                  : 'Image'}
              </label>

              <input
                id="gallery-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-slate-300 p-3"
              />

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
                placeholder="Learning Environment"
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
                Featured image
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
                    : 'Upload Image'}
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

                    <h3 className="font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.category}
                    </p>

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
