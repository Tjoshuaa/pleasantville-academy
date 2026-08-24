'use client'

import { FormEvent, useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function Contact() {
  const supabase = createClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setSuccess('')
    setError('')

    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!message.trim()) {
      setError('Please enter your message.')
      return
    }

    setSending(true)

    try {
      const { error } = await supabase
        .from('enquiries')
        .insert({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          subject: subject.trim() || null,
          message: message.trim(),
          status: 'new',
        })

      if (error) {
        throw error
      }

      setName('')
      setEmail('')
      setPhone('')
      setSubject('')
      setMessage('')

      setSuccess(
        'Thank you! Your enquiry has been sent successfully. We will get back to you soon.'
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <section
      id="contact"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="mb-12 text-center">

          <h2 className="text-3xl font-bold text-green-800 md:text-5xl">
            Contact Us
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-gray-600">
            Make your children's life special by enrolling them at
            Pleasantville Academy. Contact us today and begin your
            child's learning journey.
          </p>

        </div>

        {/* Contact Cards */}

        <div className="grid gap-8 md:grid-cols-3">

          {/* Address */}

          <div className="rounded-2xl bg-green-50 p-8">

            <MapPin
              size={40}
              className="mb-5 text-green-700"
            />

            <h3 className="mb-3 text-xl font-bold text-green-800">
              Visit Us
            </h3>

            <p className="leading-relaxed text-gray-600">
              Pleasantville Academy
              <br />
              207 Bonny Street,
              <br />
              Town Port Harcourt,
              <br />
              Rivers State, Nigeria.
            </p>

          </div>

          {/* Phone */}

          <div className="rounded-2xl bg-orange-50 p-8">

            <Phone
              size={40}
              className="mb-5 text-orange-600"
            />

            <h3 className="mb-3 text-xl font-bold text-orange-700">
              Call Us
            </h3>

            <a
              href="tel:+2348033153911"
              className="text-gray-600 hover:text-green-700"
            >
              +234 803 315 3911
            </a>

          </div>

          {/* Email */}

          <div className="rounded-2xl bg-gray-50 p-8">

            <Mail
              size={40}
              className="mb-5 text-green-700"
            />

            <h3 className="mb-3 text-xl font-bold text-gray-800">
              Email Us
            </h3>

            <a
              href="mailto:pleasantvilleacademy@gmail.com"
              className="text-gray-600 hover:text-green-700"
            >
              pleasantvilleacademy@gmail.com
            </a>

          </div>

        </div>

        {/* Enquiry Form */}

        <div className="mx-auto mt-16 max-w-4xl">

          <div className="mb-8 text-center">

            <h3 className="text-2xl font-bold text-green-800 md:text-3xl">
              Send Us an Enquiry
            </h3>

            <p className="mt-2 text-gray-600">
              Have a question about admission or our school?
              Send us a message.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-gray-50 p-6 shadow-sm md:p-10"
          >

            <div className="grid gap-6 md:grid-cols-2">

              {/* Name */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full Name *
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Your full name"
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address *
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              {/* Phone */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="+234..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

              {/* Subject */}

              <div>

                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Subject
                </label>

                <select
                  id="subject"
                  value={subject}
                  onChange={(event) =>
                    setSubject(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">
                    Select a subject
                  </option>

                  <option value="Admission Enquiry">
                    Admission Enquiry
                  </option>

                  <option value="School Information">
                    School Information
                  </option>

                  <option value="Fees Enquiry">
                    Fees Enquiry
                  </option>

                  <option value="General Enquiry">
                    General Enquiry
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

              {/* Message */}

              <div className="md:col-span-2">

                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Message *
                </label>

                <textarea
                  id="message"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="How can we help you?"
                  rows={6}
                  required
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />

              </div>

            </div>

            {/* Error */}

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Success */}

            {success && (
              <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* Submit */}

            <div className="mt-6 text-center">

              <button
                type="submit"
                disabled={sending}
                className="rounded-full bg-green-700 px-8 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending
                  ? 'Sending...'
                  : 'Send Enquiry'}
              </button>

            </div>

          </form>

        </div>

        {/* WhatsApp Button */}

        <div className="mt-12 text-center">

          <a
            href="https://wa.me/2348033153911?text=Hello%20Pleasantville%20Academy,%20I%20would%20like%20to%20make%20an%20enquiry%20about%20admission."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-green-700 px-8 py-4 font-bold text-white transition hover:bg-green-800"
          >

            <MessageCircle size={24} />

            Chat On WhatsApp

          </a>

        </div>

      </div>
    </section>
  )
}
