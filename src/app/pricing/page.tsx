'use client'
import Link from 'next/link'
import { useState } from 'react'

const products = [
  { name: 'T-Shirt', base: 280, gst: 5 },
  { name: 'Heavyweight Tee', base: 380, gst: 5 },
  { name: 'Hoodie', base: 650, gst: 5 },
  { name: 'Crewneck Sweatshirt', base: 580, gst: 5 },
  { name: 'Polo Shirt', base: 420, gst: 5 },
  { name: 'Tote Bag', base: 180, gst: 5 },
  { name: 'Dad Cap', base: 320, gst: 5 },
]

const tiers = [
  { min: 50, max: 99, discount: 0 },
  { min: 100, max: 249, discount: 0.07 },
  { min: 250, max: 499, discount: 0.12 },
  { min: 500, max: 999, discount: 0.17 },
  { min: 1000, max: 1000, discount: 0.22 },
]

function getDiscount(qty: number): number {
  for (const tier of tiers) {
    if (qty >= tier.min && qty <= tier.max) return tier.discount
  }
  return 0.22
}

function getLabel(qty: number): string {
  const d = getDiscount(qty)
  if (d === 0) return ''
  return `${(d * 100).toFixed(0)}% volume discount applied`
}

export default function Pricing() {
  const [qty, setQty] = useState<number>(50)
  const [selected, setSelected] = useState<string>('T-Shirt')

  const product = products.find(p => p.name === selected) ?? products[0]
  const discount = getDiscount(qty)
  const pricePerPiece = Math.round(product.base * (1 - discount))
  const totalEx = pricePerPiece * qty
  const gstAmount = Math.round(totalEx * product.gst / 100)
  const totalInc = totalEx + gstAmount
  const label = getLabel(qty)

  return (
    <>
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <p className="text-sm text-[#C1623D] font-medium mb-4 tracking-wide uppercase">Pricing</p>
        <h1 className="text-5xl font-bold text-[#2B2B2B] max-w-xl leading-tight mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-[#2B2B2B]/60 max-w-lg text-lg">
          No hidden fees. Prices include printing. GST extra. Volume discounts applied automatically.
        </p>
      </section>

      {/* Estimator */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Controls */}
          <div className="flex flex-col gap-8">

            {/* Product picker */}
            <div>
              <label className="text-sm font-medium block mb-3">Select product</label>
              <div className="grid grid-cols-2 gap-2">
                {products.map(p => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setSelected(p.name)}
                    className={`px-4 py-2.5 text-sm rounded-sm border text-left transition-colors ${
                      selected === p.name
                        ? 'bg-[#2B2B2B] text-[#F5F1EA] border-[#2B2B2B]'
                        : 'border-[#2B2B2B]/20 hover:border-[#2B2B2B] text-[#2B2B2B]'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium">Quantity</label>
                <span className="text-sm font-bold text-[#C1623D]">{qty} pcs</span>
              </div>
              <input
  type="range"
  min={50}
  max={1000}
  step={50}
  value={qty}
  onChange={(e) => setQty(Number(e.target.value))}
  onInput={(e) => setQty(Number((e.target as HTMLInputElement).value))}
  className="w-full accent-[#C1623D]"
/>
              <div className="flex justify-between text-xs text-[#2B2B2B]/40 mt-1">
                <span>50 pcs</span>
                <span>1000 pcs</span>
              </div>
            </div>

            {/* Volume tiers */}
            <div>
              <p className="text-sm font-medium mb-3">Volume discounts</p>
              <div className="flex flex-col gap-1">
                {tiers.map(t => (
                  <div
                    key={t.min}
                    className={`flex justify-between text-sm px-3 py-2 rounded-sm transition-colors ${
                      getDiscount(qty) === t.discount
                        ? 'bg-[#C1623D]/10 text-[#C1623D] font-medium'
                        : 'text-[#2B2B2B]/50'
                    }`}
                  >
                    <span>{t.min}{t.max === 1000 && t.min === 1000 ? '+' : t.max === 1000 ? `–${t.max}` : `–${t.max}`} pcs</span>
                    <span>{t.discount === 0 ? 'Base price' : `${(t.discount * 100).toFixed(0)}% off`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#2B2B2B] rounded-sm p-8 text-[#F5F1EA]">
              <p className="text-sm text-[#F5F1EA]/50 mb-1">Estimated price for</p>
              <p className="text-lg font-semibold mb-6">{selected} &times; {qty} pcs</p>

              <div className="flex flex-col gap-3 border-t border-[#F5F1EA]/10 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#F5F1EA]/60">Price per piece</span>
                  <span>&#8377;{pricePerPiece.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#C1623D]">{label}</span>
                    <span className="text-[#C1623D]">-{(discount * 100).toFixed(0)}%</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#F5F1EA]/60">Subtotal (ex. GST)</span>
                  <span>&#8377;{totalEx.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#F5F1EA]/60">GST ({product.gst}%)</span>
                  <span>&#8377;{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-[#F5F1EA]/10 pt-4 mt-2">
                  <span>Total estimate</span>
                  <span>&#8377;{totalInc.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="text-xs text-[#F5F1EA]/30 mt-6">
                Estimates include standard single-colour print. Final quote may vary based on artwork complexity, print technique, and shipping.
              </p>
            </div>

            <Link
              href="/contact"
              className="bg-[#C1623D] text-white text-sm font-medium px-6 py-4 rounded-sm text-center hover:opacity-90 transition"
            >
              Get a firm quote
            </Link>

            <Link
              href="/configure"
              className="border border-[#2B2B2B] text-[#2B2B2B] text-sm font-medium px-6 py-4 rounded-sm text-center hover:bg-[#2B2B2B] hover:text-[#F5F1EA] transition"
            >
              Start designing instead
            </Link>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-[#F5F1EA] border-t border-[#2B2B2B]/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">What&apos;s included in every order</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: 'Sampling', desc: 'Pre-production sample before bulk run' },
              { title: 'QA checks', desc: 'Every piece inspected before packing' },
              { title: 'Order tracking', desc: 'Full visibility from production to delivery' },
              { title: 'Print setup', desc: 'Screen setup and artwork prep included' },
            ].map(i => (
              <div key={i.title}>
                <p className="font-semibold mb-1">{i.title}</p>
                <p className="text-sm text-[#2B2B2B]/60">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}