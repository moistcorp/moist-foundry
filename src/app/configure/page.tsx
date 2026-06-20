import type { Metadata } from 'next'
import { generateMeta } from '@/lib/seo'
import { Suspense } from 'react'
import ConfigureClient from './ConfigureClient'

export const metadata: Metadata = generateMeta({
  title: 'Configure Your Order',
  description: 'Design your custom apparel online. Choose garment, fabric color, upload artwork, select print placement and technique.',
  path: '/configure',
})

export default function ConfigurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-sm text-[#111111]/40">
        Loading configurator...
      </div>
    }>
      <ConfigureClient />
    </Suspense>
  )
}