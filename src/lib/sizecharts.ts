export type SizeRow = {
  size: string
  chest: string
  length: string
  shoulder?: string
  waist?: string
  inseam?: string
}

export type SizeChart = {
  sizes: SizeRow[]
  note?: string
}

export const SIZE_CHARTS: Record<string, SizeChart> = {
  'regular-tee': {
    note: 'All measurements in inches. Measure the garment laid flat.',
    sizes: [
      { size: 'XS', chest: '34"', length: '26"', shoulder: '16"' },
      { size: 'S',  chest: '36"', length: '27"', shoulder: '17"' },
      { size: 'M',  chest: '38"', length: '28"', shoulder: '18"' },
      { size: 'L',  chest: '40"', length: '29"', shoulder: '19"' },
      { size: 'XL', chest: '42"', length: '30"', shoulder: '20"' },
      { size: 'XXL',chest: '44"', length: '31"', shoulder: '21"' },
    ],
  },
  'boxy-tee': {
    note: 'All measurements in inches. Boxy fit — size down if between sizes.',
    sizes: [
      { size: 'XS', chest: '38"', length: '27"', shoulder: '19"' },
      { size: 'S',  chest: '40"', length: '28"', shoulder: '20"' },
      { size: 'M',  chest: '42"', length: '29"', shoulder: '21"' },
      { size: 'L',  chest: '44"', length: '30"', shoulder: '22"' },
      { size: 'XL', chest: '46"', length: '31"', shoulder: '23"' },
      { size: 'XXL',chest: '48"', length: '32"', shoulder: '24"' },
    ],
  },
  'longsleeve': {
    note: 'All measurements in inches. Garment laid flat.',
    sizes: [
      { size: 'XS', chest: '34"', length: '27"', shoulder: '16"' },
      { size: 'S',  chest: '36"', length: '28"', shoulder: '17"' },
      { size: 'M',  chest: '38"', length: '29"', shoulder: '18"' },
      { size: 'L',  chest: '40"', length: '30"', shoulder: '19"' },
      { size: 'XL', chest: '42"', length: '31"', shoulder: '20"' },
      { size: 'XXL',chest: '44"', length: '32"', shoulder: '21"' },
    ],
  },
  'regular-sweatshirt': {
    note: 'All measurements in inches. Garment laid flat.',
    sizes: [
      { size: 'XS', chest: '36"', length: '25"', shoulder: '17"' },
      { size: 'S',  chest: '38"', length: '26"', shoulder: '18"' },
      { size: 'M',  chest: '40"', length: '27"', shoulder: '19"' },
      { size: 'L',  chest: '42"', length: '28"', shoulder: '20"' },
      { size: 'XL', chest: '44"', length: '29"', shoulder: '21"' },
      { size: 'XXL',chest: '46"', length: '30"', shoulder: '22"' },
    ],
  },
  'boxy-sweatshirt': {
    note: 'All measurements in inches. Boxy fit — size down if between sizes.',
    sizes: [
      { size: 'XS', chest: '40"', length: '26"', shoulder: '20"' },
      { size: 'S',  chest: '42"', length: '27"', shoulder: '21"' },
      { size: 'M',  chest: '44"', length: '28"', shoulder: '22"' },
      { size: 'L',  chest: '46"', length: '29"', shoulder: '23"' },
      { size: 'XL', chest: '48"', length: '30"', shoulder: '24"' },
      { size: 'XXL',chest: '50"', length: '31"', shoulder: '25"' },
    ],
  },
  'regular-hoodie': {
    note: 'All measurements in inches. Garment laid flat.',
    sizes: [
      { size: 'XS', chest: '36"', length: '26"', shoulder: '17"' },
      { size: 'S',  chest: '38"', length: '27"', shoulder: '18"' },
      { size: 'M',  chest: '40"', length: '28"', shoulder: '19"' },
      { size: 'L',  chest: '42"', length: '29"', shoulder: '20"' },
      { size: 'XL', chest: '44"', length: '30"', shoulder: '21"' },
      { size: 'XXL',chest: '46"', length: '31"', shoulder: '22"' },
    ],
  },
  'boxy-hoodie': {
    note: 'All measurements in inches. Boxy fit — size down if between sizes.',
    sizes: [
      { size: 'XS', chest: '42"', length: '27"', shoulder: '21"' },
      { size: 'S',  chest: '44"', length: '28"', shoulder: '22"' },
      { size: 'M',  chest: '46"', length: '29"', shoulder: '23"' },
      { size: 'L',  chest: '48"', length: '30"', shoulder: '24"' },
      { size: 'XL', chest: '50"', length: '31"', shoulder: '25"' },
      { size: 'XXL',chest: '52"', length: '32"', shoulder: '26"' },
    ],
  },
  'shorts': {
    note: 'All measurements in inches. Waist measured flat, double for full circumference.',
    sizes: [
      { size: 'XS', chest: '26"', length: '17"',   waist: '26"', inseam: '7"' },
      { size: 'S',  chest: '28"', length: '17.5"',  waist: '28"', inseam: '7"' },
      { size: 'M',  chest: '30"', length: '18"',    waist: '30"', inseam: '7"' },
      { size: 'L',  chest: '32"', length: '18.5"',  waist: '32"', inseam: '7"' },
      { size: 'XL', chest: '34"', length: '19"',    waist: '34"', inseam: '7"' },
      { size: 'XXL',chest: '36"', length: '19.5"',  waist: '36"', inseam: '7"' },
    ],
  },
  'tote': {
    note: 'One size. All measurements in cm.',
    sizes: [
      { size: 'One Size', chest: '38cm', length: '42cm', shoulder: '24cm handles' },
    ],
  },
}

// Map product slug → size chart key
export const PRODUCT_SIZE_CHART_MAP: Record<string, string> = {
  'regular-fit-tee-200gsm':       'regular-tee',
  'boxy-fit-tee-200gsm':          'boxy-tee',
  'regular-fit-tee-260gsm':       'regular-tee',
  'boxy-fit-tee-260gsm':          'boxy-tee',
  'longsleeve-tee-260gsm':        'longsleeve',
  'regular-fit-sweatshirt-320gsm':'regular-sweatshirt',
  'boxy-fit-sweatshirt-320gsm':   'boxy-sweatshirt',
  'regular-fit-hoodie-320gsm':    'regular-hoodie',
  'boxy-fit-hoodie-320gsm':       'boxy-hoodie',
  'regular-fit-shorts':           'shorts',
  'canvas-tote-bag':              'tote',
}

export function getSizeChart(slug: string): SizeChart | null {
  const key = PRODUCT_SIZE_CHART_MAP[slug]
  return key ? SIZE_CHARTS[key] ?? null : null
}