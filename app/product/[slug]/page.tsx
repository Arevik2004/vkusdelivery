'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, Flame, Leaf, WheatOff, ChevronLeft } from 'lucide-react'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ProductCard } from '@/components/ProductCard'
import type { Product } from '@/types'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  useEffect(() => {
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${slug}`)
      const data = await res.json()
      setProduct(data.product)
      setRelatedProducts(data.relatedProducts || [])
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16 text-muted">
        <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p>Загружаем блюдо...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Блюдо не найдено</h1>
        <Link href="/catalog" className="btn-primary">
          Вернуться в меню
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-muted hover:text-primary mb-6"
        >
          <ChevronLeft size={20} />
          Назад в меню
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <Image
                src={imageErrors[activeImage] ? `/images/placeholders/${product.category.slug}.svg` : product.images[activeImage]?.url || `/images/placeholders/${product.category.slug}.svg`}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
                onError={() => setImageErrors((prev) => ({ ...prev, [activeImage]: true }))}
                unoptimized
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, idx) => (
                <button
                  key={image.id}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                    idx === activeImage ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={imageErrors[idx] ? `/images/placeholders/${product.category.slug}.svg` : image.url}
                    alt={image.altText}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={() => setImageErrors((prev) => ({ ...prev, [idx]: true }))}
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-muted">{product.category.name}</span>
              <span className="text-muted">•</span>
              <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                <Star size={16} fill="currentColor" />
                {product.rating.toFixed(1)} ({product.reviewsCount} отзывов)
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-muted text-lg mb-6">{product.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.isVegan && (
                <span className="badge bg-green-100 text-green-700 flex items-center gap-1">
                  <Leaf size={12} /> Веган
                </span>
              )}
              {product.isSpicy && (
                <span className="badge bg-red-100 text-red-700 flex items-center gap-1">
                  <Flame size={12} /> Острое
                </span>
              )}
              {product.isGlutenFree && (
                <span className="badge bg-amber-100 text-amber-700 flex items-center gap-1">
                  <WheatOff size={12} /> Без глютена
                </span>
              )}
              <span className="badge bg-gray-100 text-muted flex items-center gap-1">
                <Clock size={12} /> {product.cookingTime} мин
              </span>
            </div>

            <div className="card p-6 mb-6">
              <div className="text-sm text-muted mb-1">Цена</div>
              <div className="text-3xl font-bold mb-4">{product.price} ₽</div>
              <AddToCartButton product={product} className="w-full" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Вес', value: `${product.weight} г` },
                { label: 'Калории', value: `${product.calories} ккал` },
                { label: 'Белки', value: `${product.protein} г` },
                { label: 'Жиры', value: `${product.fat} г` },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-xl p-3 text-center border border-gray-100">
                  <div className="text-xs text-muted mb-1">{item.label}</div>
                  <div className="font-bold">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Состав</h3>
              <p className="text-muted">{product.composition}</p>
            </div>

            {product.allergens && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <h3 className="font-bold text-red-700 mb-1">Аллергены</h3>
                <p className="text-red-600 text-sm">{product.allergens}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Похожие блюда</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
