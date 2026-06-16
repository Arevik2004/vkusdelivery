'use client'

import { useState } from 'react'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

interface AddToCartButtonProps {
  product: Product
  className?: string
  compact?: boolean
}

export function AddToCartButton({ product, className = '', compact = false }: AddToCartButtonProps) {
  const [count, setCount] = useState(1)
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const existingItem = items.find((i) => i.productId === product.id)

  const handleAdd = () => {
    addItem({
      productId: product.id,
      quantity: count,
      price: product.price,
      modifiers: JSON.stringify([]),
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        weight: product.weight,
        images: product.images.slice(0, 1),
      },
    })
    setCount(1)
  }

  if (existingItem) {
    return (
      <button className={`btn-primary ${compact ? 'px-2 py-1.5 text-sm' : 'px-4 py-2'} ${className}`}>
        <ShoppingCart size={compact ? 14 : 18} className="mr-1" />
        {existingItem.quantity}
      </button>
    )
  }

  return (
    <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2'} ${className}`}>
      <div className={`flex items-center border border-gray-200 rounded-xl overflow-hidden ${compact ? 'text-sm' : ''}`}>
        <button
          onClick={() => setCount(Math.max(1, count - 1))}
          className={`hover:bg-gray-50 ${compact ? 'px-1.5 py-1' : 'px-2 py-2'}`}
          aria-label="Уменьшить"
        >
          <Minus size={compact ? 14 : 16} />
        </button>
        <span className={`text-center font-medium ${compact ? 'px-1 min-w-[20px]' : 'px-2 min-w-[28px]'}`}>{count}</span>
        <button
          onClick={() => setCount(count + 1)}
          className={`hover:bg-gray-50 ${compact ? 'px-1.5 py-1' : 'px-2 py-2'}`}
          aria-label="Увеличить"
        >
          <Plus size={compact ? 14 : 16} />
        </button>
      </div>
      <button onClick={handleAdd} className={`btn-primary whitespace-nowrap ${compact ? 'px-2 py-1.5 text-sm' : 'px-4 py-2'}`}>
        <Plus size={compact ? 16 : 18} className="mr-1" />
        В корзину
      </button>
    </div>
  )
}
