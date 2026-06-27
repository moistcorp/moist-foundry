'use client'
import HomepageCaseStudies from '@/components/home/HomepageCaseStudies'
import TrustedBy from '@/components/home/TrustedBy'
import WhyMoistFoundry from '@/app/_components/WhyMoistFoundry'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  PRODUCT_PRICES,
  VOLUME_TIERS,
  RUSH_TIERS,
  calcOrder,
  getDiscount,
  getRushCharge,
  DELIVERY_DAYS,
  RUSH_DELIVERY_DAYS,
} from '@/lib/pricing'
import { products } from '@/lib/products'

const estimatorProducts = products.map(p => ({ name: p.pricingKey, base: p.price, icon: p.icon, description: p.description }))

const industries = [
  { name: 'Hotels & Restaurants', desc: 'Merchandise designed for hospitality brands, from staff apparel to retail collections and guest experiences.', image: '/industries/hotels-restaurants.jpg' },
  { name: 'Music & Events', desc: 'Merch created for releases, tours, and live events, from artist collections to large-scale drops.', image: '/industries/music-events.jpg' },
  { name: 'Sports & Fitness', desc: 'Merchandise for teams, clubs, and active brands, built for both function and identity.', image: '/industries/sports-fitness.jpg' },
  { name: 'Arts & Culture', desc: 'Merchandise developed for exhibitions, institutions, and artists, from limited releases to curated retail collections.', image: '/industries/arts-culture.jpg' },
  { name: 'Creative Studios', desc: 'Design-led merchandise for studios and agencies, built to extend brand systems into physical products.', image: '/industries/creative-studios.jpg' },
  { name: 'Companies & Startups', desc: 'Custom merchandise for teams and organisations, from onboarding kits to team apparel and client gifting.', image: '/industries/companies-startups.jpg' },
]

export default function HomeClient() {
  const [qty, setQty] = useState(50)
  const [selected, setSelected] = useState(estimatorProducts[0].name)
  const [rush, setRush] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const selectedProduct = estimatorProducts.find(p => p.name === selected) ?? estimatorProducts[0]

  const { discount, discountedBase, rushCharge, pricePerPiece, subtotal, gst, total } = calcOrder(selected, qty, rush)
  const deliveryDays = rush ? RUSH_DELIVERY_DAYS : DELIVERY_DAYS
  const rushChargeTotal = rushCharge * qty

  return (
    <>
      {/* HERO */}
      <section className="grid lg:grid-cols-2 min-h-[90vh] border-b border-[#E5E5E5]">
        <div className="flex flex-col justify-center px-8 md:px-16 py-20 lg:py-0">
          <p className="text-xs text-[#111111]/40 font-medium mb-6 tracking-widest uppercase">
            Custom apparel for businesses
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#111111] leading-[1.05] tracking-tight mb-6">
            Custom merch<br />for your<br />business
          </h1>
          <p className="text-base text-[#111111]/50 max-w-sm mb-10 leading-relaxed">
            From design to delivery: premium custom merch, made in India. Create, customise and place your order in just a few simple steps.
          </p>
          <div className="flex gap-6 mb-10">
            <div>
              <p className="text-2xl font-bold text-[#111111]">50</p>
              <p className="text-xs text-[#111111]/40 uppercase tracking-wide">Min. pieces</p>
            </div>
            <div className="w-px bg-[#E5E5E5]" />
            <div>
              <p className="text-2xl font-bold text-[#111111]">{RUSH_DELIVERY_DAYS}</p>
              <p className="text-xs text-[#111111]/40 uppercase tracking-wide">Day delivery</p>
            </div>
            <div className="w-px bg-[#E5E5E5]" />
            <div>
              <p className="text-2xl font-bold text-[#111111]">100%</p>
              <p className="text-xs text-[#111111]/40 uppercase tracking-wide">Made in India</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/configure" className="bg-[#111111] text-white px-8 py-4 text-sm font-medium hover:bg-black transition-colors">
              Start designing
            </Link>
            <Link href="/catalogue" className="border border-[#111111]/20 text-[#111111] px-8 py-4 text-sm font-medium hover:border-[#111111] transition-colors">
              View catalogue
            </Link>
          </div>
        </div>

        <div className="relative bg-[#F7F7F7] flex items-center justify-center min-h-64 lg:min-h-full overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src="/hero.jpg" alt="Hero image" width={800} height={600} className="object-cover" />
          </div>
          <div className="absolute bottom-8 left-8 bg-white border border-[#E5E5E5] px-5 py-4 shadow-sm">
            <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-1">Starting from</p>
            <p className="text-2xl font-bold text-[#111111]">&#8377;350</p>
            <p className="text-xs text-[#111111]/50">per piece &middot; MOQ 50</p>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E5E5E5]">
            {[
              { label: 'T-Shirts & Tees', sub: '200 & 260 GSM · 2 fits' },
              { label: 'Sweatshirts & Hoodies', sub: '320 GSM · 2 fits' },
              { label: 'Accessories', sub: 'Canvas totes' },
              { label: 'Screen Print, DTG, DTF, Embroidery, Heat Transfer', sub: '5 print techniques' },
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
              From brief to<br />delivery in {RUSH_DELIVERY_DAYS} days
            </h2>
            <p className="text-[#111111]/50 text-sm leading-relaxed mb-8">
              Configure your order online in minutes. We review, produce, and ship with full visibility at every stage.
            </p>
            <Link href="/how-it-works" className="text-sm font-medium text-[#111111] border-b border-[#111111] pb-0.5 hover:opacity-60 transition-opacity">
              See the full process
            </Link>
          </div>
          <div className="flex flex-col border border-[#E5E5E5]">
            {[
              { num: '01', title: 'Configure online', desc: 'Choose product, color, upload artwork, pick print technique.' },
              { num: '02', title: 'Reserve your slot', desc: 'Pay Rs.499 to confirm. We send a proforma within 24 hours.' },
              { num: '03', title: 'We produce', desc: 'Manufacturing and QA at our Greater Noida facility.' },
              { num: '04', title: 'Delivered to you', desc: `Packed and shipped. ${RUSH_DELIVERY_DAYS}-day production timeline.` },
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

<WhyMoistFoundry />

<TrustedBy />

      {/* PRICING ESTIMATOR — full version matching pricing page */}
      <section className="border-t border-[#E5E5E5] py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">

            {/* Controls */}
            <div>
              <p className="text-xs text-[#111111]/40 font-medium mb-4 tracking-widest uppercase">Pricing</p>
              <h2 className="text-4xl font-bold mb-3 tracking-tight">Estimate your order</h2>
              <p className="text-[#111111]/50 text-sm mb-10 leading-relaxed">
                Prices include fabric, stitching, single-color print, and neck label. Shipping quoted separately.
              </p>

              <div className="flex flex-col gap-6">

                {/* Product picker */}
                <div>
                  <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Product</p>
                  <div className="border border-[#E5E5E5] bg-white">
                    {/* Selected — always visible */}
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full flex items-center gap-4 px-4 py-4 bg-white hover:bg-[#F0F0F0] transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0">
                        <Image src={selectedProduct.icon} alt={selectedProduct.name} width={36} height={36} className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111111] leading-snug">{selectedProduct.name}</p>
                        <p className="text-xs text-[#111111]/50 mt-0.5 line-clamp-1">{selectedProduct.description}</p>
                      </div>
                      <svg
                        className={`w-4 h-4 text-[#111111]/40 shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Options */}
                    {dropdownOpen && (
                      <div className="border-t border-[#E5E5E5]">
                        {estimatorProducts.filter(p => p.name !== selected).map((p, i, arr) => (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => { setSelected(p.name); setDropdownOpen(false) }}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 hover:bg-white transition-colors text-left ${i < arr.length - 1 ? 'border-b border-[#E5E5E5]' : ''}`}
                          >
                            <div className="w-10 h-10 bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0">
                              <Image src={p.icon} alt={p.name} width={30} height={30} className="object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#111111] leading-snug">{p.name}</p>
                              <p className="text-xs text-[#111111]/40 mt-0.5 line-clamp-1">{p.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest">Quantity</p>
                    <span className="text-sm font-bold text-[#111111]">{qty} pcs</span>
                  </div>
                  <input type="range" min={50} max={1000} step={50} value={qty}
                    onChange={e => setQty(Number(e.target.value))}
                    onInput={e => setQty(Number((e.target as HTMLInputElement).value))}
                    className="w-full accent-[#111111]" />
                  <div className="flex justify-between text-xs text-[#111111]/30 mt-1">
                    <span>50 pcs</span><span>1000 pcs</span>
                  </div>
                </div>

                {/* Rush order toggle */}
                <div className="border border-[#E5E5E5] bg-white p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">Rush order</p>
                      <p className="text-xs text-[#111111]/50 mt-0.5">
                        Delivery in {RUSH_DELIVERY_DAYS} days instead of {DELIVERY_DAYS}
                      </p>
                    </div>
                    <button type="button" onClick={() => setRush(!rush)}
                      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${rush ? 'bg-[#111111]' : 'bg-[#E5E5E5]'}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rush ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                  {rush && (
                    <p className="text-xs text-[#111111]/50 mt-2 pt-2 border-t border-[#E5E5E5]">
                      Rush premium: +&#8377;{getRushCharge(qty)}/piece
                      (&#8377;{rushChargeTotal.toLocaleString('en-IN')} total)
                    </p>
                  )}
                </div>

                {/* Volume tiers */}
                <div>
                  <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Volume discounts</p>
                  <div className="flex flex-col border border-[#E5E5E5] overflow-hidden">
                    {VOLUME_TIERS.map(t => (
                      <div key={t.min}
                        className={`flex justify-between text-xs px-4 py-3 border-b border-[#E5E5E5] last:border-0 transition-colors ${
                          getDiscount(qty) === t.discount ? 'bg-[#111111] text-white' : 'text-[#111111]/40'
                        }`}>
                        <span>{t.min}{t.max === Infinity ? '+' : `\u2013${t.max}`} pcs</span>
                        <span>{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rush tiers — shown when rush is on */}
                {rush && (
                  <div>
                    <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">
                      Rush premiums (per piece)
                    </p>
                    <div className="flex flex-col border border-[#E5E5E5] overflow-hidden">
                      {RUSH_TIERS.map(t => (
                        <div key={t.min}
                          className={`flex justify-between text-xs px-4 py-3 border-b border-[#E5E5E5] last:border-0 transition-colors ${
                            getRushCharge(qty) === t.charge && qty >= t.min && qty <= t.max
                              ? 'bg-[#111111] text-white'
                              : 'text-[#111111]/40'
                          }`}>
                          <span>{t.min}{t.max === Infinity ? '+' : `\u2013${t.max}`} pcs</span>
                          <span>+&#8377;{t.charge}/pc</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Output */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#111111] p-8 text-white">
                <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Estimate</p>
                <p className="text-sm text-white/80 mb-1">{selected}</p>
                <p className="text-xs text-white/40 mb-6">
                  {qty} pieces &middot; {deliveryDays}-day delivery
                </p>

                <div className="flex flex-col gap-3 border-t border-white/20 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Base price/piece</span>
                    <span className="text-white">&#8377;{(PRODUCT_PRICES[selected] ?? 0).toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Volume discount ({(discount * 100).toFixed(0)}%)</span>
                      <span className="text-green-400">
                        -&#8377;{((PRODUCT_PRICES[selected] ?? 0) - discountedBase).toLocaleString('en-IN')}/pc
                      </span>
                    </div>
                  )}
                  {rush && rushCharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Rush premium</span>
                      <span className="text-white">+&#8377;{rushCharge}/pc</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-medium border-t border-white/10 pt-3 mt-1">
                    <span className="text-white/80">Price per piece</span>
                    <span className="text-white">&#8377;{pricePerPiece.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal ({qty} pcs)</span>
                    <span className="text-white">&#8377;{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-white/10 pt-3 mt-1">
                    <span className="text-white/60">GST (5%)</span>
                    <span className="text-white">&#8377;{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold border-t border-white/20 pt-4 mt-1">
                    <span className="text-white">Total</span>
                    <span className="text-white">&#8377;{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 text-xs text-white/40 flex flex-col gap-1">
                  <span>+ Shipping quoted separately by email</span>
                  <span>Delivery in {deliveryDays} days from order confirmation</span>
                </div>
              </div>

              <Link href="/pricing" className="border border-[#111111] text-[#111111] text-sm font-medium px-6 py-3.5 text-center hover:bg-[#111111] hover:text-white transition-colors">
                Full pricing details
              </Link>
              <Link href="/configure" className="bg-[#111111] text-white text-sm font-medium px-6 py-3.5 text-center hover:bg-black transition-colors">
                Start designing
              </Link>
            </div>
          </div>
        </div>
      </section>

<HomepageCaseStudies />

      {/* INDUSTRIES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <p className="text-xs text-[#111111]/40 font-medium mb-4 tracking-widest uppercase">Who we work with</p>
        <h2 className="text-4xl font-bold mb-3 tracking-tight">Premium merch for every industry</h2>
        <p className="text-[#111111]/50 text-sm mb-12 max-w-lg leading-relaxed">
          From hospitality to creative agencies, Foundry delivers premium branded merchandise tailored to different industries.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E5E5]">
          {industries.map(i => (
            <div key={i.name} className="group bg-white flex flex-col hover:bg-[#F7F7F7] transition-colors">
              <div className="w-full h-[420px] bg-[#F7F7F7] flex items-center justify-center overflow-hidden">
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