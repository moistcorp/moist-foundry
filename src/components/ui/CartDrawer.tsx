'use client'
import { useCartStore } from '@/lib/store'
import Link from 'next/link'

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const cartTotal = total()

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E5E5]">
          <p className="text-sm font-semibold text-[#111111]">Cart ({items.length})</p>
          <button type="button" onClick={onClose} className="text-[#111111]/40 hover:text-[#111111] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-sm text-[#111111]/40 text-center mt-12">Your cart is empty</p>
          ) : (
            items.map(item => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 items-start border-b border-[#E5E5E5] pb-4">
                <div className="w-14 h-14 bg-[#F7F7F7] shrink-0 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-[#111111]/20">IMG</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#111111] leading-snug">{item.name}</p>
                  <p className="text-xs text-[#111111]/50 mt-0.5">Size: {item.size}</p>
                  <p className="text-xs font-bold mt-1">&#8377;{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="w-6 h-6 border border-[#E5E5E5] text-sm flex items-center justify-center hover:border-[#111111] transition-colors">-</button>
                    <span className="text-xs w-4 text-center">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="w-6 h-6 border border-[#E5E5E5] text-sm flex items-center justify-center hover:border-[#111111] transition-colors">+</button>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id, item.size)}
                    className="text-xs text-[#111111]/30 hover:text-[#111111] transition-colors">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#E5E5E5] px-6 py-5 flex flex-col gap-3">
            <div className="flex justify-between text-sm font-bold">
              <span>Total</span>
              <span>&#8377;{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-[#111111]/40">+ Shipping quoted separately</p>
            <Link href="/checkout" onClick={onClose}
              className="w-full bg-[#111111] text-white py-3.5 text-sm font-medium text-center hover:bg-black transition-colors">
              Proceed to checkout
            </Link>
          </div>
        )}
      </div>
    </>
  )
}