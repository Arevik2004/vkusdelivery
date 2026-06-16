'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { CreditCard, Banknote, MapPin, Clock, Phone, User, FileText } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, discount, promoCode, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    building: '',
    apartment: '',
    entrance: '',
    floor: '',
    intercom: '',
    deliveryTime: 'asap',
    scheduledDate: '',
    scheduledTime: '',
    paymentMethod: 'CASH',
    comment: '',
    agree: false,
  })

  const deliveryFee = promoCode === 'FREE_DELIVERY' || getSubtotal() >= 1500 ? 0 : 199
  const total = getSubtotal() + deliveryFee - discount

  useEffect(() => {
    if (items.length === 0) {
      router.push('/catalog')
    }
  }, [items.length, router])

  if (items.length === 0) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.agree) {
      alert('Необходимо согласие на обработку данных')
      return
    }

    setLoading(true)
    try {
      const deliveryAddress = [
        form.street,
        `д. ${form.building}`,
        form.apartment && `кв. ${form.apartment}`,
        form.entrance && `подъезд ${form.entrance}`,
        form.floor && `этаж ${form.floor}`,
        form.intercom && `домофон ${form.intercom}`,
      ]
        .filter(Boolean)
        .join(', ')

      const deliveryTime =
        form.deliveryTime === 'asap'
          ? 'Как можно скорее'
          : `${form.scheduledDate} ${form.scheduledTime}`

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            modifiers: item.modifiers,
          })),
          deliveryAddress,
          deliveryTime,
          paymentMethod: form.paymentMethod,
          comment: form.comment,
          promoCode: promoCode || undefined,
        }),
      })

      if (res.ok) {
        clearCart()
        router.push('/profile')
      } else {
        const data = await res.json()
        alert(data.error || 'Ошибка оформления заказа')
      }
    } catch (error) {
      console.error(error)
      alert('Ошибка оформления заказа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="flex-1 space-y-6">
            {/* Contact */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User size={20} className="text-primary" />
                Контактные данные
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Имя"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                />
                <input
                  required
                  type="tel"
                  placeholder="Телефон"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input"
                />
                <input
                  type="email"
                  placeholder="Email (необязательно)"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input sm:col-span-2"
                />
              </div>
            </div>

            {/* Address */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Адрес доставки
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Улица"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="input sm:col-span-2"
                />
                <input
                  required
                  type="text"
                  placeholder="Дом"
                  value={form.building}
                  onChange={(e) => setForm({ ...form, building: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Квартира"
                  value={form.apartment}
                  onChange={(e) => setForm({ ...form, apartment: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Подъезд"
                  value={form.entrance}
                  onChange={(e) => setForm({ ...form, entrance: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Этаж"
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Домофон"
                  value={form.intercom}
                  onChange={(e) => setForm({ ...form, intercom: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            {/* Time */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                Время доставки
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryTime"
                    checked={form.deliveryTime === 'asap'}
                    onChange={() => setForm({ ...form, deliveryTime: 'asap' })}
                    className="w-5 h-5 text-primary"
                  />
                  <span>Как можно скорее</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryTime"
                    checked={form.deliveryTime === 'scheduled'}
                    onChange={() => setForm({ ...form, deliveryTime: 'scheduled' })}
                    className="w-5 h-5 text-primary"
                  />
                  <span>Ко времени</span>
                </label>
                {form.deliveryTime === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-4 pl-8">
                    <input
                      required={form.deliveryTime === 'scheduled'}
                      type="date"
                      value={form.scheduledDate}
                      onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                      className="input"
                    />
                    <input
                      required={form.deliveryTime === 'scheduled'}
                      type="time"
                      value={form.scheduledTime}
                      onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                      className="input"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" />
                Способ оплаты
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'CASH', label: 'Наличными при получении', icon: Banknote },
                  { value: 'CARD', label: 'Картой при получении', icon: CreditCard },
                  { value: 'ONLINE', label: 'Онлайн-оплата картой', icon: CreditCard },
                ].map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-primary transition-colors"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={form.paymentMethod === method.value}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      className="w-5 h-5 text-primary"
                    />
                    <method.icon size={20} className="text-muted" />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                Комментарий
              </h2>
              <textarea
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="Особые пожелания к заказу"
                rows={3}
                className="input resize-none"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                required
                type="checkbox"
                checked={form.agree}
                onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                className="w-5 h-5 mt-0.5 rounded text-primary"
              />
              <span className="text-sm text-muted">
                Я согласен на обработку персональных данных и принимаю условия доставки
              </span>
            </label>
          </div>

          {/* Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Ваш заказ</h2>
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium">{item.price * item.quantity} ₽</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-muted">
                  <span>Сумма</span>
                  <span>{getSubtotal()} ₽</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Скидка</span>
                    <span>-{discount} ₽</span>
                  </div>
                )}
                <div className="flex justify-between text-muted">
                  <span>Доставка</span>
                  <span>{deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₽`}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Итого</span>
                <span>{total} ₽</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Оформляем...' : 'Подтвердить заказ'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
