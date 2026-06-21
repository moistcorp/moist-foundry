import { products } from '@/lib/products'
import { notFound } from 'next/navigation'
import CatalogueProductClient from './CatalogueProductClient'

export default async function CatalogueProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = products.find(p => p.slug === slug)
  if (!product) notFound()
  return <CatalogueProductClient product={product} allProducts={products} />
}