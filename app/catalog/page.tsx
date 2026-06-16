'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductGrid } from '@/components/ProductGrid'
import type { Product, Category } from '@/types'

function CatalogContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  const initialSearch = searchParams.get('search') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const [filters, setFilters] = useState({
    category: initialCategory,
    search: initialSearch,
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    isVegan: false,
    isSpicy: false,
    isGlutenFree: false,
  })

  useEffect(() => {
    fetchCategories()
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category && filters.category !== 'all') {
        params.set('category', filters.category)
      }
      if (filters.search) params.set('search', filters.search)
      if (filters.minPrice) params.set('minPrice', filters.minPrice)
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
      params.set('sortBy', filters.sortBy)
      if (filters.isVegan) params.set('isVegan', 'true')
      if (filters.isSpicy) params.set('isSpicy', 'true')
      if (filters.isGlutenFree) params.set('isGlutenFree', 'true')

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      category: 'all',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
      isVegan: false,
      isSpicy: false,
      isGlutenFree: false,
    })
  }

  const FilterBlock = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Фильтры</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-primary hover:underline"
        >
          Сбросить
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Категория</label>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="input"
        >
          <option value="all">Все категории</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Цена, ₽</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="От"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="input"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            placeholder="До"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Сортировка</label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="input"
        >
          <option value="name">По названию (А-Я)</option>
          <option value="price_asc">По цене: сначала дешевле</option>
          <option value="price_desc">По цене: сначала дороже</option>
          <option value="rating">По рейтингу</option>
          <option value="popular">По популярности</option>
          <option value="cookingTime">По времени приготовления</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Особенности</label>
        <div className="space-y-2">
          {[
            { key: 'isVegan', label: '🌿 Веган' },
            { key: 'isSpicy', label: '🌶️ Острое' },
            { key: 'isGlutenFree', label: '🌾 Без глютена' },
          ].map((option) => (
            <label key={option.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters[option.key as keyof typeof filters] as boolean}
                onChange={(e) =>
                  setFilters({ ...filters, [option.key]: e.target.checked })
                }
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="py-8 lg:py-12">
      <div className="container-app">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Меню</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                size={20}
              />
              <input
                type="text"
                placeholder="Поиск блюд..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input pl-12"
              />
            </div>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="btn-secondary lg:hidden"
            >
              <SlidersHorizontal size={18} className="mr-2" />
              Фильтры
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <FilterBlock />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-16 text-muted">
                <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p>Загружаем меню...</p>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white p-6 overflow-y-auto">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute top-4 right-4 p-2"
            >
              <X size={24} />
            </button>
            <FilterBlock />
          </div>
        </div>
      )}
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">Загрузка...</div>}>
      <CatalogContent />
    </Suspense>
  )
}
