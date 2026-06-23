'use client'
import { useState } from 'react'
import { Product } from '@/lib/products'
import Link from 'next/link'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { useCartStore } from '@/lib/store'
import CartDrawer from '@/components/ui/CartDrawer'
import { getSizeChart } from '@/lib/sizecharts'

export default function CatalogueProductClient({ product, allProducts }: { product: Product; allProducts: Product[] }) {
  const sizeChart = getSizeChart(product.slug)
  const [cartOpen, setCartOpen] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  function handleRequestSample() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes[0] ?? 'M',
      quantity: 1,
      image: product.image,
    })
    setCartOpen(true)
  }

  return (
    <>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <Breadcrumbs crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Catalogue', href: '/catalogue' },
          { label: product.name },
        ]} />

        <div className="grid md:grid-cols-2 gap-16">
          {/* Image */}
          {product.image ? (
            <div className="aspect-square bg-[#F7F7F7] overflow-hidden sticky top-24 self-start">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
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
                from &#8377;{product.price.toLocaleString('en-IN')}
                <span className="text-sm font-normal text-[#111111]/40"> per piece (MOQ 50)</span>
              </p>
              <p className="text-sm text-[#111111]/60 leading-relaxed">{product.description}</p>
            </div>

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

            <div>
              <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Product details</p>
              <ul className="flex flex-col gap-2">
                {product.details.map(d => (
                  <li key={d} className="flex gap-3 text-sm text-[#111111]/60">
                    <span className="text-[#111111]/20 shrink-0">&#8212;</span>{d}
                  </li>
                ))}
              </ul>
            </div>

            {sizeChart && (
  <div>
    <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Size chart</p>
    <div className="border border-[#E5E5E5] overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[#F7F7F7]">
            <th className="text-left px-4 py-3 font-medium text-[#111111]/50">Size</th>
            <th className="text-left px-4 py-3 font-medium text-[#111111]/50">Chest</th>
            <th className="text-left px-4 py-3 font-medium text-[#111111]/50">Length</th>
            {sizeChart.sizes[0].shoulder && <th className="text-left px-4 py-3 font-medium text-[#111111]/50">Shoulder</th>}
            {sizeChart.sizes[0].waist && <th className="text-left px-4 py-3 font-medium text-[#111111]/50">Waist</th>}
            {sizeChart.sizes[0].inseam && <th className="text-left px-4 py-3 font-medium text-[#111111]/50">Inseam</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E5E5]">
          {sizeChart.sizes.map(row => (
            <tr key={row.size}>
              <td className="px-4 py-3 font-semibold text-[#111111]">{row.size}</td>
              <td className="px-4 py-3 text-[#111111]/60">{row.chest}</td>
              <td className="px-4 py-3 text-[#111111]/60">{row.length}</td>
              {row.shoulder && <td className="px-4 py-3 text-[#111111]/60">{row.shoulder}</td>}
              {row.waist && <td className="px-4 py-3 text-[#111111]/60">{row.waist}</td>}
              {row.inseam && <td className="px-4 py-3 text-[#111111]/60">{row.inseam}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {sizeChart.note && <p className="text-xs text-[#111111]/30 mt-2">{sizeChart.note}</p>}
  </div>
)}

            <div>
              <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Care instructions</p>
              <ul className="flex flex-col gap-1.5">
                {product.careInstructions.map(c => (
                  <li key={c} className="flex gap-3 text-xs text-[#111111]/50">
                    <span className="text-[#111111]/20 shrink-0">&#8212;</span>{c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 pt-2 border-t border-[#E5E5E5]">
              <Link href="/configure"
                className="w-full bg-[#111111] text-white py-4 text-sm font-medium text-center hover:bg-black transition-colors">
                Configure this product
              </Link>
              <button type="button" onClick={handleRequestSample}
                className="w-full border border-[#111111] text-[#111111] py-4 text-sm font-medium hover:bg-[#111111] hover:text-white transition-colors">
                Request a sample
              </button>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-24 border-t border-[#E5E5E5] pt-16">
          <h2 className="text-xs font-medium uppercase tracking-widest text-[#111111]/40 mb-8">More in {product.category}</h2>
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
                  <p className="text-sm font-bold mt-1">from &#8377;{p.price.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}