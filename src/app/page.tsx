'use client'
import Link from 'next/link'
import { useState } from 'react'

const steps = [
  { num: '01', title: 'Choose your product', desc: 'Pick from our catalogue — tees, hoodies, sweatshirts, totes, and more.' },
  { num: '02', title: 'Configure & upload', desc: 'Select fabric color, print placement, and upload your artwork.' },
  { num: '03', title: 'We produce & ship', desc: 'Delivered in 35 days or less with full production tracking.' },
]

const stats = [
  { value: '50 pcs', label: 'Minimum order' },
  { value: '35 days', label: 'Production time' },
  { value: '100%', label: 'Made in India' },
]

const industries = [
  { name: 'Hotels & Restaurants', desc: 'Staff uniforms, guest amenities, branded F&B merchandise.', icon: '🏨' },
  { name: 'Music & Events', desc: 'Artist merch, crew wear, event uniforms and giveaways.', icon: '🎵' },
  { name: 'Sports & Fitness', desc: 'Team kits, gym wear, performance and training apparel.', icon: '⚡' },
  { name: 'Arts & Culture', desc: 'Gallery merch, cultural institution apparel, limited editions.', icon: '🎨' },
  { name: 'Creative Studios', desc: 'Agency merch, studio wear, client gifting and onboarding kits.', icon: '✦' },
  { name: 'Companies & Startups', desc: 'Employee swag, brand merchandise, conference and event kits.', icon: '◆' },
]

const estimatorProducts = [
  { name: 'T-Shirt (200 GSM)', base: 280 },
  { name: 'T-Shirt (260 GSM)', base: 340 },
  { name: 'Long Sleeve', base: 420 },
  { name: 'Sweatshirt', base: 580 },
  { name: 'Hoodie', base: 650 },
  { name: 'Tote Bag', base: 180 },
]

function getDiscount(qty: number) {
  if (qty >= 1000) return 0.22
  if (qty >= 500) return 0.17
  if (qty >= 250) return 0.12
  if (qty >= 100) return 0.07
  return 0
}

export default function Home() {
  const [qty, setQty] = useState(50)
  const [selected, setSelected] = useState(estimatorProducts[0].name)

  const product = estimatorProducts.find(p => p.name === selected) ?? estimatorProducts[0]
  const discount = getDiscount(qty)
  const pricePerPiece = Math.round(product.base * (1 - discount))
  const total = pricePerPiece * qty

  return (
    <>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <p className="text-xs text-[#111111]/40 font-medium mb-6 tracking-widest uppercase">Custom apparel, made to order</p>
        <h1 className="text-6xl md:text-8xl font-bold text-[#111111] leading-none max-w-4xl mb-8 tracking-tight">
          Design it.<br />We&apos;ll make it.
        </h1>
        <p className="text-lg text-[#111111]/50 max-w-lg mb-10 leading-relaxed">
          Small batch custom apparel for brands, cafes, and companies. MOQ 50 pieces. Ships in 35 days.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/configure" className="bg-[#111111] text-white px-7 py-3.5 text-sm font-medium hover:bg-black transition-colors">
            Start designing
          </Link>
          <Link href="/catalogue" className="border border-[#111111] text-[#111111] px-7 py-3.5 text-sm font-medium hover:bg-[#111111] hover:text-white transition-colors">
            View catalogue
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#E5E5E5] py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {stats.map(s => (
            <div key={s.value}>
              <p className="text-3xl font-bold text-[#111111]">{s.value}</p>
              <p className="text-xs text-[#111111]/40 mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <p className="text-xs text-[#111111]/40 font-medium mb-3 tracking-widest uppercase">The process</p>
        <h2 className="text-4xl font-bold mb-16 tracking-tight">How it works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map(s => (
            <div key={s.num}>
              <p className="text-5xl font-bold text-[#111111]/8 mb-4 leading-none">{s.num}</p>
              <h3 className="text-base font-semibold mb-2">{s.title}</h3>
              <p className="text-[#111111]/50 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing estimator */}
      <section className="border-t border-[#E5E5E5] py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs text-[#111111]/40 font-medium mb-3 tracking-widest uppercase">Pricing</p>
          <h2 className="text-4xl font-bold mb-2 tracking-tight">Estimate your order</h2>
          <p className="text-[#111111]/50 text-sm mb-10">Adjust quantity and product to get an instant price estimate.</p>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col gap-6">
              {/* Product selector */}
              <div>
                <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Product</p>
                <div className="grid grid-cols-2 gap-2">
                  {estimatorProducts.map(p => (
                    <button key={p.name} type="button" onClick={() => setSelected(p.name)}
                      className={`px-4 py-2.5 text-xs text-left border transition-colors ${
                        selected === p.name
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111] hover:text-[#111111] bg-white'
                      }`}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest">Quantity</p>
                  <span className="text-sm font-bold">{qty} pcs</span>
                </div>
                <input type="range" min={50} max={1000} step={50} value={qty}
                  onChange={e => setQty(Number(e.target.value))}
                  onInput={e => setQty(Number((e.target as HTMLInputElement).value))}
                  className="w-full accent-[#111111]" />
                <div className="flex justify-between text-xs text-[#111111]/30 mt-1">
                  <span>50 pcs</span><span>1000 pcs</span>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="bg-[#111111] p-8 text-white">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Estimate</p>
              <p className="text-sm text-white/60 mb-6">{selected} × {qty} pcs</p>
              <div className="flex flex-col gap-3 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Per piece</span>
                  <span>&#8377;{pricePerPiece.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Volume discount</span>
                    <span>-{(discount * 100).toFixed(0)}%</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t border-white/10 pt-4 mt-1">
                  <span>Total</span>
                  <span>&#8377;{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <p className="text-xs text-white/20 mt-4">Excludes GST and shipping. Final quote sent within 24 hours.</p>
              <Link href="/pricing" className="inline-block mt-6 border border-white/20 text-white text-xs px-4 py-2.5 hover:bg-white hover:text-[#111111] transition-colors">
                Full pricing details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <p className="text-xs text-[#111111]/40 font-medium mb-3 tracking-widest uppercase">Who we work with</p>
        <h2 className="text-4xl font-bold mb-3 tracking-tight">Built for these industries</h2>
        <p className="text-[#111111]/50 text-sm mb-12 max-w-lg">From hotel uniforms to event merch — Moist Foundry serves brands across sectors that take their visual identity seriously.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E5E5]">
          {industries.map(i => (
            <div key={i.name} className="bg-white p-6 flex flex-col gap-3 hover:bg-[#F7F7F7] transition-colors">
              <span className="text-2xl">{i.icon}</span>
              <h3 className="text-sm font-semibold text-[#111111]">{i.name}</h3>
              <p className="text-xs text-[#111111]/50 leading-relaxed">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-[#111111] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Ready to build your merch?</h2>
            <p className="text-white/40 text-sm">Start with 50 pieces. Scale as you grow.</p>
          </div>
          <Link href="/configure" className="bg-white text-[#111111] px-7 py-3.5 text-sm font-medium hover:bg-[#E5E5E5] transition-colors whitespace-nowrap">
            Start designing
          </Link>
        </div>
      </section>
    </>
  )
}