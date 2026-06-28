'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const STEP_DURATION = 5000

const steps = [
  {
    number: '1',
    title: 'Select a product',
    body: 'Choose from tees, hoodies, sweatshirts, longsleeves, and totes — all manufactured at our Greater Noida facility. Every blank is cut and sewn in-house.',
    image: '/images/how-it-works-1.jpg',
  },
  {
    number: '2',
    title: 'Customise it',
    body: 'Pick your garment colour, choose a print or embroidery technique, upload your artwork, and set quantities per size. Our configurator walks you through every step.',
    image: '/images/how-it-works-2.jpg',
  },
  {
    number: '3',
    title: 'Place your order',
    body: 'Review everything, confirm your details, and lock in your order with a reservation. Our team reviews it within 24 hours and your merch ships in 18–22 days.',
    image: '/images/how-it-works-3.jpg',
  },
]

export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const mobileScrollRef = useRef<HTMLDivElement>(null)

  const startTimer = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    startTimeRef.current = Date.now()
    setProgress(0)

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const pct = Math.min((elapsed / STEP_DURATION) * 100, 100)
      setProgress(pct)

      if (elapsed >= STEP_DURATION) {
        setActive(prev => {
          const next = (prev + 1) % steps.length
          startTimer(next)
          return next
        })
      }
    }, 16)
  }

  useEffect(() => {
    startTimer(0)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  // Sync mobile scroll position when active changes via timer
  useEffect(() => {
    const el = mobileScrollRef.current
    if (!el) return
    const cardWidth = el.offsetWidth * 0.82 + 16 // 82vw card + gap
    el.scrollTo({ left: active * cardWidth, behavior: 'smooth' })
  }, [active])

  const handleClick = (index: number) => {
    setActive(index)
    startTimer(index)
  }

  // Detect which card is in view on mobile scroll
  const handleMobileScroll = () => {
    const el = mobileScrollRef.current
    if (!el) return
    const cardWidth = el.offsetWidth * 0.82 + 16
    const index = Math.round(el.scrollLeft / cardWidth)
    if (index !== active) {
      setActive(index)
      startTimer(index)
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 px-6">
          <p className="text-xs text-[#111111]/40 font-medium mb-4 tracking-widest uppercase">How it works</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-4xl font-bold text-[#111111] tracking-tight leading-tight">
              Launch your merch<br />project today.
            </h2>
            <Link
              href="/configure"
              className="text-sm font-medium text-[#111111] underline underline-offset-4 hover:opacity-50 transition-opacity whitespace-nowrap"
            >
              Start designing →
            </Link>
          </div>
        </div>

        {/* ── MOBILE — horizontal scrolling cards ── */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 pb-4"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {steps.map((step, i) => (
            <div
              key={i}
              className="snap-start flex-shrink-0 flex flex-col gap-4"
              style={{ width: '82vw' }}
            >
              {/* Text */}
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm font-bold text-[#111111]/40">{step.number}.</span>
                  <span className="text-xl font-bold text-[#111111] tracking-tight">{step.title}</span>
                </div>
                {/* Progress bar */}
                <div className="h-px bg-[#E5E5E5] w-full mb-3 overflow-hidden">
                  {active === i && (
                    <div className="h-full bg-[#111111] transition-none" style={{ width: `${progress}%` }} />
                  )}
                </div>
                <p className="text-sm text-[#111111]/55 leading-relaxed">{step.body}</p>
              </div>
              {/* Image */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#F7F7F7]">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="82vw"
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
          {/* Trailing padding card */}
          <div className="flex-shrink-0 w-2" />
        </div>

        {/* ── DESKTOP — accordion left, image right ── */}
        <div className="hidden md:grid md:grid-cols-2 gap-16 items-center px-6">

          <div className="flex flex-col gap-0">
            {steps.map((step, i) => {
              const isActive = active === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleClick(i)}
                  className="text-left py-7 border-b border-[#E5E5E5] first:border-t first:border-[#E5E5E5]"
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className={`text-xs font-bold tabular-nums transition-colors ${isActive ? 'text-[#111111]' : 'text-[#111111]/25'}`}>
                      {step.number}.
                    </span>
                    <span className={`text-xl font-bold tracking-tight transition-colors leading-snug ${isActive ? 'text-[#111111]' : 'text-[#111111]/30'}`}>
                      {step.title}
                    </span>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-sm text-[#111111]/55 leading-relaxed pl-5 pb-4">{step.body}</p>
                  </div>
                  <div className="h-px bg-[#E5E5E5] w-full mt-1 overflow-hidden">
                    {isActive && (
                      <div className="h-full bg-[#111111] transition-none" style={{ width: `${progress}%` }} />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="relative w-full aspect-[4/3] bg-[#F7F7F7] border border-[#E5E5E5] overflow-hidden rounded-2xl">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${active === i ? 'opacity-100' : 'opacity-0'}`}
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}