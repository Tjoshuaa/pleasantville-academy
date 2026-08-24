'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Admission = {
  id: number
  child_first_name: string
  child_last_name: string
  date_of_birth: string | null
  gender: string | null
  parent_name: string | null
  parent_email: string | null
  parent_phone: string | null
  address: string | null
  class_applied_for: string | null
  previous_school: string | null
  message: string | null
  status: string | null
  created_at: string
  updated_at: string
}

const statusOptions = [
  'Pending',
  'Reviewing',
  'Accepted',
  'Rejected',
]

const statusStyles: Record<string, string> = {
  Pending:
    'bg-amber-50 text-amber-700 border-amber-200',
  Reviewing:
    'bg-blue-50 text-blue-700 border-blue-200',
  Accepted:
    'bg-green-50 text-green-700 border-green-200',
  Rejected:
    'bg-red-50 text-red-700 border-red-200',
}

export default function AdmissionsAdminPage() {
  const supabase = createClient()

  const [applications, setApplications] = useState<Admission[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [selectedApplication, setSelectedApplication] =
    useState<Admission | null>(null)

  const [editingId, setEditingId] = useState<number | null>(null)

  const [showForm, setShowForm] = useState(false)

  const [childFirstName, setChildFirstName] = useState('')
  const [childLastName, setChildLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [parentName, setParentName] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [address, setAddress] = useState('')
  const [classAppliedFor, setClassAppliedFor] = useState('')
  const [previousSchool, setPreviousSchool] = useState('')
  const [messageText, setMessageText] = useState('')
  const [status, setStatus] = useState('Pending')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadApplications() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setError(error.message)
      setApplications([])
    } else {
      setApplications(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadApplications()
  }, [])

  function resetForm() {
    setEditingId(null)
    setChildFirstName('')
    setChildLastName('')
    setDateOfBirth('')
    setGender('')
    setParentName('')
    setParentEmail('')
    setParentPhone('')
    setAddress('')
    setClassAppliedFor('')
    setPreviousSchool('')
    setMessageText('')
    setStatus('Pending')
    setShowForm(false)
  }

  function startAddApplication() {
    setMessage('')
    setError('')
    resetForm()
    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function startEditApplication(application: Admission) {
    setMessage('')
    setError('')

    setEditingId(application.id)
    setChildFirstName(application.child_first_name || '')
    setChildLastName(application.child_last_name || '')
    setDateOfBirth(application.date_of_birth || '')
    setGender(application.gender || '')
    setParentName(application.parent_name || '')
    setParentEmail(application.parent_email || '')
    setParentPhone(application.parent_phone || '')
    setAddress(application.address || '')
    setClassAppliedFor(application.class_applied_for || '')
    setPreviousSchool(application.previous_school || '')
    setMessageText(application.message || '')
    setStatus(application.status || 'Pending')

    setSelectedApplication(null)
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

    if (!childFirstName.trim() || !childLastName.trim()) {
      setError('Please enter the child’s first and last name.')
      return
    }

    setSaving(true)

    try {
      const applicationData = {
        child_first_name: childFirstName.trim(),
        child_last_name: childLastName.trim(),
        date_of_birth: dateOfBirth || null,
        gender: gender || null,
        parent_name: parentName.trim() || null,
        parent_email: parentEmail.trim() || null,
        parent_phone: parentPhone.trim() || null,
        address: address.trim() || null,
        class_applied_for:
          classAppliedFor.trim() || null,
        previous_school:
          previousSchool.trim() || null,
        message: messageText.trim() || null,
        status: status || 'Pending',
        updated_at: new Date().toISOString(),
      }

      if (editingId !== null) {
        const { error } = await supabase
          .from('admissions')
          .update(applicationData)
          .eq('id', editingId)

        if (error) throw error

        setMessage(
          'Admission application updated successfully.'
        )
      } else {
        const { error } = await supabase
          .from('admissions')
          .insert(applicationData)

        if (error) throw error

        setMessage(
          'Admission application added successfully.'
        )
      }

      resetForm()
      await loadApplications()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while saving the application.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function deleteApplication(
    application: Admission
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the admission application for ${application.child_first_name} ${application.child_last_name}?`
    )

    if (!confirmed) return

    setMessage('')
    setError('')

    try {
      const { error } = await supabase
        .from('admissions')
        .delete()
        .eq('id', application.id)

      if (error) throw error

      if (selectedApplication?.id === application.id) {
        setSelectedApplication(null)
      }

      if (editingId === application.id) {
        resetForm()
      }

      setMessage(
        'Admission application deleted successfully.'
      )

      await loadApplications()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Could not delete the application.'
      )
    }
  }

  async function updateStatus(
    application: Admission,
    newStatus: string
  ) {
    setMessage('')
    setError('')

    try {
      const { error } = await supabase
        .from('admissions')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', application.id)

      if (error) throw error

      setApplications((current) =>
        current.map((item) =>
          item.id === application.id
            ? {
                ...item,
                status: newStatus,
                updated_at: new Date().toISOString(),
              }
            : item
        )
      )

      if (selectedApplication?.id === application.id) {
        setSelectedApplication({
          ...application,
          status: newStatus,
        })
      }

      setMessage(
        `Application status changed to ${newStatus}.`
      )
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Could not update application status.'
      )
    }
  }

  const filteredApplications = useMemo(() => {
    const searchText = search.toLowerCase().trim()

    return applications.filter((application) => {
      const matchesStatus =
        statusFilter === 'All' ||
        (application.status || 'Pending') === statusFilter

      if (!matchesStatus) return false

      if (!searchText) return true

      return [
        application.child_first_name,
        application.child_last_name,
        application.parent_name,
        application.parent_email,
        application.parent_phone,
        application.class_applied_for,
        application.previous_school,
        application.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchText)
        )
    })
  }, [applications, search, statusFilter])

  const statistics = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter(
        (item) =>
          (item.status || 'Pending') === 'Pending'
      ).length,
      reviewing: applications.filter(
        (item) => item.status === 'Reviewing'
      ).length,
      accepted: applications.filter(
        (item) => item.status === 'Accepted'
      ).length,
      rejected: applications.filter(
        (item) => item.status === 'Rejected'
      ).length,
    }
  }, [applications])

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

  function formatDateTime(date: string) {
    const parsed = new Date(date)

    if (Number.isNaN(parsed.getTime())) {
      return date
    }

    return parsed.toLocaleString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  function getStatusClass(applicationStatus: string | null) {
    return (
      statusStyles[applicationStatus || 'Pending'] ||
      'bg-slate-50 text-slate-700 border-slate-200'
    )
  }

  return (
    <main className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6">

          <Link
            href="/admin"
            className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                  📝
                </div>

                <div>

                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Admissions
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage and review applications to
                    Pleasantville Academy.
                  </p>

                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={startAddApplication}
              className="inline-flex items-center justify-center rounded-xl bg-green-800 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              + Add Application
            </button>

          </div>

        </div>

      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* MESSAGES */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* STATISTICS */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Total Applications
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? '...' : statistics.total}
            </p>

          </div>

          <button
            type="button"
            onClick={() => setStatusFilter('Pending')}
            className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <p className="text-sm font-semibold text-amber-700">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-900">
              {loading ? '...' : statistics.pending}
            </p>

          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Reviewing')}
            className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <p className="text-sm font-semibold text-blue-700">
              Reviewing
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-900">
              {loading ? '...' : statistics.reviewing}
            </p>

          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Accepted')}
            className="rounded-2xl border border-green-200 bg-green-50 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <p className="text-sm font-semibold text-green-700">
              Accepted
            </p>

            <p className="mt-2 text-3xl font-bold text-green-900">
              {loading ? '...' : statistics.accepted}
            </p>

          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Rejected')}
            className="rounded-2xl border border-red-200 bg-red-50 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <p className="text-sm font-semibold text-red-700">
              Rejected
            </p>

            <p className="mt-2 text-3xl font-bold text-red-900">
              {loading ? '...' : statistics.rejected}
            </p>

          </button>

        </div>

        {/* FORM */}

        {showForm && (

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                    Application Management
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {editingId !== null
                      ? 'Edit Admission Application'
                      : 'Add Admission Application'}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Cancel
                </button>

              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-6 p-6 md:grid-cols-2"
            >

              {/* CHILD */}

              <div className="md:col-span-2">

                <h3 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-green-800">
                  Child Information
                </h3>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  First Name *
                </label>

                <input
                  type="text"
                  value={childFirstName}
                  onChange={(event) =>
                    setChildFirstName(event.target.value)
                  }
                  placeholder="Child's first name"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Last Name *
                </label>

                <input
                  type="text"
                  value={childLastName}
                  onChange={(event) =>
                    setChildLastName(event.target.value)
                  }
                  placeholder="Child's last name"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Date of Birth
                </label>

                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) =>
                    setDateOfBirth(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gender
                </label>

                <select
                  value={gender}
                  onChange={(event) =>
                    setGender(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Class Applied For
                </label>

                <input
                  type="text"
                  value={classAppliedFor}
                  onChange={(event) =>
                    setClassAppliedFor(event.target.value)
                  }
                  placeholder="e.g. Primary 4"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Previous School
                </label>

                <input
                  type="text"
                  value={previousSchool}
                  onChange={(event) =>
                    setPreviousSchool(event.target.value)
                  }
                  placeholder="Previous school attended"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              {/* PARENT */}

              <div className="mt-2 md:col-span-2">

                <h3 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-green-800">
                  Parent / Guardian Information
                </h3>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Parent / Guardian Name
                </label>

                <input
                  type="text"
                  value={parentName}
                  onChange={(event) =>
                    setParentName(event.target.value)
                  }
                  placeholder="Parent or guardian name"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(event) =>
                    setParentPhone(event.target.value)
                  }
                  placeholder="Parent phone number"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={parentEmail}
                  onChange={(event) =>
                    setParentEmail(event.target.value)
                  }
                  placeholder="Parent email address"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              <div>

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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              {/* STATUS */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Application Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

              </div>

              {/* MESSAGE */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Parent Message
                </label>

                <textarea
                  value={messageText}
                  onChange={(event) =>
                    setMessageText(event.target.value)
                  }
                  rows={5}
                  placeholder="Additional information or message from the parent..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              <div className="flex flex-wrap gap-3 md:col-span-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingId !== null
                      ? 'Save Changes'
                      : 'Add Application'}
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

        {/* SEARCH / FILTER */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-[1fr_220px]">

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Search Applications
              </label>

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search child, parent, email, phone, class..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              >
                <option value="All">All Applications</option>

                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}

              </select>

            </div>

          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

            <p className="text-sm text-slate-500">
              Showing{' '}
              <span className="font-semibold text-slate-900">
                {filteredApplications.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-900">
                {applications.length}
              </span>{' '}
              applications
            </p>

            {statusFilter !== 'All' && (
              <button
                type="button"
                onClick={() => setStatusFilter('All')}
                className="text-sm font-semibold text-green-700 hover:text-green-800"
              >
                Clear status filter
              </button>
            )}

          </div>

        </div>

        {/* APPLICATIONS */}

        <div className="mt-6">

          {loading ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-green-700" />

              <p className="mt-4 font-semibold text-slate-700">
                Loading applications...
              </p>

            </div>

          ) : filteredApplications.length === 0 ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

              <div className="text-5xl">
                📝
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {applications.length === 0
                  ? 'No admission applications yet'
                  : 'No applications found'}
              </h2>

              <p className="mt-2 text-slate-500">
                {applications.length === 0
                  ? 'Applications submitted through the website will appear here.'
                  : 'Try changing your search or status filter.'}
              </p>

              {applications.length === 0 && (
                <button
                  type="button"
                  onClick={startAddApplication}
                  className="mt-5 rounded-xl bg-green-800 px-5 py-3 font-semibold text-white hover:bg-green-700"
                >
                  + Add Application
                </button>
              )}

            </div>

          ) : (

            <div className="grid gap-5 lg:grid-cols-2">

              {filteredApplications.map(
                (application) => (

                  <article
                    key={application.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl">
                          🎓
                        </div>

                        <div className="min-w-0">

                          <h2 className="truncate text-lg font-bold text-slate-900">
                            {application.child_first_name}{' '}
                            {application.child_last_name}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            Applied for{' '}
                            <span className="font-semibold text-slate-700">
                              {application.class_applied_for ||
                                'Class not specified'}
                            </span>
                          </p>

                        </div>

                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status ||
                          'Pending'}
                      </span>

                    </div>

                    <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Parent / Guardian
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {application.parent_name ||
                            'Not provided'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {application.parent_phone ||
                            'Not provided'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Date of Birth
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {formatDate(
                            application.date_of_birth
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Application Date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {formatDate(
                            application.created_at
                          )}
                        </p>
                      </div>

                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedApplication(
                            application
                          )
                        }
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          startEditApplication(
                            application
                          )
                        }
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteApplication(
                            application
                          )
                        }
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </div>

      </section>

      {/* DETAILS MODAL */}

      {selectedApplication && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white p-6">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                  Admission Application
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedApplication.child_first_name}{' '}
                  {selectedApplication.child_last_name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Submitted{' '}
                  {formatDateTime(
                    selectedApplication.created_at
                  )}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(null)
                }
                className="rounded-lg px-3 py-2 text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>

            </div>

            <div className="space-y-8 p-6">

              {/* STATUS */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Application Status
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Update the application progress.
                    </p>

                  </div>

                  <select
                    value={
                      selectedApplication.status ||
                      'Pending'
                    }
                    onChange={(event) =>
                      updateStatus(
                        selectedApplication,
                        event.target.value
                      )
                    }
                    className={`rounded-xl border px-4 py-3 text-sm font-bold outline-none ${getStatusClass(
                      selectedApplication.status
                    )}`}
                  >
                    {statusOptions.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>

                </div>

              </div>

              {/* CHILD */}

              <div>

                <h3 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-green-800">
                  Child Information
                </h3>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Full Name
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedApplication.child_first_name}{' '}
                      {selectedApplication.child_last_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Date of Birth
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {formatDate(
                        selectedApplication.date_of_birth
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Gender
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedApplication.gender ||
                        'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Class Applied For
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedApplication.class_applied_for ||
                        'Not provided'}
                    </p>
                  </div>

                  <div className="sm:col-span-2">

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Previous School
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedApplication.previous_school ||
                        'Not provided'}
                    </p>

                  </div>

                </div>

              </div>

              {/* PARENT */}

              <div>

                <h3 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-green-800">
                  Parent / Guardian
                </h3>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Name
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedApplication.parent_name ||
                        'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedApplication.parent_phone ||
                        'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 break-words font-semibold text-slate-900">
                      {selectedApplication.parent_email ||
                        'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Address
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedApplication.address ||
                        'Not provided'}
                    </p>
                  </div>

                </div>

              </div>

              {/* MESSAGE */}

              <div>

                <h3 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-green-800">
                  Parent Message
                </h3>

                <div className="mt-4 rounded-xl bg-slate-50 p-5">

                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {selectedApplication.message ||
                      'No additional message was provided.'}
                  </p>

                </div>

              </div>

            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50 p-5">

              <button
                type="button"
                onClick={() => {
                  const application =
                    selectedApplication

                  setSelectedApplication(null)
                  startEditApplication(
                    application
                  )
                }}
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
              >
                Edit Application
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(null)
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
