'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { RUSH_DELIVERY_DAYS } from '@/lib/pricing'

export default function HeroScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const videoWrap = videoWrapRef.current
    const video = videoRef.current
    if (!container || !videoWrap || !video) return

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      // How far the top of the container has scrolled above the viewport top
      const scrolled = Math.max(0, -rect.top)
      // Total scrollable distance = container height minus one viewport
      const scrollable = container.offsetHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(scrolled / scrollable, 1) : 0

      // Inset: starts at 24px on all sides, collapses to 0
      const inset = Math.round(24 * (1 - progress))
      // Border radius: 20px → 0px
      const radius = Math.round(20 * (1 - progress))

      videoWrap.style.top = `${inset}px`
      videoWrap.style.left = `${inset}px`
      videoWrap.style.right = `${inset}px`
      videoWrap.style.bottom = `${inset}px`
      videoWrap.style.borderRadius = `${radius}px`

      // Play when mid-animation, pause at edges
      if (progress > 0.02) {
  video.play().catch(() => {})
}
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* ── HERO — normal document flow ── */}
      <section className="grid lg:grid-cols-2 min-h-[90vh]">

        {/* Left — text */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-20 lg:py-0 bg-white">
          <p className="text-xs text-[#111111]/40 font-medium mb-6 tracking-widest uppercase">
            Custom apparel for businesses
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#111111] leading-[1.05] tracking-tight mb-6">
            Custom merch<br />for your<br />business
          </h1>
          <p className="text-base text-[#111111]/50 max-w-sm mb-10 leading-relaxed">
            From design to delivery: premium custom merch, made in India. Create, customise and place your order in just a few simple steps.
          </p>
          <div className="flex gap-6 mb-10">
            <div>
              <p className="text-2xl font-bold text-[#111111]">50</p>
              <p className="text-xs text-[#111111]/40 uppercase tracking-wide">Min. pieces</p>
            </div>
            <div className="w-px bg-[#E5E5E5]" />
            <div>
              <p className="text-2xl font-bold text-[#111111]">{RUSH_DELIVERY_DAYS}</p>
              <p className="text-xs text-[#111111]/40 uppercase tracking-wide">Day delivery</p>
            </div>
            <div className="w-px bg-[#E5E5E5]" />
            <div>
              <p className="text-2xl font-bold text-[#111111]">100%</p>
              <p className="text-xs text-[#111111]/40 uppercase tracking-wide">Made in India</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/configure" className="bg-[#111111] text-white px-8 py-4 text-sm font-medium hover:bg-black transition-colors">
              Start designing
            </Link>
            <Link href="/catalogue" className="border border-[#111111]/20 text-[#111111] px-8 py-4 text-sm font-medium hover:border-[#111111] transition-colors">
              View catalogue
            </Link>
          </div>
        </div>

        {/* Right — hero image */}
        <div className="relative bg-[#F7F7F7] flex items-center justify-center min-h-64 lg:min-h-full overflow-hidden">
          <Image
            src="/hero.jpg"
            alt="Custom merch made in India"
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
          <div className="absolute bottom-8 left-8 bg-white border border-[#E5E5E5] px-5 py-4 shadow-sm z-10">
            <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-1">Starting from</p>
            <p className="text-2xl font-bold text-[#111111]">&#8377;350</p>
            <p className="text-xs text-[#111111]/50">per piece &middot; MOQ 50</p>
          </div>
        </div>

      </section>

      {/* ── SCROLL VIDEO — tall container drives animation ── */}
      <div ref={containerRef} className="relative h-[120vh] overflow-hidden">

        {/* Sticky frame — locks to viewport while scrolling through container */}
        <div className="sticky top-0 h-screen">

          {/* Video card — absolutely positioned, inset shrinks to 0 on scroll */}
          <div
            ref={videoWrapRef}
            className="absolute overflow-hidden"
            style={{
              top: '24px',
              left: '24px',
              right: '24px',
              bottom: '24px',
              borderRadius: '20px',
            }}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src="/videos/homepage-reel.mp4"
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>

        </div>
      </div>
    </>
  )
}