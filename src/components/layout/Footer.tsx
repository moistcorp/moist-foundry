import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#2B2B2B]/10 mt-24 px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 text-sm text-[#2B2B2B]/70">
        <div>
          <p className="font-bold text-[#2B2B2B] text-base mb-1">Moist Foundry</p>
          <p>Powered by Moist Corp</p>
          <p>Greater Noida, Uttar Pradesh, India</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/catalogue" className="hover:text-[#C1623D]">Catalogue</Link>
          <Link href="/how-it-works" className="hover:text-[#C1623D]">How it works</Link>
          <Link href="/pricing" className="hover:text-[#C1623D]">Pricing</Link>
          <Link href="/contact" className="hover:text-[#C1623D]">Contact</Link>
        </div>
        <div className="flex flex-col gap-2">
          <a href="https://moistcorp.com" target="_blank" className="hover:text-[#C1623D]">Moist Corp</a>
          <a href="mailto:hello@moistfoundry.com" className="hover:text-[#C1623D]">hello@moistfoundry.com</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 text-xs text-[#2B2B2B]/40">
        © {new Date().getFullYear()} Moist Foundry. All rights reserved.
      </div>
    </footer>
  )
}