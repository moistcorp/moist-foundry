import { products } from '@/lib/products'
import { notFound } from 'next/navigation'
import ShopProductClient from './ShopProductClient'

export default function ShopProductPage({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug)
  if (!product) notFound()
  return <ShopProductClient product={product} allProducts={products} />
}