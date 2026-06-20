import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-8xl font-bold text-[#111111]/8 mb-6 leading-none">404</p>
        <h1 className="text-3xl font-bold text-[#111111] mb-3 tracking-tight">Page not found</h1>
        <p className="text-[#111111]/50 text-sm mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="bg-[#111111] text-white px-6 py-3 text-sm font-medium hover:bg-black transition-colors">
            Back to home
          </Link>
          <Link href="/catalogue" className="border border-[#111111] text-[#111111] px-6 py-3 text-sm font-medium hover:bg-[#111111] hover:text-white transition-colors">
            View catalogue
          </Link>
        </div>
      </div>
    </div>
  )
}