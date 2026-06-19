import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Moist Foundry — Custom Apparel, Made to Order',
  description: 'Small batch custom apparel for brands, cafes, and companies. MOQ 50. Ships in 35 days.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-[#111111]`}>
        <Navbar />
        <main>{children}</main>
<WhatsAppButton />
        <Footer />
      </body>
    </html>
  )
}