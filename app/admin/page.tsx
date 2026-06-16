'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, Edit, Trash2 } from 'lucide-react'
import type { Product, Category } from '@/types'

function AdminProductImage({ product }: { product: Product }) {
  const [imgSrc, setImgSrc] = useState(product.images[0]?.url || '/images/placeholders/food.svg')
  return (
    <Image
      src={imgSrc}
      alt={product.name}
      fill
      sizes="48px"
      className="object-cover"
      onError={() => setImgSrc('/images/placeholders/food.svg')}
      unoptimized
    />
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdmin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAdmin = async () => {
    try {
      const res = await fetch('/api/users/profile')
      const data = await res.json()
      if (res.ok && data.user.role === 'ADMIN') {
        setIsAdmin(true)
        fetchData()
      } else {
        router.push('/')
      }
    } catch {
      router.push('/')
    }
  }

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ])
      setProducts(await productsRes.json())
      setCategories(await categoriesRes.json())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const toggleProduct = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      fetchData()
    } catch (error) {
      console.error(error)
    }
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Админ-панель</h1>
          <button className="btn-primary">
            <Plus size={18} className="mr-2" />
            Добавить блюдо
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Блюд в меню', value: products.length },
            { label: 'Категорий', value: categories.length },
            { label: 'Активных', value: products.filter((p) => p.isActive).length },
          ].map((stat) => (
            <div key={stat.label} className="card p-6">
              <p className="text-muted text-sm">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">Загрузка...</div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted">Блюдо</th>
                  <th className="text-left p-4 text-sm font-medium text-muted">Категория</th>
                  <th className="text-left p-4 text-sm font-medium text-muted">Цена</th>
                  <th className="text-left p-4 text-sm font-medium text-muted">Статус</th>
                  <th className="text-right p-4 text-sm font-medium text-muted">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <AdminProductImage product={product} />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted">{product.category.name}</td>
                    <td className="p-4 font-medium">{product.price} ₽</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleProduct(product.id, product.isActive)}
                        className={`badge cursor-pointer ${
                          product.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {product.isActive ? 'Активно' : 'Скрыто'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-muted hover:text-primary">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-muted hover:text-error">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
