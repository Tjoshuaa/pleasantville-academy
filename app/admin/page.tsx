'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
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

type Statistics = {
  students: number
  teachers: number
  applications: number
  enquiries: number
  announcements: number
  events: number
  gallery: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [stats, setStats] = useState<Statistics>({
    students: 0,
    teachers: 0,
    applications: 0,
    enquiries: 0,
    announcements: 0,
    events: 0,
    gallery: 0,
  })

  const [loadingStats, setLoadingStats] = useState(true)

  async function loadStatistics() {
    setLoadingStats(true)

    const [
      studentsResult,
      teachersResult,
      applicationsResult,
      enquiriesResult,
      announcementsResult,
      eventsResult,
      galleryResult,
    ] = await Promise.all([
      supabase
        .from('students')
        .select('*', { count: 'exact', head: true }),

      supabase
        .from('teachers')
        .select('*', { count: 'exact', head: true }),

      supabase
        .from('admissions')
        .select('*', { count: 'exact', head: true }),

      supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true }),

      supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true }),

      supabase
        .from('events')
        .select('*', { count: 'exact', head: true }),

      supabase
        .from('gallery')
        .select('*', { count: 'exact', head: true }),
    ])

    setStats({
      students: studentsResult.count || 0,
      teachers: teachersResult.count || 0,
      applications: applicationsResult.count || 0,
      enquiries: enquiriesResult.count || 0,
      announcements: announcementsResult.count || 0,
      events: eventsResult.count || 0,
      gallery: galleryResult.count || 0,
    })

    setLoadingStats(false)
  }

  useEffect(() => {
    loadStatistics()
  }, [])

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
              <span className="ml-3">
                Dashboard
              </span>
            </Link>

            <Link
              href="/"
              className="mt-2 flex items-center rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              🌐
              <span className="ml-3">
                View Website
              </span>
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

            {/* Live Statistics */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Students */}

              <Link
                href="/admin/students"
                className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <p className="text-sm text-slate-500">
                  Students
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loadingStats ? '...' : stats.students}
                </p>

                <p className="mt-2 text-xs font-semibold text-slate-400">
                  Manage students →
                </p>

              </Link>

              {/* Teachers */}

              <Link
                href="/admin/teachers"
                className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <p className="text-sm text-slate-500">
                  Teachers & Staff
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loadingStats ? '...' : stats.teachers}
                </p>

                <p className="mt-2 text-xs font-semibold text-slate-400">
                  Manage staff →
                </p>

              </Link>

              {/* Admissions */}

              <Link
                href="/admin/admissions"
                className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <p className="text-sm text-slate-500">
                  Applications
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loadingStats ? '...' : stats.applications}
                </p>

                <p className="mt-2 text-xs font-semibold text-slate-400">
                  View applications →
                </p>

              </Link>

              {/* Enquiries */}

              <Link
                href="/admin/enquiries"
                className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <p className="text-sm text-slate-500">
                  Enquiries
                </p>

                <p className="mt-2 text-3xl font-bold text-green-700">
                  {loadingStats ? '...' : stats.enquiries}
                </p>

                <p className="mt-2 text-xs font-semibold text-slate-400">
                  View enquiries →
                </p>

              </Link>

            </div>

            {/* Website Statistics */}

            <div className="mt-8">

              <h3 className="text-xl font-bold text-slate-900">
                Website Overview
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Current content published across your website.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">

                <Link
                  href="/admin/gallery"
                  className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-2xl">
                      🖼️
                    </span>

                    <span className="text-2xl font-bold text-slate-900">
                      {loadingStats ? '...' : stats.gallery}
                    </span>

                  </div>

                  <h4 className="mt-4 font-bold text-slate-900">
                    Gallery Images
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage school photos
                  </p>

                </Link>

                <Link
                  href="/admin/events"
                  className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-2xl">
                      📅
                    </span>

                    <span className="text-2xl font-bold text-slate-900">
                      {loadingStats ? '...' : stats.events}
                    </span>

                  </div>

                  <h4 className="mt-4 font-bold text-slate-900">
                    Events
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage school events
                  </p>

                </Link>

                <Link
                  href="/admin/announcements"
                  className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-2xl">
                      📢
                    </span>

                    <span className="text-2xl font-bold text-slate-900">
                      {loadingStats ? '...' : stats.announcements}
                    </span>

                  </div>

                  <h4 className="mt-4 font-bold text-slate-900">
                    Announcements
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage school notices
                  </p>

                </Link>

              </div>

            </div>

            {/* Management */}

            <div className="mt-10">

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
