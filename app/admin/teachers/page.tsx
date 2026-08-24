'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
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
  employment_type: string | null
  date_joined: string | null
  notes: string | null
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
  const [employmentType, setEmploymentType] = useState('')
  const [dateJoined, setDateJoined] = useState('')
  const [notes, setNotes] = useState('')

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
      console.error('Teachers error:', error)
      setError(error.message)
      setTeachers([])
    } else {
      setTeachers((data || []) as Teacher[])
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
    setEmploymentType('')
    setDateJoined('')
    setNotes('')
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
    setEmploymentType(teacher.employment_type || '')
    setDateJoined(teacher.date_joined || '')
    setNotes(teacher.notes || '')

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
        employment_type: employmentType || null,
        date_joined: dateJoined || null,
        notes: notes.trim() || null,
      }

      if (editingId !== null) {
        const { error } = await supabase
          .from('teachers')
          .update(teacherData)
          .eq('id', editingId)

        if (error) throw error

        setMessage(
          'Teacher / staff record updated successfully.'
        )
      } else {
        const { error } = await supabase
          .from('teachers')
          .insert(teacherData)

        if (error) throw error

        setMessage(
          'Teacher / staff member added successfully.'
        )
      }

      resetForm()
      await loadTeachers()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while saving the record.'
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
        'Teacher / staff record deleted successfully.'
      )

      await loadTeachers()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Could not delete the record.'
      )
    }
  }

  const filteredTeachers = useMemo(() => {
    const searchText = search.toLowerCase().trim()

    if (!searchText) return teachers

    return teachers.filter((teacher) => {
      return [
        teacher.full_name,
        teacher.role,
        teacher.subject,
        teacher.qualification,
        teacher.phone,
        teacher.email,
        teacher.employment_type,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchText)
        )
    })
  }, [teachers, search])

  function formatDate(date: string | null) {
    if (!date) return 'Not provided'

    const parsed = new Date(date)

    if (Number.isNaN(parsed.getTime())) {
      return date
    }

    return parsed.toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-900">

      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-900">

        <div className="mx-auto max-w-7xl px-6 py-6">

          <Link
            href="/admin"
            className="inline-flex items-center text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-900/40 text-2xl ring-1 ring-green-800/50">
                  👩‍🏫
                </div>

                <div>

                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    Teachers & Staff
                  </h1>

                  <p className="mt-1 text-sm text-slate-400">
                    Manage teachers and school staff records.
                  </p>

                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={startAddTeacher}
              className="inline-flex items-center justify-center rounded-xl bg-green-700 px-5 py-3 font-semibold text-white shadow-lg shadow-green-950/30 transition hover:bg-green-600 hover:shadow-xl"
            >
              + Add Teacher / Staff
            </button>

          </div>

        </div>

      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* MESSAGES */}

        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-800/60 bg-green-950/60 px-5 py-4 text-sm font-semibold text-green-300">
            <span className="text-lg">✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-800/60 bg-red-950/60 px-5 py-4 text-sm font-semibold text-red-300">
            <span className="text-lg">!</span>
            <span>{error}</span>
          </div>
        )}

        {/* SUMMARY */}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Staff
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {teachers.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-900/50 text-xl ring-1 ring-green-800/50">
                👥
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-400">
                  Teachers
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {
                    teachers.filter((teacher) =>
                      (teacher.role || '')
                        .toLowerCase()
                        .includes('teacher')
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900/50 text-xl ring-1 ring-blue-800/50">
                🎓
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-400">
                  Showing
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {filteredTeachers.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-xl text-slate-300">
                🔎
              </div>

            </div>

          </div>

        </div>

        {/* FORM */}

        {showForm && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/20">

            <div className="border-b border-slate-800 bg-slate-800/70 px-6 py-5">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
                    Staff Management
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    {editingId !== null
                      ? 'Edit Teacher / Staff'
                      : 'Add Teacher / Staff'}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Enter the staff member's information below.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-slate-700 hover:text-white"
                >
                  Cancel
                </button>

              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 p-6 md:grid-cols-2"
            >

              {/* STAFF INFORMATION */}

              <div className="md:col-span-2">

                <h3 className="border-b border-slate-700 pb-2 text-sm font-bold uppercase tracking-wider text-green-400">
                  Staff Information
                </h3>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
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
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-600 focus:ring-2 focus:ring-green-900"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Role / Position
                </label>

                <input
                  type="text"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value)
                  }
                  placeholder="e.g. Mathematics Teacher"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-600 focus:ring-2 focus:ring-green-900"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Subject / Department
                </label>

                <input
                  type="text"
                  value={subject}
                  onChange={(event) =>
                    setSubject(event.target.value)
                  }
                  placeholder="e.g. Mathematics"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-600 focus:ring-2 focus:ring-green-900"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Qualification
                </label>

                <input
                  type="text"
                  value={qualification}
                  onChange={(event) =>
                    setQualification(event.target.value)
                  }
                  placeholder="e.g. B.Ed, M.Ed"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-600 focus:ring-2 focus:ring-green-900"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Employment Type
                </label>

                <select
                  value={employmentType}
                  onChange={(event) =>
                    setEmploymentType(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-green-600 focus:ring-2 focus:ring-green-900"
                >

                  <option value="">
                    Select employment type
                  </option>

                  <option value="Full-time">
                    Full-time
                  </option>

                  <option value="Part-time">
                    Part-time
                  </option>

                  <option value="Contract">
                    Contract
                  </option>

                  <option value="Temporary">
                    Temporary
                  </option>

                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Date Joined
                </label>

                <input
                  type="date"
                  value={dateJoined}
                  onChange={(event) =>
                    setDateJoined(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-green-600 focus:ring-2 focus:ring-green-900"
                />

              </div>

              {/* CONTACT */}

              <div className="mt-3 md:col-span-2">

                <h3 className="border-b border-slate-700 pb-2 text-sm font-bold uppercase tracking-wider text-green-400">
                  Contact Information
                </h3>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Phone
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="Phone number"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-600 focus:ring-2 focus:ring-green-900"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Email address"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-600 focus:ring-2 focus:ring-green-900"
                />

              </div>

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Address
                </label>

                <input
                  type="text"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="Home address"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-600 focus:ring-2 focus:ring-green-900"
                />

              </div>

              {/* NOTES */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Notes
                </label>

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  placeholder="Additional information..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-600 focus:ring-2 focus:ring-green-900"
                />

              </div>

              {/* ACTIONS */}

              <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-5 md:col-span-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white shadow-lg shadow-green-950/20 transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingId !== null
                      ? 'Save Changes'
                      : 'Add Teacher / Staff'}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* SEARCH */}

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div className="flex-1">

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Search Teachers & Staff
              </label>

              <div className="relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  🔎
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search by name, role, subject, phone or email..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-green-600 focus:ring-2 focus:ring-green-900"
                />

              </div>

            </div>

            <div className="text-sm text-slate-400">
              Showing{' '}
              <span className="font-bold text-white">
                {filteredTeachers.length}
              </span>{' '}
              of{' '}
              <span className="font-bold text-white">
                {teachers.length}
              </span>{' '}
              records
            </div>

          </div>

        </div>

        {/* STAFF LIST */}

        {loading ? (

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center shadow-xl shadow-black/10">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-900/50 text-xl">
              👩‍🏫
            </div>

            <p className="mt-4 font-semibold text-slate-300">
              Loading teachers and staff...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Please wait a moment.
            </p>

          </div>

        ) : filteredTeachers.length === 0 ? (

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center shadow-xl shadow-black/10">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-900/50 text-3xl">
              👩‍🏫
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              {teachers.length === 0
                ? 'No teachers or staff yet'
                : 'No records found'}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              {teachers.length === 0
                ? 'Add your first teacher or staff member to begin managing your school team.'
                : 'Try using a different name, role, subject or contact detail.'}
            </p>

            {teachers.length === 0 && (
              <button
                type="button"
                onClick={startAddTeacher}
                className="mt-6 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-600"
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
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/10 transition duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl"
              >

                {/* CARD TOP */}

                <div className="border-b border-slate-800 bg-gradient-to-br from-green-950/70 to-slate-900 p-6">

                  <div className="flex items-start gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-700 text-2xl text-white shadow-lg shadow-green-950/30">
                      👩‍🏫
                    </div>

                    <div className="min-w-0 flex-1">

                      <h2 className="truncate text-lg font-bold text-white">
                        {teacher.full_name}
                      </h2>

                      <p className="mt-1 text-sm font-semibold text-green-400">
                        {teacher.role || 'Staff Member'}
                      </p>

                    </div>

                  </div>

                </div>

                {/* CARD CONTENT */}

                <div className="p-6">

                  <div className="space-y-3 text-sm">

                    <div className="flex items-start justify-between gap-4">

                      <span className="text-slate-500">
                        Subject
                      </span>

                      <span className="text-right font-semibold text-slate-200">
                        {teacher.subject || 'Not provided'}
                      </span>

                    </div>

                    <div className="flex items-start justify-between gap-4">

                      <span className="text-slate-500">
                        Qualification
                      </span>

                      <span className="max-w-[60%] text-right font-semibold text-slate-200">
                        {teacher.qualification || 'Not provided'}
                      </span>

                    </div>

                    <div className="flex items-start justify-between gap-4">

                      <span className="text-slate-500">
                        Employment
                      </span>

                      <span className="text-right font-semibold text-slate-200">
                        {teacher.employment_type || 'Not provided'}
                      </span>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="mt-6 grid grid-cols-3 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTeacher(teacher)
                      }
                      className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      Details
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        startEditTeacher(teacher)
                      }
                      className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteTeacher(teacher)
                      }
                      className="rounded-lg border border-red-800 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-950/50"
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

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedTeacher(null)}
        >

          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-slate-800 bg-gradient-to-br from-green-950/70 to-slate-900 p-6">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-2xl text-white">
                  👩‍🏫
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
                    Staff Profile
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-white">
                    {selectedTeacher.full_name}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-slate-400">
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
                className="rounded-lg px-3 py-2 text-xl text-slate-500 transition hover:bg-slate-800 hover:text-white"
              >
                ×
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="grid gap-6 p-6 md:grid-cols-2">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Role / Position
                </p>

                <p className="mt-1 font-semibold text-slate-200">
                  {selectedTeacher.role ||
                    'Not provided'}
                </p>

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Subject / Department
                </p>

                <p className="mt-1 font-semibold text-slate-200">
                  {selectedTeacher.subject ||
                    'Not provided'}
                </p>

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Qualification
                </p>

                <p className="mt-1 font-semibold text-slate-200">
                  {selectedTeacher.qualification ||
                    'Not provided'}
                </p>

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Employment Type
                </p>

                <p className="mt-1 font-semibold text-slate-200">
                  {selectedTeacher.employment_type ||
                    'Not provided'}
                </p>

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Date Joined
                </p>

                <p className="mt-1 font-semibold text-slate-200">
                  {formatDate(
                    selectedTeacher.date_joined
                  )}
                </p>

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Phone
                </p>

                <p className="mt-1 font-semibold text-slate-200">
                  {selectedTeacher.phone ||
                    'Not provided'}
                </p>

              </div>

              <div className="md:col-span-2">

                <h3 className="border-b border-slate-700 pb-2 text-sm font-bold uppercase tracking-wider text-green-400">
                  Contact Information
                </h3>

              </div>

              <div className="md:col-span-2">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Email
                </p>

                <p className="mt-1 break-words font-semibold text-slate-200">
                  {selectedTeacher.email ||
                    'Not provided'}
                </p>

              </div>

              <div className="md:col-span-2">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Address
                </p>

                <p className="mt-1 font-semibold text-slate-200">
                  {selectedTeacher.address ||
                    'Not provided'}
                </p>

              </div>

              <div className="md:col-span-2">

                <h3 className="border-b border-slate-700 pb-2 text-sm font-bold uppercase tracking-wider text-green-400">
                  Notes
                </h3>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                  {selectedTeacher.notes ||
                    'No additional notes.'}
                </p>

              </div>

            </div>

            {/* MODAL ACTIONS */}

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-800 bg-slate-950 p-5">

              <button
                type="button"
                onClick={() => {
                  const teacher = selectedTeacher
                  setSelectedTeacher(null)
                  startEditTeacher(teacher)
                }}
                className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-600"
              >
                Edit Staff Member
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedTeacher(null)
                }
                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
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
