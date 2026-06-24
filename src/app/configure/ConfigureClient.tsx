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
  { name: 'Regular Fit Tee (200 GSM)', techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Boxy Fit Tee (200 GSM)', techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Regular Fit Tee (260 GSM)', techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Boxy Fit Tee (260 GSM)', techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Longsleeve Tee (260 GSM)', techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Regular Fit Sweatshirt (320 GSM)', techniques: ['Screen Print', 'Embroidery'] },
  { name: 'Boxy Fit Sweatshirt (320 GSM)', techniques: ['Screen Print', 'Embroidery'] },
  { name: 'Regular Fit Hoodie (320 GSM)', techniques: ['Screen Print', 'Embroidery', 'Heat Transfer'] },
  { name: 'Boxy Fit Hoodie (320 GSM)', techniques: ['Screen Print', 'Embroidery', 'Heat Transfer'] },
  { name: 'Shorts (220 GSM)', techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Canvas Tote Bag', techniques: ['Screen Print', 'DTG'] },
]

// Signature colors at top, then all TPG Pantone colors
const SIGNATURE_COLORS = [
  { name: 'Bright White', hex: 'rgb(255,255,255)', pantone: null, signature: true },
  { name: 'True Black', hex: 'rgb(23,23,23)', pantone: null, signature: true },
  { name: 'Amparo Blue', hex: 'rgba(59,130,246,0.5)', pantone: null, signature: true },
  { name: 'Fuchsia', hex: 'rgb(239,149,199)', pantone: null, signature: true },
]

// Full TPG Pantone color palette (representative set — add more as needed)
const TPG_COLORS = [
  { name: 'Pastel Yellow', hex: '#FFF9C4', pantone: '600 TPG' },
  { name: 'Cream', hex: '#FFF8E1', pantone: '607 TPG' },
  { name: 'Ivory', hex: '#FFFFF0', pantone: '608 TPG' },
  { name: 'Butter', hex: '#FFFDE7', pantone: '609 TPG' },
  { name: 'Lemon', hex: '#FFEE58', pantone: '012 TPG' },
  { name: 'Bright Yellow', hex: '#FFD600', pantone: '102 TPG' },
  { name: 'Sunflower', hex: '#FFC107', pantone: '116 TPG' },
  { name: 'Amber', hex: '#FF8F00', pantone: '138 TPG' },
  { name: 'Gold', hex: '#F9A825', pantone: '1225 TPG' },
  { name: 'Mustard', hex: '#D4A017', pantone: '1245 TPG' },
  { name: 'Dark Gold', hex: '#B8860B', pantone: '1255 TPG' },
  { name: 'Wheat', hex: '#D4C5A9', pantone: '726 TPG' },
  { name: 'Tan', hex: '#C4A882', pantone: '7527 TPG' },
  { name: 'Khaki', hex: '#C8B96D', pantone: '615 TPG' },
  { name: 'Sand', hex: '#D2B48C', pantone: '7522 TPG' },
  { name: 'Camel', hex: '#C19A6B', pantone: '7509 TPG' },
  { name: 'Beige', hex: '#E8D5B7', pantone: '9181 TPG' },
  { name: 'Stone', hex: '#B5A593', pantone: '7535 TPG' },
  { name: 'Warm Grey', hex: '#9E9689', pantone: 'Warm Gray 7 TPG' },
  { name: 'Cool Grey', hex: '#9CA3AF', pantone: 'Cool Gray 7 TPG' },
  { name: 'Light Grey', hex: '#D1D5DB', pantone: 'Cool Gray 3 TPG' },
  { name: 'Silver', hex: '#C0C0C0', pantone: '877 TPG' },
  { name: 'Ash', hex: '#B2BEC3', pantone: '7544 TPG' },
  { name: 'Slate', hex: '#708090', pantone: '7544 TPG' },
  { name: 'Charcoal', hex: '#4A4A4A', pantone: '447 TPG' },
  { name: 'Dark Charcoal', hex: '#2D2D2D', pantone: '448 TPG' },
  { name: 'Off White', hex: '#F5F5F5', pantone: '9180 TPG' },
  { name: 'White Smoke', hex: '#F8F8F8', pantone: '9181 TPG' },
  { name: 'Coral', hex: '#FF6B6B', pantone: '179 TPG' },
  { name: 'Salmon', hex: '#FA8072', pantone: '178 TPG' },
  { name: 'Peach', hex: '#FFDAB9', pantone: '9161 TPG' },
  { name: 'Melon', hex: '#FEBE7E', pantone: '1225 TPG' },
  { name: 'Apricot', hex: '#FBCEB1', pantone: '9200 TPG' },
  { name: 'Terra Cotta', hex: '#C15B3F', pantone: '7526 TPG' },
  { name: 'Burnt Orange', hex: '#CC5500', pantone: '166 TPG' },
  { name: 'Orange', hex: '#FF6600', pantone: '021 TPG' },
  { name: 'Deep Orange', hex: '#E65100', pantone: '158 TPG' },
  { name: 'Rust', hex: '#8B3A2F', pantone: '7526 TPG' },
  { name: 'Brick Red', hex: '#8B2500', pantone: '1685 TPG' },
  { name: 'Tomato', hex: '#D94F3D', pantone: '186 TPG' },
  { name: 'Red', hex: '#CC0000', pantone: '186 TPG' },
  { name: 'Cherry', hex: '#990000', pantone: '187 TPG' },
  { name: 'Crimson', hex: '#DC143C', pantone: '200 TPG' },
  { name: 'Burgundy', hex: '#6B1E2E', pantone: '229 TPG' },
  { name: 'Wine', hex: '#722F37', pantone: '228 TPG' },
  { name: 'Maroon', hex: '#800000', pantone: '195 TPG' },
  { name: 'Magenta', hex: '#FF00FF', pantone: 'Rhodamine Red TPG' },
  { name: 'Hot Pink', hex: '#FF69B4', pantone: '812 TPG' },
  { name: 'Fuchsia', hex: '#FF00FF', pantone: '807 TPG' },
  { name: 'Rose', hex: '#FF007F', pantone: '206 TPG' },
  { name: 'Blush', hex: '#FFCDD2', pantone: '9182 TPG' },
  { name: 'Baby Pink', hex: '#F4C2C2', pantone: '9180 TPG' },
  { name: 'Dusty Pink', hex: '#D4A5A5', pantone: '9185 TPG' },
  { name: 'Mauve', hex: '#B07BA0', pantone: '677 TPG' },
  { name: 'Orchid', hex: '#DA70D6', pantone: '2562 TPG' },
  { name: 'Lilac', hex: '#C8A2C8', pantone: '9350 TPG' },
  { name: 'Lavender', hex: '#E6E6FA', pantone: '9361 TPG' },
  { name: 'Wisteria', hex: '#C9A0DC', pantone: '2573 TPG' },
  { name: 'Purple', hex: '#800080', pantone: '2607 TPG' },
  { name: 'Violet', hex: '#4B0082', pantone: '2627 TPG' },
  { name: 'Plum', hex: '#5C1A5C', pantone: '519 TPG' },
  { name: 'Eggplant', hex: '#380032', pantone: '518 TPG' },
  { name: 'Periwinkle', hex: '#CCCCFF', pantone: '2706 TPG' },
  { name: 'Cornflower', hex: '#6495ED', pantone: '2727 TPG' },
  { name: 'Amparo Blue', hex: '#3B82F6', pantone: '2728 TPG' },
  { name: 'Royal Blue', hex: '#4169E1', pantone: '661 TPG' },
  { name: 'Cobalt', hex: '#0047AB', pantone: '286 TPG' },
  { name: 'Blue', hex: '#0000FF', pantone: '072 TPG' },
  { name: 'Navy', hex: '#1B2A4A', pantone: '289 TPG' },
  { name: 'Midnight', hex: '#191970', pantone: '282 TPG' },
  { name: 'French Blue', hex: '#318CE7', pantone: '285 TPG' },
  { name: 'Sky Blue', hex: '#7DB8D4', pantone: '291 TPG' },
  { name: 'Powder Blue', hex: '#B0E0E6', pantone: '9302 TPG' },
  { name: 'Baby Blue', hex: '#89CFF0', pantone: '290 TPG' },
  { name: 'Ice Blue', hex: '#D6EEFF', pantone: '9301 TPG' },
  { name: 'Turquoise', hex: '#40E0D0', pantone: '326 TPG' },
  { name: 'Aqua', hex: '#00FFFF', pantone: '306 TPG' },
  { name: 'Teal', hex: '#008080', pantone: '328 TPG' },
  { name: 'Dark Teal', hex: '#005F60', pantone: '329 TPG' },
  { name: 'Emerald', hex: '#50C878', pantone: '354 TPG' },
  { name: 'Mint', hex: '#98FF98', pantone: '354 TPG' },
  { name: 'Sage', hex: '#BCB88A', pantone: '7494 TPG' },
  { name: 'Moss', hex: '#8A9A5B', pantone: '577 TPG' },
  { name: 'Olive', hex: '#6B6B2A', pantone: '392 TPG' },
  { name: 'Army Green', hex: '#4B5320', pantone: '371 TPG' },
  { name: 'Forest Green', hex: '#2D5016', pantone: '357 TPG' },
  { name: 'Hunter Green', hex: '#355E3B', pantone: '350 TPG' },
  { name: 'Dark Green', hex: '#006400', pantone: '349 TPG' },
  { name: 'Bottle Green', hex: '#006A4E', pantone: '348 TPG' },
  { name: 'Lime', hex: '#00FF00', pantone: '802 TPG' },
  { name: 'Chartreuse', hex: '#7FFF00', pantone: '381 TPG' },
  { name: 'Yellow Green', hex: '#9ACD32', pantone: '383 TPG' },
  { name: 'Pistachio', hex: '#93C572', pantone: '366 TPG' },
  { name: 'Light Olive', hex: '#B5B35C', pantone: '390 TPG' },
  { name: 'Brown', hex: '#8B4513', pantone: '7526 TPG' },
  { name: 'Chocolate', hex: '#7B3F00', pantone: '469 TPG' },
  { name: 'Coffee', hex: '#6F4E37', pantone: '4635 TPG' },
  { name: 'Mocha', hex: '#967969', pantone: '7527 TPG' },
  { name: 'Sienna', hex: '#A0522D', pantone: '7524 TPG' },
  { name: 'Cinnamon', hex: '#D2691E', pantone: '7525 TPG' },
  { name: 'Copper', hex: '#B87333', pantone: '876 TPG' },
  { name: 'Bronze', hex: '#CD7F32', pantone: '874 TPG' },
  { name: 'Ecru', hex: '#C2B280', pantone: '9184 TPG' },
  { name: 'Linen', hex: '#FAF0E6', pantone: '9183 TPG' },
]

const ALL_COLORS = [...SIGNATURE_COLORS, ...TPG_COLORS]

const placements = ['Front', 'Back', 'Left Sleeve', 'Right Sleeve']

// Neck label types and their config
const NECK_LABEL_TYPES = ['No label', 'Woven label', 'Printed label', 'Heat transfer label'] as const
type NeckLabelType = typeof NECK_LABEL_TYPES[number]

const WOVEN_DIMENSIONS = ['50x18mm', '60x20mm', '65x15mm', '45x45mm'] as const
const WOVEN_POSITIONS = ['Below neck tape (5mm)', 'On neck tape'] as const
const BELOW_TAPE_CORNERS = ['2 side', '4-corner', '2-corner'] as const

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const techniqueInfo: Record<string, string> = {
  'Screen Print': 'Bold, solid colors. Best for large runs.',
  'DTG': 'Detailed multi-color artwork. No minimum colors.',
  'Embroidery': 'Stitched finish. Premium and long-lasting.',
  'Heat Transfer': 'Versatile. Good for complex designs.',
}

const productGroups = [
  { category: 'T-Shirts', items: products.filter(p => p.name.includes('Tee') && !p.name.includes('Longsleeve')) },
  { category: 'Longsleeve', items: products.filter(p => p.name.includes('Longsleeve')) },
  { category: 'Sweatshirts', items: products.filter(p => p.name.includes('Sweatshirt')) },
  { category: 'Hoodies', items: products.filter(p => p.name.includes('Hoodie')) },
  { category: 'Bottoms', items: products.filter(p => p.name.includes('Shorts')) },
  { category: 'Accessories', items: products.filter(p => p.name.includes('Tote')) },
]

const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
]

const ALLOWED_EXTENSIONS = ['.svg', '.ai']
const MAX_BYTES = 4.5 * 1024 * 1024
const LS_KEY = 'mf_configurator_v2'

type Screen = 'picker' | 'configure' | 'summary' | 'shipping' | 'review' | 'success'

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface NeckLabelConfig {
  type: NeckLabelType
  dimension: string
  position: string
  cornerStyle: string
}

interface ShippingState {
  firstName: string
  lastName: string
  company: string
  country: string
  addressLine1: string
  addressLine2: string
  pincode: string
  city: string
  state: string
  email: string
  phone: string
  poNumber: string
}

interface BillingState extends ShippingState {}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function distributeQty(total: number): Record<string, number> {
  const weights: Record<string, number> = { XS: 0.05, S: 0.15, M: 0.30, L: 0.30, XL: 0.15, XXL: 0.05 }
  const raw: Record<string, number> = {}
  let sum = 0
  for (const [s, w] of Object.entries(weights)) {
    raw[s] = Math.round(total * w)
    sum += raw[s]
  }
  raw['M'] = (raw['M'] ?? 0) + (total - sum)
  return raw
}

function getColorHex(name: string): string {
  return ALL_COLORS.find(c => c.name === name)?.hex ?? '#F8F8F8'
}

// ─── GARMENT SVG ─────────────────────────────────────────────────────────────

function GarmentSVG({
  color, placements: active, frontPreview, backPreview, activeView, productName,
}: {
  color: string
  placements: string[]
  frontPreview: string | null
  backPreview: string | null
  activeView: 'Front' | 'Back'
  productName: string
}) {
  const showFront = activeView === 'Front'
  const gc = getColorHex(color)
  const darkColors = ['rgb(23,23,23)', '#1a1a1a', '#1B2A4A', '#2D5016', '#6B1E2E', '#6B6B2A', '#191970', '#1B2A4A', '#006400', '#355E3B', '#4B5320', '#380032', '#800000', '#800080', '#4B0082', '#0000FF', '#00008B']
  const isDark = darkColors.includes(gc) || gc.startsWith('#1') || gc.startsWith('#0') || gc.startsWith('#2') || gc.startsWith('#3') || gc.startsWith('#4')
  const sc = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'
  const hl = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
  const isTote = productName.includes('Tote')

  if (isTote) {
    return (
      <svg viewBox="0 0 300 320" width="100%" style={{ maxWidth: 280 }} xmlns="http://www.w3.org/2000/svg">
        <path d="M60 100 L80 60 L100 60 L100 80 C100 90 200 90 200 80 L200 60 L220 60 L240 100 L240 280 L60 280 Z" fill={gc} stroke={sc} strokeWidth="1.5" />
        {frontPreview && <image href={frontPreview} x="105" y="140" width="90" height="90" preserveAspectRatio="xMidYMid meet" />}
        {!frontPreview && active.includes('Front') && <rect x="105" y="140" width="90" height="90" rx="2" fill="none" stroke="#111111" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />}
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 300 320" width="100%" style={{ maxWidth: 320 }} xmlns="http://www.w3.org/2000/svg">
      <path d="M75 80 L40 110 L55 125 L65 115 L65 270 L235 270 L235 115 L245 125 L260 110 L225 80 C210 75 195 70 180 68 C175 85 162 95 150 95 C138 95 125 85 120 68 C105 70 90 75 75 80Z" fill={gc} stroke={sc} strokeWidth="1.5" />
      <path d="M65 115 L40 110 L55 125 L65 165 Z" fill={gc} stroke={sc} strokeWidth="1.5" />
      <path d="M235 115 L260 110 L245 125 L235 165 Z" fill={gc} stroke={sc} strokeWidth="1.5" />
      {showFront && <path d="M120 68 C125 85 138 95 150 95 C162 95 175 85 180 68" fill="none" stroke={sc} strokeWidth="2" />}
      <path d="M100 90 L90 270 L110 270 L115 90Z" fill={hl} />
      {showFront && active.includes('Front') && !frontPreview && <rect x="120" y="130" width="60" height="60" rx="2" fill="none" stroke="#111111" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />}
      {!showFront && active.includes('Back') && !backPreview && <rect x="120" y="130" width="60" height="60" rx="2" fill="none" stroke="#111111" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />}
      {showFront && frontPreview && active.includes('Front') && <image href={frontPreview} x="122" y="132" width="56" height="56" preserveAspectRatio="xMidYMid meet" />}
      {!showFront && backPreview && active.includes('Back') && <image href={backPreview} x="122" y="132" width="56" height="56" preserveAspectRatio="xMidYMid meet" />}
      {active.includes('Left Sleeve') && <text x="48" y="145" fontSize="7" fill="#111111" opacity="0.5" textAnchor="middle">LOGO</text>}
      {active.includes('Right Sleeve') && <text x="252" y="145" fontSize="7" fill="#111111" opacity="0.5" textAnchor="middle">LOGO</text>}
    </svg>
  )
}

// ─── ACCORDION ───────────────────────────────────────────────────────────────

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-[#E5E5E5]">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="text-sm font-semibold text-[#111111]">{title}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="border-t border-[#E5E5E5] px-5 py-5">{children}</div>}
    </div>
  )
}

// ─── COLOR PICKER ────────────────────────────────────────────────────────────

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
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search color or Pantone code…"
          className="w-full pl-8 pr-3 py-2 text-xs border border-[#E5E5E5] focus:outline-none focus:border-[#111111] bg-[#F7F7F7]"
        />
      </div>

      {/* Signature colors */}
      {signatures.length > 0 && (
        <div>
          <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest mb-2">Signature colors</p>
          <div className="grid grid-cols-5 gap-2">
            {signatures.map(c => (
              <ColorSwatch key={c.name} color={c} selected={selected} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}

      {/* Pantone TPG */}
      {pantones.length > 0 && (
        <div>
          <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest mb-2">
            Pantone TPG {search ? `— ${pantones.length} results` : `— ${pantones.length} colors`}
          </p>
          <div className="grid grid-cols-5 gap-2 max-h-[280px] overflow-y-auto pr-1">
            {pantones.map(c => (
              <ColorSwatch key={c.name + (c.pantone ?? '')} color={c} selected={selected} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-xs text-[#111111]/40 text-center py-4">No colors match &ldquo;{search}&rdquo;</p>
      )}
    </div>
  )
}

function ColorSwatch({ color, selected, onSelect }: {
  color: { name: string; hex: string; pantone?: string | null }
  selected: string
  onSelect: (name: string) => void
}) {
  const isSelected = selected === color.name
  return (
    <button
      type="button"
      onClick={() => onSelect(color.name)}
      title={color.pantone ? `${color.name} (${color.pantone})` : color.name}
      className="flex flex-col items-center gap-1"
    >
      <div
        className={`w-9 h-9 rounded-full border-2 transition-all ${isSelected ? 'border-[#111111] scale-110' : 'border-[#E5E5E5] hover:border-[#111111]/40'}`}
        style={{ backgroundColor: color.hex }}
      />
      <span className={`text-[9px] text-center leading-tight line-clamp-2 ${isSelected ? 'text-[#111111] font-medium' : 'text-[#111111]/40'}`}>
        {color.name}
      </span>
    </button>
  )
}

// ─── NECK LABEL CONFIGURATOR ─────────────────────────────────────────────────

function NeckLabelConfig({
  config,
  onChange,
}: {
  config: NeckLabelConfig
  onChange: (c: NeckLabelConfig) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Label type */}
      <div>
        <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-2">Label type</p>
        <div className="grid grid-cols-2 gap-2">
          {NECK_LABEL_TYPES.map(l => (
            <button
              key={l}
              type="button"
              onClick={() => onChange({ ...config, type: l })}
              className={`px-3 py-2.5 border text-xs text-left transition-colors ${config.type === l ? 'border-[#111111] bg-[#111111]/5 font-medium' : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111]/40'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Woven label options */}
      {config.type === 'Woven label' && (
        <>
          {/* Dimension */}
          <div>
            <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-2">Dimensions</p>
            <div className="grid grid-cols-2 gap-2">
              {WOVEN_DIMENSIONS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChange({ ...config, dimension: d })}
                  className={`px-3 py-2 border text-xs transition-colors ${config.dimension === d ? 'border-[#111111] bg-[#111111]/5 font-medium' : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111]/40'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Position */}
          <div>
            <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-2">Position</p>
            <div className="flex flex-col gap-2">
              {WOVEN_POSITIONS.map(pos => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => onChange({
                    ...config,
                    position: pos,
                    cornerStyle: pos === 'On neck tape' ? '2-corner' : config.cornerStyle,
                  })}
                  className={`px-3 py-2.5 border text-xs text-left transition-colors ${config.position === pos ? 'border-[#111111] bg-[#111111]/5 font-medium' : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111]/40'}`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Corner style — only for "Below neck tape" */}
          {config.position === 'Below neck tape (5mm)' && (
            <div>
              <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-2">Corner style</p>
              <div className="grid grid-cols-3 gap-2">
                {BELOW_TAPE_CORNERS.map(corner => (
                  <button
                    key={corner}
                    type="button"
                    onClick={() => onChange({ ...config, cornerStyle: corner })}
                    className={`px-2 py-2 border text-xs transition-colors ${config.cornerStyle === corner ? 'border-[#111111] bg-[#111111]/5 font-medium' : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111]/40'}`}
                  >
                    {corner}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* On neck tape — fixed 2-corner note */}
          {config.position === 'On neck tape' && (
            <p className="text-xs text-[#111111]/40 bg-[#F7F7F7] border border-[#E5E5E5] px-3 py-2">
              On neck tape position uses 2-corner fold (fixed)
            </p>
          )}
        </>
      )}

      {/* Printed / Heat transfer — no position customization */}
      {(config.type === 'Printed label' || config.type === 'Heat transfer label') && (
        <p className="text-xs text-[#111111]/40 bg-[#F7F7F7] border border-[#E5E5E5] px-3 py-2">
          Placed below neck tape at 5mm. No position customization.
        </p>
      )}

      {/* Template download */}
      {config.type !== 'No label' && (
        <a
          href="/downloads/neck-label-templates.zip"
          download
          className="flex items-center justify-between border border-[#111111] px-4 py-3 text-xs font-medium text-[#111111] hover:bg-[#111111] hover:text-white transition-colors group"
        >
          <span>Download label templates</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>
      )}
    </div>
  )
}

// ─── ARTWORK UPLOAD ───────────────────────────────────────────────────────────

function ArtworkUpload({
  side,
  file,
  preview,
  onFile,
  onClear,
  error,
}: {
  side: 'front' | 'back'
  file: File | null
  preview: string | null
  onFile: (f: File) => void
  onClear: () => void
  error: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }

  return (
    <div>
      <p className="text-xs text-[#111111]/50 mb-2 uppercase tracking-widest">
        {side === 'front' ? 'Front artwork' : <>Back artwork <span className="normal-case font-normal">(optional)</span></>}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".svg,.ai"
        className="hidden"
        onChange={e => e.target.files?.[0] && onFile(e.target.files[0])}
      />

      {preview ? (
        <div className="border border-[#E5E5E5] p-3 flex items-center gap-3">
          <img src={preview} alt={side} className="w-10 h-10 object-contain bg-[#F7F7F7]" />
          <p className="text-xs flex-1 truncate">{file?.name}</p>
          <button type="button" onClick={onClear} className="text-xs text-[#111111]/40 hover:text-[#111111]">Remove</button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed cursor-pointer transition-colors rounded-sm ${dragging ? 'border-[#111111] bg-[#F7F7F7]' : 'border-[#E5E5E5] hover:border-[#111111]/30'}`}
        >
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" opacity="0.4">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-xs text-[#111111]/60 font-medium">We support .svg, .ai files up to 4.5MB</p>
            <p className="text-xs text-[#111111]/30">Drag and drop or click to upload</p>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 mt-2">{error}</p>}
    </div>
  )
}

// ─── SHIPPING FORM ────────────────────────────────────────────────────────────

function AddressForm({
  values,
  onChange,
  prefix,
}: {
  values: ShippingState
  onChange: (v: ShippingState) => void
  prefix: string
}) {
  const f = (field: keyof ShippingState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    onChange({ ...values, [field]: e.target.value })

  const inputCls = "border border-[#E5E5E5] px-4 py-3 text-sm focus:outline-none focus:border-[#111111] w-full"
  const labelCls = "text-xs font-medium text-[#111111]/50 uppercase tracking-wide"

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>{prefix} First name *</label>
          <input type="text" value={values.firstName} onChange={f('firstName')} className={inputCls} placeholder="Rahul" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Last name *</label>
          <input type="text" value={values.lastName} onChange={f('lastName')} className={inputCls} placeholder="Sharma" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Company</label>
        <input type="text" value={values.company} onChange={f('company')} className={inputCls} placeholder="Your Brand" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Country *</label>
        <select value={values.country} onChange={f('country')} className={inputCls}>
          <option value="">Select country</option>
          <option value="India">India</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="UAE">UAE</option>
          <option value="Singapore">Singapore</option>
          <option value="Australia">Australia</option>
          <option value="Canada">Canada</option>
          <option value="Germany">Germany</option>
          <option value="France">France</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Address line 1 *</label>
        <input type="text" value={values.addressLine1} onChange={f('addressLine1')} className={inputCls} placeholder="Building, street, area" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Address line 2 <span className="normal-case font-normal">(optional)</span></label>
        <input type="text" value={values.addressLine2} onChange={f('addressLine2')} className={inputCls} placeholder="Landmark, locality" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Pincode *</label>
          <input type="text" value={values.pincode} onChange={f('pincode')} className={inputCls} placeholder="110001" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>City *</label>
          <input type="text" value={values.city} onChange={f('city')} className={inputCls} placeholder="Delhi" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>State *</label>
          <select value={values.state} onChange={f('state')} className={inputCls}>
            <option value="">Select</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Email *</label>
          <input type="email" value={values.email} onChange={f('email')} className={inputCls} placeholder="you@company.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Phone *</label>
          <input type="tel" value={values.phone} onChange={f('phone')} className={inputCls} placeholder="+91 98765 43210" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>PO Number <span className="normal-case font-normal">(optional)</span></label>
        <input type="text" value={values.poNumber} onChange={f('poNumber')} className={inputCls} placeholder="PO-12345" />
      </div>
    </div>
  )
}

// ─── EMPTY ADDRESS ────────────────────────────────────────────────────────────
const emptyAddress = (): ShippingState => ({
  firstName: '', lastName: '', company: '', country: 'India',
  addressLine1: '', addressLine2: '', pincode: '', city: '',
  state: '', email: '', phone: '', poNumber: '',
})

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ConfigureClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [screen, setScreen] = useState<Screen>('picker')
  const [activeView, setActiveView] = useState<'Front' | 'Back'>('Front')
  const [submitting, setSubmitting] = useState(false)
  const [frontFileError, setFrontFileError] = useState('')
  const [backFileError, setBackFileError] = useState('')

  const [product, setProduct] = useState(products[0].name)
  const [color, setColor] = useState('Bright White')
  const [frontArtwork, setFrontArtwork] = useState<File | null>(null)
  const [backArtwork, setBackArtwork] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)
  const [activePlacements, setActivePlacements] = useState<string[]>(['Front'])
  const [technique, setTechnique] = useState('')
  const [neckLabelConfig, setNeckLabelConfig] = useState<NeckLabelConfig>({
    type: 'No label',
    dimension: '50x18mm',
    position: 'Below neck tape (5mm)',
    cornerStyle: '2 side',
  })
  const [totalQty, setTotalQty] = useState(50)
  const [rush, setRush] = useState(false)
  const [sizeQty, setSizeQty] = useState<Record<string, number>>({ XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 })
  const [notes, setNotes] = useState('')

  const [shipping, setShipping] = useState<ShippingState>(emptyAddress())
  const [billing, setBilling] = useState<BillingState>(emptyAddress())
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // ── LOCALSTORAGE RESTORE ──────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) {
        const d = JSON.parse(saved)
        if (d.product) setProduct(d.product)
        if (d.color) setColor(d.color)
        if (d.activePlacements) setActivePlacements(d.activePlacements)
        if (d.technique) setTechnique(d.technique)
        if (d.neckLabelConfig) setNeckLabelConfig(d.neckLabelConfig)
        if (d.totalQty) setTotalQty(d.totalQty)
        if (d.rush !== undefined) setRush(d.rush)
        if (d.sizeQty) setSizeQty(d.sizeQty)
        if (d.notes) setNotes(d.notes)
        if (d.shipping) setShipping(d.shipping)
        if (d.billing) setBilling(d.billing)
        if (d.billingSameAsShipping !== undefined) setBillingSameAsShipping(d.billingSameAsShipping)
        if (d.screen && ['configure', 'summary', 'shipping', 'review'].includes(d.screen)) setScreen(d.screen)
      }
    } catch {/* ignore */}

    // Also read URL params
    const p = searchParams.get('product')
    const c = searchParams.get('color')
    const t = searchParams.get('technique')
    const pl = searchParams.get('placements')
    const s = searchParams.get('screen')
    if (p) { setProduct(p); setScreen('configure') }
    if (c) setColor(c)
    if (t) setTechnique(t)
    if (pl) setActivePlacements(pl.split(','))
    if (s && ['configure', 'summary', 'shipping', 'review'].includes(s)) setScreen(s as Screen)

    setHydrated(true)
  }, [])

  // ── LOCALSTORAGE SAVE ────────────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return
    if (screen === 'picker' || screen === 'success') return
    try {
      const payload = {
        product, color, activePlacements, technique, neckLabelConfig,
        totalQty, rush, sizeQty, notes, shipping, billing, billingSameAsShipping, screen,
      }
      localStorage.setItem(LS_KEY, JSON.stringify(payload))
    } catch {/* ignore */}
  }, [product, color, activePlacements, technique, neckLabelConfig, totalQty, rush, sizeQty, notes, shipping, billing, billingSameAsShipping, screen, hydrated])

  // ── URL SYNC ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return
    if (screen === 'picker' || screen === 'success') return
    const params = new URLSearchParams()
    if (product) params.set('product', product)
    if (color) params.set('color', color)
    if (technique) params.set('technique', technique)
    if (activePlacements.length) params.set('placements', activePlacements.join(','))
    params.set('screen', screen)
    router.replace(`/configure?${params.toString()}`, { scroll: false })
  }, [product, color, technique, activePlacements, screen, hydrated])

  // ── CLEAR STORAGE ON SUCCESS ──────────────────────────────────────────────
  function clearProgress() {
    try { localStorage.removeItem(LS_KEY) } catch {/* ignore */}
  }

  const selectedProduct = products.find(p => p.name === product) ?? products[0]
  const { pricePerPiece, subtotal, gst, total, discount, discountedBase, rushCharge } = calcOrder(product, totalQty, rush)
  const deliveryDate = getDeliveryDate(rush)
  const deliveryDays = rush ? RUSH_DELIVERY_DAYS : DELIVERY_DAYS
  const actualSizeTotal = Object.values(sizeQty).reduce((a, b) => a + b, 0)

  function handleArtwork(file: File, side: 'front' | 'back') {
    const setError = side === 'front' ? setFrontFileError : setBackFileError
    setError('')
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '')
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError('Only .svg and .ai files are accepted')
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

  function togglePlacement(p: string) {
    setActivePlacements(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  function canProceedToSummary() {
    return color !== '' && activePlacements.length > 0 && technique !== '' && totalQty >= 50
  }

  function canProceedToShipping() {
    return actualSizeTotal === totalQty
  }

  function isAddressValid(a: ShippingState) {
    return a.firstName !== '' && a.lastName !== '' && a.country !== '' &&
      a.addressLine1 !== '' && a.pincode !== '' && a.city !== '' &&
      a.state !== '' && a.email !== '' && a.phone !== ''
  }

  function canProceedToReview() {
    const billingAddr = billingSameAsShipping ? shipping : billing
    return isAddressValid(shipping) && isAddressValid(billingAddr)
  }

  function canSubmit() { return true } // details now on shipping page

  function neckLabelSummary() {
    const { type, dimension, position, cornerStyle } = neckLabelConfig
    if (type === 'No label') return 'No label'
    if (type === 'Woven label') {
      const corner = position === 'On neck tape' ? '2-corner' : cornerStyle
      return `Woven · ${dimension} · ${position} · ${corner}`
    }
    return type
  }

  // ── PRODUCT PICKER ────────────────────────────────────────────────────────
  if (screen === 'picker') {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-4">Step 1 of 5</p>
        <h1 className="text-4xl font-bold tracking-tight mb-2">What are you making?</h1>
        <p className="text-[#111111]/50 text-sm mb-14">Select a product to begin. MOQ 50 pieces.</p>
        <div className="flex flex-col gap-10">
          {productGroups.map(group =>
            group.items.length > 0 ? (
              <div key={group.category}>
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-[#111111]/40 shrink-0">{group.category}</p>
                  <div className="flex-1 h-px bg-[#E5E5E5]" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {group.items.map(p => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => { setProduct(p.name); setTechnique(''); setScreen('configure') }}
                      className="p-5 border border-[#E5E5E5] text-left hover:border-[#111111] hover:bg-[#F7F7F7] transition-colors group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-sm font-semibold text-[#111111] group-hover:underline leading-snug">{p.name}</p>
                        <p className="text-xs text-[#111111]/40 shrink-0">from &#8377;{(PRODUCT_PRICES[p.name] ?? 0).toLocaleString('en-IN')}</p>
                      </div>
                      <p className="text-xs text-[#111111]/40 mt-2">{p.techniques.join(' · ')}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    )
  }

  // ── SUCCESS ───────────────────────────────────────────────────────────────
  if (screen === 'success') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-[#111111]/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#111111] mb-3 tracking-tight">Slot reserved</h1>
          <p className="text-[#111111]/60 mb-2 text-sm">
            Thanks {shipping.firstName}. Confirmation sent to
          </p>
          <p className="font-medium text-[#111111] mb-4">{shipping.email}</p>
          <p className="text-xs text-[#111111]/40 mb-2">
            Estimated delivery: <strong>{deliveryDate}</strong>
          </p>
          <p className="text-xs text-[#111111]/40 mb-8">Our team will send a proforma within 24 hours.</p>
          <a href="/" className="inline-block bg-[#111111] text-white px-6 py-3 text-sm font-medium hover:bg-black transition-colors">
            Back to home
          </a>
        </div>
      </div>
    )
  }

  // ── CONFIGURE SCREEN ──────────────────────────────────────────────────────
  if (screen === 'configure') {
    return (
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
        {/* LEFT — preview */}
        <div className="lg:w-3/5 bg-[#F7F7F7] flex flex-col items-center justify-center p-8 lg:p-16 relative">
          <button
            type="button"
            onClick={() => setScreen('picker')}
            className="absolute top-6 left-6 text-xs text-[#111111]/40 hover:text-[#111111] transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Change product
          </button>

          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex bg-white border border-[#E5E5E5] overflow-hidden">
            {(['Front', 'Back'] as const).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setActiveView(v)}
                className={`px-5 py-2 text-xs font-medium transition-colors ${activeView === v ? 'bg-[#111111] text-white' : 'text-[#111111]/50 hover:text-[#111111]'}`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="w-full max-w-xs mt-8">
            <GarmentSVG
              color={color}
              placements={activePlacements}
              frontPreview={frontPreview}
              backPreview={backPreview}
              activeView={activeView}
              productName={product}
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-[#111111]">{product}</p>
            <p className="text-xs text-[#111111]/40 mt-1">{color} colorway</p>
          </div>

          {totalQty >= 50 && (
            <div className="mt-6 bg-white border border-[#E5E5E5] px-6 py-4 w-full max-w-xs">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-[#111111]/40">Unit cost</span>
                <span className="text-sm font-bold text-[#111111]">&#8377;{pricePerPiece.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-[#111111]/40">Volume discount</span>
                  <span className="text-xs text-green-600 font-medium">-{(discount * 100).toFixed(0)}%</span>
                </div>
              )}
              {rush && rushCharge > 0 && (
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-[#111111]/40">Rush premium</span>
                  <span className="text-xs text-[#111111]/60">+&#8377;{rushCharge}/pc</span>
                </div>
              )}
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-[#111111]/40">Subtotal</span>
                <span className="text-sm font-bold text-[#111111]">&#8377;{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-[#111111]/40">GST (5%)</span>
                <span className="text-xs text-[#111111]/60">&#8377;{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#E5E5E5] mt-1">
                <span className="text-xs font-semibold text-[#111111]">Total (incl. GST)</span>
                <span className="text-sm font-bold text-[#111111]">&#8377;{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#E5E5E5]">
                <span className="text-xs text-[#111111]/40">Est. delivery</span>
                <span className="text-xs font-medium text-[#111111]">{deliveryDate}</span>
              </div>
              <p className="text-xs text-[#111111]/30 mt-2">+ Shipping quoted separately</p>
            </div>
          )}
        </div>

        {/* RIGHT — accordions */}
        <div className="lg:w-2/5 bg-white flex flex-col border-l border-[#E5E5E5]">
          <div className="border-b border-[#E5E5E5] px-6 py-4">
            <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-1">Configuring</p>
            <p className="text-sm font-semibold text-[#111111]">{product}</p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3">
            {/* Color */}
            <Accordion title={`Garment color${color ? ` — ${color}` : ''}`} defaultOpen={true}>
              <ColorPicker selected={color} onSelect={setColor} />
            </Accordion>

            {/* Artwork */}
            <Accordion title="Artwork upload">
              <div className="flex flex-col gap-5">
                <ArtworkUpload
                  side="front"
                  file={frontArtwork}
                  preview={frontPreview}
                  onFile={f => handleArtwork(f, 'front')}
                  onClear={() => { setFrontArtwork(null); setFrontPreview(null) }}
                  error={frontFileError}
                />
                <ArtworkUpload
                  side="back"
                  file={backArtwork}
                  preview={backPreview}
                  onFile={f => handleArtwork(f, 'back')}
                  onClear={() => { setBackArtwork(null); setBackPreview(null) }}
                  error={backFileError}
                />
              </div>
            </Accordion>

            {/* Placement + Technique */}
            <Accordion title="Placement &amp; print technique">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-2">Print placement</p>
                  <div className="grid grid-cols-2 gap-2">
                    {placements.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePlacement(p)}
                        className={`px-3 py-2.5 border text-xs text-left transition-colors flex items-center justify-between ${activePlacements.includes(p) ? 'border-[#111111] bg-[#111111]/5 font-medium' : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111]/40'}`}
                      >
                        {p}
                        {activePlacements.includes(p) && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-2">Print technique</p>
                  <div className="flex flex-col gap-1.5">
                    {selectedProduct.techniques.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTechnique(t)}
                        className={`px-4 py-3 border text-left transition-colors ${technique === t ? 'border-[#111111] bg-[#111111]/5' : 'border-[#E5E5E5] hover:border-[#111111]/40'}`}
                      >
                        <p className="text-xs font-medium">{t}</p>
                        <p className="text-xs text-[#111111]/40 mt-0.5">{techniqueInfo[t]}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Accordion>

            {/* Neck label */}
            <Accordion title={`Neck label — ${neckLabelConfig.type}`}>
              <NeckLabelConfig config={neckLabelConfig} onChange={setNeckLabelConfig} />
            </Accordion>

            {/* Quantity */}
            <div className="border border-[#E5E5E5] p-5">
              <p className="text-sm font-semibold mb-4">Quantity</p>
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setTotalQty(q => Math.max(50, q - 10))}
                  className="w-10 h-10 border border-[#E5E5E5] text-lg hover:border-[#111111] transition-colors flex items-center justify-center shrink-0"
                >
                  -
                </button>
                <input
                  type="number"
                  value={totalQty}
                  min={50}
                  onChange={e => setTotalQty(Math.max(50, parseInt(e.target.value) || 50))}
                  className="flex-1 text-center text-sm font-bold border border-[#E5E5E5] py-2.5 focus:outline-none focus:border-[#111111]"
                />
                <button
                  type="button"
                  onClick={() => setTotalQty(q => q + 10)}
                  className="w-10 h-10 border border-[#E5E5E5] text-lg hover:border-[#111111] transition-colors flex items-center justify-center shrink-0"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-[#111111]/40 mb-4">Minimum 50 pieces. Type any number directly.</p>

              <div className="flex flex-col border border-[#E5E5E5] overflow-hidden">
                {VOLUME_TIERS.map(t => (
                  <div
                    key={t.min}
                    className={`flex justify-between text-xs px-3 py-2 transition-colors border-b border-[#E5E5E5] last:border-0 ${getDiscount(totalQty) === t.discount ? 'bg-[#111111] text-white' : 'text-[#111111]/30'}`}
                  >
                    <span>{t.min}{t.max === Infinity ? '+' : `\u2013${t.max}`} pcs</span>
                    <span>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rush order */}
            <div className="border border-[#E5E5E5] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#111111]">Rush order</p>
                  <p className="text-xs text-[#111111]/50 mt-0.5">
                    {rush ? `Delivery in ${RUSH_DELIVERY_DAYS} days` : `Standard: ${DELIVERY_DAYS} days`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRush(!rush)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${rush ? 'bg-[#111111]' : 'bg-[#E5E5E5]'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rush ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              {rush && (
                <p className="text-xs text-[#111111]/50 mt-3 pt-3 border-t border-[#E5E5E5]">
                  Rush premium: +&#8377;{getRushCharge(totalQty)}/piece
                  (&#8377;{(getRushCharge(totalQty) * totalQty).toLocaleString('en-IN')} total)
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="border border-[#E5E5E5] p-5">
              <p className="text-sm font-semibold mb-3">Special requirements</p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Any special requirements, color codes, references…"
                className="w-full border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#111111] resize-none"
              />
            </div>
          </div>

          <div className="border-t border-[#E5E5E5] px-6 py-5">
            <button
              type="button"
              disabled={!canProceedToSummary()}
              onClick={() => { setSizeQty(distributeQty(totalQty)); setScreen('summary') }}
              className={`w-full py-3.5 text-sm font-medium transition-colors ${canProceedToSummary() ? 'bg-[#111111] text-white hover:bg-black' : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'}`}
            >
              {canProceedToSummary() ? 'Next: Order summary' : 'Complete all sections above'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── ORDER SUMMARY ─────────────────────────────────────────────────────────
  if (screen === 'summary') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <button type="button" onClick={() => setScreen('configure')} className="text-xs text-[#111111]/40 hover:text-[#111111] flex items-center gap-1.5 mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          Back to configuration
        </button>

        <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-2">Step 2 of 5</p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Order summary</h1>
        <p className="text-[#111111]/50 text-sm mb-10">
          We&apos;ve auto-distributed your quantity across sizes. Adjust as needed — total must match {totalQty} pieces.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Size breakdown</p>
            <div className="flex flex-col gap-2 mb-4">
              {sizes.map(s => (
                <div key={s} className="flex items-center justify-between border border-[#E5E5E5] px-4 py-3">
                  <span className="text-sm font-medium w-8">{s}</span>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setSizeQty(prev => ({ ...prev, [s]: Math.max(0, (prev[s] ?? 0) - 1) }))} className="w-7 h-7 border border-[#E5E5E5] hover:border-[#111111] transition-colors flex items-center justify-center text-base">-</button>
                    <span className="w-8 text-center text-sm font-medium">{sizeQty[s]}</span>
                    <button type="button" onClick={() => setSizeQty(prev => ({ ...prev, [s]: (prev[s] ?? 0) + 1 }))} className="w-7 h-7 border border-[#E5E5E5] hover:border-[#111111] transition-colors flex items-center justify-center text-base">+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className={`p-3 text-xs font-medium border ${actualSizeTotal === totalQty ? 'bg-green-50 text-green-700 border-green-200' : actualSizeTotal > totalQty ? 'bg-red-50 text-red-600 border-red-200' : 'bg-[#111111]/5 text-[#111111]/60 border-[#111111]/10'}`}>
              {actualSizeTotal === totalQty ? `${actualSizeTotal} pieces — matches your order` : actualSizeTotal > totalQty ? `${actualSizeTotal} pieces — ${actualSizeTotal - totalQty} over limit` : `${actualSizeTotal} of ${totalQty} pieces — ${totalQty - actualSizeTotal} remaining`}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="border border-[#E5E5E5] p-5 text-xs">
              <p className="font-medium text-[#111111]/40 uppercase tracking-widest mb-4">Configuration</p>
              {[
                { label: 'Product', value: product },
                { label: 'Color', value: color },
                { label: 'Technique', value: technique },
                { label: 'Placement', value: activePlacements.join(', ') },
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
                <div className="flex justify-between">
                  <span className="text-white/60">Base price/piece</span>
                  <span>&#8377;{(PRODUCT_PRICES[product] ?? 0).toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Volume discount ({(discount * 100).toFixed(0)}%)</span>
                    <span className="text-green-400">-&#8377;{((PRODUCT_PRICES[product] ?? 0) - discountedBase).toLocaleString('en-IN')}/pc</span>
                  </div>
                )}
                {rush && rushCharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Rush premium</span>
                    <span>+&#8377;{rushCharge}/pc</span>
                  </div>
                )}
                <div className="flex justify-between font-medium border-t border-white/10 pt-2 mt-1">
                  <span className="text-white/80">Price per piece</span>
                  <span>&#8377;{pricePerPiece.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Subtotal</span>
                  <span>&#8377;{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 mt-1">
                  <span className="text-white/60">GST (5%)</span>
                  <span>&#8377;{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-white/20 pt-3 mt-1">
                  <span>Total (incl. GST)</span>
                  <span>&#8377;{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <p className="text-xs text-white/30 mt-3">+ Shipping quoted separately by email</p>
            </div>

            <button
              type="button"
              disabled={!canProceedToShipping()}
              onClick={() => setScreen('shipping')}
              className={`w-full py-3.5 text-sm font-medium transition-colors ${canProceedToShipping() ? 'bg-[#111111] text-white hover:bg-black' : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'}`}
            >
              Next: Shipping details
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── SHIPPING + BILLING ────────────────────────────────────────────────────
  if (screen === 'shipping') {
    const effectiveBilling = billingSameAsShipping ? shipping : billing

    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <button type="button" onClick={() => setScreen('summary')} className="text-xs text-[#111111]/40 hover:text-[#111111] flex items-center gap-1.5 mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          Back to order summary
        </button>

        <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-2">Step 3 of 5</p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Shipping &amp; billing</h1>
        <p className="text-[#111111]/50 text-sm mb-10">
          Shipping charges are quoted separately via email.
        </p>

        <div className="flex flex-col gap-10">
          {/* Shipping */}
          <div>
            <p className="text-sm font-semibold text-[#111111] mb-5">Shipping address</p>
            <AddressForm values={shipping} onChange={setShipping} prefix="Shipping" />
          </div>

          {/* Billing */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-semibold text-[#111111]">Billing address</p>
              <button
                type="button"
                onClick={() => setBillingSameAsShipping(!billingSameAsShipping)}
                className="flex items-center gap-2 text-xs text-[#111111]/60 hover:text-[#111111] transition-colors"
              >
                <div className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${billingSameAsShipping ? 'border-[#111111] bg-[#111111]' : 'border-[#E5E5E5]'}`}>
                  {billingSameAsShipping && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                Copy shipping details to billing
              </button>
            </div>

            {billingSameAsShipping ? (
              <div className="border border-[#E5E5E5] bg-[#F7F7F7] p-4 text-xs text-[#111111]/50">
                Billing address same as shipping address
              </div>
            ) : (
              <AddressForm values={billing} onChange={setBilling} prefix="Billing" />
            )}
          </div>

          <div className="bg-[#F7F7F7] border border-[#E5E5E5] p-4 text-xs text-[#111111]/50">
            Shipping is paid by the client. We will email you the shipping charge before dispatching.
          </div>

          <button
            type="button"
            disabled={!canProceedToReview()}
            onClick={() => setScreen('review')}
            className={`w-full py-3.5 text-sm font-medium transition-colors ${canProceedToReview() ? 'bg-[#111111] text-white hover:bg-black' : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'}`}
          >
            {canProceedToReview() ? 'Next: Review & pay' : 'Fill in all required fields'}
          </button>
        </div>
      </div>
    )
  }

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
        <p className="text-[#111111]/50 text-sm mb-10">
          Confirm everything looks right before paying.
        </p>

        <div className="flex flex-col gap-6">
          {/* Order details */}
          <div className="border border-[#E5E5E5] p-5 text-xs">
            <p className="font-medium text-[#111111]/40 uppercase tracking-widest mb-4">Order details</p>
            {[
              { label: 'Product', value: product },
              { label: 'Color', value: color },
              { label: 'Technique', value: technique },
              { label: 'Placement', value: activePlacements.join(', ') },
              { label: 'Neck label', value: neckLabelSummary() },
              { label: 'Quantity', value: `${totalQty} pcs` },
              { label: 'Size breakdown', value: sizes.filter(s => sizeQty[s] > 0).map(s => `${s}:${sizeQty[s]}`).join(' · ') },
              { label: 'Est. delivery', value: deliveryDate },
            ].map(row => (
              <div key={row.label} className="flex justify-between py-2 border-b border-[#F7F7F7] last:border-0">
                <span className="text-[#111111]/50 shrink-0">{row.label}</span>
                <span className="font-medium text-right max-w-[55%] break-words">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Shipping + billing summary */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-[#E5E5E5] p-5 text-xs">
              <p className="font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Shipping address</p>
              <div className="flex flex-col gap-1 text-[#111111]/70 leading-relaxed">
                <span className="font-medium text-[#111111]">{shipping.firstName} {shipping.lastName}</span>
                {shipping.company && <span>{shipping.company}</span>}
                <span>{shipping.addressLine1}</span>
                {shipping.addressLine2 && <span>{shipping.addressLine2}</span>}
                <span>{shipping.city}, {shipping.state} {shipping.pincode}</span>
                <span>{shipping.country}</span>
                <span className="mt-1">{shipping.email}</span>
                <span>{shipping.phone}</span>
                {shipping.poNumber && <span>PO: {shipping.poNumber}</span>}
              </div>
            </div>

            <div className="border border-[#E5E5E5] p-5 text-xs">
              <p className="font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Billing address</p>
              <div className="flex flex-col gap-1 text-[#111111]/70 leading-relaxed">
                <span className="font-medium text-[#111111]">{effectiveBilling.firstName} {effectiveBilling.lastName}</span>
                {effectiveBilling.company && <span>{effectiveBilling.company}</span>}
                <span>{effectiveBilling.addressLine1}</span>
                {effectiveBilling.addressLine2 && <span>{effectiveBilling.addressLine2}</span>}
                <span>{effectiveBilling.city}, {effectiveBilling.state} {effectiveBilling.pincode}</span>
                <span>{effectiveBilling.country}</span>
                <span className="mt-1">{effectiveBilling.email}</span>
                <span>{effectiveBilling.phone}</span>
                {effectiveBilling.poNumber && <span>PO: {effectiveBilling.poNumber}</span>}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#111111] p-5 text-white text-sm">
            <p className="text-xs text-white/50 uppercase tracking-widest mb-4">Pricing breakdown</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-white/60">Base price/piece</span>
                <span>&#8377;{(PRODUCT_PRICES[product] ?? 0).toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/60">Volume discount ({(discount * 100).toFixed(0)}%)</span>
                  <span className="text-green-400">-&#8377;{((PRODUCT_PRICES[product] ?? 0) - discountedBase).toLocaleString('en-IN')}/pc</span>
                </div>
              )}
              {rush && rushCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/60">Rush premium</span>
                  <span>+&#8377;{rushCharge}/pc</span>
                </div>
              )}
              <div className="flex justify-between font-medium border-t border-white/10 pt-2 mt-1">
                <span className="text-white/80">Price per piece</span>
                <span>&#8377;{pricePerPiece.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Subtotal ({totalQty} pcs)</span>
                <span>&#8377;{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 mt-1">
                <span className="text-white/60">GST (5%)</span>
                <span>&#8377;{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-white/20 pt-3 mt-1">
                <span>Total (incl. GST)</span>
                <span>&#8377;{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40 flex flex-col gap-1">
              <span>Shipping quoted separately via email</span>
              <span>Rs.499 reservation deducted from final invoice</span>
            </div>
          </div>

          <div className="bg-[#F7F7F7] border border-[#E5E5E5] p-4 text-xs text-[#111111]/60 leading-relaxed">
            A <strong className="text-[#111111]">&#8377;499 reservation fee</strong> is charged now to confirm your production slot.
            The balance (&#8377;{Math.max(0, total - 499).toLocaleString('en-IN')}) is invoiced separately via net banking before production begins.
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={async () => {
              if (submitting) return
              setSubmitting(true)
              try {
                const txnid = 'MF' + Date.now()
                const amount = '499.00'
                const productinfo = `Reservation - ${product} x${totalQty} pcs`

                const res = await fetch('/api/payu/hash', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    txnid,
                    amount,
                    productinfo,
                    firstname: shipping.firstName,
                    email: shipping.email,
                  }),
                })
                const { hash, key } = await res.json()

                // Store order details in localStorage for success page to send confirmation email
                try {
                  localStorage.setItem('mf_pending_order', JSON.stringify({
                    txnid,
                    name: `${shipping.firstName} ${shipping.lastName}`,
                    email: shipping.email,
                    product, color, technique,
                    placements: activePlacements.join(', '),
                    totalQty,
                    sizeBreakdown: sizes.filter(s => sizeQty[s] > 0).map(s => `${s}: ${sizeQty[s]}`).join(', '),
                    estimatedTotal: `Rs.${total.toLocaleString('en-IN')} (incl. GST)`,
                    neckLabel: neckLabelSummary(),
                    shipping, billing: effectiveBilling,
                  }))
                } catch {/* ignore */}

                const payuForm = document.createElement('form')
                payuForm.method = 'POST'
                payuForm.action = process.env.NEXT_PUBLIC_PAYU_BASE_URL ?? 'https://secure.payu.in/_payment'

                const fields: Record<string, string> = {
                  key, txnid, amount, productinfo,
                  firstname: shipping.firstName,
                  lastname: shipping.lastName,
                  email: shipping.email,
                  phone: shipping.phone || '9999999999',
                  surl: `${window.location.origin}/payment/success`,
                  furl: `${window.location.origin}/payment/failure`,
                  hash,
                }

                Object.entries(fields).forEach(([k, v]) => {
                  const input = document.createElement('input')
                  input.type = 'hidden'
                  input.name = k
                  input.value = v
                  payuForm.appendChild(input)
                })

                document.body.appendChild(payuForm)
                payuForm.submit()
              } catch (err) {
                console.error('Submit error:', err)
                setSubmitting(false)
              }
            }}
            className={`w-full py-4 text-sm font-medium transition-colors ${!submitting ? 'bg-[#111111] text-white hover:bg-black' : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'}`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-[#111111]/20 border-t-[#111111]/60 rounded-full animate-spin" />
                Redirecting to payment...
              </span>
            ) : (
              'Confirm & pay Rs.499'
            )}
          </button>
        </div>
      </div>
    )
  }

  return null
}
