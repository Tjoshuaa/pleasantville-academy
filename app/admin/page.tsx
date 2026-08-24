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
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950 md:flex md:flex-col">

          {/* BRAND */}

          <div className="border-b border-slate-800 px-6 py-7">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-700 text-xl shadow-lg shadow-green-900/20">
                🏫
              </div>

              <div>
                <h1 className="text-base font-bold text-white">
                  Pleasantville Academy
                </h1>

                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  Administration Portal
                </p>
              </div>

            </div>

          </div>

          {/* NAVIGATION */}

          <nav className="flex-1 p-4">

            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
              Main Menu
            </p>

            <Link
              href="/admin"
              className="flex items-center rounded-xl border border-green-700/30 bg-green-700/10 px-4 py-3 text-sm font-semibold text-green-400"
            >
              <span className="text-lg">📊</span>

              <span className="ml-3">
                Dashboard
              </span>
            </Link>

            <Link
              href="/"
              className="mt-2 flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >
              <span className="text-lg">🌐</span>

              <span className="ml-3">
                View Website
              </span>
            </Link>

          </nav>

          {/* LOGOUT */}

          <div className="border-t border-slate-800 p-4">

            <button
              onClick={handleLogout}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              🚪
              <span className="ml-3">
                Logout
              </span>
            </button>

          </div>

        </aside>

        {/* MAIN CONTENT */}

        <section className="min-w-0 flex-1">

          {/* HEADER */}

          <header className="border-b border-slate-800 bg-slate-950/95 px-6 py-5 backdrop-blur">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-500">
                  Administration
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  Admin Dashboard
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage Pleasantville Academy.
                </p>

              </div>

              <div className="flex gap-3">

                <Link
                  href="/"
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                >
                  View Website
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 md:hidden"
                >
                  Logout
                </button>

              </div>

            </div>

          </header>

          <div className="p-6 lg:p-8">

            {/* WELCOME */}

            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-7 shadow-xl">

              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-green-700/10 blur-3xl" />

              <div className="relative">

                <p className="text-sm font-medium text-green-500">
                  Welcome back
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white lg:text-3xl">
                  Pleasantville Academy
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  Manage your school website, admissions, events,
                  announcements, gallery and school information from
                  one professional administration portal.
                </p>

              </div>

            </div>

            {/* STATISTICS */}

            <div className="mt-8">

              <div className="mb-4">

                <h3 className="text-lg font-bold text-white">
                  Quick Statistics
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Overview of your school records.
                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* STUDENTS */}

                <Link
                  href="/admin/students"
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition hover:-translate-y-1 hover:border-green-700/50 hover:bg-slate-900/80"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-2xl">
                      🎓
                    </span>

                    <span className="text-xs font-semibold text-slate-600">
                      STUDENTS
                    </span>

                  </div>

                  <p className="mt-5 text-3xl font-bold text-white">
                    {loadingStats ? '...' : stats.students}
                  </p>

                  <p className="mt-2 text-xs font-semibold text-slate-500 group-hover:text-green-400">
                    Manage students →
                  </p>

                </Link>

                {/* TEACHERS */}

                <Link
                  href="/admin/teachers"
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition hover:-translate-y-1 hover:border-green-700/50 hover:bg-slate-900/80"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-2xl">
                      👩‍🏫
                    </span>

                    <span className="text-xs font-semibold text-slate-600">
                      STAFF
                    </span>

                  </div>

                  <p className="mt-5 text-3xl font-bold text-white">
                    {loadingStats ? '...' : stats.teachers}
                  </p>

                  <p className="mt-2 text-xs font-semibold text-slate-500 group-hover:text-green-400">
                    Manage staff →
                  </p>

                </Link>

                {/* APPLICATIONS */}

                <Link
                  href="/admin/admissions"
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition hover:-translate-y-1 hover:border-green-700/50 hover:bg-slate-900/80"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-2xl">
                      📝
                    </span>

                    <span className="text-xs font-semibold text-slate-600">
                      ADMISSIONS
                    </span>

                  </div>

                  <p className="mt-5 text-3xl font-bold text-white">
                    {loadingStats ? '...' : stats.applications}
                  </p>

                  <p className="mt-2 text-xs font-semibold text-slate-500 group-hover:text-green-400">
                    View applications →
                  </p>

                </Link>

                {/* ENQUIRIES */}

                <Link
                  href="/admin/enquiries"
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition hover:-translate-y-1 hover:border-green-700/50 hover:bg-slate-900/80"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-2xl">
                      📨
                    </span>

                    <span className="text-xs font-semibold text-slate-600">
                      ENQUIRIES
                    </span>

                  </div>

                  <p className="mt-5 text-3xl font-bold text-green-500">
                    {loadingStats ? '...' : stats.enquiries}
                  </p>

                  <p className="mt-2 text-xs font-semibold text-slate-500 group-hover:text-green-400">
                    View enquiries →
                  </p>

                </Link>

              </div>

            </div>

            {/* WEBSITE OVERVIEW */}

            <div className="mt-10">

              <h3 className="text-xl font-bold text-white">
                Website Overview
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Current content published across your website.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">

                <Link
                  href="/admin/gallery"
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-green-700/50 hover:bg-slate-900/80"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-2xl">
                      🖼️
                    </span>

                    <span className="text-2xl font-bold text-white">
                      {loadingStats ? '...' : stats.gallery}
                    </span>

                  </div>

                  <h4 className="mt-4 font-bold text-white">
                    Gallery Images
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage school photos
                  </p>

                </Link>

                <Link
                  href="/admin/events"
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-green-700/50 hover:bg-slate-900/80"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-2xl">
                      📅
                    </span>

                    <span className="text-2xl font-bold text-white">
                      {loadingStats ? '...' : stats.events}
                    </span>

                  </div>

                  <h4 className="mt-4 font-bold text-white">
                    Events
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage school events
                  </p>

                </Link>

                <Link
                  href="/admin/announcements"
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-green-700/50 hover:bg-slate-900/80"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-2xl">
                      📢
                    </span>

                    <span className="text-2xl font-bold text-white">
                      {loadingStats ? '...' : stats.announcements}
                    </span>

                  </div>

                  <h4 className="mt-4 font-bold text-white">
                    Announcements
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage school notices
                  </p>

                </Link>

              </div>

            </div>

            {/* SCHOOL MANAGEMENT */}

            <div className="mt-10">

              <h3 className="text-xl font-bold text-white">
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
                    className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:-translate-y-1 hover:border-green-700/50 hover:bg-slate-900/80 hover:shadow-xl"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 text-2xl">
                      {section.icon}
                    </div>

                    <h4 className="mt-5 font-bold text-white">
                      {section.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {section.description}
                    </p>

                    <p className="mt-5 text-sm font-semibold text-green-500 transition group-hover:text-green-400">
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
