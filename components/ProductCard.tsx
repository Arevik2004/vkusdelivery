'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Star, Flame, Leaf, Clock } from 'lucide-react'
import { AddToCartButton } from './AddToCartButton'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.find((img) => img.isMain) || product.images[0]
  const [imgSrc, setImgSrc] = useState(mainImage?.url || `/images/placeholders/${product.category.slug}.svg`)
  const [imgError, setImgError] = useState(false)

  const handleError = () => {
    if (!imgError) {
      setImgSrc(`/images/placeholders/${product.category.slug}.svg`)
      setImgError(true)
    }
  }

  return (
    <div className="card group flex flex-col h-full">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={imgSrc}
          alt={mainImage?.altText || product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleError}
          unoptimized
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.isNew && <span className="badge bg-primary text-white">New</span>}
          {product.isHit && <span className="badge bg-secondary text-white">Hit</span>}
          {product.isVegan && (
            <span className="badge bg-green-100 text-green-700 flex items-center gap-1">
              <Leaf size={12} /> Vegan
            </span>
          )}
          {product.isSpicy && (
            <span className="badge bg-red-100 text-red-700 flex items-center gap-1">
              <Flame size={12} /> Острое
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-lg hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
            <Star size={14} fill="currentColor" />
            {product.rating.toFixed(1)}
          </div>
        </div>

        <p className="text-sm text-muted line-clamp-2 mb-3 flex-1">{product.description}</p>

        <div className="flex items-center gap-3 text-xs text-muted mb-4">
          <span>{product.weight} г</span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {product.cookingTime} мин
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
          <span className="text-xl font-bold">{product.price} ₽</span>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </div>
  )
}
