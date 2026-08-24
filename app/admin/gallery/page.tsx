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

export default function AdminGalleryPage() {
  const supabase = createClient()

  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('School Life')
  const [featured, setFeatured] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const [editingId, setEditingId] = useState<number | null>(null)

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

  function resetForm() {
    setTitle('')
    setCategory('School Life')
    setFeatured(false)
    setFile(null)
    setEditingId(null)

    const input = document.getElementById(
      'gallery-file'
    ) as HTMLInputElement | null

    if (input) {
      input.value = ''
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] || null
    setFile(selectedFile)
  }

  function startEditing(item: GalleryItem) {
    setEditingId(item.id)
    setTitle(item.title)
    setCategory(item.category || 'School Life')
    setFeatured(item.featured)
    setFile(null)

    const input = document.getElementById(
      'gallery-file'
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

  async function uploadImage(
    selectedFile: File
  ): Promise<string> {
    const fileExtension =
      selectedFile.name.split('.').pop()?.toLowerCase() || 'jpg'

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExtension}`

    const filePath = `gallery/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath)

    return publicUrl
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setMessage('')
    setError('')

    if (!title.trim()) {
      setError('Please enter a title.')
      return
    }

    setSaving(true)

    try {
      let imageUrl: string | null = null

      if (file) {
        setUploading(true)
        imageUrl = await uploadImage(file)
        setUploading(false)
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

        const { error: updateError } = await supabase
          .from('gallery')
          .update(updateData)
          .eq('id', editingId)

        if (updateError) {
          throw updateError
        }

        setMessage('Gallery item updated successfully.')
      } else {
        if (!imageUrl) {
          setError('Please select an image when creating a new gallery item.')
          setSaving(false)
          return
        }

        const { error: insertError } = await supabase
          .from('gallery')
          .insert({
            title: title.trim(),
            image_url: imageUrl,
            category,
            featured,
          })

        if (insertError) {
          throw insertError
        }

        setMessage('Gallery image uploaded successfully.')
      }

      resetForm()
      await loadGallery()
    } catch (err) {
      setUploading(false)

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.'
      )
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  async function deleteImage(item: GalleryItem) {
    const confirmed = window.confirm(
      `Delete "${item.title}" permanently?`
    )

    if (!confirmed) return

    setMessage('')
    setError('')

    try {
      const { error: databaseError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', item.id)

      if (databaseError) {
        throw databaseError
      }

      if (item.image_url) {
        const marker =
          '/storage/v1/object/public/gallery/'

        if (item.image_url.includes(marker)) {
          const filePath = decodeURIComponent(
            item.image_url.split(marker)[1]
          )

          await supabase.storage
            .from('gallery')
            .remove([filePath])
        }
      }

      if (editingId === item.id) {
        resetForm()
      }

      setMessage('Gallery item deleted.')

      await loadGallery()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while deleting.'
      )
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>

            <Link
              href="/admin"
              className="text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Gallery Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Upload and manage Pleasantville Academy photographs.
            </p>

          </div>

          <Link
            href="/"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View Website
          </Link>

        </div>

      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">

        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                {editingId
                  ? 'Edit Gallery Item'
                  : 'Add Gallery Image'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? 'Update this gallery item below.'
                  : 'Upload a new school photograph.'}
              </p>

            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Cancel Edit
              </button>
            )}

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 lg:grid-cols-2"
          >

            <div className="lg:col-span-2">

              <label
                htmlFor="gallery-file"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                {editingId
                  ? 'Replace Image (optional)'
                  : 'Image'}
              </label>

              <input
                id="gallery-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"
              />

              {file && (
                <p className="mt-2 text-sm text-slate-500">
                  Selected: {file.name}
                </p>
              )}

            </div>

            <div>

              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Learning Environment"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />

            </div>

            <div>

              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                <option>School Life</option>
                <option>Classroom</option>
                <option>Sports</option>
                <option>Events</option>
                <option>Activities</option>
                <option>Campus</option>
              </select>

            </div>

            <div className="flex items-center gap-3 lg:col-span-2">

              <input
                id="featured"
                type="checkbox"
                checked={featured}
                onChange={(event) =>
                  setFeatured(event.target.checked)
                }
                className="h-4 w-4"
              />

              <label
                htmlFor="featured"
                className="text-sm font-medium text-slate-700"
              >
                Feature this image
              </label>

            </div>

            <div className="flex gap-3 lg:col-span-2">

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? uploading
                    ? 'Uploading...'
                    : 'Saving...'
                  : editingId
                    ? 'Save Changes'
                    : 'Upload Image'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}

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

        </section>

        <section className="mt-8">

          <div className="mb-5">

            <h2 className="text-lg font-bold text-slate-900">
              Gallery Images
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {items.length} image
              {items.length === 1 ? '' : 's'}
            </p>

          </div>

          {loading ? (
            <div className="rounded-2xl bg-white p-10 text-center text-slate-500">
              Loading gallery...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center text-slate-500">
              No gallery images yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {items.map((item) => (

                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >

                  <div className="relative aspect-[4/3] bg-green-50">

                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-6 text-center">

                        <div>

                          <div className="text-4xl">
                            📷
                          </div>

                          <p className="mt-3 font-semibold text-green-800">
                            Photo coming soon
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Edit this item to upload a photograph.
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

                        <p className="mt-1 text-xs text-slate-500">
                          {item.category}
                        </p>

                      </div>

                      {item.featured && (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
                          Featured
                        </span>
                      )}

                    </div>

                    <div className="mt-4 flex gap-2">

                      <button
                        type="button"
                        onClick={() => startEditing(item)}
                        className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteImage(item)}
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

        </section>

      </div>

    </main>
  )
}
