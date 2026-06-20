'use client'
import { useEffect } from 'react'
import { useCartStore } from '@/lib/store'
import Link from 'next/link'

export default function PaymentSuccess() {
  const clearCart = useCartStore(s => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#111111] mb-3 tracking-tight">Payment successful</h1>
        <p className="text-[#111111]/60 mb-2 text-sm">Your order has been placed. You will receive a confirmation email shortly.</p>
        <p className="text-[#111111]/40 text-xs mb-8">Ships within 7 days</p>
        <Link href="/shop" className="inline-block bg-[#111111] text-white px-6 py-3 text-sm font-medium hover:bg-black transition-colors">
          Continue shopping
        </Link>
      </div>
    </div>
  )
}