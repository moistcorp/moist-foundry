'use client'
import Link from 'next/link'
import { useState } from 'react'

const industries = [
  { name: 'Hotels & Restaurants', desc: 'Staff uniforms, guest amenities, branded F&B merchandise.', image: null },
  { name: 'Music & Events', desc: 'Artist merch, crew wear, event uniforms and giveaways.', image: null },
  { name: 'Sports & Fitness', desc: 'Team kits, gym wear, performance and training apparel.', image: null },
  { name: 'Arts & Culture', desc: 'Gallery merch, cultural institution apparel, limited editions.', image: null },
  { name: 'Creative Studios', desc: 'Agency merch, studio wear, client gifting and onboarding kits.', image: null },
  { name: 'Companies & Startups', desc: 'Employee swag, brand merchandise, conference and event kits.', image: null },
]

const estimatorProducts = [
  { name: 'Regular Fit Tee (200 GSM)', base: 280 },
  { name: 'Boxy Fit Tee (200 GSM)', base: 280 },
  { name: 'Regular Fit Tee (260 GSM)', base: 340 },
  { name: 'Boxy Fit Tee (260 GSM)', base: 340 },
  { name: 'Longsleeve Tee (260 GSM)', base: 420 },
  { name: 'Regular Fit Sweatshirt (320 GSM)', base: 580 },
  { name: 'Boxy Fit Sweatshirt (320 GSM)', base: 580 },
  { name: 'Regular Fit Hoodie (320 GSM)', base: 650 },
  { name: 'Boxy Fit Hoodie (320 GSM)', base: 650 },
  { name: 'Shorts (220 GSM)', base: 320 },
  { name: 'Canvas Tote Bag', base: 180 },
]

function getDiscount(qty: number) {
  if (qty >= 1000) return 0.22
  if (qty >= 500) return 0.17
  if (qty >= 250) return 0.12
  if (qty >= 100) return 0.07
  return 0
}

export default function HomeClient() {
  const [qty, setQty] = useState(50)
  const [selected, setSelected] = useState(estimatorProducts[0].name)

  const product = estimatorProducts.find(p => p.name === selected) ?? estimatorProducts[0]
  const discount = getDiscount(qty)
  const pricePerPiece = Math.round(product.base * (1 - discount))
  const total = pricePerPiece * qty

  return (
    <>
      {/* HERO — split screen like Assembly */}
      <section className="grid lg:grid-cols-2 min-h-[90vh] border-b border-[#E5E5E5]">
        {/* Left — text */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-20 lg:py-0">
          <p className="text-xs text-[#111111]/40 font-medium mb-6 tracking-widest uppercase">
            Custom apparel for businesses
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#111111] leading-[1.05] tracking-tight mb-6">
            Custom merch<br />for your<br />business
          </h1>
          <p className="text-base text-[#111111]/50 max-w-sm mb-10 leading-relaxed">
            From design to delivery. Premium custom apparel made in India. Configure online, reserve your slot, receive in 35 days.
          </p>

          {/* Key facts inline */}
          <div className="flex gap-6 mb-10">
            <div>
              <p className="text-2xl font-bold text-[#111111]">50</p>
              <p className="text-xs text-[#111111]/40 uppercase tracking-wide">Min. pieces</p>
            </div>
            <div className="w-px bg-[#E5E5E5]" />
            <div>
              <p className="text-2xl font-bold text-[#111111]">35</p>
              <p className="text-xs text-[#111111]/40 uppercase tracking-wide">Day delivery</p>
            </div>
            <div className="w-px bg-[#E5E5E5]" />
            <div>
              <p className="text-2xl font-bold text-[#111111]">100%</p>
              <p className="text-xs text-[#111111]/40 uppercase tracking-wide">Made in India</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/configure"
              className="bg-[#111111] text-white px-8 py-4 text-sm font-medium hover:bg-black transition-colors"
            >
              Start designing
            </Link>
            <Link
              href="/catalogue"
              className="border border-[#111111]/20 text-[#111111] px-8 py-4 text-sm font-medium hover:border-[#111111] transition-colors"
            >
              View catalogue
            </Link>
          </div>
        </div>

        {/* Right — image / visual */}
        <div className="relative bg-[#F7F7F7] flex items-center justify-center min-h-64 lg:min-h-full overflow-hidden">
          {/* Placeholder — replace with actual garment photo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-[#111111]/20 uppercase tracking-widest mb-2">Hero image</p>
              <p className="text-xs text-[#111111]/15">Drop a garment photo here</p>
              <p className="text-xs text-[#111111]/15">public/hero.jpg</p>
            </div>
          </div>

          {/* Floating product badge */}
          <div className="absolute bottom-8 left-8 bg-white border border-[#E5E5E5] px-5 py-4 shadow-sm">
            <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-1">Starting from</p>
            <p className="text-2xl font-bold text-[#111111]">&#8377;180</p>
            <p className="text-xs text-[#111111]/50">per piece · MOQ 50</p>
          </div>
        </div>
      </section>

      {/* WHAT WE DO — immediate clarity strip */}
      <section className="border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-[#E5E5E5]">
            {[
              { label: 'T-Shirts & Tees', sub: '200 & 260 GSM · 2 fits' },
              { label: 'Sweatshirts & Hoodies', sub: '320 GSM · 2 fits' },
              { label: 'Bottoms & Accessories', sub: 'Shorts, totes' },
              { label: 'Screen Print, DTG, Embroidery', sub: '3 print techniques' },
            ].map(item => (
              <div key={item.label} className="px-6 py-4 first:pl-0">
                <p className="text-sm font-semibold text-[#111111] leading-snug">{item.label}</p>
                <p className="text-xs text-[#111111]/40 mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs text-[#111111]/40 font-medium mb-4 tracking-widest uppercase">The process</p>
            <h2 className="text-4xl font-bold mb-6 tracking-tight leading-tight">
              From brief to<br />delivery in 35 days
            </h2>
            <p className="text-[#111111]/50 text-sm leading-relaxed mb-8">
              Configure your order online in minutes. We review, produce, and ship — with full visibility at every stage.
            </p>
            <Link href="/how-it-works" className="text-sm font-medium text-[#111111] border-b border-[#111111] pb-0.5 hover:opacity-60 transition-opacity">
              See the full process
            </Link>
          </div>
          <div className="flex flex-col gap-0 border border-[#E5E5E5]">
            {[
              { num: '01', title: 'Configure online', desc: 'Choose product, color, upload artwork, pick print technique.' },
              { num: '02', title: 'Reserve your slot', desc: 'Pay Rs.499 to confirm. We send a proforma within 24 hours.' },
              { num: '03', title: 'We produce', desc: 'Manufacturing and QA at our Greater Noida facility.' },
              { num: '04', title: 'Delivered to you', desc: 'Packed and shipped. Tracking provided throughout.' },
            ].map((s, i) => (
              <div key={s.num} className={`flex gap-5 px-6 py-5 ${i < 3 ? 'border-b border-[#E5E5E5]' : ''}`}>
                <span className="text-xs font-bold text-[#111111]/20 shrink-0 pt-0.5">{s.num}</span>
                <div>
                  <p className="text-sm font-semibold text-[#111111]">{s.title}</p>
                  <p className="text-xs text-[#111111]/50 mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING ESTIMATOR */}
      <section className="border-t border-[#E5E5E5] py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs text-[#111111]/40 font-medium mb-4 tracking-widest uppercase">Pricing</p>
              <h2 className="text-4xl font-bold mb-3 tracking-tight">Estimate your order</h2>
              <p className="text-[#111111]/50 text-sm mb-10 leading-relaxed">
                Transparent pricing, no hidden fees. Volume discounts up to 22% apply automatically.
              </p>

              <div className="flex flex-col gap-6">
                {/* Product */}
                <div>
                  <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Product</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {estimatorProducts.map(p => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setSelected(p.name)}
                        className={`px-3 py-2 text-xs text-left border transition-colors ${
                          selected === p.name
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'border-[#E5E5E5] bg-white text-[#111111]/60 hover:border-[#111111] hover:text-[#111111]'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest">Quantity</p>
                    <span className="text-sm font-bold text-[#111111]">{qty} pcs</span>
                  </div>
                  <input
                    type="range" min={50} max={1000} step={50} value={qty}
                    onChange={e => setQty(Number(e.target.value))}
                    onInput={e => setQty(Number((e.target as HTMLInputElement).value))}
                    className="w-full accent-[#111111]"
                  />
                  <div className="flex justify-between text-xs text-[#111111]/30 mt-1">
                    <span>50 pcs</span><span>1000 pcs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#111111] p-8 text-white">
                <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Estimate</p>
                <p className="text-sm text-white/80 mb-6">{selected} &times; {qty} pcs</p>
                <div className="flex flex-col gap-3 border-t border-white/20 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Per piece</span>
                    <span className="text-white font-medium">&#8377;{pricePerPiece.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Volume discount</span>
                      <span className="text-white">-{(discount * 100).toFixed(0)}%</span>
                    </div>
                  )}
                  <div className="flex justify-between text-2xl font-bold border-t border-white/20 pt-4 mt-1">
                    <span className="text-white">Total</span>
                    <span className="text-white">&#8377;{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <p className="text-xs text-white/40 mt-5 leading-relaxed">Excludes GST and shipping. Final quote sent within 24 hours.</p>
              </div>
              <Link
                href="/pricing"
                className="border border-[#111111] text-[#111111] text-sm font-medium px-6 py-3.5 text-center hover:bg-[#111111] hover:text-white transition-colors"
              >
                Full pricing details
              </Link>
              <Link
                href="/configure"
                className="bg-[#111111] text-white text-sm font-medium px-6 py-3.5 text-center hover:bg-black transition-colors"
              >
                Start designing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <p className="text-xs text-[#111111]/40 font-medium mb-4 tracking-widest uppercase">Who we work with</p>
        <h2 className="text-4xl font-bold mb-3 tracking-tight">Built for these industries</h2>
        <p className="text-[#111111]/50 text-sm mb-12 max-w-lg leading-relaxed">
          From hotel uniforms to event merch. We serve businesses that take their visual identity seriously.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E5E5]">
          {industries.map(i => (
            <div key={i.name} className="group bg-white flex flex-col hover:bg-[#F7F7F7] transition-colors">
              <div className="w-full aspect-video bg-[#F7F7F7] flex items-center justify-center overflow-hidden">
                {i.image ? (
                  <img src={i.image} alt={i.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-xs text-[#111111]/20 uppercase tracking-widest">{i.name}</span>
                )}
              </div>
              <div className="p-5 flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold text-[#111111]">{i.name}</h3>
                <p className="text-xs text-[#111111]/50 leading-relaxed">{i.desc}</p>
              </div>
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