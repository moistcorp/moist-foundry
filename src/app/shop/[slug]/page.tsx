import { products } from '@/lib/products'
import { notFound } from 'next/navigation'
import ShopProductClient from './ShopProductClient'

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = products.find(p => p.slug === slug)
  if (!product) notFound()
  return <ShopProductClient product={product} allProducts={products} />
}