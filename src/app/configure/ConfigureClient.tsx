'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  PRODUCT_PRICES,
  calcOrder,
  getDeliveryDate,
  DELIVERY_DAYS,
  RUSH_DELIVERY_DAYS,
  getRushCharge,
  getDiscount,
  VOLUME_TIERS,
} from '@/lib/pricing'

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const products = [
  { name: 'Regular Fit Tee (200 GSM)' },
  { name: 'Boxy Fit Tee (200 GSM)' },
  { name: 'Regular Fit Tee (260 GSM)' },
  { name: 'Boxy Fit Tee (260 GSM)' },
  { name: 'Longsleeve Tee (260 GSM)' },
  { name: 'Regular Fit Sweatshirt (320 GSM)' },
  { name: 'Regular Fit Hoodie (320 GSM)' },
  { name: 'Boxy Fit Hoodie (320 GSM)' },
  { name: 'Canvas Tote Bag' },
]

// Product image map — exact paths from products.ts
const PRODUCT_IMAGES: Record<string, string> = {
  'Regular Fit Tee (200 GSM)':        '/products/regular-fit-tee-200gsm.jpg',
  'Boxy Fit Tee (200 GSM)':           '/products/boxy-fit-tee-200gsm.jpg',
  'Regular Fit Tee (260 GSM)':        '/products/regular-fit-tee-260gsm.jpg',
  'Boxy Fit Tee (260 GSM)':           '/products/boxy-fit-tee-260gsm.jpg',
  'Longsleeve Tee (260 GSM)':         '/products/longsleeve-tee-260gsm.jpg',
  'Regular Fit Sweatshirt (320 GSM)': '/products/regular-fit-sweatshirt-320gsm.jpg',
  'Regular Fit Hoodie (320 GSM)':     '/products/regular-fit-hoodie-320gsm.jpg',
  'Boxy Fit Hoodie (320 GSM)':        '/products/boxy-fit-hoodie-320gsm.jpg',
  'Canvas Tote Bag':                  '/products/canvas-tote-bag.jpg',
}

const ALL_TECHNIQUES = [
  'Screen Print',
  'DTG',
  'Reflective Heat Transfer',
  'Embroidery',
  '3D Embroidery',
  'Puff',
  'DTF',
] as const

type Technique = typeof ALL_TECHNIQUES[number]

const techniqueInfo: Record<string, string> = {
  'Screen Print': 'Bold, solid colors. Best for large runs.',
  'DTG': 'Full-color digital print. No minimum colors.',
  'Reflective Heat Transfer': 'Reflects light. Great for safety and streetwear.',
  'Embroidery': 'Stitched finish. Classic and long-lasting.',
  '3D Embroidery': 'Raised foam stitching. Premium structured look.',
  'Puff': 'Raised ink effect. Bold and tactile.',
  'DTF': 'Direct-to-film transfer. Vibrant and detailed.',
}

// ── SIGNATURE COLORS (keep `signature` flag for TypeScript type consistency) ──
const SIGNATURE_COLORS: { name: string; hex: string; pantone: string | null; signature: boolean }[] = [
  { name: 'Bright White', hex: 'rgb(255,255,255)', pantone: null, signature: true },
  { name: 'True Black', hex: 'rgb(23,23,23)', pantone: null, signature: true },
  { name: 'Amparo Blue', hex: 'rgba(59,130,246,0.5)', pantone: null, signature: true },
  { name: 'Fuchsia', hex: 'rgb(239,149,199)', pantone: null, signature: true },
]

// ── TPG PANTONE COLORS (official codes like 18-1664 TPG) ──
const TPG_COLORS: { name: string; hex: string; pantone: string | null; signature: boolean }[] = [
  // Whites & Creams
  { name: '11-0601 TPG', hex: '#F5F5F0', pantone: '11-0601 TPG', signature: false },
  { name: '11-0602 TPG', hex: '#F2EFE4', pantone: '11-0602 TPG', signature: false },
  { name: '11-0700 TPG', hex: '#F8F4E3', pantone: '11-0700 TPG', signature: false },
  { name: '11-4800 TPG', hex: '#EAE8E1', pantone: '11-4800 TPG', signature: false },
  { name: '12-0104 TPG', hex: '#EDE8D5', pantone: '12-0104 TPG', signature: false },
  { name: '12-0712 TPG', hex: '#F0E6C8', pantone: '12-0712 TPG', signature: false },
  { name: '12-0752 TPG', hex: '#FFE033', pantone: '12-0752 TPG', signature: false },
  { name: '12-0104 TPG', hex: '#EDE8D5', pantone: '12-0104 TPG', signature: false },
  // Yellows
  { name: '13-0756 TPG', hex: '#FFD700', pantone: '13-0756 TPG', signature: false },
  { name: '13-0858 TPG', hex: '#FFCC00', pantone: '13-0858 TPG', signature: false },
  { name: '14-0846 TPG', hex: '#F5C518', pantone: '14-0846 TPG', signature: false },
  { name: '14-0952 TPG', hex: '#F5A623', pantone: '14-0952 TPG', signature: false },
  { name: '15-1062 TPG', hex: '#F0941D', pantone: '15-1062 TPG', signature: false },
  { name: '15-1157 TPG', hex: '#F48024', pantone: '15-1157 TPG', signature: false },
  // Oranges
  { name: '15-1164 TPG', hex: '#F07030', pantone: '15-1164 TPG', signature: false },
  { name: '16-1358 TPG', hex: '#E8602C', pantone: '16-1358 TPG', signature: false },
  { name: '16-1546 TPG', hex: '#E87040', pantone: '16-1546 TPG', signature: false },
  { name: '16-1548 TPG', hex: '#E86030', pantone: '16-1548 TPG', signature: false },
  { name: '17-1462 TPG', hex: '#E05020', pantone: '17-1462 TPG', signature: false },
  { name: '17-1464 TPG', hex: '#D84818', pantone: '17-1464 TPG', signature: false },
  // Reds
  { name: '18-1660 TPG', hex: '#CC2222', pantone: '18-1660 TPG', signature: false },
  { name: '18-1662 TPG', hex: '#C82020', pantone: '18-1662 TPG', signature: false },
  { name: '18-1664 TPG', hex: '#C01818', pantone: '18-1664 TPG', signature: false },
  { name: '18-1550 TPG', hex: '#B84030', pantone: '18-1550 TPG', signature: false },
  { name: '19-1664 TPG', hex: '#A01010', pantone: '19-1664 TPG', signature: false },
  { name: '19-1557 TPG', hex: '#8B1A1A', pantone: '19-1557 TPG', signature: false },
  // Pinks
  { name: '13-2010 TPG', hex: '#FFD0D0', pantone: '13-2010 TPG', signature: false },
  { name: '14-1911 TPG', hex: '#FFBABA', pantone: '14-1911 TPG', signature: false },
  { name: '15-1920 TPG', hex: '#F5A0A0', pantone: '15-1920 TPG', signature: false },
  { name: '16-1723 TPG', hex: '#E88090', pantone: '16-1723 TPG', signature: false },
  { name: '17-1927 TPG', hex: '#D06070', pantone: '17-1927 TPG', signature: false },
  { name: '18-2043 TPG', hex: '#D03070', pantone: '18-2043 TPG', signature: false },
  { name: '18-3025 TPG', hex: '#C050B0', pantone: '18-3025 TPG', signature: false },
  { name: '17-2624 TPG', hex: '#D060A0', pantone: '17-2624 TPG', signature: false },
  { name: '16-2126 TPG', hex: '#E07090', pantone: '16-2126 TPG', signature: false },
  // Purples
  { name: '17-3628 TPG', hex: '#9060B0', pantone: '17-3628 TPG', signature: false },
  { name: '18-3633 TPG', hex: '#7840A0', pantone: '18-3633 TPG', signature: false },
  { name: '19-3536 TPG', hex: '#602890', pantone: '19-3536 TPG', signature: false },
  { name: '19-3748 TPG', hex: '#501880', pantone: '19-3748 TPG', signature: false },
  { name: '19-3950 TPG', hex: '#401070', pantone: '19-3950 TPG', signature: false },
  { name: '19-3830 TPG', hex: '#300860', pantone: '19-3830 TPG', signature: false },
  // Blues
  { name: '15-3920 TPG', hex: '#A0C0E8', pantone: '15-3920 TPG', signature: false },
  { name: '16-4132 TPG', hex: '#80A8D8', pantone: '16-4132 TPG', signature: false },
  { name: '17-4041 TPG', hex: '#5888C0', pantone: '17-4041 TPG', signature: false },
  { name: '18-4051 TPG', hex: '#3868A8', pantone: '18-4051 TPG', signature: false },
  { name: '18-4244 TPG', hex: '#2858A0', pantone: '18-4244 TPG', signature: false },
  { name: '19-4050 TPG', hex: '#184090', pantone: '19-4050 TPG', signature: false },
  { name: '19-4150 TPG', hex: '#103880', pantone: '19-4150 TPG', signature: false },
  { name: '19-4340 TPG', hex: '#083060', pantone: '19-4340 TPG', signature: false },
  { name: '19-4241 TPG', hex: '#102848', pantone: '19-4241 TPG', signature: false },
  // Teals & Aquas
  { name: '14-4818 TPG', hex: '#A0D8D0', pantone: '14-4818 TPG', signature: false },
  { name: '15-5519 TPG', hex: '#70C0B0', pantone: '15-5519 TPG', signature: false },
  { name: '17-5126 TPG', hex: '#30A090', pantone: '17-5126 TPG', signature: false },
  { name: '18-5020 TPG', hex: '#207870', pantone: '18-5020 TPG', signature: false },
  { name: '18-5338 TPG', hex: '#108070', pantone: '18-5338 TPG', signature: false },
  { name: '19-4916 TPG', hex: '#085848', pantone: '19-4916 TPG', signature: false },
  // Greens
  { name: '13-0117 TPG', hex: '#C8EDB0', pantone: '13-0117 TPG', signature: false },
  { name: '14-0232 TPG', hex: '#98D888', pantone: '14-0232 TPG', signature: false },
  { name: '15-0545 TPG', hex: '#58C858', pantone: '15-0545 TPG', signature: false },
  { name: '16-0237 TPG', hex: '#48A848', pantone: '16-0237 TPG', signature: false },
  { name: '17-0145 TPG', hex: '#309830', pantone: '17-0145 TPG', signature: false },
  { name: '18-0135 TPG', hex: '#207820', pantone: '18-0135 TPG', signature: false },
  { name: '19-0230 TPG', hex: '#185818', pantone: '19-0230 TPG', signature: false },
  { name: '18-0430 TPG', hex: '#486830', pantone: '18-0430 TPG', signature: false },
  { name: '18-0325 TPG', hex: '#507040', pantone: '18-0325 TPG', signature: false },
  { name: '17-0535 TPG', hex: '#608050', pantone: '17-0535 TPG', signature: false },
  // Olives & Khakis
  { name: '18-0430 TPG', hex: '#607040', pantone: '18-0430 TPG', signature: false },
  { name: '18-0526 TPG', hex: '#686030', pantone: '18-0526 TPG', signature: false },
  { name: '18-0625 TPG', hex: '#706830', pantone: '18-0625 TPG', signature: false },
  { name: '19-0417 TPG', hex: '#484030', pantone: '19-0417 TPG', signature: false },
  // Browns & Tans
  { name: '14-1118 TPG', hex: '#E8C898', pantone: '14-1118 TPG', signature: false },
  { name: '15-1220 TPG', hex: '#D8A878', pantone: '15-1220 TPG', signature: false },
  { name: '16-1325 TPG', hex: '#C08858', pantone: '16-1325 TPG', signature: false },
  { name: '17-1044 TPG', hex: '#A87038', pantone: '17-1044 TPG', signature: false },
  { name: '18-1048 TPG', hex: '#905828', pantone: '18-1048 TPG', signature: false },
  { name: '18-1142 TPG', hex: '#804820', pantone: '18-1142 TPG', signature: false },
  { name: '19-1217 TPG', hex: '#604030', pantone: '19-1217 TPG', signature: false },
  { name: '19-1228 TPG', hex: '#503020', pantone: '19-1228 TPG', signature: false },
  { name: '19-1338 TPG', hex: '#402010', pantone: '19-1338 TPG', signature: false },
  // Greys
  { name: '11-4800 TPG', hex: '#E8E8E8', pantone: '11-4800 TPG', signature: false },
  { name: '13-4305 TPG', hex: '#D0D0D0', pantone: '13-4305 TPG', signature: false },
  { name: '14-4102 TPG', hex: '#B8B8B8', pantone: '14-4102 TPG', signature: false },
  { name: '16-3911 TPG', hex: '#A0A0A0', pantone: '16-3911 TPG', signature: false },
  { name: '17-4014 TPG', hex: '#888888', pantone: '17-4014 TPG', signature: false },
  { name: '18-0201 TPG', hex: '#707070', pantone: '18-0201 TPG', signature: false },
  { name: '19-0303 TPG', hex: '#585858', pantone: '19-0303 TPG', signature: false },
  { name: '19-3906 TPG', hex: '#404040', pantone: '19-3906 TPG', signature: false },
  { name: '19-4005 TPG', hex: '#282828', pantone: '19-4005 TPG', signature: false },
]

const ALL_COLORS = [...SIGNATURE_COLORS, ...TPG_COLORS]

// Placements: Front and Back only
const PLACEMENTS = ['Front', 'Back'] as const
type Placement = typeof PLACEMENTS[number]

// Neck label types and their config
const NECK_LABEL_TYPES = ['No label', 'Woven label', 'Printed label', 'Heat transfer label'] as const
type NeckLabelType = typeof NECK_LABEL_TYPES[number]

const WOVEN_DIMENSIONS = ['50x18mm', '60x20mm', '65x15mm', '45x45mm'] as const
const WOVEN_POSITIONS = ['Below neck tape (5mm)', 'On neck tape'] as const
const BELOW_TAPE_CORNERS = ['2 side', '4-corner', '2-corner'] as const

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const productGroups = [
  { category: 'T-Shirts', items: products.filter(p => p.name.includes('Tee') && !p.name.includes('Longsleeve')) },
  { category: 'Longsleeve', items: products.filter(p => p.name.includes('Longsleeve')) },
  { category: 'Sweatshirts', items: products.filter(p => p.name.includes('Sweatshirt')) },
  { category: 'Hoodies', items: products.filter(p => p.name.includes('Hoodie')) },
  { category: 'Accessories', items: products.filter(p => p.name.includes('Tote')) },
]

const INDIAN_STATES = [
  'Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar',
  'Chandigarh','Chhattisgarh','Dadra and Nagar Haveli and Daman and Diu','Delhi',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand',
  'Karnataka','Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra',
  'Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Puducherry','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal',
]

// Artwork: same formats as Rovo Assembly
const ALLOWED_ARTWORK_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.svg', '.ai']
const ALLOWED_NECK_LABEL_EXTENSIONS = ['.svg', '.ai']
const MAX_BYTES = 4.5 * 1024 * 1024
const CONFIGURATOR_DRAFT_KEY = 'mf_configurator_v2'
const CONFIGURATOR_DRAFT_TTL_MS = 2 * 60 * 60 * 1000

type Screen = 'picker' | 'configure' | 'summary' | 'shipping' | 'review' | 'success'

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface NeckLabelConfig {
  type: NeckLabelType
  dimension: string
  position: string
  cornerStyle: string
}

interface ShippingState {
  firstName: string; lastName: string; company: string; country: string
  addressLine1: string; addressLine2: string; pincode: string; city: string
  state: string; email: string; phone: string; poNumber: string
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function distributeQty(total: number): Record<string, number> {
  const weights: Record<string, number> = { XS: 0.05, S: 0.15, M: 0.30, L: 0.30, XL: 0.15, XXL: 0.05 }
  const raw: Record<string, number> = {}
  let sum = 0
  for (const [s, w] of Object.entries(weights)) { raw[s] = Math.round(total * w); sum += raw[s] }
  raw['M'] = (raw['M'] ?? 0) + (total - sum)
  return raw
}

function getColorHex(name: string): string {
  return ALL_COLORS.find(c => c.name === name)?.hex ?? '#F8F8F8'
}

const emptyAddress = (): ShippingState => ({
  firstName: '', lastName: '', company: '', country: 'India',
  addressLine1: '', addressLine2: '', pincode: '', city: '',
  state: '', email: '', phone: '', poNumber: '',
})

// ─── GARMENT SVG ─────────────────────────────────────────────────────────────

function GarmentSVG({ color, activePlacements, frontPreview, backPreview, activeView, productName, neckLabel, neckLabelPreview }: {
  color: string; activePlacements: string[]; frontPreview: string | null
  backPreview: string | null; activeView: 'Front' | 'Back' | 'Neck'; productName: string
  neckLabel?: NeckLabelConfig; neckLabelPreview?: string | null
}) {
  const showFront = activeView !== 'Back'
  const isNeckZoom = activeView === 'Neck'
  const hasNeckLabel = !!neckLabel && neckLabel.type !== 'No label'
  const gc = getColorHex(color)
  const isDark = ['rgb(23,23,23)','#1B2A4A','#2D5016','#191970','#006400','#355E3B','#4B5320',
    '#380032','#800000','#800080','#4B0082'].includes(gc) ||
    /^#[012345]/.test(gc)
  const sc = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'
  const hl = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
  const isTote = productName.includes('Tote')

  if (isTote) return (
    <svg viewBox="0 0 300 320" width="100%" style={{ maxWidth: 280 }} xmlns="http://www.w3.org/2000/svg">
      <path d="M60 100 L80 60 L100 60 L100 80 C100 90 200 90 200 80 L200 60 L220 60 L240 100 L240 280 L60 280 Z" fill={gc} stroke={sc} strokeWidth="1.5" />
      {frontPreview && <image href={frontPreview} x="105" y="140" width="90" height="90" preserveAspectRatio="xMidYMid meet" />}
      {!frontPreview && activePlacements.includes('Front') && <rect x="105" y="140" width="90" height="90" rx="2" fill="none" stroke="#111111" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />}
    </svg>
  )

  if (isNeckZoom) return (
    <svg viewBox="0 0 300 260" width="100%" style={{ maxWidth: 320 }} xmlns="http://www.w3.org/2000/svg">
      <path d="M20 200 C20 80 100 30 150 30 C200 30 280 80 280 200 L280 260 L20 260 Z" fill={gc} stroke={sc} strokeWidth="1.5" />
      <path d="M95 48 C108 82 128 100 150 100 C172 100 192 82 205 48" fill="none" stroke={sc} strokeWidth="2.5" />
      <circle cx="150" cy="150" r="5" fill="none" stroke={sc} strokeWidth="1.5" />
      {neckLabelPreview ? (
        <image href={neckLabelPreview} x="118" y="92" width="64" height="26" preserveAspectRatio="xMidYMid meet" />
      ) : hasNeckLabel ? (
        <rect x="118" y="92" width="64" height="26" rx="2" fill="white" stroke="#111111" strokeWidth="1.5" />
      ) : null}
    </svg>
  )

  return (
    <svg viewBox="0 0 300 320" width="100%" style={{ maxWidth: 320 }} xmlns="http://www.w3.org/2000/svg">
      <path d="M75 80 L40 110 L55 125 L65 115 L65 270 L235 270 L235 115 L245 125 L260 110 L225 80 C210 75 195 70 180 68 C175 85 162 95 150 95 C138 95 125 85 120 68 C105 70 90 75 75 80Z" fill={gc} stroke={sc} strokeWidth="1.5" />
      <path d="M65 115 L40 110 L55 125 L65 165 Z" fill={gc} stroke={sc} strokeWidth="1.5" />
      <path d="M235 115 L260 110 L245 125 L235 165 Z" fill={gc} stroke={sc} strokeWidth="1.5" />
      {showFront && <path d="M120 68 C125 85 138 95 150 95 C162 95 175 85 180 68" fill="none" stroke={sc} strokeWidth="2" />}
      {showFront && hasNeckLabel && (
        <rect x="138" y="78" width="24" height="10" rx="1.5" fill="white" stroke="#111111" strokeWidth="1.25" opacity="0.9" />
      )}
      <path d="M100 90 L90 270 L110 270 L115 90Z" fill={hl} />
      {showFront && activePlacements.includes('Front') && !frontPreview && <rect x="120" y="130" width="60" height="60" rx="2" fill="none" stroke="#111111" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />}
      {!showFront && activePlacements.includes('Back') && !backPreview && <rect x="120" y="130" width="60" height="60" rx="2" fill="none" stroke="#111111" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />}
      {showFront && frontPreview && activePlacements.includes('Front') && <image href={frontPreview} x="122" y="132" width="56" height="56" preserveAspectRatio="xMidYMid meet" />}
      {!showFront && backPreview && activePlacements.includes('Back') && <image href={backPreview} x="122" y="132" width="56" height="56" preserveAspectRatio="xMidYMid meet" />}
    </svg>
  )
}

// ─── ACCORDION ───────────────────────────────────────────────────────────────

function Accordion({ title, summary, complete = false, children, defaultOpen = false, open: controlledOpen, onToggle }: {
  title: string
  summary?: string
  complete?: boolean
  children: React.ReactNode | ((controls: { close: () => void }) => React.ReactNode)
  defaultOpen?: boolean
  open?: boolean
  onToggle?: (next: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = (next: boolean) => {
    if (isControlled) onToggle?.(next)
    else setInternalOpen(next)
  }
  const content = typeof children === 'function' ? children({ close: () => setOpen(false) }) : children
  return (
    <div className={`border transition-colors rounded-lg overflow-hidden ${open ? 'border-[#DADADA] bg-white' : 'border-transparent bg-[#F7F7F7] hover:bg-[#F2F2F2]'}`}>
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#111111] tracking-tight">{title}</span>
            {complete && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" className="shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
          {summary && <span className="block text-xs text-[#111111]/50 mt-1 truncate">{summary}</span>}
        </span>
        <span className="w-8 h-8 rounded-full bg-white border border-[#EAEAEA] flex items-center justify-center shrink-0 ml-4">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      {open && <div className="border-t border-[#E5E5E5] px-5 py-5">{content}</div>}
    </div>
  )
}

// ─── COLOR PICKER ────────────────────────────────────────────────────────────

function ColorSwatch({ color, selected, onSelect }: {
  color: { name: string; hex: string; pantone: string | null; signature: boolean }
  selected: string; onSelect: (name: string) => void
}) {
  const isSelected = selected === color.name
  return (
    <button type="button" onClick={() => onSelect(color.name)}
      title={color.signature ? color.name : color.pantone ?? color.name}
      className="flex flex-col items-center gap-1">
      <div className={`w-9 h-9 rounded-full border-2 transition-all ${isSelected ? 'border-[#111111] scale-110' : 'border-[#E5E5E5] hover:border-[#111111]/40'}`}
        style={{ backgroundColor: color.hex }} />
      <span className={`text-[9px] text-center leading-tight line-clamp-2 ${isSelected ? 'text-[#111111] font-medium' : 'text-[#111111]/40'}`}>
        {color.signature ? color.name : color.pantone}
      </span>
    </button>
  )
}

function ColorPicker({ selected, onSelect }: { selected: string; onSelect: (name: string) => void }) {
  const [search, setSearch] = useState('')
  const filtered = search.trim()
    ? ALL_COLORS.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.pantone && c.pantone.toLowerCase().includes(search.toLowerCase()))
      )
    : ALL_COLORS
  const signatures = filtered.filter(c => c.signature)
  const pantones = filtered.filter(c => !c.signature)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or Pantone code (e.g. 18-1664)…"
          className="w-full pl-8 pr-3 py-2 text-xs border border-[#E5E5E5] focus:outline-none focus:border-[#111111] bg-[#F7F7F7]" />
      </div>
      {signatures.length > 0 && (
        <div>
          <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest mb-2">Signature colors</p>
          <div className="grid grid-cols-5 gap-2">
            {signatures.map(c => <ColorSwatch key={c.name} color={c} selected={selected} onSelect={onSelect} />)}
          </div>
        </div>
      )}
      {pantones.length > 0 && (
        <div>
          <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest mb-2">
            Pantone TPG{search ? ` — ${pantones.length} results` : ` — ${pantones.length} colors`}
          </p>
          <div className="grid grid-cols-5 gap-2 max-h-[280px] overflow-y-auto pr-1">
            {pantones.map((c, i) => <ColorSwatch key={c.name + i} color={c} selected={selected} onSelect={onSelect} />)}
          </div>
        </div>
      )}
      {filtered.length === 0 && (
        <p className="text-xs text-[#111111]/40 text-center py-4">No colors match &ldquo;{search}&rdquo;</p>
      )}
    </div>
  )
}

// ─── NECK LABEL CONFIGURATOR ─────────────────────────────────────────────────

function NeckLabelSection({ config, onChange }: { config: NeckLabelConfig; onChange: (c: NeckLabelConfig) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-2">Label type</p>
        <div className="grid grid-cols-2 gap-2">
          {NECK_LABEL_TYPES.map(l => (
            <button key={l} type="button" onClick={() => onChange({ ...config, type: l })}
              className={`px-3 py-2.5 border rounded-md text-xs text-left transition-colors ${config.type === l ? 'border-[#111111] bg-[#111111]/5 font-medium' : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111]/40 bg-white'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {config.type === 'Woven label' && (
        <>
          <div>
            <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-2">Dimensions</p>
            <div className="grid grid-cols-2 gap-2">
              {WOVEN_DIMENSIONS.map(d => (
                <button key={d} type="button" onClick={() => onChange({ ...config, dimension: d })}
                  className={`px-3 py-2 border rounded-md text-xs transition-colors ${config.dimension === d ? 'border-[#111111] bg-[#111111]/5 font-medium' : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111]/40 bg-white'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-2">Position</p>
            <div className="flex flex-col gap-2">
              {WOVEN_POSITIONS.map(pos => (
                <button key={pos} type="button"
                  onClick={() => onChange({ ...config, position: pos, cornerStyle: pos === 'On neck tape' ? '2-corner' : config.cornerStyle })}
                  className={`px-3 py-2.5 border rounded-md text-xs text-left transition-colors ${config.position === pos ? 'border-[#111111] bg-[#111111]/5 font-medium' : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111]/40 bg-white'}`}>
                  {pos}
                </button>
              ))}
            </div>
          </div>
          {config.position === 'Below neck tape (5mm)' && (
            <div>
              <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-2">Corner style</p>
              <div className="grid grid-cols-3 gap-2">
                {BELOW_TAPE_CORNERS.map(corner => (
                  <button key={corner} type="button" onClick={() => onChange({ ...config, cornerStyle: corner })}
                    className={`px-2 py-2 border rounded-md text-xs transition-colors ${config.cornerStyle === corner ? 'border-[#111111] bg-[#111111]/5 font-medium' : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111]/40 bg-white'}`}>
                    {corner}
                  </button>
                ))}
              </div>
            </div>
          )}
          {config.position === 'On neck tape' && (
            <p className="text-xs text-[#111111]/40 bg-[#F7F7F7] border border-[#E5E5E5] px-3 py-2">
              On neck tape position uses 2-corner fold (fixed)
            </p>
          )}
        </>
      )}
      {(config.type === 'Printed label' || config.type === 'Heat transfer label') && (
        <p className="text-xs text-[#111111]/40 bg-[#F7F7F7] border border-[#E5E5E5] px-3 py-2">
          Placed below neck tape at 5mm. No position customization.
        </p>
      )}
      {config.type !== 'No label' && (
        <a href="/downloads/neck-label-templates.zip" download
          className="flex items-center justify-between border border-[#111111] rounded-md px-4 py-3 text-xs font-medium text-[#111111] hover:bg-[#111111] hover:text-white transition-colors">
          <span>Download neck label templates</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>
      )}
    </div>
  )
}

// ─── ARTWORK UPLOAD ───────────────────────────────────────────────────────────

function ArtworkUpload({ side, file, preview, onFile, onClear, error, isNeckLabel = false }: {
  side: string; file: File | null; preview: string | null
  onFile: (f: File) => void; onClear: () => void; error: string; isNeckLabel?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const acceptedExts = isNeckLabel ? ALLOWED_NECK_LABEL_EXTENSIONS : ALLOWED_ARTWORK_EXTENSIONS
  const acceptStr = isNeckLabel ? '.svg,.ai' : '.jpg,.jpeg,.png,.svg,.ai'
  const supportText = isNeckLabel
    ? 'We support .svg, .ai files up to 4.5MB'
    : 'We support .jpg, .jpeg, .png, .svg, .ai (Adobe Illustrator) files up to 4.5MB'

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept={acceptStr} className="hidden"
        onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
      {preview ? (
        <div className="border border-[#E5E5E5] rounded-md p-3 flex items-center gap-3">
          <img src={preview} alt={side} className="w-10 h-10 object-contain bg-[#F7F7F7]" />
          <p className="text-xs flex-1 truncate">{file?.name}</p>
          <button type="button" onClick={onClear} className="text-xs text-[#111111]/40 hover:text-[#111111]">Remove</button>
        </div>
      ) : (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)} onDrop={handleDrop}
          className={`border-2 border-dashed cursor-pointer transition-colors rounded-sm ${dragging ? 'border-[#111111] bg-[#F7F7F7]' : 'border-[#E5E5E5] hover:border-[#111111]/30'}`}>
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" opacity="0.4">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-xs text-[#111111]/60 font-medium text-center px-4">{supportText}</p>
            <p className="text-xs text-[#111111]/30">Drag and drop or click to upload</p>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 mt-2">{error}</p>}
    </div>
  )
}

// ─── TECHNIQUE SELECTOR (per-side) ───────────────────────────────────────────

function TechniqueSelector({ label, selected, onChange }: {
  label: string; selected: string; onChange: (t: string) => void
}) {
  return (
    <div>
      <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-2">{label}</p>
      <div className="flex flex-col gap-1.5">
        {ALL_TECHNIQUES.map(t => (
          <button key={t} type="button" onClick={() => onChange(t)}
            className={`px-4 py-3 border rounded-md text-left transition-colors ${selected === t ? 'border-[#111111] bg-[#111111]/5' : 'border-[#E5E5E5] hover:border-[#111111]/40 bg-white'}`}>
            <p className="text-xs font-medium">{t}</p>
            <p className="text-xs text-[#111111]/40 mt-0.5">{techniqueInfo[t]}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── ARTWORK POSITION CONTROLS ────────────────────────────────────────────────

type HAlign = 'left' | 'center' | 'right'
type VAlign = 'top' | 'middle' | 'bottom'

function PositionIcons({ h, v, onH, onV }: { h: HAlign; v: VAlign; onH: (h: HAlign) => void; onV: (v: VAlign) => void }) {
  const btn = (active: boolean) =>
    `w-8 h-8 flex items-center justify-center border rounded-md transition-colors ${active ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#E5E5E5] text-[#111111]/50 hover:border-[#111111]/40 bg-white'}`
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" title="Align left" onClick={() => onH('left')} className={btn(h === 'left')}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="3" x2="4" y2="21" /><rect x="8" y="7" width="10" height="4" /><rect x="8" y="14" width="14" height="4" /></svg>
      </button>
      <button type="button" title="Align center" onClick={() => onH('center')} className={btn(h === 'center')}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="3" x2="12" y2="21" /><rect x="7" y="7" width="10" height="4" /><rect x="5" y="14" width="14" height="4" /></svg>
      </button>
      <button type="button" title="Align right" onClick={() => onH('right')} className={btn(h === 'right')}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="20" y1="3" x2="20" y2="21" /><rect x="6" y="7" width="10" height="4" /><rect x="2" y="14" width="14" height="4" /></svg>
      </button>
      <span className="w-px h-5 bg-[#E5E5E5] mx-1" />
      <button type="button" title="Align top" onClick={() => onV('top')} className={btn(v === 'top')}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="4" x2="21" y2="4" /><rect x="7" y="8" width="4" height="10" /><rect x="14" y="8" width="4" height="6" /></svg>
      </button>
      <button type="button" title="Align middle" onClick={() => onV('middle')} className={btn(v === 'middle')}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><rect x="7" y="7" width="4" height="10" /><rect x="14" y="5" width="4" height="14" /></svg>
      </button>
      <button type="button" title="Align bottom" onClick={() => onV('bottom')} className={btn(v === 'bottom')}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="20" x2="21" y2="20" /><rect x="7" y="6" width="4" height="10" /><rect x="14" y="10" width="4" height="6" /></svg>
      </button>
    </div>
  )
}

function NumberStepper({ label, value, onChange, hint, disabled = false, step = 0.5 }: {
  label: string; value: number; onChange?: (v: number) => void; hint?: string; disabled?: boolean; step?: number
}) {
  return (
    <div>
      <p className="text-xs font-medium text-[#111111]/50 mb-1.5 flex items-center gap-1">
        {label}
        {hint && (
          <span title={hint} className="w-3.5 h-3.5 rounded-full border border-[#111111]/20 text-[9px] flex items-center justify-center text-[#111111]/40">?</span>
        )}
      </p>
      <div className={`flex items-center border rounded-md overflow-hidden ${disabled ? 'border-[#EAEAEA] bg-[#F7F7F7]' : 'border-[#E5E5E5] bg-white'}`}>
        <button type="button" disabled={disabled} onClick={() => onChange?.(Math.max(0, Math.round((value - step) * 10) / 10))}
          className="w-8 h-9 flex items-center justify-center text-[#111111]/40 hover:text-[#111111] disabled:opacity-30">−</button>
        <span className={`flex-1 text-center text-sm ${disabled ? 'text-[#111111]/30' : 'text-[#111111]'}`}>{value.toFixed(1)}</span>
        <button type="button" disabled={disabled} onClick={() => onChange?.(Math.round((value + step) * 10) / 10)}
          className="w-8 h-9 flex items-center justify-center text-[#111111]/40 hover:text-[#111111] disabled:opacity-30">+</button>
      </div>
    </div>
  )
}



function AddressForm({ values, onChange, prefix }: { values: ShippingState; onChange: (v: ShippingState) => void; prefix: string }) {
  const f = (field: keyof ShippingState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...values, [field]: e.target.value })
  const ic = "border border-[#E5E5E5] px-4 py-3 text-sm focus:outline-none focus:border-[#111111] w-full"
  const lc = "text-xs font-medium text-[#111111]/50 uppercase tracking-wide"
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5"><label className={lc}>{prefix} First name *</label><input type="text" value={values.firstName} onChange={f('firstName')} className={ic} placeholder="Rahul" /></div>
        <div className="flex flex-col gap-1.5"><label className={lc}>Last name *</label><input type="text" value={values.lastName} onChange={f('lastName')} className={ic} placeholder="Sharma" /></div>
      </div>
      <div className="flex flex-col gap-1.5"><label className={lc}>Company</label><input type="text" value={values.company} onChange={f('company')} className={ic} placeholder="Your Brand" /></div>
      <div className="flex flex-col gap-1.5">
        <label className={lc}>Country *</label>
        <select value={values.country} onChange={f('country')} className={ic}>
          <option value="">Select country</option>
          {['India','United States','United Kingdom','UAE','Singapore','Australia','Canada','Germany','France','Other'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5"><label className={lc}>Address line 1 *</label><input type="text" value={values.addressLine1} onChange={f('addressLine1')} className={ic} placeholder="Building, street, area" /></div>
      <div className="flex flex-col gap-1.5"><label className={lc}>Address line 2 <span className="normal-case font-normal">(optional)</span></label><input type="text" value={values.addressLine2} onChange={f('addressLine2')} className={ic} placeholder="Landmark, locality" /></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5"><label className={lc}>Pincode *</label><input type="text" value={values.pincode} onChange={f('pincode')} className={ic} placeholder="110001" /></div>
        <div className="flex flex-col gap-1.5"><label className={lc}>City *</label><input type="text" value={values.city} onChange={f('city')} className={ic} placeholder="Delhi" /></div>
        <div className="flex flex-col gap-1.5">
          <label className={lc}>State *</label>
          <select value={values.state} onChange={f('state')} className={ic}>
            <option value="">Select</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5"><label className={lc}>Email *</label><input type="email" value={values.email} onChange={f('email')} className={ic} placeholder="you@company.com" /></div>
        <div className="flex flex-col gap-1.5"><label className={lc}>Phone *</label><input type="tel" value={values.phone} onChange={f('phone')} className={ic} placeholder="+91 98765 43210" /></div>
      </div>
      <div className="flex flex-col gap-1.5"><label className={lc}>PO Number <span className="normal-case font-normal">(optional)</span></label><input type="text" value={values.poNumber} onChange={f('poNumber')} className={ic} placeholder="PO-12345" /></div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ConfigureClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [screen, setScreen] = useState<Screen>('picker')
  const [activeView, setActiveView] = useState<'Front' | 'Back' | 'Neck'>('Front')
  const [submitting, setSubmitting] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const [product, setProduct] = useState(products[0].name)
  const [color, setColor] = useState('Bright White')
  const [confirmedColor, setConfirmedColor] = useState('')
  const [activePlacements, setActivePlacements] = useState<string[]>(['Front'])

  // Per-side technique selection
  const [frontTechnique, setFrontTechnique] = useState('')
  const [backTechnique, setBackTechnique] = useState('')

  // Per-side artwork
  const [frontArtwork, setFrontArtwork] = useState<File | null>(null)
  const [backArtwork, setBackArtwork] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)
  const [frontFileError, setFrontFileError] = useState('')
  const [backFileError, setBackFileError] = useState('')

  // Per-side artwork position & sizing (cm), Rovo-style
  const [frontPos, setFrontPos] = useState<{ h: HAlign; v: VAlign }>({ h: 'center', v: 'middle' })
  const [backPos, setBackPos] = useState<{ h: HAlign; v: VAlign }>({ h: 'center', v: 'middle' })
  const [frontWidth, setFrontWidth] = useState(20.0)
  const [frontFromNeck, setFrontFromNeck] = useState(20.5)
  const [frontFromCenter, setFrontFromCenter] = useState(0.0)
  const [backWidth, setBackWidth] = useState(20.0)
  const [backFromNeck, setBackFromNeck] = useState(20.5)
  const [backFromCenter, setBackFromCenter] = useState(0.0)
  const [smallestSize, setSmallestSize] = useState('XS - 37 x 50 cm')
  const [guidelineMaxArea, setGuidelineMaxArea] = useState(true)
  const [guidelineLeftChest, setGuidelineLeftChest] = useState(false)

  // Neck label artwork upload
  const [neckLabelFile, setNeckLabelFile] = useState<File | null>(null)
  const [neckLabelPreview, setNeckLabelPreview] = useState<string | null>(null)
  const [neckLabelFileError, setNeckLabelFileError] = useState('')

  // Which accordion is open — drives the contextual Front/Neck/Back toggle on the left
  const [activeAccordion, setActiveAccordion] = useState<'color' | 'artwork' | 'neck' | null>('color')

  const [neckLabel, setNeckLabel] = useState<NeckLabelConfig>({
    type: 'No label', dimension: '50x18mm', position: 'Below neck tape (5mm)', cornerStyle: '2 side',
  })
  const [totalQty, setTotalQty] = useState(50)
  const [rush, setRush] = useState(false)
  const [sizeQty, setSizeQty] = useState<Record<string, number>>({ XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 })
  const [notes, setNotes] = useState('')

  const [shipping, setShipping] = useState<ShippingState>(emptyAddress())
  const [billing, setBilling] = useState<ShippingState>(emptyAddress())
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false)

  const resetConfiguratorDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(CONFIGURATOR_DRAFT_KEY)
      localStorage.removeItem(CONFIGURATOR_DRAFT_KEY)
    } catch {/* ignore */}

    setScreen('picker')
    setActiveView('Front')
    setProduct(products[0].name)
    setColor('Bright White')
    setConfirmedColor('')
    setActivePlacements(['Front'])
    setFrontTechnique('')
    setBackTechnique('')
    setFrontArtwork(null)
    setBackArtwork(null)
    setFrontPreview(null)
    setBackPreview(null)
    setFrontFileError('')
    setBackFileError('')
    setFrontPos({ h: 'center', v: 'middle' })
    setBackPos({ h: 'center', v: 'middle' })
    setFrontWidth(20.0)
    setFrontFromNeck(20.5)
    setFrontFromCenter(0.0)
    setBackWidth(20.0)
    setBackFromNeck(20.5)
    setBackFromCenter(0.0)
    setSmallestSize('XS - 37 x 50 cm')
    setGuidelineMaxArea(true)
    setGuidelineLeftChest(false)
    setNeckLabelFile(null)
    setNeckLabelPreview(null)
    setNeckLabelFileError('')
    setActiveAccordion('color')
    setNeckLabel({ type: 'No label', dimension: '50x18mm', position: 'Below neck tape (5mm)', cornerStyle: '2 side' })
    setTotalQty(50)
    setRush(false)
    setSizeQty({ XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 })
    setNotes('')
    setShipping(emptyAddress())
    setBilling(emptyAddress())
    setBillingSameAsShipping(false)
  }, [])

  // ── TAB DRAFT RESTORE ─────────────────────────────────────────────────────
  useEffect(() => {
    let restoredDraft = false

    try {
      localStorage.removeItem(CONFIGURATOR_DRAFT_KEY)
      const saved = sessionStorage.getItem(CONFIGURATOR_DRAFT_KEY)
      if (saved) {
        const d = JSON.parse(saved)
        const draftAge = Date.now() - (d.savedAt ?? 0)

        if (draftAge <= CONFIGURATOR_DRAFT_TTL_MS) {
          restoredDraft = true
          if (d.product) setProduct(d.product)
          if (d.color) setColor(d.color)
          if (d.confirmedColor) setConfirmedColor(d.confirmedColor)
          if (d.activePlacements) setActivePlacements(d.activePlacements)
          if (d.frontTechnique) setFrontTechnique(d.frontTechnique)
          if (d.backTechnique) setBackTechnique(d.backTechnique)
          if (d.neckLabel) setNeckLabel(d.neckLabel)
          if (d.totalQty) setTotalQty(d.totalQty)
          if (d.rush !== undefined) setRush(d.rush)
          if (d.sizeQty) setSizeQty(d.sizeQty)
          if (d.notes) setNotes(d.notes)
          if (d.shipping) setShipping(d.shipping)
          if (d.billing) setBilling(d.billing)
          if (d.billingSameAsShipping !== undefined) setBillingSameAsShipping(d.billingSameAsShipping)
          if (d.screen && ['configure','summary','shipping','review'].includes(d.screen)) setScreen(d.screen as Screen)
        } else {
          sessionStorage.removeItem(CONFIGURATOR_DRAFT_KEY)
        }
      }
    } catch {/* ignore */}

    if (!restoredDraft) {
      const p = searchParams.get('product')
      if (p) { setProduct(p); setScreen('configure') }
    }

    setHydrated(true)
  }, [searchParams])

  // ── TAB DRAFT SAVE ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated || screen === 'picker' || screen === 'success') return
    try {
      sessionStorage.setItem(CONFIGURATOR_DRAFT_KEY, JSON.stringify({
        savedAt: Date.now(),
        product, color, confirmedColor, activePlacements, frontTechnique, backTechnique,
        neckLabel, totalQty, rush, sizeQty, notes, shipping, billing, billingSameAsShipping, screen,
      }))
    } catch {/* ignore */}
  }, [product, color, confirmedColor, activePlacements, frontTechnique, backTechnique, neckLabel, totalQty, rush, sizeQty, notes, shipping, billing, billingSameAsShipping, screen, hydrated])

  // ── URL CLEANUP ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated || screen === 'picker' || screen === 'success') return
    if (window.location.search) router.replace('/configure', { scroll: false })
  }, [screen, hydrated, router])

  // ── TAB DRAFT EXPIRY ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated || screen === 'picker' || screen === 'success') return
    const timeout = window.setTimeout(() => {
      resetConfiguratorDraft()
      router.replace('/configure', { scroll: false })
    }, CONFIGURATOR_DRAFT_TTL_MS)

    return () => window.clearTimeout(timeout)
  }, [product, color, confirmedColor, activePlacements, frontTechnique, backTechnique, neckLabel, totalQty, rush, sizeQty, notes, shipping, billing, billingSameAsShipping, screen, hydrated, router, resetConfiguratorDraft])

  const { pricePerPiece, subtotal, gst, total, discount, discountedBase, rushCharge } = calcOrder(product, totalQty, rush)
  const deliveryDate = getDeliveryDate(rush)
  const deliveryDays = rush ? RUSH_DELIVERY_DAYS : DELIVERY_DAYS
  const actualSizeTotal = Object.values(sizeQty).reduce((a, b) => a + b, 0)

  function handleArtwork(file: File, side: 'front' | 'back') {
    const setError = side === 'front' ? setFrontFileError : setBackFileError
    setError('')
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '')
    if (!ALLOWED_ARTWORK_EXTENSIONS.includes(ext)) {
      setError(`Only ${ALLOWED_ARTWORK_EXTENSIONS.join(', ')} files accepted`)
      return
    }
    if (file.size > MAX_BYTES) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum 4.5MB`)
      return
    }
    const url = URL.createObjectURL(file)
    if (side === 'front') { setFrontArtwork(file); setFrontPreview(url) }
    else { setBackArtwork(file); setBackPreview(url) }
  }

  function handleNeckLabelFile(file: File) {
    setNeckLabelFileError('')
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '')
    if (!ALLOWED_NECK_LABEL_EXTENSIONS.includes(ext)) {
      setNeckLabelFileError(`Only ${ALLOWED_NECK_LABEL_EXTENSIONS.join(', ')} files accepted`)
      return
    }
    if (file.size > MAX_BYTES) {
      setNeckLabelFileError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum 4.5MB`)
      return
    }
    setNeckLabelFile(file)
    setNeckLabelPreview(URL.createObjectURL(file))
  }

  function togglePlacement(p: string) {
    setActivePlacements(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const frontActive = activePlacements.includes('Front')
  const backActive = activePlacements.includes('Back')

  function canProceedToSummary() {
    if (!color || confirmedColor !== color || activePlacements.length === 0) return false
    if (frontActive && !frontTechnique) return false
    if (backActive && !backTechnique) return false
    if (totalQty < 50) return false
    return true
  }

  function canProceedToShipping() { return actualSizeTotal === totalQty }

  function isAddressValid(a: ShippingState) {
    return !!(a.firstName && a.lastName && a.country && a.addressLine1 && a.pincode && a.city && a.state && a.email && a.phone)
  }

  function canProceedToReview() {
    return isAddressValid(shipping) && isAddressValid(billingSameAsShipping ? shipping : billing)
  }

  function neckLabelSummary() {
    const { type, dimension, position, cornerStyle } = neckLabel
    if (type === 'No label') return 'No label'
    if (type === 'Woven label') {
      const corner = position === 'On neck tape' ? '2-corner' : cornerStyle
      return `Woven · ${dimension} · ${position} · ${corner}`
    }
    return type
  }

  function garmentColorSummary() {
    const selected = ALL_COLORS.find(c => c.name === color)
    const group = selected?.signature ? 'Signature' : 'Pantone TPG'
    return confirmedColor === color ? `${group}, ${color}` : `Unsaved changes, ${color}`
  }

  function techniqueSummary() {
    if (frontActive && backActive) {
      if (frontTechnique === backTechnique) return frontTechnique
      return `Front: ${frontTechnique} · Back: ${backTechnique}`
    }
    if (frontActive) return frontTechnique
    if (backActive) return backTechnique
    return '—'
  }

  function artworkSummary() {
    if (!activePlacements.length) return 'No Selection'
    const technique = techniqueSummary()
    const uploaded: string[] = []
    if (frontArtwork) uploaded.push('Front artwork')
    if (backArtwork) uploaded.push('Back artwork')
    return [activePlacements.join(', '), technique !== '—' ? technique : '', uploaded.join(', ')].filter(Boolean).join(' · ')
  }

  const colorConfirmed = confirmedColor === color
  const artworkComplete = activePlacements.length > 0 && (!frontActive || !!frontTechnique) && (!backActive || !!backTechnique)
  const neckLabelComplete = neckLabel.type !== 'No label'

  // ── PRODUCT PICKER ────────────────────────────────────────────────────────
  if (screen === 'picker') return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-4">Step 1 of 5</p>
      <h1 className="text-4xl font-bold tracking-tight mb-2">What are you making?</h1>
      <p className="text-[#111111]/50 text-sm mb-14">Select a product to begin. MOQ 50 pieces.</p>
      <div className="flex flex-col gap-12">
        {productGroups.map(group => group.items.length > 0 ? (
          <div key={group.category}>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-xs font-medium uppercase tracking-widest text-[#111111]/40 shrink-0">{group.category}</p>
              <div className="flex-1 h-px bg-[#E5E5E5]" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {group.items.map(p => (
                <button key={p.name} type="button"
                  onClick={() => { setProduct(p.name); setConfirmedColor(''); setFrontTechnique(''); setBackTechnique(''); setScreen('configure') }}
                  className="bg-white text-left hover:bg-[#F7F7F7] transition-colors group flex flex-col">
                  {/* Image area — no background, image fills fully */}
                  <div className="w-full aspect-[4/5] overflow-hidden flex items-center justify-center bg-[#F7F7F7]">
                    {PRODUCT_IMAGES[p.name] ? (
                      <img
                        src={PRODUCT_IMAGES[p.name]}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <svg viewBox="0 0 120 120" className="w-2/5 h-2/5 text-[#111111]/10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        {p.name.includes('Tote') ? (
                          <path d="M25 40L32 25h10v8c0 4 46 4 46 0v-8h10l7 15v54H25V40z" />
                        ) : p.name.includes('Hoodie') ? (
                          <path d="M30 32L15 44l6 6 4-4v50h70V46l4 4 6-6-15-12c-6-3-12-6-20-7-2 7-7 12-15 12s-13-5-15-12c-8 1-14 4-20 7z" />
                        ) : p.name.includes('Sweatshirt') ? (
                          <path d="M30 32L15 44l6 6 4-4v50h70V46l4 4 6-6-15-12c-6-3-12-6-20-7-2 7-7 11-15 11s-13-4-15-11c-8 1-14 4-20 7z" />
                        ) : p.name.includes('Longsleeve') ? (
                          <path d="M30 32L15 52l6 6 4-4v54h70V54l4 4 6-6-15-20c-6-3-12-6-20-7-2 7-7 11-15 11s-13-4-15-11c-8 1-14 4-20 7z" />
                        ) : (
                          <path d="M30 32L15 44l6 6 4-4v50h70V46l4 4 6-6-15-12c-6-3-12-6-20-7-2 7-7 11-15 11s-13-4-15-11c-8 1-14 4-20 7z" />
                        )}
                      </svg>
                    )}
                  </div>
                  {/* Label area */}
                  <div className="px-3 py-3 flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-[#111111] leading-snug group-hover:underline">{p.name}</p>
                    <p className="text-xs text-[#111111]/40 shrink-0 whitespace-nowrap">from &#8377;{(PRODUCT_PRICES[p.name] ?? 0).toLocaleString('en-IN')}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null)}
      </div>
    </div>
  )

  // ── CONFIGURE SCREEN ──────────────────────────────────────────────────────
  if (screen === 'configure') return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
      {/* LEFT — full bleed preview */}
      <div className="lg:w-3/5 bg-[#F7F7F7] flex flex-col relative">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <button type="button" onClick={() => setScreen('picker')}
            className="text-xs text-[#111111]/40 hover:text-[#111111] transition-colors flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            {product}
          </button>
          <div className="text-xs text-[#111111]/30">{color}</div>
        </div>

        {/* Garment — fills remaining height */}
        <div className="flex-1 flex items-center justify-center px-12 pb-24">
          <div className="w-full max-w-sm">
            <GarmentSVG color={color} activePlacements={activePlacements} frontPreview={frontPreview}
              backPreview={backPreview} activeView={activeView} productName={product} />
          </div>
        </div>

        {/* Front / Back toggle — pinned to bottom center like Assembly */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex bg-white border border-[#E5E5E5] overflow-hidden shadow-sm">
          {(['Front', 'Back'] as const).map(v => (
            <button key={v} type="button" onClick={() => setActiveView(v)}
              className={`px-6 py-2.5 text-xs font-medium transition-colors ${activeView === v ? 'bg-[#111111] text-white' : 'text-[#111111]/50 hover:text-[#111111]'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT — accordions */}
      <div className="lg:w-2/5 bg-[#F4F4F4] flex flex-col border-l border-[#E5E5E5]">
        <div className="border-b border-[#E5E5E5] bg-white px-6 py-4">
          <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-1">Configuring</p>
          <p className="text-sm font-semibold">{product}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3">
          {/* Color */}
          <Accordion title="Garment Colour" summary={garmentColorSummary()} complete={colorConfirmed} defaultOpen>
            {({ close }) => (
            <>
            <div className="mb-5 rounded-md border border-[#E5E5E5] bg-[#FAFAFA] p-3">
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full border border-[#DADADA] shrink-0"
                  style={{ backgroundColor: getColorHex(color) }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#111111]/40 uppercase tracking-widest">Selected colour</p>
                  <p className="text-sm font-semibold text-[#111111] truncate">{color}</p>
                </div>
                {colorConfirmed ? (
                  <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full shrink-0">Confirmed</span>
                ) : (
                  <span className="text-xs font-medium text-[#111111]/60 bg-white border border-[#E5E5E5] px-2.5 py-1 rounded-full shrink-0">Unsaved</span>
                )}
              </div>
              {!colorConfirmed && (
                <button type="button"
                  onClick={() => {
                    setConfirmedColor(color)
                    close()
                  }}
                  className="mt-3 w-full py-3 text-sm font-medium transition-colors bg-[#111111] text-white hover:bg-black flex items-center justify-center gap-2 rounded-md">
                  Confirm garment colour
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              )}
            </div>
            <ColorPicker
              selected={color}
              onSelect={nextColor => {
                setColor(nextColor)
                if (nextColor !== confirmedColor) setConfirmedColor('')
              }}
            />
            </>
            )}
          </Accordion>

          {/* Artwork */}
          <Accordion title="Artwork" summary={artworkSummary()} complete={artworkComplete} defaultOpen>
            <div className="flex flex-col gap-7">
              <section>
                <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-3">Print technique</p>
                <div className="flex flex-col gap-6">
                  {frontActive && (
                    <TechniqueSelector label="Front technique" selected={frontTechnique} onChange={setFrontTechnique} />
                  )}
                  {backActive && (
                    <TechniqueSelector label="Back technique" selected={backTechnique} onChange={setBackTechnique} />
                  )}
                  {!frontActive && !backActive && (
                    <p className="text-xs text-[#111111]/40">Select a print placement first.</p>
                  )}
                </div>
              </section>

              <section>
                <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-3">Print placements</p>
                <div className="grid grid-cols-2 gap-2">
                  {PLACEMENTS.map(p => (
                    <button key={p} type="button" onClick={() => togglePlacement(p)}
                  className={`px-3 py-2.5 border rounded-md text-xs text-left transition-colors flex items-center justify-between ${activePlacements.includes(p) ? 'border-[#111111] bg-[#111111]/5 font-medium' : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111]/40 bg-white'}`}>
                      {p}
                      {activePlacements.includes(p) && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-3">Artwork upload</p>
                <div className="flex flex-col gap-3 mb-3">
                  <a href="/downloads/moistfoundry-print_templates-1.0.zip" download
                    className="flex items-center justify-between border border-[#111111] rounded-md px-4 py-3 text-xs font-medium text-[#111111] hover:bg-[#111111] hover:text-white transition-colors">
                    <span>Download print templates</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </a>
                  <p className="text-xs text-[#111111]/40">We recommend using our .ai templates. One template covers front and back.</p>
                </div>
                <div className="flex flex-col gap-5">
                  {frontActive && (
                    <div>
                      <p className="text-xs text-[#111111]/50 mb-2 uppercase tracking-widest">Front artwork</p>
                      <ArtworkUpload side="front" file={frontArtwork} preview={frontPreview}
                        onFile={f => handleArtwork(f, 'front')} onClear={() => { setFrontArtwork(null); setFrontPreview(null) }}
                        error={frontFileError} />
                    </div>
                  )}
                  {backActive && (
                    <div>
                      <p className="text-xs text-[#111111]/50 mb-2 uppercase tracking-widest">Back artwork <span className="normal-case font-normal">(optional)</span></p>
                      <ArtworkUpload side="back" file={backArtwork} preview={backPreview}
                        onFile={f => handleArtwork(f, 'back')} onClear={() => { setBackArtwork(null); setBackPreview(null) }}
                        error={backFileError} />
                    </div>
                  )}
                  {!frontActive && !backActive && (
                    <p className="text-xs text-[#111111]/40">Select a print placement to upload artwork.</p>
                  )}
                </div>
              </section>
            </div>
          </Accordion>

          {/* Neck label */}
          <Accordion
            title="Neck Label"
            summary={neckLabelComplete ? neckLabelSummary() : 'No Selection'}
            complete={neckLabelComplete}
          >
            <NeckLabelSection config={neckLabel} onChange={setNeckLabel} />
          </Accordion>

          {/* Quantity */}
          <div className="border border-[#E5E5E5] p-5 rounded-lg bg-white">
            <p className="text-sm font-semibold mb-4">Quantity</p>
            <div className="flex items-center gap-3 mb-3">
              <button type="button" onClick={() => setTotalQty(q => Math.max(50, q - 10))}
                className="w-10 h-10 rounded-md border border-[#E5E5E5] text-lg hover:border-[#111111] transition-colors flex items-center justify-center shrink-0">-</button>
              <input type="number" value={totalQty} min={50}
                onChange={e => setTotalQty(Math.max(50, parseInt(e.target.value) || 50))}
                className="flex-1 text-center text-sm font-bold border border-[#E5E5E5] rounded-md py-2.5 focus:outline-none focus:border-[#111111]" />
              <button type="button" onClick={() => setTotalQty(q => q + 10)}
                className="w-10 h-10 rounded-md border border-[#E5E5E5] text-lg hover:border-[#111111] transition-colors flex items-center justify-center shrink-0">+</button>
            </div>
            <p className="text-xs text-[#111111]/40 mb-4">Minimum 50 pieces.</p>
            <div className="flex flex-col border border-[#E5E5E5] overflow-hidden">
              {VOLUME_TIERS.map(t => (
                <div key={t.min} className={`flex justify-between text-xs px-3 py-2 border-b border-[#E5E5E5] last:border-0 transition-colors ${getDiscount(totalQty) === t.discount ? 'bg-[#111111] text-white' : 'text-[#111111]/30'}`}>
                  <span>{t.min}{t.max === Infinity ? '+' : `–${t.max}`} pcs</span>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rush */}
          <div className="border border-[#E5E5E5] p-5 rounded-lg bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Rush order</p>
                <p className="text-xs text-[#111111]/50 mt-0.5">{rush ? `${RUSH_DELIVERY_DAYS} days` : `Standard: ${DELIVERY_DAYS} days`}</p>
              </div>
              <button type="button" onClick={() => setRush(!rush)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${rush ? 'bg-[#111111]' : 'bg-[#E5E5E5]'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rush ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            {rush && <p className="text-xs text-[#111111]/50 mt-3 pt-3 border-t border-[#E5E5E5]">Rush premium: +&#8377;{getRushCharge(totalQty)}/piece</p>}
          </div>
        </div>

        <div className="border-t border-[#E5E5E5] bg-white px-6 pt-4 pb-5">
          {/* Pricing summary — Assembly style */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-[#111111]/40 mb-0.5">Unit cost</p>
              <p className="text-lg font-bold">&#8377;{pricePerPiece.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#111111]/40 mb-0.5">Est. delivery</p>
              <p className="text-sm font-medium">{deliveryDate}</p>
            </div>
          </div>
          {discount > 0 && (
            <p className="text-xs text-green-600 font-medium mb-3">Volume discount applied: -{(discount * 100).toFixed(0)}%</p>
          )}
          {!canProceedToSummary() && (
            <p className="text-xs text-[#111111]/40 mb-3 text-center">
              {!colorConfirmed ? 'Confirm garment colour' :
               activePlacements.length === 0 ? 'Select a placement' :
               (frontActive && !frontTechnique) || (backActive && !backTechnique) ? 'Select technique for each active placement' :
               'Complete all sections above'}
            </p>
          )}
          <button type="button" disabled={!canProceedToSummary()}
            onClick={() => { setSizeQty(distributeQty(totalQty)); setScreen('summary') }}
            className={`w-full py-3.5 text-sm font-medium transition-colors rounded-md ${canProceedToSummary() ? 'bg-[#111111] text-white hover:bg-black' : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'}`}>
            Next: Order summary →
          </button>
        </div>
      </div>
    </div>
  )

  // ── ORDER SUMMARY ─────────────────────────────────────────────────────────
  if (screen === 'summary') return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <button type="button" onClick={() => setScreen('configure')} className="text-xs text-[#111111]/40 hover:text-[#111111] flex items-center gap-1.5 mb-8">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Back to configuration
      </button>
      <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-2">Step 2 of 5</p>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Order summary</h1>
      <p className="text-[#111111]/50 text-sm mb-10">
        Auto-distributed across sizes. Adjust — total must match {totalQty} pieces.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Size breakdown</p>
          <div className="flex flex-col gap-2 mb-4">
            {sizes.map(s => (
              <div key={s} className="flex items-center justify-between border border-[#E5E5E5] px-4 py-3">
                <span className="text-sm font-medium w-8">{s}</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setSizeQty(prev => ({ ...prev, [s]: Math.max(0, (prev[s] ?? 0) - 1) }))} className="w-7 h-7 border border-[#E5E5E5] hover:border-[#111111] transition-colors flex items-center justify-center">-</button>
                  <span className="w-8 text-center text-sm font-medium">{sizeQty[s]}</span>
                  <button type="button" onClick={() => setSizeQty(prev => ({ ...prev, [s]: (prev[s] ?? 0) + 1 }))} className="w-7 h-7 border border-[#E5E5E5] hover:border-[#111111] transition-colors flex items-center justify-center">+</button>
                </div>
              </div>
            ))}
          </div>
          <div className={`p-3 text-xs font-medium border ${actualSizeTotal === totalQty ? 'bg-green-50 text-green-700 border-green-200' : actualSizeTotal > totalQty ? 'bg-red-50 text-red-600 border-red-200' : 'bg-[#111111]/5 text-[#111111]/60 border-[#111111]/10'}`}>
            {actualSizeTotal === totalQty ? `${actualSizeTotal} pieces — matches your order` :
             actualSizeTotal > totalQty ? `${actualSizeTotal} pieces — ${actualSizeTotal - totalQty} over limit` :
             `${actualSizeTotal} of ${totalQty} — ${totalQty - actualSizeTotal} remaining`}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="border border-[#E5E5E5] p-5 text-xs">
            <p className="font-medium text-[#111111]/40 uppercase tracking-widest mb-4">Configuration</p>
            {[
              { label: 'Product', value: product },
              { label: 'Color', value: color },
              { label: 'Placement', value: activePlacements.join(', ') },
              { label: 'Technique', value: techniqueSummary() },
              { label: 'Neck label', value: neckLabelSummary() },
              { label: 'Quantity', value: `${totalQty} pcs` },
              { label: 'Delivery', value: `${deliveryDays} days · ${deliveryDate}` },
            ].map(row => (
              <div key={row.label} className="flex justify-between py-2 border-b border-[#F7F7F7] last:border-0">
                <span className="text-[#111111]/50">{row.label}</span>
                <span className="font-medium text-right max-w-[60%]">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="bg-[#111111] p-5 text-white">
            <p className="text-xs text-white/50 uppercase tracking-widest mb-4">Pricing</p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span className="text-white/60">Base/piece</span><span>&#8377;{(PRODUCT_PRICES[product] ?? 0).toLocaleString('en-IN')}</span></div>
              {discount > 0 && <div className="flex justify-between"><span className="text-white/60">Volume discount ({(discount * 100).toFixed(0)}%)</span><span className="text-green-400">-&#8377;{((PRODUCT_PRICES[product] ?? 0) - discountedBase).toLocaleString('en-IN')}/pc</span></div>}
              {rush && rushCharge > 0 && <div className="flex justify-between"><span className="text-white/60">Rush premium</span><span>+&#8377;{rushCharge}/pc</span></div>}
              <div className="flex justify-between border-t border-white/10 pt-2 mt-1"><span className="text-white/80">Subtotal</span><span>&#8377;{subtotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-white/60">GST (5%)</span><span>&#8377;{gst.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-base font-bold border-t border-white/20 pt-3 mt-1"><span>Total (incl. GST)</span><span>&#8377;{total.toLocaleString('en-IN')}</span></div>
            </div>
            <p className="text-xs text-white/30 mt-3">+ Shipping quoted separately</p>
          </div>
          <button type="button" disabled={!canProceedToShipping()} onClick={() => setScreen('shipping')}
            className={`w-full py-3.5 text-sm font-medium transition-colors ${canProceedToShipping() ? 'bg-[#111111] text-white hover:bg-black' : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'}`}>
            Next: Shipping details
          </button>
        </div>
      </div>
    </div>
  )

  // ── SHIPPING + BILLING ────────────────────────────────────────────────────
  if (screen === 'shipping') return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <button type="button" onClick={() => setScreen('summary')} className="text-xs text-[#111111]/40 hover:text-[#111111] flex items-center gap-1.5 mb-8">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Back to order summary
      </button>
      <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-2">Step 3 of 5</p>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Shipping &amp; billing</h1>
      <p className="text-[#111111]/50 text-sm mb-10">Shipping charges are quoted separately via email.</p>
      <div className="flex flex-col gap-10">
        <div>
          <p className="text-sm font-semibold text-[#111111] mb-5">Shipping address</p>
          <AddressForm values={shipping} onChange={setShipping} prefix="Shipping" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-[#111111]">Billing address</p>
            <button type="button" onClick={() => setBillingSameAsShipping(!billingSameAsShipping)}
              className="flex items-center gap-2 text-xs text-[#111111]/60 hover:text-[#111111] transition-colors">
              <div className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${billingSameAsShipping ? 'border-[#111111] bg-[#111111]' : 'border-[#E5E5E5]'}`}>
                {billingSameAsShipping && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
              </div>
              Copy shipping details to billing
            </button>
          </div>
          {billingSameAsShipping
            ? <div className="border border-[#E5E5E5] bg-[#F7F7F7] p-4 text-xs text-[#111111]/50">Billing address same as shipping address</div>
            : <AddressForm values={billing} onChange={setBilling} prefix="Billing" />
          }
        </div>
        <div className="bg-[#F7F7F7] border border-[#E5E5E5] p-4 text-xs text-[#111111]/50">
          Shipping is paid by the client. We will email the shipping charge before dispatching.
        </div>
        <button type="button" disabled={!canProceedToReview()} onClick={() => setScreen('review')}
          className={`w-full py-3.5 text-sm font-medium transition-colors ${canProceedToReview() ? 'bg-[#111111] text-white hover:bg-black' : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'}`}>
          {canProceedToReview() ? 'Next: Review & pay' : 'Fill in all required fields'}
        </button>
      </div>
    </div>
  )

  // ── REVIEW ────────────────────────────────────────────────────────────────
  if (screen === 'review') {
    const effectiveBilling = billingSameAsShipping ? shipping : billing
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <button type="button" onClick={() => setScreen('shipping')} className="text-xs text-[#111111]/40 hover:text-[#111111] flex items-center gap-1.5 mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          Back to shipping
        </button>
        <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-2">Step 4 of 5</p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Review &amp; pay</h1>
        <p className="text-[#111111]/50 text-sm mb-10">Confirm everything looks right before paying.</p>
        <div className="flex flex-col gap-6">
          {/* Order details */}
          <div className="border border-[#E5E5E5] p-5 text-xs">
            <p className="font-medium text-[#111111]/40 uppercase tracking-widest mb-4">Order details</p>
            {[
              { label: 'Product', value: product },
              { label: 'Color', value: color },
              { label: 'Placement', value: activePlacements.join(', ') },
              { label: 'Technique', value: techniqueSummary() },
              { label: 'Neck label', value: neckLabelSummary() },
              { label: 'Quantity', value: `${totalQty} pcs` },
              { label: 'Sizes', value: sizes.filter(s => sizeQty[s] > 0).map(s => `${s}:${sizeQty[s]}`).join(' · ') },
              { label: 'Est. delivery', value: deliveryDate },
            ].map(row => (
              <div key={row.label} className="flex justify-between py-2 border-b border-[#F7F7F7] last:border-0">
                <span className="text-[#111111]/50 shrink-0">{row.label}</span>
                <span className="font-medium text-right max-w-[55%] break-words">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Addresses */}
          <div className="grid md:grid-cols-2 gap-4">
            {[{ label: 'Shipping address', addr: shipping }, { label: 'Billing address', addr: effectiveBilling }].map(({ label, addr }) => (
              <div key={label} className="border border-[#E5E5E5] p-5 text-xs">
                <p className="font-medium text-[#111111]/40 uppercase tracking-widest mb-3">{label}</p>
                <div className="flex flex-col gap-1 text-[#111111]/70 leading-relaxed">
                  <span className="font-medium text-[#111111]">{addr.firstName} {addr.lastName}</span>
                  {addr.company && <span>{addr.company}</span>}
                  <span>{addr.addressLine1}</span>
                  {addr.addressLine2 && <span>{addr.addressLine2}</span>}
                  <span>{addr.city}, {addr.state} {addr.pincode}</span>
                  <span>{addr.country}</span>
                  <span className="mt-1">{addr.email}</span>
                  <span>{addr.phone}</span>
                  {addr.poNumber && <span>PO: {addr.poNumber}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="bg-[#111111] p-5 text-white text-sm">
            <p className="text-xs text-white/50 uppercase tracking-widest mb-4">Pricing</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between"><span className="text-white/60">Base/piece</span><span>&#8377;{(PRODUCT_PRICES[product] ?? 0).toLocaleString('en-IN')}</span></div>
              {discount > 0 && <div className="flex justify-between"><span className="text-white/60">Volume discount</span><span className="text-green-400">-&#8377;{((PRODUCT_PRICES[product] ?? 0) - discountedBase).toLocaleString('en-IN')}/pc</span></div>}
              {rush && rushCharge > 0 && <div className="flex justify-between"><span className="text-white/60">Rush</span><span>+&#8377;{rushCharge}/pc</span></div>}
              <div className="flex justify-between border-t border-white/10 pt-2 mt-1"><span className="text-white/80">Subtotal</span><span>&#8377;{subtotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-white/60">GST (5%)</span><span>&#8377;{gst.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-base font-bold border-t border-white/20 pt-3 mt-1"><span>Total (incl. GST)</span><span>&#8377;{total.toLocaleString('en-IN')}</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40 flex flex-col gap-1">
              <span>Shipping quoted separately</span>
              <span>&#8377;499 reservation deducted from final invoice</span>
            </div>
          </div>

          <div className="bg-[#F7F7F7] border border-[#E5E5E5] p-4 text-xs text-[#111111]/60 leading-relaxed">
            A <strong className="text-[#111111]">&#8377;499 reservation fee</strong> is charged now to confirm your slot.
            Balance (&#8377;{Math.max(0, total - 499).toLocaleString('en-IN')}) invoiced separately before production.
          </div>

          <button type="button" disabled={submitting}
            onClick={async () => {
              if (submitting) return
              setSubmitting(true)
              try {
                const txnid = 'MF' + Date.now()
                const amount = '499.00'
                const productinfo = `Reservation - ${product} x${totalQty}`
                const res = await fetch('/api/payu/hash', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ txnid, amount, productinfo, firstname: shipping.firstName, email: shipping.email }),
                })
                const { hash, key } = await res.json()
                try {
                  localStorage.setItem('mf_pending_order', JSON.stringify({
                    txnid,
                    name: `${shipping.firstName} ${shipping.lastName}`,
                    email: shipping.email,
                    product, color,
                    placements: activePlacements.join(', '),
                    technique: techniqueSummary(),
                    neckLabel: neckLabelSummary(),
                    totalQty,
                    sizeBreakdown: sizes.filter(s => sizeQty[s] > 0).map(s => `${s}: ${sizeQty[s]}`).join(', '),
                    estimatedTotal: `Rs.${total.toLocaleString('en-IN')} (incl. GST)`,
                    shipping, billing: effectiveBilling,
                  }))
                } catch {/* ignore */}

                const form = document.createElement('form')
                form.method = 'POST'
                form.action = process.env.NEXT_PUBLIC_PAYU_BASE_URL ?? 'https://secure.payu.in/_payment'
                const fields: Record<string, string> = {
                  key, txnid, amount, productinfo,
                  firstname: shipping.firstName, lastname: shipping.lastName,
                  email: shipping.email, phone: shipping.phone || '9999999999',
                  surl: `${window.location.origin}/payment/success`,
                  furl: `${window.location.origin}/payment/failure`,
                  hash,
                }
                Object.entries(fields).forEach(([k, v]) => {
                  const inp = document.createElement('input'); inp.type = 'hidden'; inp.name = k; inp.value = v; form.appendChild(inp)
                })
                document.body.appendChild(form); form.submit()
              } catch (err) {
                console.error('Submit error:', err); setSubmitting(false)
              }
            }}
            className={`w-full py-4 text-sm font-medium transition-colors ${!submitting ? 'bg-[#111111] text-white hover:bg-black' : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'}`}>
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-[#111111]/20 border-t-[#111111]/60 rounded-full animate-spin" />
                Redirecting to payment...
              </span>
            ) : 'Confirm & pay ₹499'}
          </button>
        </div>
      </div>
    )
  }

  return null
}