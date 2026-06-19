import Link from 'next/link'

const products = [
  { name: 'Classic T-Shirt', desc: '180 GSM, 100% combed cotton. Available in 20+ colors.', moq: '50 pcs', turnaround: '25-30 days', techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Heavyweight Tee', desc: '240 GSM, 100% cotton. Structured fit, ideal for premium merch.', moq: '50 pcs', turnaround: '25-30 days', techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Pullover Hoodie', desc: '320 GSM, 80/20 cotton-poly fleece. Kangaroo pocket, ribbed cuffs.', moq: '50 pcs', turnaround: '30-35 days', techniques: ['Screen Print', 'Embroidery', 'Heat Transfer'] },
  { name: 'Zip-Up Hoodie', desc: '320 GSM fleece. Full-length zipper, twin needle stitching.', moq: '50 pcs', turnaround: '30-35 days', techniques: ['Screen Print', 'Embroidery'] },
  { name: 'Polo Shirt', desc: '220 GSM pique cotton. Ideal for corporate and hospitality uniforms.', moq: '50 pcs', turnaround: '25-30 days', techniques: ['Embroidery', 'Heat Transfer'] },
  { name: 'Tote Bag', desc: '12oz natural canvas. Reinforced handles, gusset base.', moq: '50 pcs', turnaround: '20-25 days', techniques: ['Screen Print', 'DTG'] },
  { name: 'Dad Cap', desc: 'Cotton twill, adjustable metal buckle closure. Unstructured, low profile.', moq: '50 pcs', turnaround: '25-30 days', techniques: ['Embroidery'] },
  { name: 'Crewneck Sweatshirt', desc: '300 GSM fleece. Clean crewneck silhouette for minimal branded merch.', moq: '50 pcs', turnaround: '30-35 days', techniques: ['Screen Print', 'Embroidery'] },
]

export default function Catalogue() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <p className="text-xs text-[#111111]/40 font-medium mb-4 tracking-widest uppercase">Products</p>
        <h1 className="text-5xl font-bold text-[#111111] max-w-xl leading-tight mb-6 tracking-tight">Our catalogue</h1>
        <p className="text-[#111111]/50 max-w-lg text-lg">
          Premium blanks, manufactured to spec. Every product supports custom colors, artwork, and branding.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E5E5]">
          {products.map(p => (
            <div key={p.name} className="bg-white p-6 flex flex-col gap-4">
              <div className="w-full h-44 bg-[#F7F7F7] flex items-center justify-center">
                <span className="text-xs text-[#111111]/20 uppercase tracking-wide">Product image</span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111111] mb-1">{p.name}</h3>
                <p className="text-xs text-[#111111]/50 leading-relaxed">{p.desc}</p>
              </div>
              <div className="flex gap-4 text-xs text-[#111111]/40">
                <span>MOQ: <strong className="text-[#111111]">{p.moq}</strong></span>
                <span>Lead time: <strong className="text-[#111111]">{p.turnaround}</strong></span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.techniques.map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 border border-[#E5E5E5] text-[#111111]/60">{t}</span>
                ))}
              </div>
              <Link href="/configure" className="mt-auto border border-[#111111] text-[#111111] text-xs px-4 py-2.5 text-center hover:bg-[#111111] hover:text-white transition-colors">
                Configure this product
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#111111] py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Don&apos;t see what you need?</h2>
            <p className="text-white/40 text-sm">We source custom blanks on request.</p>
          </div>
          <Link href="/contact" className="bg-white text-[#111111] px-7 py-3.5 text-sm font-medium hover:bg-[#E5E5E5] transition whitespace-nowrap">
            Contact us
          </Link>
        </div>
      </section>
    </>
  )
}