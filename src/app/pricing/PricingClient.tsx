'use client'
import Link from 'next/link'
import { useState } from 'react'

const products = [
  { name: 'T-Shirt (200 GSM)', base: 280, gst: 5 },
  { name: 'T-Shirt (260 GSM)', base: 340, gst: 5 },
  { name: 'Doctor Tee', base: 360, gst: 5 },
  { name: 'Long Sleeve', base: 420, gst: 5 },
  { name: 'Sweatshirt', base: 580, gst: 5 },
  { name: 'Hoodie', base: 650, gst: 5 },
  { name: 'Sweatpants', base: 580, gst: 5 },
  { name: 'Shorts', base: 320, gst: 5 },
  { name: 'Tote Bag', base: 180, gst: 5 },
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

export default function PricingClient() {
  const [qty, setQty] = useState<number>(50)
  const [selected, setSelected] = useState<string>('T-Shirt (200 GSM)')

  const product = products.find(p => p.name === selected) ?? products[0]
  const discount = getDiscount(qty)
  const pricePerPiece = Math.round(product.base * (1 - discount))
  const totalEx = pricePerPiece * qty
  const gstAmount = Math.round(totalEx * product.gst / 100)
  const totalInc = totalEx + gstAmount

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <p className="text-xs text-[#111111]/40 font-medium mb-4 tracking-widest uppercase">Pricing</p>
        <h1 className="text-5xl font-bold text-[#111111] max-w-xl leading-tight mb-4 tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="text-[#111111]/50 max-w-lg text-lg">
          No hidden fees. Prices include printing. GST extra. Volume discounts applied automatically.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-8">
            <div>
              <label className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest block mb-3">Select product</label>
              <div className="grid grid-cols-2 gap-2">
                {products.map(p => (
                  <button key={p.name} type="button" onClick={() => setSelected(p.name)}
                    className={`px-4 py-2.5 text-xs text-left border transition-colors ${
                      selected === p.name
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111] hover:text-[#111111]'
                    }`}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest">Quantity</label>
                <span className="text-sm font-bold text-[#111111]">{qty} pcs</span>
              </div>
              <input type="range" min={50} max={1000} step={50} value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                onInput={(e) => setQty(Number((e.target as HTMLInputElement).value))}
                className="w-full accent-[#111111]" />
              <div className="flex justify-between text-xs text-[#111111]/30 mt-1">
                <span>50 pcs</span><span>1000 pcs</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-3">Volume discounts</p>
              <div className="flex flex-col gap-1 border border-[#E5E5E5]">
                {tiers.map(t => (
                  <div key={t.min} className={`flex justify-between text-xs px-4 py-3 transition-colors ${
                    getDiscount(qty) === t.discount ? 'bg-[#111111] text-white' : 'text-[#111111]/40'
                  }`}>
                    <span>{t.min}{t.min === 1000 ? '+' : `-${t.max}`} pcs</span>
                    <span>{t.discount === 0 ? 'Base price' : `${(t.discount * 100).toFixed(0)}% off`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-[#111111] p-8 text-white">
              <p className="text-xs text-white/40 mb-1 uppercase tracking-widest">Estimate for</p>
              <p className="text-base font-semibold mb-6">{selected} &times; {qty} pcs</p>
              <div className="flex flex-col gap-3 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Price per piece</span>
                  <span>&#8377;{pricePerPiece.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Volume discount</span>
                    <span>-{(discount * 100).toFixed(0)}%</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal (ex. GST)</span>
                  <span>&#8377;{totalEx.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">GST ({product.gst}%)</span>
                  <span>&#8377;{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-white/10 pt-4 mt-1">
                  <span>Total estimate</span>
                  <span>&#8377;{totalInc.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <p className="text-xs text-white/20 mt-6 leading-relaxed">
                Estimates include standard single-colour print. Final quote may vary.
              </p>
            </div>
            <Link href="/contact" className="bg-[#111111] text-white text-sm font-medium px-6 py-4 text-center hover:bg-black transition">
              Get a firm quote
            </Link>
            <Link href="/configure" className="border border-[#111111] text-[#111111] text-sm font-medium px-6 py-4 text-center hover:bg-[#111111] hover:text-white transition">
              Start designing instead
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F7F7] border-t border-[#E5E5E5] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 tracking-tight">What&apos;s included in every order</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: 'Sampling', desc: 'Pre-production sample before bulk run' },
              { title: 'QA checks', desc: 'Every piece inspected before packing' },
              { title: 'Order tracking', desc: 'Full visibility from production to delivery' },
              { title: 'Print setup', desc: 'Screen setup and artwork prep included' },
            ].map(i => (
              <div key={i.title}>
                <p className="font-semibold text-sm mb-1">{i.title}</p>
                <p className="text-xs text-[#111111]/50 leading-relaxed">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}