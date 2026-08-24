'use client'

import Link from 'next/link'

export default function TeachersAdminPage() {
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
            Teachers & Staff
          </h1>

          <p className="mt-2 text-slate-500">
            Manage teachers and school staff.
          </p>

        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="rounded-2xl bg-white p-8 shadow-sm">

          <div className="text-center">

            <div className="text-5xl">
              👩‍🏫
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Teachers & Staff Management
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Staff management is ready to be configured.
              You can use this section to manage teachers,
              administrators and other school staff.
            </p>

          </div>

        </div>

      </section>

    </main>
  )
}
