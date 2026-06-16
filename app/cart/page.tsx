'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'

function CartItemImage({ item }: { item: { product: { name: string; images: { url: string }[] } } }) {
  const [imgSrc, setImgSrc] = useState(item.product.images[0]?.url || '/images/placeholder.jpg')
  return (
    <Image
      src={imgSrc}
      alt={item.product.name}
      fill
      sizes="96px"
      className="object-cover"
      onError={() => setImgSrc('/images/placeholders/food.svg')}
      unoptimized
    />
  )
}

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotal,
    promoCode,
    discount,
    applyPromo,
    removePromo,
  } = useCartStore()
  const [promoInput, setPromoInput] = useState('')

  const deliveryFee = getSubtotal() >= 1500 ? 0 : 199
  const total = getSubtotal() + deliveryFee - discount

  const handleApplyPromo = () => {
    if (promoInput.trim().toUpperCase() === 'WELCOME20') {
      const discountAmount = Math.min((getSubtotal() * 20) / 100, 500)
      applyPromo('WELCOME20', discountAmount)
    } else if (promoInput.trim().toUpperCase() === 'FREE_DELIVERY') {
      applyPromo('FREE_DELIVERY', 0)
    } else {
      alert('Промокод не найден')
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-muted mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
        <p className="text-muted mb-6">Добавьте блюда из меню, чтобы оформить заказ</p>
        <Link href="/catalog" className="btn-primary">
          Перейти в меню
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="card p-4 flex gap-4">
                <Link
                  href={`/product/${item.product.slug}`}
                  className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100"
                >
                  <CartItemImage item={item} />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.slug}`}>
                    <h3 className="font-bold text-lg hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted mb-2">{item.product.weight} г</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="font-bold">{item.price * item.quantity} ₽</div>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-muted hover:text-error p-2 self-start"
                  aria-label="Удалить"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Итого</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-muted">
                  <span>Товары ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span>{getSubtotal()} ₽</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Скидка ({promoCode})</span>
                    <span>-{discount} ₽</span>
                  </div>
                )}
                <div className="flex justify-between text-muted">
                  <span>Доставка</span>
                  <span>{deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₽`}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>К оплате</span>
                  <span>{total} ₽</span>
                </div>
                {getSubtotal() < 1500 && (
                  <p className="text-sm text-muted mt-2">
                    Добавьте товаров на {1500 - getSubtotal()} ₽ для бесплатной доставки
                  </p>
                )}
              </div>

              {/* Promo */}
              <div className="mb-6">
                {promoCode ? (
                  <div className="flex items-center justify-between bg-green-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <Tag size={16} />
                      <span className="font-medium">{promoCode}</span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Удалить
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Промокод"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="input flex-1"
                    />
                    <button onClick={handleApplyPromo} className="btn-primary px-4">
                      Применить
                    </button>
                  </div>
                )}
              </div>

              <Link href="/checkout" className="btn-primary w-full">
                Оформить заказ
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
