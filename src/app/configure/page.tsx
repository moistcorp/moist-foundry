'use client'
import { useState, useRef } from 'react'

const products = [
  { name: 'T-Shirt', basePrice: 280, techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Heavyweight Tee', basePrice: 380, techniques: ['Screen Print', 'DTG', 'Embroidery'] },
  { name: 'Hoodie', basePrice: 650, techniques: ['Screen Print', 'Embroidery', 'Heat Transfer'] },
  { name: 'Crewneck Sweatshirt', basePrice: 580, techniques: ['Screen Print', 'Embroidery'] },
  { name: 'Polo Shirt', basePrice: 420, techniques: ['Embroidery', 'Heat Transfer'] },
  { name: 'Tote Bag', basePrice: 180, techniques: ['Screen Print', 'DTG'] },
  { name: 'Dad Cap', basePrice: 320, techniques: ['Embroidery'] },
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

function getDiscount(qty: number): number {
  if (qty >= 1000) return 0.22
  if (qty >= 500) return 0.17
  if (qty >= 250) return 0.12
  if (qty >= 100) return 0.07
  return 0
}

function GarmentSVG({ color, placements: activePlacements, frontPreview, backPreview, activeView }: {
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
        {/* Body */}
        <path
          d={showFront
            ? "M75 80 L40 110 L55 125 L65 115 L65 270 L235 270 L235 115 L245 125 L260 110 L225 80 C210 75 195 70 180 68 C175 85 162 95 150 95 C138 95 125 85 120 68 C105 70 90 75 75 80Z"
            : "M75 80 L40 110 L55 125 L65 115 L65 270 L235 270 L235 115 L245 125 L260 110 L225 80 C210 75 195 70 180 68 C175 85 162 95 150 95 C138 95 125 85 120 68 C105 70 90 75 75 80Z"
          }
          fill={garmentColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        {/* Sleeve left */}
        <path
          d="M65 115 L40 110 L55 125 L65 165 Z"
          fill={garmentColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        {/* Sleeve right */}
        <path
          d="M235 115 L260 110 L245 125 L235 165 Z"
          fill={garmentColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        {/* Collar */}
        {showFront && (
          <path
            d="M120 68 C125 85 138 95 150 95 C162 95 175 85 180 68"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
          />
        )}
        {/* Highlight sheen */}
        <path
          d="M100 90 L90 270 L110 270 L115 90Z"
          fill={highlightColor}
        />
        {/* Front print area indicator */}
        {showFront && activePlacements.includes('Front') && !frontPreview && (
          <rect x="120" y="130" width="60" height="60" rx="2"
            fill="none" stroke="#111111" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7"/>
        )}
        {/* Back print area indicator */}
        {!showFront && activePlacements.includes('Back') && !backPreview && (
          <rect x="120" y="130" width="60" height="60" rx="2"
            fill="none" stroke="#111111" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7"/>
        )}
        {/* Artwork preview */}
        {showFront && frontPreview && activePlacements.includes('Front') && (
          <image href={frontPreview} x="122" y="132" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>
        )}
        {!showFront && backPreview && activePlacements.includes('Back') && (
          <image href={backPreview} x="122" y="132" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>
        )}
        {/* Sleeve indicators */}
        {activePlacements.includes('Left Sleeve') && (
          <text x="48" y="145" fontSize="7" fill="#111111" opacity="0.8" textAnchor="middle">LOGO</text>
        )}
        {activePlacements.includes('Right Sleeve') && (
          <text x="252" y="145" fontSize="7" fill="#111111" opacity="0.8" textAnchor="middle">LOGO</text>
        )}
      </svg>
    </div>
  )
}

export default function Configure() {
  const [submitted, setSubmitted] = useState(false)
  const [activeView, setActiveView] = useState<'Front' | 'Back'>('Front')

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
  const [details, setDetails] = useState({ name: '', company: '', email: '', phone: '', notes: '' })
  const [panel, setPanel] = useState<'product' | 'color' | 'artwork' | 'placement' | 'technique' | 'sizes' | 'details'>('product')

  const frontRef = useRef<HTMLInputElement>(null)
  const backRef = useRef<HTMLInputElement>(null)

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

  const panels = ['product', 'color', 'artwork', 'placement', 'technique', 'sizes', 'details'] as const

  function canSubmit() {
    return product && color && activePlacements.length > 0 && technique &&
      totalQty >= 50 && details.name && details.email && details.company
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-[#111111]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#111111] mb-3">Request received</h1>
          <p className="text-[#111111]/60 mb-2 text-sm">
            Thanks {details.name.split(' ')[0]}. We&apos;ll review your configuration and send a detailed quote to
          </p>
          <p className="font-medium text-[#111111] mb-8">{details.email}</p>
          <p className="text-xs text-[#111111]/40 mb-8">Expected response within 24 hours</p>
          <a
            href="/"
            className="inline-block bg-[#111111] text-[#F7F7F7] px-6 py-3 rounded-sm text-sm font-medium hover:bg-[#111111] transition-colors"
          >
            Back to home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">

      {/* LEFT — Garment preview */}
      <div className="lg:w-3/5 bg-[#F7F7F7] flex flex-col items-center justify-center p-8 lg:p-16 relative">

        {/* View toggle */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex bg-white rounded-sm border border-[#111111]/10 overflow-hidden">
          {(['Front', 'Back'] as const).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setActiveView(v)}
              className={`px-5 py-2 text-xs font-medium transition-colors ${
                activeView === v ? 'bg-[#111111] text-white' : 'text-[#111111]/60 hover:text-[#111111]'
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

        {/* Color + product label */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-[#111111]">{product}</p>
          <p className="text-xs text-[#111111]/50 mt-1">{color} colorway</p>
        </div>

        {/* Live estimate */}
        {totalQty >= 50 && (
          <div className="mt-8 bg-white rounded-sm border border-[#111111]/10 px-6 py-4 text-center">
            <p className="text-xs text-[#111111]/50 mb-1">Estimated total ({totalQty} pcs)</p>
            <p className="text-2xl font-bold text-[#111111]">&#8377;{totalPrice.toLocaleString('en-IN')}</p>
            <p className="text-xs text-[#111111]/40 mt-1">&#8377;{pricePerPiece} per piece{discount > 0 ? ` · ${(discount * 100).toFixed(0)}% volume discount` : ''}</p>
          </div>
        )}
        {totalQty > 0 && totalQty < 50 && (
          <div className="mt-8 bg-[#111111]/5 border border-[#111111]/20 rounded-sm px-6 py-3 text-center">
            <p className="text-xs text-[#111111]">{50 - totalQty} more pieces needed to meet MOQ</p>
          </div>
        )}
      </div>

      {/* RIGHT — Controls */}
      <div className="lg:w-2/5 bg-white flex flex-col border-l border-[#111111]/10">

        {/* Panel tabs */}
        <div className="border-b border-[#111111]/10 px-6 py-4">
          <p className="text-xs text-[#111111]/40 uppercase tracking-wide mb-3">Configure</p>
          <div className="flex flex-wrap gap-2">
            {panels.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPanel(p)}
                className={`px-3 py-1.5 text-xs rounded-sm border capitalize transition-colors ${
                  panel === p
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'border-[#111111]/15 text-[#111111]/60 hover:border-[#111111]/40'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* Product */}
          {panel === 'product' && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium mb-1">Choose your garment</p>
              {products.map(p => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => { setProduct(p.name); setTechnique('') }}
                  className={`p-4 border rounded-sm text-left transition-colors ${
                    product === p.name
                      ? 'border-[#111111] bg-[#111111]/5'
                      : 'border-[#111111]/15 hover:border-[#111111]/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-[#111111]/50">from &#8377;{p.basePrice}</p>
                  </div>
                  <p className="text-xs text-[#111111]/40 mt-1">{p.techniques.join(' · ')}</p>
                </button>
              ))}
            </div>
          )}

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
                        color === c.name ? 'border-[#111111] scale-110' : 'border-[#111111]/15 hover:border-[#111111]/40'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className={`text-xs text-center leading-tight ${color === c.name ? 'text-[#111111] font-medium' : 'text-[#111111]/50'}`}>
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Artwork */}
          {panel === 'artwork' && (
            <div className="flex flex-col gap-5">
              <p className="text-sm font-medium">Upload artwork</p>
              <p className="text-xs text-[#111111]/50 -mt-3">PNG, SVG, or JPG. Transparent background recommended.</p>

              {/* Front */}
              <div>
                <p className="text-xs font-medium text-[#111111]/70 mb-2 uppercase tracking-wide">Front</p>
                <input ref={frontRef} type="file" accept=".png,.svg,.jpg,.jpeg" className="hidden"
                  onChange={e => e.target.files?.[0] && handleArtwork(e.target.files[0], 'front')} />
                {frontPreview ? (
                  <div className="border border-[#111111]/15 rounded-sm p-3 flex items-center gap-3">
                    <img src={frontPreview} alt="Front" className="w-12 h-12 object-contain rounded-sm bg-[#F7F7F7]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{frontArtwork?.name}</p>
                      <p className="text-xs text-[#111111]/40">{((frontArtwork?.size ?? 0) / 1024).toFixed(0)} KB</p>
                    </div>
                    <button type="button" onClick={() => { setFrontArtwork(null); setFrontPreview(null) }}
                      className="text-xs text-[#111111] hover:underline shrink-0">Remove</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => frontRef.current?.click()}
                    className="w-full border-2 border-dashed border-[#111111]/15 rounded-sm py-8 flex flex-col items-center gap-2 hover:border-[#111111]/40 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" opacity="0.3">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <span className="text-xs text-[#111111]/40">Upload front artwork</span>
                  </button>
                )}
              </div>

              {/* Back */}
              <div>
                <p className="text-xs font-medium text-[#111111]/70 mb-2 uppercase tracking-wide">Back <span className="normal-case text-[#111111]/30 font-normal">(optional)</span></p>
                <input ref={backRef} type="file" accept=".png,.svg,.jpg,.jpeg" className="hidden"
                  onChange={e => e.target.files?.[0] && handleArtwork(e.target.files[0], 'back')} />
                {backPreview ? (
                  <div className="border border-[#111111]/15 rounded-sm p-3 flex items-center gap-3">
                    <img src={backPreview} alt="Back" className="w-12 h-12 object-contain rounded-sm bg-[#F7F7F7]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{backArtwork?.name}</p>
                      <p className="text-xs text-[#111111]/40">{((backArtwork?.size ?? 0) / 1024).toFixed(0)} KB</p>
                    </div>
                    <button type="button" onClick={() => { setBackArtwork(null); setBackPreview(null) }}
                      className="text-xs text-[#111111] hover:underline shrink-0">Remove</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => backRef.current?.click()}
                    className="w-full border-2 border-dashed border-[#111111]/15 rounded-sm py-8 flex flex-col items-center gap-2 hover:border-[#111111]/40 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" opacity="0.3">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <span className="text-xs text-[#111111]/40">Upload back artwork</span>
                  </button>
                )}
              </div>
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
                    className={`p-4 border rounded-sm text-left text-sm transition-colors flex items-center justify-between ${
                      activePlacements.includes(p)
                        ? 'border-[#111111] bg-[#111111]/5 text-[#111111]'
                        : 'border-[#111111]/15 hover:border-[#111111]/30 text-[#111111]'
                    }`}
                  >
                    {p}
                    {activePlacements.includes(p) && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
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
                    className={`p-4 border rounded-sm text-left transition-colors ${
                      technique === t
                        ? 'border-[#111111] bg-[#111111]/5'
                        : 'border-[#111111]/15 hover:border-[#111111]/30'
                    }`}
                  >
                    <p className="text-sm font-medium">{t}</p>
                    <p className="text-xs text-[#111111]/50 mt-0.5">{techniqueInfo[t]}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {panel === 'sizes' && (
            <div>
              <p className="text-sm font-medium mb-1">Size breakdown</p>
              <p className="text-xs text-[#111111]/50 mb-4">Minimum 50 pieces total</p>
              <div className="flex flex-col gap-2">
                {sizes.map(s => (
                  <div key={s} className="flex items-center justify-between border border-[#111111]/15 rounded-sm px-4 py-3">
                    <span className="text-sm font-medium w-8">{s}</span>
                    <div className="flex items-center gap-3">
                      <button type="button"
                        onClick={() => setSizeQty(prev => ({ ...prev, [s]: Math.max(0, (prev[s] ?? 0) - 1) }))}
                        className="w-7 h-7 border border-[#111111]/20 rounded-sm text-base leading-none hover:border-[#111111] hover:text-[#111111] transition-colors flex items-center justify-center">
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{sizeQty[s]}</span>
                      <button type="button"
                        onClick={() => setSizeQty(prev => ({ ...prev, [s]: (prev[s] ?? 0) + 1 }))}
                        className="w-7 h-7 border border-[#111111]/20 rounded-sm text-base leading-none hover:border-[#111111] hover:text-[#111111] transition-colors flex items-center justify-center">
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`mt-4 p-3 rounded-sm text-xs font-medium ${
                totalQty >= 50 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-[#111111]/5 text-[#111111] border border-[#111111]/15'
              }`}>
                {totalQty >= 50
                  ? `${totalQty} pieces — good to go`
                  : totalQty === 0 ? 'Add sizes to continue' : `${totalQty} pieces — need ${50 - totalQty} more`}
              </div>
            </div>
          )}

          {/* Details */}
          {panel === 'details' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium mb-1">Your details</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#111111]/70">Full name *</label>
                  <input type="text" value={details.name}
                    onChange={e => setDetails({ ...details, name: e.target.value })}
                    className="border border-[#111111]/20 bg-white px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#111111]"
                    placeholder="Rahul Sharma" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#111111]/70">Company *</label>
                  <input type="text" value={details.company}
                    onChange={e => setDetails({ ...details, company: e.target.value })}
                    className="border border-[#111111]/20 bg-white px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#111111]"
                    placeholder="Your Brand" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#111111]/70">Email *</label>
                  <input type="email" value={details.email}
                    onChange={e => setDetails({ ...details, email: e.target.value })}
                    className="border border-[#111111]/20 bg-white px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#111111]"
                    placeholder="you@company.com" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#111111]/70">Phone</label>
                  <input type="tel" value={details.phone}
                    onChange={e => setDetails({ ...details, phone: e.target.value })}
                    className="border border-[#111111]/20 bg-white px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#111111]"
                    placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#111111]/70">Notes</label>
                <textarea value={details.notes}
                  onChange={e => setDetails({ ...details, notes: e.target.value })}
                  rows={3} placeholder="Deadlines, special requirements..."
                  className="border border-[#111111]/20 bg-white px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#111111] resize-none" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom — order summary + submit */}
        <div className="border-t border-[#111111]/10 px-6 py-5 flex flex-col gap-3">
          {/* Mini summary */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#111111]/50">
            <span>{product}</span>
            {color && <span>{color}</span>}
            {technique && <span>{technique}</span>}
            {activePlacements.length > 0 && <span>{activePlacements.join(', ')}</span>}
            {totalQty > 0 && <span>{totalQty} pcs</span>}
          </div>

          <button
            type="button"
            onClick={() => canSubmit() && setSubmitted(true)}
            disabled={!canSubmit()}
            className={`w-full py-3.5 text-sm font-medium rounded-sm transition-colors ${
              canSubmit()
                ? 'bg-[#111111] text-white hover:opacity-90'
                : 'bg-[#111111]/10 text-[#111111]/30 cursor-not-allowed'
            }`}
          >
            {canSubmit() ? 'Submit request' : 'Complete all sections to submit'}
          </button>
        </div>
      </div>
    </div>
  )
}