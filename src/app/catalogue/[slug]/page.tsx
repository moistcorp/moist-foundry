import { products } from '@/lib/products'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { generateMeta } from '@/lib/seo'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = products.find(p => p.slug === params.slug)
  if (!product) return generateMeta({ title: 'Product Not Found' })
  return generateMeta({
    title: product.name,
    description: `${product.name} — ${product.gsm} GSM. ${product.description} MOQ 50 pieces.`,
    path: `/catalogue/${product.slug}`,
    image: product.image ?? undefined,
  })
}

export default function CatalogueProduct({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug)
  if (!product) notFound()

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link href="/catalogue" className="text-xs text-[#111111]/40 hover:text-[#111111] transition-colors mb-10 inline-block uppercase tracking-widest">
        Back to catalogue
      </Link>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Image */}
        <div className="aspect-square bg-[#F7F7F7] flex items-center justify-center sticky top-24 self-start">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-[#111111]/20 uppercase tracking-wide">Product image</span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-2">{product.category}</p>
            <h1 className="text-4xl font-bold text-[#111111] leading-tight tracking-tight mb-2">{product.name}</h1>
            <p className="text-lg font-bold text-[#111111] mb-4">from &#8377;{product.price} <span className="text-sm font-normal text-[#111111]/40">per piece (MOQ 50)</span></p>
            <p className="text-sm text-[#111111]/60 leading-relaxed">{product.description}</p>
          </div>

          {/* Key specs */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Weight', value: `${product.gsm} GSM` },
              { label: 'Fit', value: product.fits?.join(', ') ?? 'Standard' },
              { label: 'MOQ', value: '50 pieces' },
              { label: 'Lead time', value: '25–35 days' },
            ].map(s => (
              <div key={s.label} className="border border-[#E5E5E5] p-4">
                <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-sm font-semibold text-[#111111]">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Product details */}
          <div>
            <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Product details</p>
            <ul className="flex flex-col gap-2">
              {product.details.map(d => (
                <li key={d} className="flex gap-3 text-sm text-[#111111]/60">
                  <span className="text-[#111111]/20 shrink-0">—</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Size chart */}
          {product.sizeChart && (
            <div>
              <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Size chart (inches)</p>
              <div className="border border-[#E5E5E5] overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#F7F7F7]">
                      <th className="text-left px-4 py-3 font-medium text-[#111111]/50">Size</th>
                      <th className="text-left px-4 py-3 font-medium text-[#111111]/50">Chest</th>
                      <th className="text-left px-4 py-3 font-medium text-[#111111]/50">Length</th>
                      {product.sizeChart[0].shoulder && (
                        <th className="text-left px-4 py-3 font-medium text-[#111111]/50">Shoulder</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {product.sizeChart.map(row => (
                      <tr key={row.size}>
                        <td className="px-4 py-3 font-semibold text-[#111111]">{row.size}</td>
                        <td className="px-4 py-3 text-[#111111]/60">{row.chest}</td>
                        <td className="px-4 py-3 text-[#111111]/60">{row.length}</td>
                        {row.shoulder && <td className="px-4 py-3 text-[#111111]/60">{row.shoulder}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[#111111]/30 mt-2">All measurements are of the garment laid flat. Size up if between sizes.</p>
            </div>
          )}

          {/* Care */}
          <div>
            <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Care instructions</p>
            <ul className="flex flex-col gap-1.5">
              {product.careInstructions.map(c => (
                <li key={c} className="flex gap-3 text-xs text-[#111111]/50">
                  <span className="text-[#111111]/20 shrink-0">—</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 pt-2 border-t border-[#E5E5E5]">
            <Link href="/configure" className="w-full bg-[#111111] text-white py-4 text-sm font-medium text-center hover:bg-black transition-colors">
              Configure this product
            </Link>
            <Link href="/contact" className="w-full border border-[#111111] text-[#111111] py-4 text-sm font-medium text-center hover:bg-[#111111] hover:text-white transition-colors">
              Request a sample
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}