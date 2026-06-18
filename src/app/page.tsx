import Link from 'next/link'

const steps = [
  { num: '01', title: 'Choose your product', desc: 'Pick from our catalogue of garments — tees, hoodies, polos, totes, and more.' },
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
        <p className="text-sm text-[#C1623D] font-medium mb-4 tracking-wide uppercase">Custom apparel, made to order</p>
        <h1 className="text-5xl md:text-7xl font-bold text-[#2B2B2B] leading-tight max-w-3xl mb-8">
          Design it.<br />We'll make it.
        </h1>
        <p className="text-lg text-[#2B2B2B]/60 max-w-xl mb-10">
          Small batch custom apparel for brands, cafes, and companies. MOQ 50 pieces. Ships in 35 days. Full visibility from fabric to delivery.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/configure"
            className="bg-[#2B2B2B] text-[#F5F1EA] px-7 py-3.5 rounded-sm hover:bg-[#C1623D] transition-colors text-sm font-medium"
          >
            Start designing
          </Link>
          <Link
            href="/catalogue"
            className="border border-[#2B2B2B] text-[#2B2B2B] px-7 py-3.5 rounded-sm hover:bg-[#2B2B2B] hover:text-[#F5F1EA] transition-colors text-sm font-medium"
          >
            View catalogue
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#2B2B2B] py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {stats.map(s => (
            <div key={s.value}>
              <p className="text-3xl font-bold text-[#C1623D]">{s.value}</p>
              <p className="text-sm text-[#F5F1EA]/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <p className="text-sm text-[#C1623D] font-medium mb-2 tracking-wide uppercase">The process</p>
        <h2 className="text-4xl font-bold mb-16">How it works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map(s => (
            <div key={s.num}>
              <p className="text-5xl font-bold text-[#2B2B2B]/10 mb-4">{s.num}</p>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-[#2B2B2B]/60 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-[#C1623D] rounded-sm p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Ready to build your merch?</h2>
            <p className="text-white/70 text-sm">Start with 50 pieces. Scale as you grow.</p>
          </div>
          <Link
            href="/configure"
            className="bg-white text-[#C1623D] px-7 py-3.5 rounded-sm font-medium text-sm hover:bg-[#F5F1EA] transition-colors whitespace-nowrap"
          >
            Start designing
          </Link>
        </div>
      </section>
    </>
  )
}