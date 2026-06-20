'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/products'
import { useCartStore } from '@/lib/store'
import Link from 'next/link'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

function ImageZoom({ src, alt }: { src: string; alt: string }) {
  const [zoomed, setZoomed] = useState(false)
  return (
    <>
      <div
        className="aspect-square bg-[#F7F7F7] flex items-center justify-center cursor-zoom-in overflow-hidden relative"
        onClick={() => setZoomed(true)}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        <span className="absolute bottom-3 right-3 bg-white border border-[#E5E5E5] text-xs px-2 py-1 text-[#111111]/50">
          Click to zoom
        </span>
      </div>
      {zoomed && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8 cursor-zoom-out" onClick={() => setZoomed(false)}>
          <img src={src} alt={alt} className="max-w-full max-h-full object-contain" />
          <button type="button" onClick={() => setZoomed(false)} className="absolute top-6 right-6 text-white/60 hover:text-white text-sm">Close</button>
        </div>
      )}
    </>
  )
}

export default function ShopProductClient({ product, allProducts }: { product: Product; allProducts: Product[] }) {
  const router = useRouter()
  const addItem = useCartStore(s => s.addItem)

  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  function handleAdd() {
    if (product.sizes.length > 1 && !selectedSize) {
      setError('Please select a size')
      return
    }
    setError('')
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize || product.sizes[0],
      quantity,
      image: product.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    if (product.sizes.length > 1 && !selectedSize) {
      setError('Please select a size')
      return
    }
    setError('')
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize || product.sizes[0],
      quantity,
      image: product.image,
    })
    router.push('/cart')
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Breadcrumbs crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: product.name },
        ]} />

        <div className="grid md:grid-cols-2 gap-16">
          {/* Image */}
          <div className="relative">
            {product.image ? (
              <ImageZoom src={product.image} alt={product.name} />
            ) : (
              <div className="aspect-square bg-[#F7F7F7] flex items-center justify-center">
                <span className="text-xs text-[#111111]/20 uppercase tracking-wide">Product photo</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-2">{product.category}</p>
              <h1 className="text-3xl font-bold text-[#111111] leading-tight tracking-tight mb-2">{product.name}</h1>
              <p className="text-xs text-[#111111]/40 mb-3">{product.gsm} GSM{product.fits ? ` · ${product.fits[0]} fit` : ''}</p>
              <p className="text-2xl font-bold text-[#111111]">&#8377;{product.price.toLocaleString('en-IN')}</p>
            </div>

            <p className="text-sm text-[#111111]/60 leading-relaxed">{product.description}</p>

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div>
                <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-3">Size</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map(s => (
                    <button key={s} type="button"
                      onClick={() => { setSelectedSize(s); setError('') }}
                      className={`w-12 h-12 text-sm border transition-colors ${
                        selectedSize === s
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'border-[#E5E5E5] text-[#111111] hover:border-[#111111]'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 border border-[#E5E5E5] hover:border-[#111111] transition-colors flex items-center justify-center text-lg">
                  -
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button type="button" onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 border border-[#E5E5E5] hover:border-[#111111] transition-colors flex items-center justify-center text-lg">
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button type="button" onClick={handleBuyNow}
                className="w-full bg-[#111111] text-white py-4 text-sm font-medium hover:bg-black transition-colors">
                Buy now
              </button>
              <button type="button" onClick={handleAdd}
                className="w-full border border-[#111111] text-[#111111] py-4 text-sm font-medium hover:bg-[#111111] hover:text-white transition-colors">
                {added ? 'Added to cart' : 'Add to cart'}
              </button>
            </div>

            {/* Details */}
            <div className="border-t border-[#E5E5E5] pt-6">
              <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Details</p>
              <ul className="flex flex-col gap-1.5">
                {product.details.map(d => (
                  <li key={d} className="flex gap-2 text-xs text-[#111111]/60">
                    <span className="text-[#111111]/20">—</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-[#111111]/40">Free shipping above ₹2000. Ships within 7 days.</p>
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
              <Link key={p.id} href={`/shop/${p.slug}`}
                className="group bg-white flex flex-col hover:bg-[#F7F7F7] transition-colors">
                <div className="w-full aspect-square bg-[#F7F7F7] flex items-center justify-center overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-xs text-[#111111]/20 uppercase tracking-wide">Product photo</span>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <h3 className="text-sm font-semibold text-[#111111] group-hover:underline">{p.name}</h3>
                  <p className="text-xs text-[#111111]/40">{p.gsm} GSM{p.fits ? ` · ${p.fits[0]} fit` : ''}</p>
                  <p className="text-base font-bold mt-1">&#8377;{p.price.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}