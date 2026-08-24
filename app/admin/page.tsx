'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const sections = [
  {
    title: 'Students',
    description: 'Manage student records and information.',
    icon: '🎓',
    href: '/admin/students',
  },
  {
    title: 'Teachers & Staff',
    description: 'Manage teachers and school staff.',
    icon: '👩‍🏫',
    href: '/admin/teachers',
  },
  {
    title: 'Admissions',
    description: 'View and manage admission applications.',
    icon: '📝',
    href: '/admin/admissions',
  },
  {
    title: 'Announcements',
    description: 'Create and manage school announcements.',
    icon: '📢',
    href: '/admin/announcements',
  },
  {
    title: 'Events',
    description: 'Manage upcoming school events.',
    icon: '📅',
    href: '/admin/events',
  },
  {
    title: 'Gallery',
    description: 'Upload and manage school photographs.',
    icon: '🖼️',
    href: '/admin/gallery',
  },
  {
    title: 'Facilities',
    description: 'Manage school facilities and descriptions.',
    icon: '🏫',
    href: '/admin/facilities',
  },
  {
    title: 'Enquiries',
    description: 'View messages from parents and visitors.',
    icon: '📨',
    href: '/admin/enquiries',
  },
  {
    title: 'Website Content',
    description: 'Manage important website content.',
    icon: '🌐',
    href: '/admin/content',
  },
]

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()

    router.push('/admin/login')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 bg-slate-900 text-white md:block">

          <div className="border-b border-slate-800 px-6 py-6">
            <h1 className="text-lg font-bold">
              Pleasantville Academy
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Admin Portal
            </p>
          </div>

          <nav className="p-4">

            <Link
              href="/admin"
              className="flex items-center rounded-lg bg-white/10 px-4 py-3 text-sm font-medium"
            >
              📊
              <span className="ml-3">Dashboard</span>
            </Link>

            <Link
              href="/"
              className="mt-2 flex items-center rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              🌐
              <span className="ml-3">View Website</span>
            </Link>

          </nav>

          <div className="absolute bottom-6 w-64 px-4">
            <button
              onClick={handleLogout}
              className="w-full rounded-lg px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
            >
              🚪 Logout
            </button>
          </div>

        </aside>

        {/* Main */}
        <section className="flex-1">

          {/* Header */}
          <header className="border-b bg-white px-6 py-5">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Admin Dashboard
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage Pleasantville Academy.
                </p>
              </div>

              <div className="flex gap-3">

                <Link
                  href="/"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  View Website
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 md:hidden"
                >
                  Logout
                </button>

              </div>

            </div>

          </header>

          <div className="p-6">

            {/* Welcome */}
            <div className="rounded-2xl bg-slate-900 p-6 text-white">

              <p className="text-sm text-slate-400">
                Welcome back
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                Pleasantville Academy
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Manage your school website, admissions, events,
                announcements, gallery and school information from
                one place.
              </p>

            </div>

            {/* Statistics */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Students
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  0
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Teachers
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  0
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Applications
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  0
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Enquiries
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  0
                </p>
              </div>

            </div>

            {/* Management */}
            <div className="mt-8">

              <h3 className="text-xl font-bold text-slate-900">
                School Management
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Select an area to manage.
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {sections.map((section) => (
                  <Link
                    key={section.title}
                    href={section.href}
                    className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                      {section.icon}
                    </div>

                    <h4 className="mt-5 font-bold text-slate-900">
                      {section.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {section.description}
                    </p>

                    <p className="mt-5 text-sm font-semibold text-slate-900">
                      Manage →
                    </p>

                  </Link>
                ))}

              </div>

            </div>

          </div>

        </section>

      </div>
    </main>
  )
}
