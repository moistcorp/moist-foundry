'use client'
import { useState } from 'react'
import { products } from '@/lib/products'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

function ImageZoom({ src, alt }: { src: string; alt: string }) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <>
      <div
        className="aspect-square bg-[#F7F7F7] flex items-center justify-center sticky top-24 self-start cursor-zoom-in overflow-hidden"
        onClick={() => setZoomed(true)}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        <span className="absolute bottom-3 right-3 bg-white border border-[#E5E5E5] text-xs px-2 py-1 text-[#111111]/50">
          Click to zoom
        </span>
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <img src={src} alt={alt} className="max-w-full max-h-full object-contain" />
          <button
            type="button"
            onClick={() => setZoomed(false)}
            className="absolute top-6 right-6 text-white/60 hover:text-white text-sm"
          >
            Close
          </button>
        </div>
      )}
    </>
  )
}

export default function CatalogueProduct({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug)
  if (!product) notFound()

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Breadcrumbs */}
        <Breadcrumbs crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Catalogue', href: '/catalogue' },
          { label: product.name },
        ]} />

        <div className="grid md:grid-cols-2 gap-16">

          {/* Image */}
          {product.image ? (
            <ImageZoom src={product.image} alt={product.name} />
          ) : (
            <div className="aspect-square bg-[#F7F7F7] flex items-center justify-center sticky top-24 self-start">
              <span className="text-xs text-[#111111]/20 uppercase tracking-wide">Product image</span>
            </div>
          )}

          {/* Info */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold text-[#111111] leading-tight tracking-tight mb-2">{product.name}</h1>
              <p className="text-lg font-bold text-[#111111] mb-4">
                from &#8377;{product.price}
                <span className="text-sm font-normal text-[#111111]/40"> per piece (MOQ 50)</span>
              </p>
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

      {/* Related products */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-24 border-t border-[#E5E5E5] pt-16">
          <h2 className="text-xs font-medium uppercase tracking-widest text-[#111111]/40 mb-8">
            More in {product.category}
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-[#E5E5E5]">
            {related.map(p => (
              <Link key={p.id} href={`/catalogue/${p.slug}`}
                className="group bg-white flex flex-col hover:bg-[#F7F7F7] transition-colors">
                <div className="w-full aspect-square bg-[#F7F7F7] flex items-center justify-center overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-xs text-[#111111]/20 uppercase tracking-wide">Product image</span>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <h3 className="text-sm font-semibold text-[#111111] group-hover:underline">{p.name}</h3>
                  <p className="text-xs text-[#111111]/40">{p.gsm} GSM{p.fits ? ` · ${p.fits[0]} fit` : ''}</p>
                  <p className="text-sm font-bold mt-1">from &#8377;{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}