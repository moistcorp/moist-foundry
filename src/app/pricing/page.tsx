import type { Metadata } from 'next'
import { generateMeta } from '@/lib/seo'
import PricingClient from './PricingClient'

export const metadata: Metadata = generateMeta({
  title: 'Pricing',
  description: 'Transparent pricing for custom apparel. Starting from ₹180 per piece. Volume discounts up to 22%. No hidden fees.',
  path: '/pricing',
})

export default function PricingPage() {
  return <PricingClient />
}