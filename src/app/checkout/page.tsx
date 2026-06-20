'use client'
import { useState } from 'react'
import { useCartStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Checkout() {
  const { items, total, clearCart } = useCartStore()
  const router = useRouter()
  const cartTotal = total()
  const shipping = cartTotal >= 2000 ? 0 : 99
  const grandTotal = cartTotal + shipping

  const [form, setForm] = useState({
    firstname: '', lastname: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4 tracking-tight">Nothing to checkout</h1>
        <Link href="/shop" className="inline-block bg-[#111111] text-white px-6 py-3 text-sm font-medium hover:bg-black transition">
          Back to shop
        </Link>
      </div>
    )
  }

  async function handlePayment() {
    if (!form.firstname || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
      setError('Please fill in all required fields')
      return
    }
    setLoading(true)
    setError('')

    const txnid = 'MF' + Date.now()
    const amount = grandTotal.toFixed(2)
    const productinfo = items.map(i => `${i.name} (${i.size}) x${i.quantity}`).join(', ')

    try {
      const res = await fetch('/api/payu/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txnid, amount, productinfo, firstname: form.firstname, email: form.email })
      })
      const { hash, key } = await res.json()

      // Build PayU form and submit
      const payuForm = document.createElement('form')
      payuForm.method = 'POST'
      payuForm.action = process.env.NEXT_PUBLIC_PAYU_BASE_URL ?? 'https://secure.payu.in/_payment'

      const fields: Record<string, string> = {
        key,
        txnid,
        amount,
        productinfo,
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        phone: form.phone,
        address1: form.address,
        city: form.city,
        state: form.state,
        zipcode: form.pincode,
        country: 'India',
        hash,
        surl: `${window.location.origin}/payment/success`,
        furl: `${window.location.origin}/payment/failure`,
      }

      Object.entries(fields).forEach(([k, v]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = k
        input.value = v
        payuForm.appendChild(input)
      })

      document.body.appendChild(payuForm)
      payuForm.submit()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12 tracking-tight">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest">Delivery details</p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'firstname', label: 'First name *', placeholder: 'Rahul' },
              { name: 'lastname', label: 'Last name', placeholder: 'Sharma' },
              { name: 'email', label: 'Email *', placeholder: 'you@email.com' },
              { name: 'phone', label: 'Phone *', placeholder: '+91 98765 43210' },
            ].map(f => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#111111]/50 uppercase tracking-wide">{f.label}</label>
                <input
                  name={f.name}
                  value={(form as any)[f.name]}
                  onChange={handle}
                  placeholder={f.placeholder}
                  className="border border-[#E5E5E5] px-4 py-3 text-sm focus:outline-none focus:border-[#111111] transition-colors"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#111111]/50 uppercase tracking-wide">Address *</label>
            <input name="address" value={form.address} onChange={handle}
              placeholder="Street address, apartment, floor"
              className="border border-[#E5E5E5] px-4 py-3 text-sm focus:outline-none focus:border-[#111111] transition-colors" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'city', label: 'City *', placeholder: 'Delhi' },
              { name: 'state', label: 'State', placeholder: 'Delhi' },
              { name: 'pincode', label: 'Pincode *', placeholder: '110001' },
            ].map(f => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#111111]/50 uppercase tracking-wide">{f.label}</label>
                <input name={f.name} value={(form as any)[f.name]} onChange={handle}
                  placeholder={f.placeholder}
                  className="border border-[#E5E5E5] px-4 py-3 text-sm focus:outline-none focus:border-[#111111] transition-colors" />
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {/* Order summary */}
        <div className="flex flex-col gap-4">
          <div className="border border-[#E5E5E5] p-6 flex flex-col gap-4">
            <p className="text-sm font-semibold">Order summary</p>
            <div className="flex flex-col gap-3 border-t border-[#E5E5E5] pt-4">
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between text-xs">
                  <span className="text-[#111111]/60">{item.name} ({item.size}) x{item.quantity}</span>
                  <span className="font-medium">&#8377;{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 text-sm border-t border-[#E5E5E5] pt-4">
              <div className="flex justify-between">
                <span className="text-[#111111]/50">Subtotal</span>
                <span>&#8377;{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#111111]/50">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-[#E5E5E5] pt-4">
              <span>Total</span>
              <span>&#8377;{grandTotal.toLocaleString('en-IN')}</span>
            </div>
            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-[#111111] text-white py-3.5 text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Redirecting to PayU...' : `Pay ₹${grandTotal.toLocaleString('en-IN')}`}
            </button>
          </div>
          <p className="text-xs text-center text-[#111111]/40">Secured by PayU. We never store card details.</p>
        </div>
      </div>
    </div>
  )
}