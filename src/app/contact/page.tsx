'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', type: '', message: ''
  })

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to email service (Resend/Brevo)
    setSubmitted(true)
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <p className="text-sm text-[#C1623D] font-medium mb-4 tracking-wide uppercase">Get in touch</p>
        <h1 className="text-5xl font-bold text-[#2B2B2B] max-w-xl leading-tight mb-6">
          Tell us about your project
        </h1>
        <p className="text-[#2B2B2B]/60 max-w-lg text-lg">
          Fill in the form and we&apos;ll get back to you with a quote within 24 hours.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-16">

        {/* Form */}
        <div>
          {submitted ? (
            <div className="bg-[#2B2B2B] text-[#F5F1EA] p-10 rounded-sm">
              <h2 className="text-2xl font-bold mb-2">We&apos;ve got your request.</h2>
              <p className="text-[#F5F1EA]/60">Our team will reach out within 24 hours with a detailed quote.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Full name *</label>
                  <input
                    name="name" required onChange={handle}
                    className="border border-[#2B2B2B]/20 bg-white px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-[#C1623D]"
                    placeholder="Rahul Sharma"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Company *</label>
                  <input
                    name="company" required onChange={handle}
                    className="border border-[#2B2B2B]/20 bg-white px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-[#C1623D]"
                    placeholder="Your Brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Email *</label>
                  <input
                    name="email" type="email" required onChange={handle}
                    className="border border-[#2B2B2B]/20 bg-white px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-[#C1623D]"
                    placeholder="you@company.com"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    name="phone" onChange={handle}
                    className="border border-[#2B2B2B]/20 bg-white px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-[#C1623D]"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">What are you looking for? *</label>
                <select
                  name="type" required onChange={handle}
                  className="border border-[#2B2B2B]/20 bg-white px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-[#C1623D]"
                >
                  <option value="">Select an option</option>
                  <option>T-shirts</option>
                  <option>Hoodies / Sweatshirts</option>
                  <option>Polos</option>
                  <option>Tote bags</option>
                  <option>Caps</option>
                  <option>Mixed / Multiple products</option>
                  <option>Not sure yet</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Tell us more</label>
                <textarea
                  name="message" rows={5} onChange={handle}
                  className="border border-[#2B2B2B]/20 bg-white px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-[#C1623D] resize-none"
                  placeholder="Quantity, timeline, any specific requirements..."
                />
              </div>

              <button
                type="submit"
                className="bg-[#2B2B2B] text-[#F5F1EA] px-6 py-3.5 text-sm font-medium rounded-sm hover:bg-[#C1623D] transition-colors"
              >
                Submit request
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-10 pt-2">
          <div>
            <p className="text-sm font-medium text-[#C1623D] mb-2 uppercase tracking-wide">Location</p>
            <p className="text-[#2B2B2B]/70 leading-relaxed">Moist Corp<br />Greater Noida, Uttar Pradesh<br />India</p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#C1623D] mb-2 uppercase tracking-wide">Email</p>
            <a href="mailto:hello@moistfoundry.com" className="text-[#2B2B2B] hover:text-[#C1623D] transition-colors">
              hello@moistfoundry.com
            </a>
          </div>
          <div>
            <p className="text-sm font-medium text-[#C1623D] mb-2 uppercase tracking-wide">MOQ & Turnaround</p>
            <p className="text-[#2B2B2B]/70">50 pieces minimum. 35-day standard production. Rush available on request.</p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#C1623D] mb-2 uppercase tracking-wide">Or start directly</p>
            
             <Link
              href="/configure"
              className="inline-block border border-[#2B2B2B] text-[#2B2B2B] px-5 py-2.5 text-sm rounded-sm hover:bg-[#2B2B2B] hover:text-[#F5F1EA] transition-colors"
            >
              Open the configurator
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}