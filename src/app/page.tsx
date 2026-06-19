import Link from 'next/link'

const steps = [
  { num: '01', title: 'Choose your product', desc: 'Pick from our catalogue of garments — tees, hoodies, polos, totes, caps, and more.' },
  { num: '02', title: 'Configure & upload', desc: 'Select fabric color, print placement, and upload your artwork. We handle the rest.' },
  { num: '03', title: 'We produce & ship', desc: 'Your order goes into production. Delivered in 35 days or less, with full tracking.' },
]

const stats = [
  { value: '50 pcs', label: 'Minimum order quantity' },
  { value: '35 days', label: 'Average production time' },
  { value: '100%', label: 'Supply chain transparency' },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <p className="text-xs text-[#111111]/40 font-medium mb-6 tracking-widest uppercase">Custom apparel, made to order</p>
        <h1 className="text-6xl md:text-8xl font-bold text-[#111111] leading-none max-w-3xl mb-8 tracking-tight">
          Design it.<br />We&apos;ll make it.
        </h1>
        <p className="text-lg text-[#111111]/50 max-w-lg mb-10 leading-relaxed">
          Small batch custom apparel for brands, cafes, and companies. MOQ 50 pieces. Ships in 35 days.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/configure"
            className="bg-[#111111] text-white px-7 py-3.5 text-sm font-medium hover:bg-black transition-colors"
          >
            Start designing
          </Link>
          <Link
            href="/catalogue"
            className="border border-[#111111] text-[#111111] px-7 py-3.5 text-sm font-medium hover:bg-[#111111] hover:text-white transition-colors"
          >
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
              <p className="text-6xl font-bold text-[#111111]/8 mb-4 leading-none">{s.num}</p>
              <h3 className="text-base font-semibold mb-2">{s.title}</h3>
              <p className="text-[#111111]/50 text-sm leading-relaxed">{s.desc}</p>
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
          <Link
            href="/configure"
            className="bg-white text-[#111111] px-7 py-3.5 text-sm font-medium hover:bg-[#E5E5E5] transition-colors whitespace-nowrap"
          >
            Start designing
          </Link>
        </div>
      </section>
    </>
  )
}