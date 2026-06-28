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
  const [isMobile, setIsMobile] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const mobileScrollRef = useRef<HTMLDivElement>(null)

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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

  // Sync mobile scroll when active changes via timer
  useEffect(() => {
    const el = mobileScrollRef.current
    if (!el || !isMobile) return
    const cardWidth = el.offsetWidth * 0.82 + 16
    el.scrollTo({ left: active * cardWidth, behavior: 'smooth' })
  }, [active, isMobile])

  const handleClick = (index: number) => {
    setActive(index)
    startTimer(index)
  }

  const handleMobileScroll = () => {
    const el = mobileScrollRef.current
    if (!el) return
    const cardWidth = el.offsetWidth * 0.82 + 16
    const index = Math.round(el.scrollLeft / cardWidth)
    if (index !== active && index >= 0 && index < steps.length) {
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

        {/* MOBILE — horizontal scrolling cards */}
        {isMobile && (
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              paddingLeft: '24px',
              paddingRight: '24px',
              paddingBottom: '16px',
            }}
          >
            {steps.map((step, i) => (
              <div
                key={i}
                style={{
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                  width: '82vw',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Text */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(17,17,17,0.4)' }}>{step.number}.</span>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: '#111111', lineHeight: 1.2 }}>{step.title}</span>
                  </div>
                  <div style={{ height: '1px', background: '#E5E5E5', marginBottom: '12px', overflow: 'hidden' }}>
                    {active === i && (
                      <div style={{ height: '100%', background: '#111111', width: `${progress}%` }} />
                    )}
                  </div>
                  <p style={{ fontSize: '14px', color: 'rgba(17,17,17,0.55)', lineHeight: 1.6 }}>{step.body}</p>
                </div>
                {/* Image */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '16px', overflow: 'hidden', background: '#F7F7F7' }}>
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="82vw"
                    priority={i === 0}
                  />
                </div>
              </div>
            ))}
            <div style={{ flexShrink: 0, width: '8px' }} />
          </div>
        )}

        {/* DESKTOP — accordion left, image right */}
        {!isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center', padding: '0 24px' }}>

            <div>
              {steps.map((step, i) => {
                const isActive = active === i
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleClick(i)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '28px 0',
                      borderBottom: '1px solid #E5E5E5',
                      borderTop: i === 0 ? '1px solid #E5E5E5' : undefined,
                      display: 'block',
                      background: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: isActive ? '#111111' : 'rgba(17,17,17,0.25)' }}>
                        {step.number}.
                      </span>
                      <span style={{ fontSize: '20px', fontWeight: 700, color: isActive ? '#111111' : 'rgba(17,17,17,0.3)', lineHeight: 1.2 }}>
                        {step.title}
                      </span>
                    </div>
                    <div style={{
                      overflow: 'hidden',
                      maxHeight: isActive ? '160px' : '0px',
                      opacity: isActive ? 1 : 0,
                      transition: 'max-height 0.3s ease, opacity 0.3s ease',
                    }}>
                      <p style={{ fontSize: '14px', color: 'rgba(17,17,17,0.55)', lineHeight: 1.6, paddingLeft: '20px', paddingBottom: '16px' }}>
                        {step.body}
                      </p>
                    </div>
                    <div style={{ height: '1px', background: '#E5E5E5', marginTop: '4px', overflow: 'hidden' }}>
                      {isActive && (
                        <div style={{ height: '100%', background: '#111111', width: `${progress}%` }} />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#F7F7F7', border: '1px solid #E5E5E5', borderRadius: '16px', overflow: 'hidden' }}>
              {steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute', inset: 0,
                    opacity: active === i ? 1 : 0,
                    transition: 'opacity 0.7s ease',
                  }}
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="50vw"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  )
}