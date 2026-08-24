'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Teacher = {
  id: number
  created_at: string
  full_name: string
  role: string | null
  subject: string | null
  qualification: string | null
  phone: string | null
  email: string | null
  address: string | null
  bio: string | null
  photo_url: string | null
}

export default function TeachersAdminPage() {
  const supabase = createClient()

  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedTeacher, setSelectedTeacher] =
    useState<Teacher | null>(null)

  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('')
  const [subject, setSubject] = useState('')
  const [qualification, setQualification] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [bio, setBio] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadTeachers() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
      setTeachers([])
    } else {
      setTeachers(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadTeachers()
  }, [])

  function resetForm() {
    setEditingId(null)
    setFullName('')
    setRole('')
    setSubject('')
    setQualification('')
    setPhone('')
    setEmail('')
    setAddress('')
    setBio('')
    setPhotoUrl('')
    setShowForm(false)
  }

  function startAddTeacher() {
    setMessage('')
    setError('')
    resetForm()
    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function startEditTeacher(teacher: Teacher) {
    setMessage('')
    setError('')

    setEditingId(teacher.id)
    setFullName(teacher.full_name)
    setRole(teacher.role || '')
    setSubject(teacher.subject || '')
    setQualification(teacher.qualification || '')
    setPhone(teacher.phone || '')
    setEmail(teacher.email || '')
    setAddress(teacher.address || '')
    setBio(teacher.bio || '')
    setPhotoUrl(teacher.photo_url || '')

    setSelectedTeacher(null)
    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setMessage('')
    setError('')

    if (!fullName.trim()) {
      setError('Please enter the teacher or staff member name.')
      return
    }

    setSaving(true)

    try {
      const teacherData = {
        full_name: fullName.trim(),
        role: role.trim() || null,
        subject: subject.trim() || null,
        qualification: qualification.trim() || null,
        phone: phone.trim() || null,
        email: email.trim() || null,
        address: address.trim() || null,
        bio: bio.trim() || null,
        photo_url: photoUrl.trim() || null,
      }

      if (editingId !== null) {
        const { error } = await supabase
          .from('teachers')
          .update(teacherData)
          .eq('id', editingId)

        if (error) throw error

        setMessage(
          'Teacher or staff member updated successfully.'
        )
      } else {
        const { error } = await supabase
          .from('teachers')
          .insert(teacherData)

        if (error) throw error

        setMessage(
          'Teacher or staff member added successfully.'
        )
      }

      resetForm()
      await loadTeachers()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while saving.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function deleteTeacher(teacher: Teacher) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${teacher.full_name}?`
    )

    if (!confirmed) return

    setMessage('')
    setError('')

    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', teacher.id)

      if (error) throw error

      if (selectedTeacher?.id === teacher.id) {
        setSelectedTeacher(null)
      }

      if (editingId === teacher.id) {
        resetForm()
      }

      setMessage(
        'Teacher or staff member deleted successfully.'
      )

      await loadTeachers()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not delete this teacher.'
      )
    }
  }

  const filteredTeachers = teachers.filter((teacher) => {
    const searchText = search.toLowerCase().trim()

    if (!searchText) return true

    return [
      teacher.full_name,
      teacher.role,
      teacher.subject,
      teacher.qualification,
      teacher.phone,
      teacher.email,
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(searchText)
      )
  })

  return (
    <main className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">

          <Link
            href="/admin"
            className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-green-800"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                  👩‍🏫
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Teachers & Staff
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage your school's teaching and support staff.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={startAddTeacher}
              className="rounded-xl bg-green-800 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md"
            >
              + Add Teacher / Staff
            </button>

          </div>

        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* MESSAGES */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* SUMMARY */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Staff
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? '...' : teachers.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Teaching Staff
            </p>

            <p className="mt-2 text-3xl font-bold text-green-800">
              {loading
                ? '...'
                : teachers.filter((teacher) =>
                    teacher.role
                      ?.toLowerCase()
                      .includes('teacher')
                  ).length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Showing
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading
                ? '...'
                : filteredTeachers.length}
            </p>
          </div>

        </div>

        {/* FORM */}

        {showForm && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                    Staff Management
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {editingId !== null
                      ? 'Edit Staff Member'
                      : 'Add New Staff Member'}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the staff member's professional information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-white hover:text-slate-900"
                >
                  Cancel
                </button>

              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-6 p-6 md:grid-cols-2"
            >

              {/* PERSONAL */}

              <div className="md:col-span-2">
                <h3 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-green-800">
                  Personal & Professional Information
                </h3>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name *
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  placeholder="Full name"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Role / Position
                </label>

                <input
                  type="text"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value)
                  }
                  placeholder="e.g. Mathematics Teacher"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Subject
                </label>

                <input
                  type="text"
                  value={subject}
                  onChange={(event) =>
                    setSubject(event.target.value)
                  }
                  placeholder="e.g. Mathematics"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Qualification
                </label>

                <input
                  type="text"
                  value={qualification}
                  onChange={(event) =>
                    setQualification(event.target.value)
                  }
                  placeholder="e.g. B.Ed, M.Ed"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* CONTACT */}

              <div className="mt-2 md:col-span-2">
                <h3 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-green-800">
                  Contact Information
                </h3>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="Phone number"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Email address"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Address
                </label>

                <input
                  type="text"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="Home address"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* PROFILE */}

              <div className="mt-2 md:col-span-2">
                <h3 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-green-800">
                  Profile
                </h3>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Photo URL
                </label>

                <input
                  type="url"
                  value={photoUrl}
                  onChange={(event) =>
                    setPhotoUrl(event.target.value)
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  You can add image upload/storage later. For now,
                  enter the public image URL.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Biography
                </label>

                <textarea
                  value={bio}
                  onChange={(event) =>
                    setBio(event.target.value)
                  }
                  placeholder="Short professional biography..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* ACTIONS */}

              <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5 md:col-span-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingId !== null
                      ? 'Save Changes'
                      : 'Add Staff Member'}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* SEARCH */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Search Teachers & Staff
          </label>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by name, role, subject, qualification, phone or email..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
          />

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{' '}
              <span className="font-semibold text-slate-900">
                {filteredTeachers.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-900">
                {teachers.length}
              </span>{' '}
              staff members
            </p>
          </div>

        </div>

        {/* LIST */}

        {loading ? (

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-green-700" />

            <p className="mt-4 font-semibold text-slate-700">
              Loading teachers & staff...
            </p>
          </div>

        ) : filteredTeachers.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="text-5xl">
              👩‍🏫
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              {teachers.length === 0
                ? 'No staff members yet'
                : 'No staff members found'}
            </h2>

            <p className="mt-2 text-slate-500">
              {teachers.length === 0
                ? 'Add your first teacher or staff member to get started.'
                : 'Try changing your search.'}
            </p>

            {teachers.length === 0 && (
              <button
                type="button"
                onClick={startAddTeacher}
                className="mt-5 rounded-xl bg-green-800 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                + Add Teacher / Staff
              </button>
            )}

          </div>

        ) : (

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredTeachers.map((teacher) => (

              <article
                key={teacher.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                {/* CARD TOP */}

                <div className="border-b border-slate-100 bg-gradient-to-br from-green-50 to-slate-50 p-6">

                  <div className="flex items-start gap-4">

                    {teacher.photo_url ? (

                      <img
                        src={teacher.photo_url}
                        alt={teacher.full_name}
                        className="h-16 w-16 shrink-0 rounded-2xl object-cover shadow-sm"
                      />

                    ) : (

                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-800 text-3xl text-white shadow-sm">
                        👩‍🏫
                      </div>

                    )}

                    <div className="min-w-0">

                      <h2 className="truncate text-lg font-bold text-slate-900">
                        {teacher.full_name}
                      </h2>

                      <p className="mt-1 text-sm font-semibold text-green-700">
                        {teacher.role || 'Staff Member'}
                      </p>

                    </div>

                  </div>

                </div>

                {/* CARD BODY */}

                <div className="p-6">

                  <div className="space-y-3 text-sm">

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Subject
                      </span>

                      <span className="text-right font-semibold text-slate-900">
                        {teacher.subject || 'Not provided'}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Qualification
                      </span>

                      <span className="max-w-[60%] text-right font-semibold text-slate-900">
                        {teacher.qualification ||
                          'Not provided'}
                      </span>
                    </div>

                    {teacher.phone && (
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          Phone
                        </span>

                        <span className="text-right font-medium text-slate-900">
                          {teacher.phone}
                        </span>
                      </div>
                    )}

                  </div>

                  {/* ACTIONS */}

                  <div className="mt-6 grid grid-cols-3 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTeacher(teacher)
                      }
                      className="rounded-lg border border-slate-200 px-2 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Details
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        startEditTeacher(teacher)
                      }
                      className="rounded-lg bg-slate-900 px-2 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteTeacher(teacher)
                      }
                      className="rounded-lg border border-red-200 px-2 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
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

      {/* DETAILS MODAL */}

      {selectedTeacher && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50 p-6">

              <div className="flex items-center gap-4">

                {selectedTeacher.photo_url ? (

                  <img
                    src={selectedTeacher.photo_url}
                    alt={selectedTeacher.full_name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />

                ) : (

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-800 text-3xl text-white">
                    👩‍🏫
                  </div>

                )}

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                    Staff Profile
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {selectedTeacher.full_name}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {selectedTeacher.role ||
                      'Staff Member'}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedTeacher(null)
                }
                className="rounded-lg px-3 py-2 text-xl text-slate-500 transition hover:bg-white hover:text-slate-900"
              >
                ×
              </button>

            </div>

            {/* DETAILS */}

            <div className="grid gap-6 p-6 md:grid-cols-2">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Role / Position
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedTeacher.role ||
                    'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Subject
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedTeacher.subject ||
                    'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Qualification
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedTeacher.qualification ||
                    'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Phone
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedTeacher.phone ||
                    'Not provided'}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Email
                </p>

                <p className="mt-1 break-words font-semibold text-slate-900">
                  {selectedTeacher.email ||
                    'Not provided'}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Address
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {selectedTeacher.address ||
                    'Not provided'}
                </p>
              </div>

              <div className="md:col-span-2">

                <p className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-green-800">
                  Biography
                </p>

                <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
                  {selectedTeacher.bio ||
                    'No biography has been added.'}
                </p>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 p-5">

              <button
                type="button"
                onClick={() => {
                  const teacher = selectedTeacher
                  setSelectedTeacher(null)
                  startEditTeacher(teacher)
                }}
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
              >
                Edit Staff Member
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedTeacher(null)
                }
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  )
}
