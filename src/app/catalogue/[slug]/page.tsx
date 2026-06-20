import { products } from '@/lib/products'
import { notFound } from 'next/navigation'
import CatalogueProductClient from './CatalogueProductClient'

export default function CatalogueProductPage({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug)
  if (!product) notFound()
  return <CatalogueProductClient product={product} allProducts={products} />
}