'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type GalleryItem = {
  id: number
  title: string
  image_url: string | null
  category: string | null
  featured: boolean
  created_at: string
}

export default function Gallery() {
  const supabase = createClient()

  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadGallery() {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: true })

      if (!error) {
        setGalleryImages(data || [])
      }

      setLoading(false)
    }

    loadGallery()
  }, [])

  return (
    <section
      id="gallery"
      className="py-20 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-5xl font-bold text-green-800">
            School Gallery
          </h2>

          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            A glimpse into learning, creativity, friendships, and memorable
            moments at Pleasantville Academy.
          </p>

        </div>

        {/* Loading */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-96 rounded-2xl bg-green-100 animate-pulse"
              />
            ))}

          </div>
        )}

        {/* Gallery */}
        {!loading && galleryImages.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {galleryImages.map((item) => (

              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition"
              >

                <div className="relative h-72 bg-green-100">

                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-center">

                      <div className="text-green-800 px-6">

                        <p className="font-bold text-lg">
                          {item.title}
                        </p>

                        <p className="text-sm mt-2">
                          Image coming soon
                        </p>

                      </div>

                    </div>
                  )}

                </div>

                <div className="p-5">

                  <h3 className="font-bold text-gray-800">
                    {item.title}
                  </h3>

                  {item.category && (
                    <p className="mt-1 text-sm text-gray-500">
                      {item.category}
                    </p>
                  )}

                </div>

              </div>

            ))}

          </div>
        )}

        {/* Empty state */}
        {!loading && galleryImages.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <p className="font-semibold text-gray-700">
              Our gallery is being updated.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Please check back soon for photographs from Pleasantville Academy.
            </p>

          </div>
        )}

      </div>
    </section>
  )
}
