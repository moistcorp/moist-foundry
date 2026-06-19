'use client'
import Link from 'next/link'
import Image from 'next/image'
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
    <header className="w-full border-b border-[#E5E5E5] bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo3.png"
            alt="Moist Foundry"
            width={140}
            height={60}
            className="h-6 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-[#111111]/60 hover:text-[#111111] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/configure"
          className="hidden md:inline-flex bg-[#111111] text-white text-sm px-5 py-2.5 hover:bg-black transition-colors"
        >
          Start designing
        </Link>

        {/* Mobile hamburger */}
        <button className="md:hidden flex flex-col gap-1.5" onClick={() => setOpen(!open)}>
          <span className="block w-5 h-0.5 bg-[#111111]"></span>
          <span className="block w-5 h-0.5 bg-[#111111]"></span>
          <span className="block w-5 h-0.5 bg-[#111111]"></span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 text-sm border-t border-[#E5E5E5] pt-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-[#111111]/70" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link
            href="/configure"
            className="bg-[#111111] text-white px-5 py-3 text-center text-sm"
            onClick={() => setOpen(false)}
          >
            Start designing
          </Link>
        </div>
      )}
    </header>
  )
}