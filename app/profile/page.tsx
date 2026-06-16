'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { User, Mail, Phone, Package, LogOut } from 'lucide-react'

function OrderItemImage({ item }: { item: { product: { name: string; images: { url: string }[] } } }) {
  const [imgSrc, setImgSrc] = useState(item.product.images[0]?.url || '/images/placeholders/food.svg')
  return (
    <Image
      src={imgSrc}
      alt={item.product.name}
      fill
      sizes="48px"
      className="object-cover"
      onError={() => setImgSrc('/images/placeholders/food.svg')}
      unoptimized
    />
  )
}

interface UserData {
  id: string
  email: string
  name: string
  role: string
}

interface Order {
  id: string
  status: string
  finalAmount: number
  createdAt: string
  items: {
    product: {
      name: string
      images: { url: string }[]
    }
    quantity: number
    price: number
  }[]
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' })

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/users/profile')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        fetchOrders()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        fetchOrders()
      } else {
        alert(data.error || 'Ошибка')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setOrders([])
  }

  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      PENDING: 'Ожидает подтверждения',
      CONFIRMED: 'Подтвержден',
      PREPARING: 'Готовится',
      READY: 'Готов',
      DELIVERING: 'В пути',
      DELIVERED: 'Доставлен',
      CANCELLED: 'Отменен',
    }
    return statuses[status] || status
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="py-12">
        <div className="container-app max-w-md mx-auto">
          <div className="card p-8">
            <h1 className="text-2xl font-bold text-center mb-6">
              {isLogin ? 'Вход' : 'Регистрация'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input
                  required
                  type="text"
                  placeholder="Имя"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                />
              )}
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
              />
              {!isLogin && (
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input"
                />
              )}
              <input
                required
                type="password"
                placeholder="Пароль"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
              />
              <button type="submit" className="btn-primary w-full">
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>
            <p className="text-center mt-4 text-sm text-muted">
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
              >
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile info */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User size={32} />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{user.name}</h1>
                  <p className="text-sm text-muted">{user.email}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted">
                  <Mail size={16} />
                  {user.email}
                </div>
                <div className="flex items-center gap-3 text-muted">
                  <Phone size={16} />
                  {form.phone || 'Не указан'}
                </div>
                <div className="flex items-center gap-3 text-muted">
                  <Package size={16} />
                  {orders.length} заказов
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn-secondary w-full mt-6 text-error"
              >
                <LogOut size={18} className="mr-2" />
                Выйти
              </button>
            </div>
          </div>

          {/* Orders */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">История заказов</h2>
            {orders.length === 0 ? (
              <div className="card p-8 text-center text-muted">
                <p>У вас пока нет заказов</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="card p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="font-bold">Заказ #{order.id.slice(-8)}</p>
                        <p className="text-sm text-muted">
                          {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <span className="badge bg-primary/10 text-primary">
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      {order.items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100"
                      >
                        <OrderItemImage item={item} />
                      </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-sm text-muted">+{order.items.length - 3}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted text-sm">
                        {order.items.reduce((sum, i) => sum + i.quantity, 0)} позиций
                      </span>
                      <span className="text-xl font-bold">{order.finalAmount} ₽</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
