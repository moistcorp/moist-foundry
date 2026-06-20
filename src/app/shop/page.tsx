import Link from 'next/link'
import { products } from '@/lib/products'
import type { Metadata } from 'next'
import { generateMeta } from '@/lib/seo'

export const metadata: Metadata = generateMeta({
  title: 'Shop',
  description: 'Shop Moist Foundry\'s own line — designed and manufactured in-house. Heavyweight tees, hoodies, sweatpants, and more.',
  path: '/shop',
})

export default function Shop() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <p className="text-xs text-[#111111]/40 font-medium mb-4 tracking-widest uppercase">Moist Foundry</p>
        <h1 className="text-5xl font-bold text-[#111111] leading-tight mb-4 tracking-tight">Shop</h1>
        <p className="text-[#111111]/50 max-w-lg text-lg">
          Our own line. Designed and manufactured in-house. Small runs, no restocks.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="border border-[#E5E5E5] px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
          <p className="text-sm text-[#111111]/60">
            All pieces manufactured at our Greater Noida facility. Ships within 7 days.
          </p>
          <div className="flex gap-6 text-xs text-[#111111]/40 shrink-0">
            <span>Free shipping above ₹2000</span>
            <span>Easy returns</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E5E5]">
          {products.map(p => (
            <Link key={p.id} href={`/shop/${p.slug}`}
              className="group bg-white flex flex-col hover:bg-[#F7F7F7] transition-colors">
              <div className="relative w-full aspect-square bg-[#F7F7F7] flex items-center justify-center">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-[#111111]/20 uppercase tracking-wide">Product photo</span>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="text-sm font-semibold text-[#111111] leading-snug group-hover:underline">{p.name}</h3>
                <p className="text-xs text-[#111111]/40">{p.gsm} GSM{p.fits ? ` · ${p.fits[0]} fit` : ''}</p>
                <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5] mt-auto">
                  <p className="text-base font-bold text-[#111111]">&#8377;{p.price.toLocaleString('en-IN')}</p>
                  <span className="text-xs text-[#111111]/40">{p.sizes.length > 1 ? `${p.sizes.length} sizes` : p.sizes[0]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#F7F7F7] border-t border-[#E5E5E5] py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-1 tracking-tight">Want merch like this for your brand?</h2>
            <p className="text-[#111111]/50 text-sm">Custom apparel for brands, cafes, and companies. MOQ 50 pieces.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/configure" className="bg-[#111111] text-white px-6 py-3 text-sm font-medium hover:bg-black transition">Start designing</Link>
            <Link href="/catalogue" className="border border-[#111111] text-[#111111] px-6 py-3 text-sm font-medium hover:bg-[#111111] hover:text-white transition">View catalogue</Link>
          </div>
        </div>
      </section>
    </>
  )
}