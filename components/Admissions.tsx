'use client'

import {
  Search,
  FileText,
  UserCheck,
  GraduationCap,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const steps = [
  {
    title: 'Make an Enquiry',
    description:
      'Contact Pleasantville Academy to learn more about our programs and admission requirements.',
    icon: Search,
  },
  {
    title: 'Submit Application',
    description:
      'Complete the admission process and provide the required information for your child.',
    icon: FileText,
  },
  {
    title: 'Assessment & Review',
    description:
      "Allow our team to understand your child's learning needs and placement.",
    icon: UserCheck,
  },
  {
    title: 'Begin Learning',
    description:
      'Welcome your child into our nurturing and supportive learning environment.',
    icon: GraduationCap,
  },
]

export default function Admissions() {
  const supabase = createClient()

  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    child_first_name: '',
    child_last_name: '',
    date_of_birth: '',
    gender: '',
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    address: '',
    class_applied_for: '',
    previous_school: '',
    message: '',
  })

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setSubmitting(true)
    setError('')
    setSuccess(false)

    const { error } = await supabase
      .from('admissions')
      .insert({
        child_first_name: form.child_first_name,
        child_last_name: form.child_last_name,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender || null,
        parent_name: form.parent_name,
        parent_email: form.parent_email,
        parent_phone: form.parent_phone,
        address: form.address || null,
        class_applied_for: form.class_applied_for,
        previous_school: form.previous_school || null,
        message: form.message || null,
      })

    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)

    setForm({
      child_first_name: '',
      child_last_name: '',
      date_of_birth: '',
      gender: '',
      parent_name: '',
      parent_email: '',
      parent_phone: '',
      address: '',
      class_applied_for: '',
      previous_school: '',
      message: '',
    })
  }

  return (
    <>
      <section
        id="admissions"
        className="bg-green-800 py-20 text-white"
      >
        <div className="mx-auto max-w-7xl px-6">

          {/* Heading */}

          <div className="mb-12 text-center">

            <h2 className="text-3xl font-bold md:text-5xl">
              Admissions
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-green-100">
              Begin your child's journey with Pleasantville Academy.
              We are committed to providing a supportive environment
              where children can explore, evolve, and excel.
            </p>

          </div>

          {/* Steps */}

          <div className="grid gap-8 md:grid-cols-4">

            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <div
                  key={step.title}
                  className="relative rounded-2xl bg-white p-6 text-gray-800"
                >

                  <div className="absolute -top-5 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
                    {index + 1}
                  </div>

                  <div className="mt-5">

                    <Icon
                      size={40}
                      className="mb-4 text-green-700"
                    />

                    <h3 className="mb-3 text-lg font-bold">
                      {step.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-gray-600">
                      {step.description}
                    </p>

                  </div>

                </div>
              )
            })}

          </div>

          {/* Button */}

          <div className="mt-12 text-center">

            <button
              type="button"
              onClick={() => {
                setShowForm(true)
                setSuccess(false)
                setError('')
              }}
              className="rounded-full bg-orange-500 px-10 py-4 font-bold transition hover:bg-orange-600"
            >
              Start Admission Process
            </button>

          </div>

        </div>
      </section>

      {/* Admission Modal */}

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 px-4 py-8">

          <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b px-6 py-5">

              <div>

                <h2 className="text-2xl font-bold text-green-800">
                  Admission Application
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Please provide the information below.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close admission form"
              >
                <X size={24} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >

              {/* Child Information */}

              <div>

                <h3 className="mb-4 text-lg font-bold text-green-800">
                  Child Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      First Name *
                    </label>

                    <input
                      type="text"
                      name="child_first_name"
                      value={form.child_first_name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Last Name *
                    </label>

                    <input
                      type="text"
                      name="child_last_name"
                      value={form.child_last_name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="date_of_birth"
                      value={form.date_of_birth}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Gender
                    </label>

                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-700"
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
                  </div>

                </div>

              </div>

              {/* Parent Information */}

              <div>

                <h3 className="mb-4 text-lg font-bold text-green-800">
                  Parent / Guardian Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Parent / Guardian Name *
                    </label>

                    <input
                      type="text"
                      name="parent_name"
                      value={form.parent_name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Phone Number *
                    </label>

                    <input
                      type="tel"
                      name="parent_phone"
                      value={form.parent_phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-700"
                    />
                  </div>

                  <div className="md:col-span-2">

                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Email Address *
                    </label>

                    <input
                      type="email"
                      name="parent_email"
                      value={form.parent_email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-700"
                    />

                  </div>

                  <div className="md:col-span-2">

                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-700"
                    />

                  </div>

                </div>

              </div>

              {/* Application Information */}

              <div>

                <h3 className="mb-4 text-lg font-bold text-green-800">
                  Application Information
                </h3>

                <div className="space-y-4">

                  <div>

                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Class Applying For *
                    </label>

                    <select
                      name="class_applied_for"
                      value={form.class_applied_for}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-700"
                    >

                      <option value="">
                        Select class
                      </option>

                      <option value="Creche">
                        Creche
                      </option>

                      <option value="Nursery 1">
                        Nursery 1
                      </option>

                      <option value="Nursery 2">
                        Nursery 2
                      </option>

                      <option value="Nursery 3">
                        Nursery 3
                      </option>

                      <option value="Primary 1">
                        Primary 1
                      </option>

                      <option value="Primary 2">
                        Primary 2
                      </option>

                      <option value="Primary 3">
                        Primary 3
                      </option>

                      <option value="Primary 4">
                        Primary 4
                      </option>

                      <option value="Primary 5">
                        Primary 5
                      </option>

                      <option value="Primary 6">
                        Primary 6
                      </option>

                    </select>

                  </div>

                  <div>

                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Previous School
                    </label>

                    <input
                      type="text"
                      name="previous_school"
                      value={form.previous_school}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-700"
                    />

                  </div>

                  <div>

                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Additional Information
                    </label>

                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us anything else you would like the school to know."
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-700"
                    />

                  </div>

                </div>

              </div>

              {/* Error */}

              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}

              {success && (
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                  <strong>Application submitted successfully.</strong>
                  <br />
                  Thank you. Pleasantville Academy will review your application and contact you.
                </div>
              )}

              {/* Submit */}

              <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-green-800 px-8 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? 'Submitting...'
                    : 'Submit Application'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </>
  )
}
