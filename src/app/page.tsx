import type { Metadata } from 'next'
import { generateMeta } from '@/lib/seo'
import HomeClient from './_components/HomeClient'

export const metadata: Metadata = generateMeta({
  title: 'Custom Apparel, Made to Order',
  description: 'Small batch custom apparel for brands, cafes, and companies. MOQ 50 pieces. Ships in 35 days. Manufactured in Greater Noida, India.',
  path: '/',
})

export default function Home() {
  return <HomeClient />
}