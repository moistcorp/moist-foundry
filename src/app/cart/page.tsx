'use client'
import { useCartStore } from '@/lib/store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const router = useRouter()
  const cartTotal = total()
  const shipping = cartTotal >= 2000 ? 0 : 99
  const grandTotal = cartTotal + shipping

  if (items.length === 0) return (
    <div className="max-w-7xl mx-auto px-6 py-24 text-center">
      <h1 className="text-3xl font-bold mb-4 tracking-tight">Your cart is empty</h1>
      <p className="text-[#111111]/50 text-sm mb-8">Add some items from the shop to continue.</p>
      <Link href="/shop" className="inline-block bg-[#111111] text-white px-6 py-3 text-sm font-medium hover:bg-black transition">
        Back to shop
      </Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12 tracking-tight">Your cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-px bg-[#E5E5E5]">
          {items.map(item => (
            <div key={`${item.id}-${item.size}`} className="bg-white p-5 flex gap-5 items-start">
              <div className="w-20 h-20 bg-[#F7F7F7] shrink-0 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-[#111111]/20">IMG</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111111] leading-snug">{item.name}</p>
                <p className="text-xs text-[#111111]/50 mt-0.5">Size: {item.size}</p>
                <p className="text-sm font-bold mt-2">&#8377;{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-2">
                  <button type="button"
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    className="w-7 h-7 border border-[#E5E5E5] text-sm hover:border-[#111111] transition-colors flex items-center justify-center">
                    -
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button type="button"
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    className="w-7 h-7 border border-[#E5E5E5] text-sm hover:border-[#111111] transition-colors flex items-center justify-center">
                    +
                  </button>
                </div>
                <button type="button"
                  onClick={() => removeItem(item.id, item.size)}
                  className="text-xs text-[#111111]/30 hover:text-[#111111] transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-4">
          <div className="border border-[#E5E5E5] p-6 flex flex-col gap-4">
            <p className="text-sm font-semibold">Order summary</p>
            <div className="flex flex-col gap-2 text-sm border-t border-[#E5E5E5] pt-4">
              <div className="flex justify-between">
                <span className="text-[#111111]/50">Subtotal</span>
                <span>&#8377;{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#111111]/50">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-[#111111]/40">Add ₹{(2000 - cartTotal).toLocaleString('en-IN')} more for free shipping</p>
              )}
            </div>
            <div className="flex justify-between font-bold text-base border-t border-[#E5E5E5] pt-4">
              <span>Total</span>
              <span>&#8377;{grandTotal.toLocaleString('en-IN')}</span>
            </div>
            <button
              type="button"
              onClick={() => router.push('/checkout')}
              className="w-full bg-[#111111] text-white py-3.5 text-sm font-medium hover:bg-black transition-colors"
            >
              Proceed to checkout
            </button>
            <Link href="/shop" className="text-xs text-center text-[#111111]/40 hover:text-[#111111] transition-colors">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}