'use client'

import { FormEvent, useEffect, useState } from 'react'
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

      if (editingId) {
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

  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase().trim()

    if (!searchText) return true

    return [
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
  })

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
    <main className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">

          <Link
            href="/admin"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Students
              </h1>

              <p className="mt-2 text-slate-500">
                Manage student records and information.
              </p>
            </div>

            <button
              type="button"
              onClick={startAddStudent}
              className="rounded-xl bg-green-800 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              + Add Student
            </button>

          </div>

        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* MESSAGES */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* FORM */}

        {showForm && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between gap-4">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingId
                    ? 'Edit Student'
                    : 'Add New Student'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the student's details below.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-semibold text-slate-500 hover:text-slate-900"
              >
                Cancel
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-5 md:grid-cols-2"
            >

              {/* STUDENT INFORMATION */}

              <div className="md:col-span-2">
                <h3 className="border-b pb-2 text-sm font-bold uppercase tracking-wider text-green-800">
                  Student Information
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
                  placeholder="Student full name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Student ID
                </label>

                <input
                  type="text"
                  value={studentId}
                  onChange={(event) =>
                    setStudentId(event.target.value)
                  }
                  placeholder="e.g. PVA-2026-001"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Class
                </label>

                <input
                  type="text"
                  value={className}
                  onChange={(event) =>
                    setClassName(event.target.value)
                  }
                  placeholder="e.g. Primary 4"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* PARENT INFORMATION */}

              <div className="mt-3 md:col-span-2">
                <h3 className="border-b pb-2 text-sm font-bold uppercase tracking-wider text-green-800">
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Parent / Guardian Phone
                </label>

                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(event) =>
                    setParentPhone(event.target.value)
                  }
                  placeholder="Phone number"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Parent / Guardian Email
                </label>

                <input
                  type="email"
                  value={parentEmail}
                  onChange={(event) =>
                    setParentEmail(event.target.value)
                  }
                  placeholder="Email address"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* NOTES */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Notes
                </label>

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  placeholder="Additional information about the student..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              {/* SUBMIT */}

              <div className="flex gap-3 md:col-span-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingId
                      ? 'Save Changes'
                      : 'Add Student'}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* SEARCH */}

        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Search Students
          </label>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by name, student ID, class, parent or phone..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
          />

          <p className="mt-3 text-sm text-slate-500">
            Showing {filteredStudents.length} of{' '}
            {students.length} students
          </p>

        </div>

        {/* STUDENTS */}

        {loading ? (

          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-700">
              Loading students...
            </div>
          </div>

        ) : filteredStudents.length === 0 ? (

          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              🎓
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              {students.length === 0
                ? 'No students yet'
                : 'No students found'}
            </h2>

            <p className="mt-2 text-slate-500">
              {students.length === 0
                ? 'Add your first student to get started.'
                : 'Try changing your search.'}
            </p>

            {students.length === 0 && (
              <button
                type="button"
                onClick={startAddStudent}
                className="mt-5 rounded-xl bg-green-800 px-5 py-3 font-semibold text-white hover:bg-green-700"
              >
                + Add Student
              </button>
            )}

          </div>

        ) : (

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredStudents.map((student) => (

              <article
                key={student.id}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-2xl">
                    🎓
                  </div>

                  <div className="flex-1">

                    <h2 className="text-lg font-bold text-slate-900">
                      {student.full_name}
                    </h2>

                    {student.student_id && (
                      <p className="mt-1 text-sm font-medium text-green-700">
                        ID: {student.student_id}
                      </p>
                    )}

                  </div>

                </div>

                <div className="mt-5 space-y-2 text-sm">

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Class
                    </span>

                    <span className="font-medium text-slate-900">
                      {student.class_name || 'Not provided'}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Gender
                    </span>

                    <span className="font-medium text-slate-900">
                      {student.gender || 'Not provided'}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Parent
                    </span>

                    <span className="max-w-[60%] text-right font-medium text-slate-900">
                      {student.parent_name || 'Not provided'}
                    </span>
                  </div>

                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedStudent(student)
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Details
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      startEditStudent(student)
                    }
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteStudent(student)
                    }
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

      {/* STUDENT DETAILS MODAL */}

      {selectedStudent && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b p-6">

              <div>

                <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                  Student Details
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedStudent.full_name}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedStudent(null)
                }
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>

            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Student ID
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedStudent.student_id ||
                    'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Class
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedStudent.class_name ||
                    'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Gender
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedStudent.gender ||
                    'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Date of Birth
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {formatDate(
                    selectedStudent.date_of_birth
                  )}
                </p>
              </div>

              <div className="md:col-span-2">
                <h3 className="border-b pb-2 text-sm font-bold uppercase tracking-wider text-green-800">
                  Parent / Guardian
                </h3>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Name
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedStudent.parent_name ||
                    'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Phone
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedStudent.parent_phone ||
                    'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Email
                </p>

                <p className="mt-1 break-words font-medium text-slate-900">
                  {selectedStudent.parent_email ||
                    'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Address
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedStudent.address ||
                    'Not provided'}
                </p>
              </div>

              <div className="md:col-span-2">

                <h3 className="border-b pb-2 text-sm font-bold uppercase tracking-wider text-green-800">
                  Notes
                </h3>

                <p className="mt-3 whitespace-pre-wrap text-slate-700">
                  {selectedStudent.notes ||
                    'No additional notes.'}
                </p>

              </div>

            </div>

            <div className="flex justify-end gap-3 border-t bg-slate-50 p-5">

              <button
                type="button"
                onClick={() => {
                  const student = selectedStudent
                  setSelectedStudent(null)
                  startEditStudent(student)
                }}
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
              >
                Edit Student
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedStudent(null)
                }
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100"
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
