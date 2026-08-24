'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Student = {
  id: number
  created_at: string
  full_name: string
  class_name: string | null
  gender: string | null
  date_of_birth: string | null
  parent_name: string | null
  parent_phone: string | null
  parent_email: string | null
  address: string | null
  student_id: string | null
  notes: string | null
}

export default function StudentsAdminPage() {
  const supabase = createClient()

  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null)

  const [fullName, setFullName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [className, setClassName] = useState('')
  const [gender, setGender] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')

  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [parentEmail, setParentEmail] = useState('')

  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadStudents() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
      setStudents([])
    } else {
      setStudents(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadStudents()
  }, [])

  function resetForm() {
    setEditingId(null)
    setFullName('')
    setStudentId('')
    setClassName('')
    setGender('')
    setDateOfBirth('')
    setParentName('')
    setParentPhone('')
    setParentEmail('')
    setAddress('')
    setNotes('')
    setShowForm(false)
  }

  function startAddStudent() {
    setMessage('')
    setError('')
    resetForm()
    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function startEditStudent(student: Student) {
    setMessage('')
    setError('')

    setEditingId(student.id)
    setFullName(student.full_name)
    setStudentId(student.student_id || '')
    setClassName(student.class_name || '')
    setGender(student.gender || '')
    setDateOfBirth(student.date_of_birth || '')
    setParentName(student.parent_name || '')
    setParentPhone(student.parent_phone || '')
    setParentEmail(student.parent_email || '')
    setAddress(student.address || '')
    setNotes(student.notes || '')

    setSelectedStudent(null)
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
      setError('Please enter the student name.')
      return
    }

    setSaving(true)

    try {
      const studentData = {
        full_name: fullName.trim(),
        student_id: studentId.trim() || null,
        class_name: className.trim() || null,
        gender: gender || null,
        date_of_birth: dateOfBirth || null,
        parent_name: parentName.trim() || null,
        parent_phone: parentPhone.trim() || null,
        parent_email: parentEmail.trim() || null,
        address: address.trim() || null,
        notes: notes.trim() || null,
      }

      if (editingId !== null) {
        const { error } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', editingId)

        if (error) throw error

        setMessage('Student updated successfully.')
      } else {
        const { error } = await supabase
          .from('students')
          .insert(studentData)

        if (error) throw error

        setMessage('Student added successfully.')
      }

      resetForm()
      await loadStudents()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while saving the student.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function deleteStudent(student: Student) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${student.full_name}?`
    )

    if (!confirmed) return

    setMessage('')
    setError('')

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', student.id)

      if (error) throw error

      if (selectedStudent?.id === student.id) {
        setSelectedStudent(null)
      }

      if (editingId === student.id) {
        resetForm()
      }

      setMessage('Student deleted successfully.')
      await loadStudents()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not delete the student.'
      )
    }
  }

  const filteredStudents = useMemo(() => {
    const searchText = search.toLowerCase().trim()

    if (!searchText) return students

    return students.filter((student) =>
      [
        student.full_name,
        student.student_id,
        student.class_name,
        student.gender,
        student.parent_name,
        student.parent_phone,
        student.parent_email,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(searchText)
        )
    )
  }, [students, search])

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
    <main className="min-h-screen bg-slate-100 text-slate-900">

      {/* TOP HEADER */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <Link
                href="/admin"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-green-700 hover:bg-green-50 hover:text-green-800"
              >
                ←
              </Link>

              <div>

                <div className="flex items-center gap-2">

                  <span className="hidden rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-800 sm:inline-flex">
                    Admin Portal
                  </span>

                  <span className="text-xs font-semibold text-slate-400">
                    Pleasantville Academy
                  </span>

                </div>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Students
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage student records and information.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={startAddStudent}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md"
            >
              <span className="text-lg">+</span>
              Add Student
            </button>

          </div>

        </div>

      </header>

      <section className="mx-auto max-w-7xl px-5 py-7 sm:px-6">

        {/* BREADCRUMB */}

        <div className="mb-6 flex items-center gap-2 text-sm">

          <Link
            href="/admin"
            className="font-medium text-slate-500 hover:text-green-800"
          >
            Dashboard
          </Link>

          <span className="text-slate-300">
            /
          </span>

          <span className="font-semibold text-slate-900">
            Students
          </span>

        </div>

        {/* MESSAGES */}

        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800 shadow-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-white">
              ✓
            </span>
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
              !
            </span>

            <span>
              {error}
            </span>
          </div>
        )}

        {/* STATISTICS */}

        <div className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Students
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {students.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                🎓
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-500">
              Registered student records
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Search Results
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {filteredStudents.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                🔎
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-500">
              Students matching your search
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Records
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {students.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                📋
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-500">
              Current student database
            </p>

          </div>

        </div>

        {/* ADD / EDIT FORM */}

        {showForm && (

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 bg-slate-950 px-6 py-5">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
                    Student Management
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    {editingId !== null
                      ? 'Edit Student'
                      : 'Add New Student'}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {editingId !== null
                      ? 'Update the student record below.'
                      : 'Create a new student record.'}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>

              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-6 p-6 md:grid-cols-2"
            >

              {/* STUDENT INFORMATION */}

              <div className="md:col-span-2">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                    🎓
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Student Information
                    </h3>

                    <p className="text-xs text-slate-500">
                      Basic information about the student
                    </p>
                  </div>

                </div>

                <div className="mt-4 h-px bg-slate-200" />

              </div>

              <FormField
                label="Full Name"
                required
              >
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  placeholder="Student full name"
                  className={inputClass}
                  required
                />
              </FormField>

              <FormField label="Student ID">
                <input
                  type="text"
                  value={studentId}
                  onChange={(event) =>
                    setStudentId(event.target.value)
                  }
                  placeholder="e.g. PVA-2026-001"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Class">
                <input
                  type="text"
                  value={className}
                  onChange={(event) =>
                    setClassName(event.target.value)
                  }
                  placeholder="e.g. Primary 4"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Gender">
                <select
                  value={gender}
                  onChange={(event) =>
                    setGender(event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">
                    Select gender
                  </option>
                  <option value="Male">
                    Male
                  </option>
                  <option value="Female">
                    Female
                  </option>
                </select>
              </FormField>

              <FormField label="Date of Birth">
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) =>
                    setDateOfBirth(event.target.value)
                  }
                  className={inputClass}
                />
              </FormField>

              {/* PARENT INFORMATION */}

              <div className="mt-2 md:col-span-2">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                    👨‍👩‍👧
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Parent / Guardian Information
                    </h3>

                    <p className="text-xs text-slate-500">
                      Contact information for the parent or guardian
                    </p>
                  </div>

                </div>

                <div className="mt-4 h-px bg-slate-200" />

              </div>

              <FormField label="Parent / Guardian Name">
                <input
                  type="text"
                  value={parentName}
                  onChange={(event) =>
                    setParentName(event.target.value)
                  }
                  placeholder="Parent or guardian name"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Parent / Guardian Phone">
                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(event) =>
                    setParentPhone(event.target.value)
                  }
                  placeholder="Phone number"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Parent / Guardian Email">
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(event) =>
                    setParentEmail(event.target.value)
                  }
                  placeholder="Email address"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Address">
                <input
                  type="text"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="Home address"
                  className={inputClass}
                />
              </FormField>

              {/* NOTES */}

              <div className="md:col-span-2">

                <FormField label="Notes">

                  <textarea
                    value={notes}
                    onChange={(event) =>
                      setNotes(event.target.value)
                    }
                    placeholder="Additional information about the student..."
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />

                </FormField>

              </div>

              {/* FORM ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row md:col-span-2">

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-green-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingId !== null
                      ? 'Save Changes'
                      : 'Add Student'}
                </button>

              </div>

            </form>

          </div>

        )}

        {/* SEARCH */}

        <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-950">
                Student Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search and manage registered students.
              </p>

            </div>

            <div className="w-full md:max-w-md">

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Search
              </label>

              <div className="relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔎
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Name, ID, class, parent or phone..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:bg-white focus:ring-2 focus:ring-green-100"
                />

              </div>

            </div>

          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

            <p className="text-sm text-slate-500">
              Showing{' '}
              <span className="font-bold text-slate-900">
                {filteredStudents.length}
              </span>{' '}
              of{' '}
              <span className="font-bold text-slate-900">
                {students.length}
              </span>{' '}
              students
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-sm font-semibold text-green-800 hover:text-green-700"
              >
                Clear search
              </button>
            )}

          </div>

        </div>

        {/* STUDENT LIST */}

        <div className="mt-6">

          {loading ? (

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {[1, 2, 3].map((item) => (

                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                  <div className="animate-pulse">

                    <div className="flex gap-4">

                      <div className="h-12 w-12 rounded-full bg-slate-200" />

                      <div className="flex-1">

                        <div className="h-5 w-2/3 rounded bg-slate-200" />

                        <div className="mt-2 h-4 w-1/3 rounded bg-slate-200" />

                      </div>

                    </div>

                    <div className="mt-6 space-y-3">

                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 rounded bg-slate-200" />

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : filteredStudents.length === 0 ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl">
                🎓
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950">
                {students.length === 0
                  ? 'No students yet'
                  : 'No students found'}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {students.length === 0
                  ? 'Add your first student to begin building your student records.'
                  : 'No student records match your current search. Try another name, ID or class.'}
              </p>

              {students.length === 0 && (
                <button
                  type="button"
                  onClick={startAddStudent}
                  className="mt-6 rounded-xl bg-green-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  + Add First Student
                </button>
              )}

            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {filteredStudents.map((student) => (

                <article
                  key={student.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
                >

                  {/* CARD HEADER */}

                  <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-2xl">
                        🎓
                      </div>

                      <div className="min-w-0 flex-1">

                        <h2 className="truncate text-lg font-bold text-slate-950">
                          {student.full_name}
                        </h2>

                        {student.student_id ? (

                          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-green-700">
                            {student.student_id}
                          </p>

                        ) : (

                          <p className="mt-1 text-xs text-slate-400">
                            No student ID
                          </p>

                        )}

                      </div>

                    </div>

                  </div>

                  {/* CARD DETAILS */}

                  <div className="space-y-3 px-6 py-5">

                    <InfoRow
                      label="Class"
                      value={student.class_name || 'Not provided'}
                    />

                    <InfoRow
                      label="Gender"
                      value={student.gender || 'Not provided'}
                    />

                    <InfoRow
                      label="Date of Birth"
                      value={formatDate(student.date_of_birth)}
                    />

                    <InfoRow
                      label="Parent / Guardian"
                      value={student.parent_name || 'Not provided'}
                    />

                  </div>

                  {/* CARD ACTIONS */}

                  <div className="grid grid-cols-3 gap-2 border-t border-slate-100 bg-white px-5 py-4">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedStudent(student)
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-800"
                    >
                      Details
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        startEditStudent(student)
                      }
                      className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteStudent(student)
                      }
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>

      </section>

      {/* DETAILS MODAL */}

      {selectedStudent && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedStudent(null)
            }
          }}
        >

          <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="bg-slate-950 px-6 py-6">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-700 text-2xl">
                    🎓
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
                      Student Details
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-white">
                      {selectedStudent.full_name}
                    </h2>

                    {selectedStudent.student_id && (
                      <p className="mt-1 text-sm text-slate-400">
                        Student ID: {selectedStudent.student_id}
                      </p>
                    )}

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedStudent(null)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  ×
                </button>

              </div>

            </div>

            {/* MODAL CONTENT */}

            <div className="max-h-[65vh] overflow-y-auto p-6">

              <div className="grid gap-6 sm:grid-cols-2">

                <DetailItem
                  label="Student ID"
                  value={
                    selectedStudent.student_id ||
                    'Not provided'
                  }
                />

                <DetailItem
                  label="Class"
                  value={
                    selectedStudent.class_name ||
                    'Not provided'
                  }
                />

                <DetailItem
                  label="Gender"
                  value={
                    selectedStudent.gender ||
                    'Not provided'
                  }
                />

                <DetailItem
                  label="Date of Birth"
                  value={formatDate(
                    selectedStudent.date_of_birth
                  )}
                />

                <div className="sm:col-span-2">

                  <SectionHeading>
                    Parent / Guardian Information
                  </SectionHeading>

                </div>

                <DetailItem
                  label="Name"
                  value={
                    selectedStudent.parent_name ||
                    'Not provided'
                  }
                />

                <DetailItem
                  label="Phone"
                  value={
                    selectedStudent.parent_phone ||
                    'Not provided'
                  }
                />

                <DetailItem
                  label="Email"
                  value={
                    selectedStudent.parent_email ||
                    'Not provided'
                  }
                />

                <DetailItem
                  label="Address"
                  value={
                    selectedStudent.address ||
                    'Not provided'
                  }
                />

                <div className="sm:col-span-2">

                  <SectionHeading>
                    Additional Notes
                  </SectionHeading>

                  <div className="mt-4 rounded-xl bg-slate-50 p-4">

                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {selectedStudent.notes ||
                        'No additional notes.'}
                    </p>

                  </div>

                </div>

                <div className="sm:col-span-2">

                  <p className="text-xs text-slate-400">
                    Record created:{' '}
                    {formatDate(
                      selectedStudent.created_at
                    )}
                  </p>

                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setSelectedStudent(null)
                }
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const student = selectedStudent
                  setSelectedStudent(null)
                  startEditStudent(student)
                }}
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Edit Student
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  )
}

/* -------------------------------------------------------------------------- */
/* REUSABLE UI COMPONENTS                                                     */
/* -------------------------------------------------------------------------- */

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-100'

function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="max-w-[60%] text-right text-sm font-semibold text-slate-900">
        {value}
      </span>

    </div>
  )
}

function DetailItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>

      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-slate-900">
        {value}
      </p>

    </div>
  )
}

function SectionHeading({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-200 pb-3">

      <div className="h-5 w-1 rounded-full bg-green-700" />

      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
        {children}
      </h3>

    </div>
  )
}
