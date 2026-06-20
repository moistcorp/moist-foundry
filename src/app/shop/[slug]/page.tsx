'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { products } from '@/lib/products'
import { useCartStore } from '@/lib/store'
import Link from 'next/link'

import Breadcrumbs from '@/components/ui/Breadcrumbs'

export default function ProductPage() {
  const { slug } = useParams()
  const router = useRouter()
  const product = products.find(p => p.slug === slug)
  const addItem = useCartStore(s => s.addItem)

  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  if (!product) return (
    <div className="max-w-7xl mx-auto px-6 py-24 text-center">
      <p className="text-[#111111]/50">Product not found.</p>
      <Link href="/shop" className="text-sm underline mt-4 inline-block">Back to shop</Link>
    </div>
  )

  function handleAdd() {
    if (product!.sizes.length > 1 && !selectedSize) {
      setError('Please select a size')
      return
    }
    setError('')
    addItem({
      id: product!.id,
      name: product!.name,
      price: product!.price,
      size: selectedSize || product!.sizes[0],
      quantity,
      image: product!.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    if (product!.sizes.length > 1 && !selectedSize) {
      setError('Please select a size')
      return
    }
    setError('')
    addItem({
      id: product!.id,
      name: product!.name,
      price: product!.price,
      size: selectedSize || product!.sizes[0],
      quantity,
      image: product!.image,
    })
    router.push('/cart')
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link href="/shop" className="text-xs text-[#111111]/40 hover:text-[#111111] transition-colors mb-8 inline-block uppercase tracking-widest">
        Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Image */}
        <div className="aspect-square bg-[#F7F7F7] flex items-center justify-center">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-[#111111]/20 uppercase tracking-wide">Product photo</span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#111111] leading-tight tracking-tight mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-[#111111]">&#8377;{product.price.toLocaleString('en-IN')}</p>
          </div>

          <p className="text-sm text-[#111111]/60 leading-relaxed">{product.description}</p>

          {/* Size selector */}
          {product.sizes.length > 1 && (
            <div>
              <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-3">Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setSelectedSize(s); setError('') }}
                    className={`w-12 h-12 text-sm border transition-colors ${
                      selectedSize === s
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'border-[#E5E5E5] text-[#111111] hover:border-[#111111]'
                    }`}
                  >
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
              <button type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 border border-[#E5E5E5] text-lg hover:border-[#111111] transition-colors flex items-center justify-center">
                -
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 border border-[#E5E5E5] text-lg hover:border-[#111111] transition-colors flex items-center justify-center">
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full bg-[#111111] text-white py-4 text-sm font-medium hover:bg-black transition-colors"
            >
              Buy now
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="w-full border border-[#111111] text-[#111111] py-4 text-sm font-medium hover:bg-[#111111] hover:text-white transition-colors"
            >
              {added ? 'Added to cart' : 'Add to cart'}
            </button>
          </div>

          {/* Details */}
          <div className="border-t border-[#E5E5E5] pt-6">
            <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-3">Details</p>
            <ul className="flex flex-col gap-1.5">
              {product.details.map(d => (
                <li key={d} className="text-xs text-[#111111]/60 flex gap-2">
                  <span className="text-[#111111]/30">—</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-[#111111]/40">Free shipping above ₹2000. Ships within 7 days.</p>
        </div>
      </div>
    </div>
  )
}