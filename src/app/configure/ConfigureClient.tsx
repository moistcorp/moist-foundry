'use client'
import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const products = [
  { name: 'Regular Fit Tee (200 GSM)', basePrice: 280, techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Boxy Fit Tee (200 GSM)', basePrice: 280, techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Regular Fit Tee (260 GSM)', basePrice: 340, techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Boxy Fit Tee (260 GSM)', basePrice: 340, techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Longsleeve Tee (260 GSM)', basePrice: 420, techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Regular Fit Sweatshirt (320 GSM)', basePrice: 580, techniques: ['Screen Print', 'Embroidery'] },
  { name: 'Boxy Fit Sweatshirt (320 GSM)', basePrice: 580, techniques: ['Screen Print', 'Embroidery'] },
  { name: 'Regular Fit Hoodie (320 GSM)', basePrice: 650, techniques: ['Screen Print', 'Embroidery', 'Heat Transfer'] },
  { name: 'Boxy Fit Hoodie (320 GSM)', basePrice: 650, techniques: ['Screen Print', 'Embroidery', 'Heat Transfer'] },
  { name: 'Shorts (220 GSM)', basePrice: 320, techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Canvas Tote Bag', basePrice: 180, techniques: ['Screen Print', 'DTG'] },
]

const colors = [
  { name: 'White', hex: '#F8F8F8' },
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Navy', hex: '#1B2A4A' },
  { name: 'Forest Green', hex: '#2D5016' },
  { name: 'Burgundy', hex: '#6B1E2E' },
  { name: 'Grey', hex: '#9CA3AF' },
  { name: 'Beige', hex: '#D4C5A9' },
  { name: 'Sky Blue', hex: '#7DB8D4' },
  { name: 'Mustard', hex: '#D4A017' },
  { name: 'Olive', hex: '#6B6B2A' },
]

const placements = ['Front', 'Back', 'Left Sleeve', 'Right Sleeve']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const techniqueInfo: Record<string, string> = {
  'Screen Print': 'Bold, solid colors. Best for large runs.',
  'DTG': 'Detailed multi-color artwork. No minimum colors.',
  'Embroidery': 'Stitched finish. Premium and long-lasting.',
  'Heat Transfer': 'Versatile. Good for complex designs.',
}

const productGroups = [
  {
    category: 'T-Shirts',
    items: products.filter(p => p.name.includes('Tee') && !p.name.includes('Longsleeve')),
  },
  {
    category: 'Longsleeve',
    items: products.filter(p => p.name.includes('Longsleeve')),
  },
  {
    category: 'Sweatshirts',
    items: products.filter(p => p.name.includes('Sweatshirt')),
  },
  {
    category: 'Hoodies',
    items: products.filter(p => p.name.includes('Hoodie')),
  },
  {
    category: 'Bottoms',
    items: products.filter(p => p.name.includes('Shorts')),
  },
  {
    category: 'Accessories',
    items: products.filter(p => p.name.includes('Tote')),
  },
]

const PANELS = ['color', 'artwork', 'placement', 'technique', 'sizes', 'details'] as const
type Panel = typeof PANELS[number]

const PANEL_LABELS: Record<Panel, string> = {
  color: 'Color',
  artwork: 'Artwork',
  placement: 'Placement',
  technique: 'Technique',
  sizes: 'Sizes',
  details: 'Details',
}

function getDiscount(qty: number): number {
  if (qty >= 1000) return 0.22
  if (qty >= 500) return 0.17
  if (qty >= 250) return 0.12
  if (qty >= 100) return 0.07
  return 0
}

function GarmentSVG({
  color,
  placements: activePlacements,
  frontPreview,
  backPreview,
  activeView,
}: {
  color: string
  placements: string[]
  frontPreview: string | null
  backPreview: string | null
  activeView: 'Front' | 'Back'
}) {
  const showFront = activeView === 'Front'
  const garmentColor = colors.find(c => c.name === color)?.hex ?? '#F8F8F8'
  const isDark = ['#1a1a1a', '#1B2A4A', '#2D5016', '#6B1E2E', '#6B6B2A'].includes(garmentColor)
  const strokeColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'
  const highlightColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'

  return (
    <div className="relative w-full flex flex-col items-center gap-3">
      <svg viewBox="0 0 300 320" width="100%" style={{ maxWidth: 320 }} xmlns="http://www.w3.org/2000/svg">
        <path
          d="M75 80 L40 110 L55 125 L65 115 L65 270 L235 270 L235 115 L245 125 L260 110 L225 80 C210 75 195 70 180 68 C175 85 162 95 150 95 C138 95 125 85 120 68 C105 70 90 75 75 80Z"
          fill={garmentColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <path d="M65 115 L40 110 L55 125 L65 165 Z" fill={garmentColor} stroke={strokeColor} strokeWidth="1.5" />
        <path d="M235 115 L260 110 L245 125 L235 165 Z" fill={garmentColor} stroke={strokeColor} strokeWidth="1.5" />
        {showFront && (
          <path d="M120 68 C125 85 138 95 150 95 C162 95 175 85 180 68" fill="none" stroke={strokeColor} strokeWidth="2" />
        )}
        <path d="M100 90 L90 270 L110 270 L115 90Z" fill={highlightColor} />
        {showFront && activePlacements.includes('Front') && !frontPreview && (
          <rect x="120" y="130" width="60" height="60" rx="2" fill="none" stroke="#111111" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
        )}
        {!showFront && activePlacements.includes('Back') && !backPreview && (
          <rect x="120" y="130" width="60" height="60" rx="2" fill="none" stroke="#111111" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
        )}
        {showFront && frontPreview && activePlacements.includes('Front') && (
          <image href={frontPreview} x="122" y="132" width="56" height="56" preserveAspectRatio="xMidYMid meet" />
        )}
        {!showFront && backPreview && activePlacements.includes('Back') && (
          <image href={backPreview} x="122" y="132" width="56" height="56" preserveAspectRatio="xMidYMid meet" />
        )}
        {activePlacements.includes('Left Sleeve') && (
          <text x="48" y="145" fontSize="7" fill="#111111" opacity="0.5" textAnchor="middle">LOGO</text>
        )}
        {activePlacements.includes('Right Sleeve') && (
          <text x="252" y="145" fontSize="7" fill="#111111" opacity="0.5" textAnchor="middle">LOGO</text>
        )}
      </svg>
    </div>
  )
}

export default function ConfigureClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [productSelected, setProductSelected] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activeView, setActiveView] = useState<'Front' | 'Back'>('Front')
  const [submitting, setSubmitting] = useState(false)

  const [product, setProduct] = useState(products[0].name)
  const [color, setColor] = useState('White')
  const [frontArtwork, setFrontArtwork] = useState<File | null>(null)
  const [backArtwork, setBackArtwork] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)
  const [activePlacements, setActivePlacements] = useState<string[]>(['Front'])
  const [technique, setTechnique] = useState('')
  const [sizeQty, setSizeQty] = useState<Record<string, number>>({
    XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0,
  })
  const [details, setDetails] = useState({
    name: '', company: '', email: '', phone: '', notes: '',
  })
  const [panel, setPanel] = useState<Panel>('color')

  const frontRef = useRef<HTMLInputElement>(null)
  const backRef = useRef<HTMLInputElement>(null)

  // Load from URL on mount
  useEffect(() => {
    const p = searchParams.get('product')
    const c = searchParams.get('color')
    const t = searchParams.get('technique')
    const pl = searchParams.get('placements')
    const s = searchParams.get('step')
    if (p) { setProduct(p); setProductSelected(true) }
    if (c) setColor(c)
    if (t) setTechnique(t)
    if (pl) setActivePlacements(pl.split(','))
    if (s && PANELS.includes(s as Panel)) setPanel(s as Panel)
  }, [])

  // Save to URL on change
  useEffect(() => {
    if (!productSelected) return
    const params = new URLSearchParams()
    if (product) params.set('product', product)
    if (color) params.set('color', color)
    if (technique) params.set('technique', technique)
    if (activePlacements.length) params.set('placements', activePlacements.join(','))
    params.set('step', panel)
    router.replace(`/configure?${params.toString()}`, { scroll: false })
  }, [product, color, technique, activePlacements, panel, productSelected])

  const totalQty = Object.values(sizeQty).reduce((a, b) => a + b, 0)
  const selectedProduct = products.find(p => p.name === product) ?? products[0]
  const discount = getDiscount(totalQty)
  const pricePerPiece = Math.round(selectedProduct.basePrice * (1 - discount))
  const totalPrice = pricePerPiece * Math.max(totalQty, 50)

  function handleArtwork(file: File, side: 'front' | 'back') {
    const url = URL.createObjectURL(file)
    if (side === 'front') { setFrontArtwork(file); setFrontPreview(url) }
    else { setBackArtwork(file); setBackPreview(url) }
  }

  function togglePlacement(p: string) {
    setActivePlacements(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  // Progress bar — how many panels are complete
  function isPanelComplete(p: Panel): boolean {
    if (p === 'color') return color !== ''
    if (p === 'artwork') return frontArtwork !== null || backArtwork !== null
    if (p === 'placement') return activePlacements.length > 0
    if (p === 'technique') return technique !== ''
    if (p === 'sizes') return totalQty >= 50
    if (p === 'details') return details.name !== '' && details.email !== '' && details.company !== ''
    return false
  }

  const completedCount = PANELS.filter(isPanelComplete).length
  const progressPct = Math.round((completedCount / PANELS.length) * 100)

  function canSubmit() {
    return PANELS.every(isPanelComplete)
  }

  // ── PRODUCT SELECTION SCREEN ──────────────────────────────────
  if (!productSelected) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-4">Step 1 of 2</p>
        <h1 className="text-4xl font-bold tracking-tight mb-2">What are you making?</h1>
        <p className="text-[#111111]/50 text-sm mb-14">
          Select a product to start configuring your order. MOQ 50 pieces.
        </p>

        <div className="flex flex-col gap-10">
          {productGroups.map(group =>
            group.items.length > 0 ? (
              <div key={group.category}>
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-[#111111]/40 shrink-0">
                    {group.category}
                  </p>
                  <div className="flex-1 h-px bg-[#E5E5E5]" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {group.items.map(p => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setProduct(p.name)
                        setTechnique('')
                        setProductSelected(true)
                        setPanel('color')
                      }}
                      className="p-5 border border-[#E5E5E5] text-left hover:border-[#111111] hover:bg-[#F7F7F7] transition-colors group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-sm font-semibold text-[#111111] group-hover:underline leading-snug">
                          {p.name}
                        </p>
                        <p className="text-xs text-[#111111]/40 shrink-0">from &#8377;{p.basePrice}</p>
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

  // ── SUCCESS SCREEN ────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-[#111111]/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#111111] mb-3 tracking-tight">Request received</h1>
          <p className="text-[#111111]/60 mb-2 text-sm">
            Thanks {details.name.split(' ')[0]}. We&apos;ll review your configuration and send a detailed quote to
          </p>
          <p className="font-medium text-[#111111] mb-8">{details.email}</p>
          <p className="text-xs text-[#111111]/40 mb-8">Expected response within 24 hours</p>
          
            href="/"
            className="inline-block bg-[#111111] text-white px-6 py-3 text-sm font-medium hover:bg-black transition-colors"
          
            Back to home
          
        </div>
      </div>
    )
  }

  // ── MAIN STUDIO ───────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">

      {/* LEFT — Garment preview */}
      <div className="lg:w-3/5 bg-[#F7F7F7] flex flex-col items-center justify-center p-8 lg:p-16 relative">

        {/* Back to product selection */}
        <button
          type="button"
          onClick={() => setProductSelected(false)}
          className="absolute top-6 left-6 text-xs text-[#111111]/40 hover:text-[#111111] transition-colors flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Change product
        </button>

        {/* View toggle */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex bg-white border border-[#E5E5E5] overflow-hidden">
          {(['Front', 'Back'] as const).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setActiveView(v)}
              className={`px-5 py-2 text-xs font-medium transition-colors ${
                activeView === v ? 'bg-[#111111] text-white' : 'text-[#111111]/50 hover:text-[#111111]'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Garment */}
        <div className="w-full max-w-xs mt-8">
          <GarmentSVG
            color={color}
            placements={activePlacements}
            frontPreview={frontPreview}
            backPreview={backPreview}
            activeView={activeView}
          />
        </div>

        {/* Labels */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-[#111111]">{product}</p>
          <p className="text-xs text-[#111111]/40 mt-1">{color} colorway</p>
        </div>

        {/* Live estimate */}
        {totalQty >= 50 && (
          <div className="mt-8 bg-white border border-[#E5E5E5] px-6 py-4 text-center">
            <p className="text-xs text-[#111111]/40 mb-1">Estimated total ({totalQty} pcs)</p>
            <p className="text-2xl font-bold text-[#111111]">&#8377;{totalPrice.toLocaleString('en-IN')}</p>
            <p className="text-xs text-[#111111]/40 mt-1">
              &#8377;{pricePerPiece} per piece
              {discount > 0 ? ` · ${(discount * 100).toFixed(0)}% volume discount` : ''}
            </p>
          </div>
        )}
        {totalQty > 0 && totalQty < 50 && (
          <div className="mt-8 bg-[#111111]/5 border border-[#111111]/10 px-6 py-3 text-center">
            <p className="text-xs text-[#111111]/60">{50 - totalQty} more pieces needed to meet MOQ</p>
          </div>
        )}
      </div>

      {/* RIGHT — Controls */}
      <div className="lg:w-2/5 bg-white flex flex-col border-l border-[#E5E5E5]">

        {/* Progress bar */}
        <div className="border-b border-[#E5E5E5] px-6 pt-4 pb-3">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-[#111111]/40 uppercase tracking-widest">Progress</p>
            <p className="text-xs font-medium text-[#111111]">{progressPct}%</p>
          </div>
          <div className="w-full h-1 bg-[#E5E5E5] rounded-full overflow-hidden">
            <div
              className="h-1 bg-[#111111] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {PANELS.map(p => (
              <div key={p} className="flex flex-col items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isPanelComplete(p) ? 'bg-[#111111]' : panel === p ? 'bg-[#111111]/40' : 'bg-[#E5E5E5]'
                }`} />
                <span className={`text-[10px] leading-none ${
                  panel === p ? 'text-[#111111] font-medium' : 'text-[#111111]/30'
                }`}>
                  {PANEL_LABELS[p]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected product header */}
        <div className="border-b border-[#E5E5E5] px-6 py-3">
          <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-1">Configuring</p>
          <p className="text-sm font-semibold text-[#111111]">{product}</p>
        </div>

        {/* Panel tabs */}
        <div className="border-b border-[#E5E5E5] px-6 py-3">
          <div className="flex flex-wrap gap-2">
            {PANELS.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPanel(p)}
                className={`px-3 py-1.5 text-xs border capitalize transition-colors relative ${
                  panel === p
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'border-[#E5E5E5] text-[#111111]/50 hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                {PANEL_LABELS[p]}
                {isPanelComplete(p) && panel !== p && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#111111] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* Color */}
          {panel === 'color' && (
            <div>
              <p className="text-sm font-medium mb-4">Fabric color</p>
              <div className="grid grid-cols-5 gap-3">
                {colors.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    title={c.name}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        color === c.name ? 'border-[#111111] scale-110' : 'border-[#E5E5E5] hover:border-[#111111]/40'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className={`text-xs text-center leading-tight ${
                      color === c.name ? 'text-[#111111] font-medium' : 'text-[#111111]/40'
                    }`}>
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
              {color && (
                <div className="mt-6 p-3 bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#111111]/60">
                  Selected: <strong className="text-[#111111]">{color}</strong>
                </div>
              )}
              <button
                type="button"
                onClick={() => setPanel('artwork')}
                className="mt-4 w-full border border-[#111111] text-[#111111] py-2.5 text-xs font-medium hover:bg-[#111111] hover:text-white transition-colors"
              >
                Next: Artwork
              </button>
            </div>
          )}

          {/* Artwork */}
          {panel === 'artwork' && (
            <div className="flex flex-col gap-5">
              <p className="text-sm font-medium">Upload artwork</p>
              <p className="text-xs text-[#111111]/40 -mt-3">PNG, SVG, or JPG. Transparent background recommended.</p>

              {/* Front */}
              <div>
                <p className="text-xs font-medium text-[#111111]/50 mb-2 uppercase tracking-widest">Front</p>
                <input
                  ref={frontRef}
                  type="file"
                  accept=".png,.svg,.jpg,.jpeg"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleArtwork(e.target.files[0], 'front')}
                />
                {frontPreview ? (
                  <div className="border border-[#E5E5E5] p-3 flex items-center gap-3">
                    <img src={frontPreview} alt="Front" className="w-12 h-12 object-contain bg-[#F7F7F7]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{frontArtwork?.name}</p>
                      <p className="text-xs text-[#111111]/40">{((frontArtwork?.size ?? 0) / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setFrontArtwork(null); setFrontPreview(null) }}
                      className="text-xs text-[#111111]/40 hover:text-[#111111] shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => frontRef.current?.click()}
                    className="w-full border-2 border-dashed border-[#E5E5E5] py-8 flex flex-col items-center gap-2 hover:border-[#111111]/30 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" opacity="0.3">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    <span className="text-xs text-[#111111]/40">Upload front artwork</span>
                  </button>
                )}
              </div>

              {/* Back */}
              <div>
                <p className="text-xs font-medium text-[#111111]/50 mb-2 uppercase tracking-widest">
                  Back <span className="normal-case text-[#111111]/30 font-normal">(optional)</span>
                </p>
                <input
                  ref={backRef}
                  type="file"
                  accept=".png,.svg,.jpg,.jpeg"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleArtwork(e.target.files[0], 'back')}
                />
                {backPreview ? (
                  <div className="border border-[#E5E5E5] p-3 flex items-center gap-3">
                    <img src={backPreview} alt="Back" className="w-12 h-12 object-contain bg-[#F7F7F7]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{backArtwork?.name}</p>
                      <p className="text-xs text-[#111111]/40">{((backArtwork?.size ?? 0) / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setBackArtwork(null); setBackPreview(null) }}
                      className="text-xs text-[#111111]/40 hover:text-[#111111] shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => backRef.current?.click()}
                    className="w-full border-2 border-dashed border-[#E5E5E5] py-8 flex flex-col items-center gap-2 hover:border-[#111111]/30 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" opacity="0.3">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    <span className="text-xs text-[#111111]/40">Upload back artwork</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setPanel('placement')}
                className="mt-2 w-full border border-[#111111] text-[#111111] py-2.5 text-xs font-medium hover:bg-[#111111] hover:text-white transition-colors"
              >
                Next: Placement
              </button>
            </div>
          )}

          {/* Placement */}
          {panel === 'placement' && (
            <div>
              <p className="text-sm font-medium mb-4">Print placement</p>
              <div className="flex flex-col gap-2">
                {placements.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlacement(p)}
                    className={`p-4 border text-left text-sm transition-colors flex items-center justify-between ${
                      activePlacements.includes(p)
                        ? 'border-[#111111] bg-[#111111]/5 text-[#111111] font-medium'
                        : 'border-[#E5E5E5] hover:border-[#111111]/40 text-[#111111]'
                    }`}
                  >
                    {p}
                    {activePlacements.includes(p) && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPanel('technique')}
                className="mt-4 w-full border border-[#111111] text-[#111111] py-2.5 text-xs font-medium hover:bg-[#111111] hover:text-white transition-colors"
              >
                Next: Technique
              </button>
            </div>
          )}

          {/* Technique */}
          {panel === 'technique' && (
            <div>
              <p className="text-sm font-medium mb-4">Print technique</p>
              <div className="flex flex-col gap-2">
                {selectedProduct.techniques.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTechnique(t)}
                    className={`p-4 border text-left transition-colors ${
                      technique === t
                        ? 'border-[#111111] bg-[#111111]/5'
                        : 'border-[#E5E5E5] hover:border-[#111111]/40'
                    }`}
                  >
                    <p className="text-sm font-medium">{t}</p>
                    <p className="text-xs text-[#111111]/40 mt-0.5">{techniqueInfo[t]}</p>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPanel('sizes')}
                className="mt-4 w-full border border-[#111111] text-[#111111] py-2.5 text-xs font-medium hover:bg-[#111111] hover:text-white transition-colors"
              >
                Next: Sizes
              </button>
            </div>
          )}

          {/* Sizes */}
          {panel === 'sizes' && (
            <div>
              <p className="text-sm font-medium mb-1">Size breakdown</p>
              <p className="text-xs text-[#111111]/40 mb-4">Minimum 50 pieces total</p>
              <div className="flex flex-col gap-2">
                {sizes.map(s => (
                  <div key={s} className="flex items-center justify-between border border-[#E5E5E5] px-4 py-3">
                    <span className="text-sm font-medium w-8">{s}</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSizeQty(prev => ({ ...prev, [s]: Math.max(0, (prev[s] ?? 0) - 1) }))}
                        className="w-7 h-7 border border-[#E5E5E5] text-base hover:border-[#111111] transition-colors flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{sizeQty[s]}</span>
                      <button
                        type="button"
                        onClick={() => setSizeQty(prev => ({ ...prev, [s]: (prev[s] ?? 0) + 1 }))}
                        className="w-7 h-7 border border-[#E5E5E5] text-base hover:border-[#111111] transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`mt-4 p-3 text-xs font-medium border ${
                totalQty >= 50
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-[#111111]/5 text-[#111111]/60 border-[#111111]/10'
              }`}>
                {totalQty >= 50
                  ? `${totalQty} pieces — good to go`
                  : totalQty === 0
                  ? 'Add sizes to continue'
                  : `${totalQty} pieces — need ${50 - totalQty} more`}
              </div>
              {totalQty >= 50 && (
                <button
                  type="button"
                  onClick={() => setPanel('details')}
                  className="mt-4 w-full border border-[#111111] text-[#111111] py-2.5 text-xs font-medium hover:bg-[#111111] hover:text-white transition-colors"
                >
                  Next: Your details
                </button>
              )}
            </div>
          )}

          {/* Details */}
          {panel === 'details' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium mb-1">Your details</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#111111]/50">Full name *</label>
                  <input
                    type="text"
                    value={details.name}
                    onChange={e => setDetails({ ...details, name: e.target.value })}
                    className="border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#111111]"
                    placeholder="Rahul Sharma"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#111111]/50">Company *</label>
                  <input
                    type="text"
                    value={details.company}
                    onChange={e => setDetails({ ...details, company: e.target.value })}
                    className="border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#111111]"
                    placeholder="Your Brand"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#111111]/50">Email *</label>
                  <input
                    type="email"
                    value={details.email}
                    onChange={e => setDetails({ ...details, email: e.target.value })}
                    className="border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#111111]"
                    placeholder="you@company.com"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#111111]/50">Phone</label>
                  <input
                    type="tel"
                    value={details.phone}
                    onChange={e => setDetails({ ...details, phone: e.target.value })}
                    className="border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#111111]"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#111111]/50">Additional notes</label>
                <textarea
                  value={details.notes}
                  onChange={e => setDetails({ ...details, notes: e.target.value })}
                  rows={3}
                  className="border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#111111] resize-none"
                  placeholder="Deadlines, special requirements..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom — summary + submit */}
        <div className="border-t border-[#E5E5E5] px-6 py-5 flex flex-col gap-3">
          {/* Mini summary */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#111111]/40">
            <span>{product}</span>
            {color && <span>&#183; {color}</span>}
            {technique && <span>&#183; {technique}</span>}
            {activePlacements.length > 0 && <span>&#183; {activePlacements.join(', ')}</span>}
            {totalQty > 0 && <span>&#183; {totalQty} pcs</span>}
          </div>

          {canSubmit() && (
            <div className="bg-[#F7F7F7] border border-[#E5E5E5] p-3 text-xs text-[#111111]/60 leading-relaxed">
              A <strong className="text-[#111111]">&#8377;499 refundable reservation fee</strong> is collected to confirm your slot. Balance invoiced via net banking.
            </div>
          )}

          <button
            type="button"
            disabled={!canSubmit() || submitting}
            onClick={async () => {
              if (!canSubmit() || submitting) return
              setSubmitting(true)
              try {
                await fetch('/api/send-confirmation', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: details.name,
                    email: details.email,
                    type: 'configure',
                    orderDetails: {
                      product,
                      color,
                      technique,
                      placements: activePlacements.join(', '),
                      totalQty,
                      sizeBreakdown: sizes
                        .filter(s => sizeQty[s] > 0)
                        .map(s => `${s}: ${sizeQty[s]}`)
                        .join(', '),
                      estimatedTotal: `Rs.${(Math.round(
                        selectedProduct.basePrice * (1 - getDiscount(totalQty)) * totalQty
                      )).toLocaleString('en-IN')} (ex. GST)`,
                    },
                  }),
                })

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
                    firstname: details.name.split(' ')[0],
                    email: details.email,
                  }),
                })
                const { hash, key } = await res.json()

                const payuForm = document.createElement('form')
                payuForm.method = 'POST'
                payuForm.action = process.env.NEXT_PUBLIC_PAYU_BASE_URL ?? 'https://test.payu.in/_payment'

                const fields: Record<string, string> = {
                  key,
                  txnid,
                  amount,
                  productinfo,
                  firstname: details.name.split(' ')[0],
                  lastname: details.name.split(' ').slice(1).join(' '),
                  email: details.email,
                  phone: details.phone || '9999999999',
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
            className={`w-full py-3.5 text-sm font-medium transition-colors ${
              canSubmit() && !submitting
                ? 'bg-[#111111] text-white hover:bg-black'
                : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-[#111111]/20 border-t-[#111111]/60 rounded-full animate-spin" />
                Redirecting to payment...
              </span>
            ) : canSubmit() ? 'Reserve slot - Rs.499' : 'Complete all sections to continue'}
          </button>
        </div>
      </div>
    </div>
  )
}