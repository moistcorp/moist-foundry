import Link from 'next/link'

const products = [
  {
    name: 'Classic T-Shirt',
    desc: '180 GSM, 100% combed cotton. Available in 20+ colors. Screen print, DTG, or embroidery.',
    moq: '50 pcs',
    turnaround: '25–30 days',
    techniques: ['Screen Print', 'DTG', 'Embroidery'],
  },
  {
    name: 'Heavyweight Tee',
    desc: '240 GSM, 100% cotton. Structured fit, ideal for premium brand merchandise.',
    moq: '50 pcs',
    turnaround: '25–30 days',
    techniques: ['Screen Print', 'DTG', 'Embroidery'],
  },
  {
    name: 'Pullover Hoodie',
    desc: '320 GSM, 80% cotton 20% polyester fleece. Kangaroo pocket, ribbed cuffs.',
    moq: '50 pcs',
    turnaround: '30–35 days',
    techniques: ['Screen Print', 'Embroidery', 'Heat Transfer'],
  },
  {
    name: 'Zip-Up Hoodie',
    desc: '320 GSM fleece. Full-length zipper, twin needle stitching throughout.',
    moq: '50 pcs',
    turnaround: '30–35 days',
    techniques: ['Screen Print', 'Embroidery'],
  },
  {
    name: 'Polo Shirt',
    desc: '220 GSM pique cotton. Ideal for corporate and hospitality uniforms.',
    moq: '50 pcs',
    turnaround: '25–30 days',
    techniques: ['Embroidery', 'Heat Transfer'],
  },
  {
    name: 'Tote Bag',
    desc: '12oz natural canvas. Reinforced handles, gusset base. Perfect for cafes and retail.',
    moq: '50 pcs',
    turnaround: '20–25 days',
    techniques: ['Screen Print', 'DTG'],
  },
  {
    name: 'Dad Cap',
    desc: 'Cotton twill, adjustable metal buckle closure. Unstructured, low profile.',
    moq: '50 pcs',
    turnaround: '25–30 days',
    techniques: ['Embroidery'],
  },
  {
    name: 'Sweatshirt (Crewneck)',
    desc: '300 GSM fleece. Clean crewneck silhouette, ideal for minimal branded merch.',
    moq: '50 pcs',
    turnaround: '30–35 days',
    techniques: ['Screen Print', 'Embroidery'],
  },
]

const techniqueColors: Record<string, string> = {
  'Screen Print': 'bg-[#4A6670]/10 text-[#4A6670]',
  'DTG': 'bg-[#C1623D]/10 text-[#C1623D]',
  'Embroidery': 'bg-[#2B2B2B]/10 text-[#2B2B2B]',
  'Heat Transfer': 'bg-yellow-100 text-yellow-800',
}

export default function Catalogue() {
  return (
    <>
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <p className="text-sm text-[#C1623D] font-medium mb-4 tracking-wide uppercase">Products</p>
        <h1 className="text-5xl font-bold text-[#2B2B2B] max-w-xl leading-tight mb-6">
          Our catalogue
        </h1>
        <p className="text-[#2B2B2B]/60 max-w-lg text-lg">
          Premium blanks, manufactured to spec. Every product supports custom colors, artwork, and branding.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div
              key={p.name}
              className="border border-[#2B2B2B]/10 rounded-sm p-6 flex flex-col gap-4 hover:border-[#C1623D]/40 transition-colors bg-white"
            >
              {/* Placeholder image area */}
              <div className="w-full h-48 bg-[#F5F1EA] rounded-sm flex items-center justify-center">
                <span className="text-[#2B2B2B]/20 text-sm">Product image</span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#2B2B2B] mb-1">{p.name}</h3>
                <p className="text-sm text-[#2B2B2B]/60 leading-relaxed">{p.desc}</p>
              </div>

              <div className="flex gap-4 text-xs text-[#2B2B2B]/50">
                <span>MOQ: <strong className="text-[#2B2B2B]">{p.moq}</strong></span>
                <span>Lead time: <strong className="text-[#2B2B2B]">{p.turnaround}</strong></span>
              </div>

              <div className="flex flex-wrap gap-2">
                {p.techniques.map(t => (
                  <span key={t} className={`text-xs px-2.5 py-1 rounded-full font-medium ${techniqueColors[t]}`}>
                    {t}
                  </span>
                ))}
              </div>

              <Link
                href="/configure"
                className="mt-auto border border-[#2B2B2B] text-[#2B2B2B] text-sm px-4 py-2.5 rounded-sm text-center hover:bg-[#2B2B2B] hover:text-[#F5F1EA] transition-colors"
              >
                Configure this product
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2B2B2B] py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-[#F5F1EA] mb-2">Don&apos;t see what you need?</h2>
            <p className="text-[#F5F1EA]/60 text-sm">We source custom blanks on request. Get in touch and we&apos;ll find the right product for you.</p>
          </div>
          <Link
            href="/contact"
            className="bg-[#C1623D] text-white px-7 py-3.5 rounded-sm text-sm font-medium hover:opacity-90 transition whitespace-nowrap"
          >
            Contact us
          </Link>
        </div>
      </section>
    </>
  )
}