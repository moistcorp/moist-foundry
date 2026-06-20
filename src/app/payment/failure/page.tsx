import Link from 'next/link'

export default function PaymentFailure() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#111111] mb-3 tracking-tight">Payment failed</h1>
        <p className="text-[#111111]/60 mb-8 text-sm">Something went wrong with your payment. Your cart has been saved — please try again.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/cart" className="bg-[#111111] text-white px-6 py-3 text-sm font-medium hover:bg-black transition-colors">
            Back to cart
          </Link>
          <Link href="/shop" className="border border-[#111111] text-[#111111] px-6 py-3 text-sm font-medium hover:bg-[#111111] hover:text-white transition-colors">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}