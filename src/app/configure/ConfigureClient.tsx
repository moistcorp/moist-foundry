'use client'
import { useState, useRef, useEffect } from 'react'
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
const neckLabels = ['No label', 'Woven label', 'Printed label', 'Heat transfer label']
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

type Screen = 'picker' | 'configure' | 'summary' | 'shipping' | 'review' | 'success'

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

function GarmentSVG({ color, placements: active, frontPreview, backPreview, activeView, productName }: {
  color: string; placements: string[]; frontPreview: string | null
  backPreview: string | null; activeView: 'Front' | 'Back'; productName: string
}) {
  const showFront = activeView === 'Front'
  const gc = colors.find(c => c.name === color)?.hex ?? '#F8F8F8'
  const isDark = ['#1a1a1a', '#1B2A4A', '#2D5016', '#6B1E2E', '#6B6B2A'].includes(gc)
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

function Accordion({ title, children, defaultOpen = false }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-[#E5E5E5]">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="text-sm font-semibold text-[#111111]">{title}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="border-t border-[#E5E5E5] px-5 py-5">{children}</div>}
    </div>
  )
}

export default function ConfigureClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [screen, setScreen] = useState<Screen>('picker')
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
  const [neckLabel, setNeckLabel] = useState('No label')
  const [totalQty, setTotalQty] = useState(50)
  const [rush, setRush] = useState(false)
  const [sizeQty, setSizeQty] = useState<Record<string, number>>({
    XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0,
  })
  const [details, setDetails] = useState({
    name: '', company: '', email: '', phone: '', notes: '',
  })
  const [shipping, setShipping] = useState({
    address: '', city: '', state: '', pincode: '',
  })

  const frontRef = useRef<HTMLInputElement>(null)
  const backRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    if (screen === 'picker' || screen === 'success') return
    const params = new URLSearchParams()
    if (product) params.set('product', product)
    if (color) params.set('color', color)
    if (technique) params.set('technique', technique)
    if (activePlacements.length) params.set('placements', activePlacements.join(','))
    params.set('screen', screen)
    router.replace(`/configure?${params.toString()}`, { scroll: false })
  }, [product, color, technique, activePlacements, screen])

  const selectedProduct = products.find(p => p.name === product) ?? products[0]
  const { pricePerPiece, subtotal, gst, total, discount, discountedBase, rushCharge } = calcOrder(product, totalQty, rush)
  const deliveryDate = getDeliveryDate(rush)
  const deliveryDays = rush ? RUSH_DELIVERY_DAYS : DELIVERY_DAYS
  const actualSizeTotal = Object.values(sizeQty).reduce((a, b) => a + b, 0)

  function handleArtwork(file: File, side: 'front' | 'back') {
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'application/postscript', 'application/illustrator']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.svg', '.ai']
const MAX_SIZE_MB = 4.5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

const [fileError, setFileError] = useState('')

function handleArtwork(file: File, side: 'front' | 'back') {
  setFileError('')
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  const isValidType = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext)
  if (!isValidType) {
    setFileError(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`)
    return
  }
  if (file.size > MAX_SIZE_BYTES) {
    setFileError(`File too large. Maximum size is ${MAX_SIZE_MB}MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB`)
    return
  }
  const url = URL.createObjectURL(file)
  if (side === 'front') { setFrontArtwork(file); setFrontPreview(url) }
  else { setBackArtwork(file); setBackPreview(url) }
}
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

  function canProceedToReview() {
    return shipping.address !== '' && shipping.city !== '' && shipping.pincode !== ''
  }

  function canSubmit() {
    return details.name !== '' && details.email !== '' && details.company !== ''
  }

  // ── PRODUCT PICKER ────────────────────────────────────────────
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
                    <button key={p.name} type="button"
                      onClick={() => { setProduct(p.name); setTechnique(''); setScreen('configure') }}
                      className="p-5 border border-[#E5E5E5] text-left hover:border-[#111111] hover:bg-[#F7F7F7] transition-colors group">
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

  // ── SUCCESS ───────────────────────────────────────────────────
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
          <p className="text-[#111111]/60 mb-2 text-sm">Thanks {details.name.split(' ')[0]}. Confirmation sent to</p>
          <p className="font-medium text-[#111111] mb-4">{details.email}</p>
          <p className="text-xs text-[#111111]/40 mb-2">Estimated delivery: <strong>{deliveryDate}</strong></p>
          <p className="text-xs text-[#111111]/40 mb-8">Our team will send a proforma within 24 hours.</p>
          <a href="/" className="inline-block bg-[#111111] text-white px-6 py-3 text-sm font-medium hover:bg-black transition-colors">
            Back to home
          </a>
        </div>
      </div>
    )
  }

  // ── CONFIGURE SCREEN ─────────────────────────────────────────
  if (screen === 'configure') {
    return (
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">

        {/* LEFT — preview */}
        <div className="lg:w-3/5 bg-[#F7F7F7] flex flex-col items-center justify-center p-8 lg:p-16 relative">
          <button type="button" onClick={() => setScreen('picker')}
            className="absolute top-6 left-6 text-xs text-[#111111]/40 hover:text-[#111111] transition-colors flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Change product
          </button>

          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex bg-white border border-[#E5E5E5] overflow-hidden">
            {(['Front', 'Back'] as const).map(v => (
              <button key={v} type="button" onClick={() => setActiveView(v)}
                className={`px-5 py-2 text-xs font-medium transition-colors ${activeView === v ? 'bg-[#111111] text-white' : 'text-[#111111]/50 hover:text-[#111111]'}`}>
                {v}
              </button>
            ))}
          </div>

          <div className="w-full max-w-xs mt-8">
            <GarmentSVG color={color} placements={activePlacements} frontPreview={frontPreview}
              backPreview={backPreview} activeView={activeView} productName={product} />
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-[#111111]">{product}</p>
            <p className="text-xs text-[#111111]/40 mt-1">{color} colorway</p>
          </div>

          {/* Live pricing card */}
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
              <div className="grid grid-cols-5 gap-3">
                {colors.map(c => (
                  <button key={c.name} type="button" onClick={() => setColor(c.name)} title={c.name}
                    className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full border-2 transition-all ${color === c.name ? 'border-[#111111] scale-110' : 'border-[#E5E5E5] hover:border-[#111111]/40'}`}
                      style={{ backgroundColor: c.hex }} />
                    <span className={`text-[10px] text-center leading-tight ${color === c.name ? 'text-[#111111] font-medium' : 'text-[#111111]/40'}`}>
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </Accordion>

            {/* Artwork */}
            <Accordion title="Artwork upload">
              <div className="flex flex-col gap-4">
                <input ref={frontRef} type="file" accept=".png,.svg,.jpg,.jpeg,.ai" className="hidden"
                  onChange={e => e.target.files?.[0] && handleArtwork(e.target.files[0], 'front')} />
                <input ref={backRef} type="file" accept=".png,.svg,.jpg,.jpeg,.ai" className="hidden"
                  onChange={e => e.target.files?.[0] && handleArtwork(e.target.files[0], 'back')} />

                <div>
                  <p className="text-xs text-[#111111]/50 mb-2 uppercase tracking-widest">Front artwork</p>
                  {frontPreview ? (
                    <div className="border border-[#E5E5E5] p-3 flex items-center gap-3">
                      <img src={frontPreview} alt="Front" className="w-10 h-10 object-contain bg-[#F7F7F7]" />
                      <p className="text-xs flex-1 truncate">{frontArtwork?.name}</p>
                      <button type="button" onClick={() => { setFrontArtwork(null); setFrontPreview(null) }}
                        className="text-xs text-[#111111]/40 hover:text-[#111111]">Remove</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => frontRef.current?.click()}
                      className="w-full border-2 border-dashed border-[#E5E5E5] py-6 text-xs text-[#111111]/40 hover:border-[#111111]/30 transition-colors">
                      Click to upload front artwork
                    </button>
                  )}
                </div>

                <div>
                  <p className="text-xs text-[#111111]/50 mb-2 uppercase tracking-widest">
                    Back artwork <span className="normal-case font-normal">(optional)</span>
                  </p>
                  {backPreview ? (
                    <div className="border border-[#E5E5E5] p-3 flex items-center gap-3">
                      <img src={backPreview} alt="Back" className="w-10 h-10 object-contain bg-[#F7F7F7]" />
                      <p className="text-xs flex-1 truncate">{backArtwork?.name}</p>
                      <button type="button" onClick={() => { setBackArtwork(null); setBackPreview(null) }}
                        className="text-xs text-[#111111]/40 hover:text-[#111111]">Remove</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => backRef.current?.click()}
                      className="w-full border-2 border-dashed border-[#E5E5E5] py-6 text-xs text-[#111111]/40 hover:border-[#111111]/30 transition-colors">
                      Click to upload back artwork
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#111111]/30">PNG, SVG, or JPG. Transparent background recommended.</p>
              </div>
            </Accordion>

            {/* Placement + Technique */}
            <Accordion title="Placement &amp; print technique">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xs font-medium text-[#111111]/50 uppercase tracking-widest mb-2">Print placement</p>
                  <div className="grid grid-cols-2 gap-2">
                    {placements.map(p => (
                      <button key={p} type="button" onClick={() => togglePlacement(p)}
                        className={`px-3 py-2.5 border text-xs text-left transition-colors flex items-center justify-between ${
                          activePlacements.includes(p)
                            ? 'border-[#111111] bg-[#111111]/5 font-medium'
                            : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111]/40'
                        }`}>
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
                      <button key={t} type="button" onClick={() => setTechnique(t)}
                        className={`px-4 py-3 border text-left transition-colors ${
                          technique === t ? 'border-[#111111] bg-[#111111]/5' : 'border-[#E5E5E5] hover:border-[#111111]/40'
                        }`}>
                        <p className="text-xs font-medium">{t}</p>
                        <p className="text-xs text-[#111111]/40 mt-0.5">{techniqueInfo[t]}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Accordion>

            {/* Neck label */}
            <Accordion title={`Neck label — ${neckLabel}`}>
              <div className="grid grid-cols-2 gap-2">
                {neckLabels.map(l => (
                  <button key={l} type="button" onClick={() => setNeckLabel(l)}
                    className={`px-3 py-2.5 border text-xs text-left transition-colors ${
                      neckLabel === l ? 'border-[#111111] bg-[#111111]/5 font-medium' : 'border-[#E5E5E5] text-[#111111]/60 hover:border-[#111111]/40'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </Accordion>

            {/* Quantity */}
            <div className="border border-[#E5E5E5] p-5">
              <p className="text-sm font-semibold mb-4">Quantity</p>
              <div className="flex items-center gap-3 mb-3">
                <button type="button"
                  onClick={() => setTotalQty(q => Math.max(50, q - 10))}
                  className="w-10 h-10 border border-[#E5E5E5] text-lg hover:border-[#111111] transition-colors flex items-center justify-center shrink-0">
                  -
                </button>
                <input
                  type="number"
                  value={totalQty}
                  min={50}
                  onChange={e => {
                    const val = parseInt(e.target.value) || 50
                    setTotalQty(Math.max(50, val))
                  }}
                  className="flex-1 text-center text-sm font-bold border border-[#E5E5E5] py-2.5 focus:outline-none focus:border-[#111111]"
                />
                <button type="button"
                  onClick={() => setTotalQty(q => q + 10)}
                  className="w-10 h-10 border border-[#E5E5E5] text-lg hover:border-[#111111] transition-colors flex items-center justify-center shrink-0">
                  +
                </button>
              </div>
              <p className="text-xs text-[#111111]/40 mb-4">Minimum 50 pieces. Type any number directly.</p>

              {/* Volume tier indicator */}
              <div className="flex flex-col gap-1 border border-[#E5E5E5] overflow-hidden">
                {VOLUME_TIERS.map(t => (
                  <div key={t.min}
                    className={`flex justify-between text-xs px-3 py-2 transition-colors ${
                      getDiscount(totalQty) === t.discount ? 'bg-[#111111] text-white' : 'text-[#111111]/30'
                    }`}>
                    <span>{t.min}{t.max === Infinity ? '+' : `–${t.max}`} pcs</span>
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
                    {rush
                      ? `Delivery in ${RUSH_DELIVERY_DAYS} days · ${getRushCharge(totalQty)}/pc`
                      : `Standard: ${DELIVERY_DAYS} days`}
                  </p>
                </div>
                <button type="button" onClick={() => setRush(!rush)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${rush ? 'bg-[#111111]' : 'bg-[#E5E5E5]'}`}>
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
          </div>

          {/* Bottom CTA */}
          <div className="border-t border-[#E5E5E5] px-6 py-5">
            <button type="button"
              disabled={!canProceedToSummary()}
              onClick={() => {
                setSizeQty(distributeQty(totalQty))
                setScreen('summary')
              }}
              className={`w-full py-3.5 text-sm font-medium transition-colors ${
                canProceedToSummary()
                  ? 'bg-[#111111] text-white hover:bg-black'
                  : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'
              }`}>
              {canProceedToSummary() ? 'Next: Order summary' : 'Complete all sections above'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── ORDER SUMMARY ─────────────────────────────────────────────
  if (screen === 'summary') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <button type="button" onClick={() => setScreen('configure')}
          className="text-xs text-[#111111]/40 hover:text-[#111111] flex items-center gap-1.5 mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to configuration
        </button>

        <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-2">Step 2 of 5</p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Order summary</h1>
        <p className="text-[#111111]/50 text-sm mb-10">
          We&apos;ve auto-distributed your quantity across sizes. Adjust as needed — total must match {totalQty} pieces.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Size breakdown */}
          <div>
            <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest mb-3">Size breakdown</p>
            <div className="flex flex-col gap-2 mb-4">
              {sizes.map(s => (
                <div key={s} className="flex items-center justify-between border border-[#E5E5E5] px-4 py-3">
                  <span className="text-sm font-medium w-8">{s}</span>
                  <div className="flex items-center gap-3">
                    <button type="button"
                      onClick={() => setSizeQty(prev => ({ ...prev, [s]: Math.max(0, (prev[s] ?? 0) - 1) }))}
                      className="w-7 h-7 border border-[#E5E5E5] hover:border-[#111111] transition-colors flex items-center justify-center text-base">
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{sizeQty[s]}</span>
                    <button type="button"
                      onClick={() => setSizeQty(prev => ({ ...prev, [s]: (prev[s] ?? 0) + 1 }))}
                      className="w-7 h-7 border border-[#E5E5E5] hover:border-[#111111] transition-colors flex items-center justify-center text-base">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-3 text-xs font-medium border ${
              actualSizeTotal === totalQty
                ? 'bg-green-50 text-green-700 border-green-200'
                : actualSizeTotal > totalQty
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-[#111111]/5 text-[#111111]/60 border-[#111111]/10'
            }`}>
              {actualSizeTotal === totalQty
                ? `${actualSizeTotal} pieces — matches your order`
                : actualSizeTotal > totalQty
                ? `${actualSizeTotal} pieces — ${actualSizeTotal - totalQty} over limit`
                : `${actualSizeTotal} of ${totalQty} pieces — ${totalQty - actualSizeTotal} remaining`}
            </div>
          </div>

          {/* Pricing + details */}
          <div className="flex flex-col gap-4">
            <div className="border border-[#E5E5E5] p-5 text-xs">
              <p className="font-medium text-[#111111]/40 uppercase tracking-widest mb-4">Configuration</p>
              {[
                { label: 'Product', value: product },
                { label: 'Color', value: color },
                { label: 'Technique', value: technique },
                { label: 'Placement', value: activePlacements.join(', ') },
                { label: 'Neck label', value: neckLabel },
                { label: 'Quantity', value: `${totalQty} pcs` },
                { label: 'Delivery', value: `${deliveryDays} days · ${deliveryDate}` },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2 border-b border-[#F7F7F7] last:border-0">
                  <span className="text-[#111111]/50">{row.label}</span>
                  <span className="font-medium text-right max-w-[55%]">{row.value}</span>
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

            <button type="button"
              disabled={!canProceedToShipping()}
              onClick={() => setScreen('shipping')}
              className={`w-full py-3.5 text-sm font-medium transition-colors ${
                canProceedToShipping()
                  ? 'bg-[#111111] text-white hover:bg-black'
                  : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'
              }`}>
              Next: Shipping details
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── SHIPPING ──────────────────────────────────────────────────
  if (screen === 'shipping') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <button type="button" onClick={() => setScreen('summary')}
          className="text-xs text-[#111111]/40 hover:text-[#111111] flex items-center gap-1.5 mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to order summary
        </button>

        <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-2">Step 3 of 5</p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Shipping details</h1>
        <p className="text-[#111111]/50 text-sm mb-10">
          Where should we deliver your order? Shipping charges will be quoted separately via email.
        </p>

        <div className="flex flex-col gap-4 max-w-lg">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#111111]/50 uppercase tracking-wide">Street address *</label>
            <input type="text" value={shipping.address}
              onChange={e => setShipping({ ...shipping, address: e.target.value })}
              className="border border-[#E5E5E5] px-4 py-3 text-sm focus:outline-none focus:border-[#111111]"
              placeholder="Building, street, area" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#111111]/50 uppercase tracking-wide">City *</label>
              <input type="text" value={shipping.city}
                onChange={e => setShipping({ ...shipping, city: e.target.value })}
                className="border border-[#E5E5E5] px-4 py-3 text-sm focus:outline-none focus:border-[#111111]"
                placeholder="Delhi" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#111111]/50 uppercase tracking-wide">State</label>
              <input type="text" value={shipping.state}
                onChange={e => setShipping({ ...shipping, state: e.target.value })}
                className="border border-[#E5E5E5] px-4 py-3 text-sm focus:outline-none focus:border-[#111111]"
                placeholder="Delhi" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#111111]/50 uppercase tracking-wide">Pincode *</label>
              <input type="text" value={shipping.pincode}
                onChange={e => setShipping({ ...shipping, pincode: e.target.value })}
                className="border border-[#E5E5E5] px-4 py-3 text-sm focus:outline-none focus:border-[#111111]"
                placeholder="110001" />
            </div>
          </div>

          <div className="bg-[#F7F7F7] border border-[#E5E5E5] p-4 text-xs text-[#111111]/50 mt-2">
            Shipping charges will be shared over email before dispatching.
          </div>

          <button type="button"
            disabled={!canProceedToReview()}
            onClick={() => setScreen('review')}
            className={`w-full py-3.5 text-sm font-medium transition-colors mt-2 ${
              canProceedToReview()
                ? 'bg-[#111111] text-white hover:bg-black'
                : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'
            }`}>
            Next: Review &amp; pay
          </button>
        </div>
      </div>
    )
  }

  // ── REVIEW ────────────────────────────────────────────────────
  if (screen === 'review') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <button type="button" onClick={() => setScreen('shipping')}
          className="text-xs text-[#111111]/40 hover:text-[#111111] flex items-center gap-1.5 mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to shipping
        </button>

        <p className="text-xs text-[#111111]/40 uppercase tracking-widest mb-2">Step 4 of 5</p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Review &amp; pay</h1>
        <p className="text-[#111111]/50 text-sm mb-10">
          Fill in your contact details and confirm everything is correct before paying the reservation fee.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium text-[#111111]/40 uppercase tracking-widest">Your details</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#111111]/50">Full name *</label>
                <input type="text" value={details.name}
                  onChange={e => setDetails({ ...details, name: e.target.value })}
                  className="border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#111111]"
                  placeholder="Rahul Sharma" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#111111]/50">Company *</label>
                <input type="text" value={details.company}
                  onChange={e => setDetails({ ...details, company: e.target.value })}
                  className="border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#111111]"
                  placeholder="Your Brand" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#111111]/50">Email *</label>
                <input type="email" value={details.email}
                  onChange={e => setDetails({ ...details, email: e.target.value })}
                  className="border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#111111]"
                  placeholder="you@company.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#111111]/50">Phone</label>
                <input type="tel" value={details.phone}
                  onChange={e => setDetails({ ...details, phone: e.target.value })}
                  className="border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#111111]"
                  placeholder="+91 98765 43210" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#111111]/50">Notes</label>
              <textarea value={details.notes}
                onChange={e => setDetails({ ...details, notes: e.target.value })}
                rows={3} placeholder="Any special requirements..."
                className="border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:border-[#111111] resize-none" />
            </div>
          </div>

          {/* Full summary */}
          <div className="flex flex-col gap-4">
            <div className="border border-[#E5E5E5] p-5 text-xs">
              <p className="font-medium text-[#111111]/40 uppercase tracking-widest mb-4">Order details</p>
              {[
                { label: 'Product', value: product },
                { label: 'Color', value: color },
                { label: 'Technique', value: technique },
                { label: 'Placement', value: activePlacements.join(', ') },
                { label: 'Neck label', value: neckLabel },
                { label: 'Quantity', value: `${totalQty} pcs` },
                { label: 'Size breakdown', value: sizes.filter(s => sizeQty[s] > 0).map(s => `${s}:${sizeQty[s]}`).join(' · ') },
                { label: 'Ship to', value: `${shipping.address}, ${shipping.city} ${shipping.pincode}` },
                { label: 'Est. delivery', value: deliveryDate },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2 border-b border-[#F7F7F7] last:border-0">
                  <span className="text-[#111111]/50 shrink-0">{row.label}</span>
                  <span className="font-medium text-right max-w-[55%] break-words">{row.value}</span>
                </div>
              ))}
            </div>

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
              A <strong className="text-[#111111]">&#8377;499 reservation fee</strong> is charged now to confirm your production slot. The balance (&#8377;{Math.max(0, total - 499).toLocaleString('en-IN')}) is invoiced separately via net banking before production begins.
            </div>

            <button type="button"
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
                        product, color, technique,
                        placements: activePlacements.join(', '),
                        totalQty,
                        sizeBreakdown: sizes.filter(s => sizeQty[s] > 0).map(s => `${s}: ${sizeQty[s]}`).join(', '),
                        estimatedTotal: `Rs.${total.toLocaleString('en-IN')} (incl. GST)`,
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
                      txnid, amount, productinfo,
                      firstname: details.name.split(' ')[0],
                      email: details.email,
                    }),
                  })
                  const { hash, key } = await res.json()

                  const payuForm = document.createElement('form')
                  payuForm.method = 'POST'
                  payuForm.action = process.env.NEXT_PUBLIC_PAYU_BASE_URL ?? 'https://secure.payu.in/_payment'

                  const fields: Record<string, string> = {
                    key, txnid, amount, productinfo,
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
              className={`w-full py-4 text-sm font-medium transition-colors ${
                canSubmit() && !submitting
                  ? 'bg-[#111111] text-white hover:bg-black'
                  : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'
              }`}>
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#111111]/20 border-t-[#111111]/60 rounded-full animate-spin" />
                  Redirecting to payment...
                </span>
              ) : canSubmit() ? 'Confirm & pay Rs.499' : 'Fill in your details to continue'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}