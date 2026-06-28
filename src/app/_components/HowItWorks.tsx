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

  const handleClick = (index: number) => {
    setActive(index)
    startTimer(index)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-14">
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

        {/* Body */}
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT — steps (always on top on mobile) */}
          <div className="flex flex-col gap-0">
            {steps.map((step, i) => {
              const isActive = active === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleClick(i)}
                  className="text-left py-7 border-b border-[#E5E5E5] first:border-t first:border-[#E5E5E5] group"
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
                    <p className="text-sm text-[#111111]/55 leading-relaxed pl-5 pb-4">
                      {step.body}
                    </p>
                  </div>

                  <div className="h-px bg-[#E5E5E5] w-full mt-1 overflow-hidden">
                    {isActive && (
                      <div
                        className="h-full bg-[#111111] transition-none"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* RIGHT — desktop: crossfade. Mobile: horizontal slide strip */}

          {/* DESKTOP — hidden on mobile */}
          <div className="hidden md:block relative w-full aspect-[4/3] bg-[#F7F7F7] border border-[#E5E5E5] overflow-hidden rounded-2xl">
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

          {/* MOBILE — horizontal sliding strip, shown below steps */}
          <div className="md:hidden w-full overflow-hidden rounded-2xl aspect-[4/3] bg-[#F7F7F7]">
            <div
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${active * 100}%)`, width: `${steps.length * 100}%` }}
            >
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="relative h-full flex-shrink-0"
                  style={{ width: `${100 / steps.length}%` }}
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${active === i ? 'bg-[#111111]' : 'bg-[#111111]/30'}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}