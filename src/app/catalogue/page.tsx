'use client'
import Link from 'next/link'
import { products, categories } from '@/lib/products'
import { useState, useRef } from 'react'

export default function Catalogue() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  function scrollToCategory(cat: string) {
    setActiveCategory(cat)
    sectionRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const filtered = activeCategory
    ? products.filter(p => p.category === activeCategory)
    : products

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <p className="text-xs text-[#111111]/40 font-medium mb-4 tracking-widest uppercase">Products</p>
        <h1 className="text-5xl font-bold text-[#111111] leading-tight mb-4 tracking-tight">Our catalogue</h1>
        <p className="text-[#111111]/50 max-w-lg text-lg">
          Premium blanks, manufactured in-house. Every product available in custom colors, prints, and branding.
        </p>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-[73px] z-40 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 px-4 py-1.5 text-xs border transition-colors ${
                activeCategory === null
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'border-[#E5E5E5] text-[#111111]/50 hover:border-[#111111] hover:text-[#111111]'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => scrollToCategory(cat)}
                className={`shrink-0 px-4 py-1.5 text-xs border transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'border-[#E5E5E5] text-[#111111]/50 hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeCategory ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E5E5]">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          categories.map(cat => {
            const catProducts = products.filter(p => p.category === cat)
            if (catProducts.length === 0) return null
            return (
              <section
                key={cat}
                ref={el => { sectionRefs.current[cat] = el }}
                className="mb-16"
              >
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xs font-medium uppercase tracking-widest text-[#111111]/40 shrink-0">{cat}</h2>
                  <div className="flex-1 h-px bg-[#E5E5E5]" />
                  <span className="text-xs text-[#111111]/30 shrink-0">{catProducts.length} products</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E5E5]">
                  {catProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )
          })
        )}
      </div>

      <section className="bg-[#111111] py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Ready to customise?</h2>
            <p className="text-white/40 text-sm">MOQ 50 pieces. Quote within 24 hours.</p>
          </div>
          <Link href="/configure" className="bg-white text-[#111111] px-7 py-3.5 text-sm font-medium hover:bg-[#E5E5E5] transition whitespace-nowrap">
            Start designing
          </Link>
        </div>
      </section>
    </>
  )
}

function ProductCard({ product: p }: { product: any }) {
  return (
    <Link href={`/catalogue/${p.slug}`}
      className="group bg-white flex flex-col hover:bg-[#F7F7F7] transition-colors">
      {p.image && (
  <div className="w-full aspect-square bg-[#F7F7F7] flex items-center justify-center overflow-hidden">
  {p.image ? (
    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
  ) : (
    <span className="text-xs text-[#111111]/20 uppercase tracking-wide">Product image</span>
  )}
</div>
)}
      <div className="p-5 flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#111111] group-hover:underline">{p.name}</h3>
          <p className="text-xs text-[#111111]/40 mt-0.5">{p.gsm} GSM{p.fits ? ` · ${p.fits[0]} fit` : ''}</p>
        </div>
        <p className="text-xs text-[#111111]/50 leading-relaxed">{p.description}</p>
        <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5]">
          <p className="text-sm font-bold">from &#8377;{p.price}</p>
          <span className="text-xs text-[#111111]/40 group-hover:text-[#111111] transition-colors">View details</span>
        </div>
      </div>
    </Link>
  )
}