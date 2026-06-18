'use client'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full border-b border-[#2B2B2B]/10 bg-[#F5F1EA] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight text-[#2B2B2B]">
          Moist Foundry
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="hover:text-[#C1623D] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/configure"
          className="hidden md:inline-flex bg-[#2B2B2B] text-[#F5F1EA] text-sm px-5 py-2.5 rounded-sm hover:bg-[#C1623D] transition-colors"
        >
          Start designing
        </Link>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <span className="block w-5 h-0.5 bg-[#2B2B2B] mb-1"></span>
          <span className="block w-5 h-0.5 bg-[#2B2B2B] mb-1"></span>
          <span className="block w-5 h-0.5 bg-[#2B2B2B]"></span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 text-sm border-t border-[#2B2B2B]/10">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link
            href="/configure"
            className="bg-[#2B2B2B] text-[#F5F1EA] px-5 py-2.5 rounded-sm text-center"
            onClick={() => setOpen(false)}
          >
            Start designing
          </Link>
        </div>
      )}
    </header>
  )
}