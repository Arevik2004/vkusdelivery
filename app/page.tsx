import Link from 'next/link'
import Image from 'next/image'
import { Search, Truck, Clock, Star, ShieldCheck } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ProductGrid } from '@/components/ProductGrid'

async function getPopularProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isPopular: true },
    take: 8,
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      modifiers: true,
    },
  })
  return products
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
  return categories
}

export default async function HomePage() {
  const [popularProducts, categories] = await Promise.all([
    getPopularProducts(),
    getCategories(),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
            alt="Food background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container-app relative py-16 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Вкусная еда с доставкой за 30 минут
            </h1>
            <p className="text-lg lg:text-xl mb-8 text-white/90">
              Пицца, бургеры, суши, салаты и напитки от лучших поваров города
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalog" className="btn-primary bg-white text-primary hover:bg-gray-100">
                Перейти в меню
              </Link>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                <Link
                  href="/catalog"
                  className="input pl-12 bg-white text-text flex items-center h-full"
                >
                  Найти блюдо...
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 lg:py-16">
        <div className="container-app">
          <h2 className="text-2xl lg:text-3xl font-bold mb-8">Категории</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/catalog?category=${category.slug}`}
                className="card p-6 text-center hover:shadow-card-hover transition-shadow"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-bold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container-app">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold">Популярные блюда</h2>
            <Link href="/catalog" className="text-primary font-medium hover:underline">
              Смотреть всё
            </Link>
          </div>
          <ProductGrid products={popularProducts} />
        </div>
      </section>

      {/* Features */}
      <section className="py-12 lg:py-16">
        <div className="container-app">
          <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-center">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Быстрая доставка', text: 'Доставляем за 30-60 минут' },
              { icon: Star, title: 'Качество', text: 'Только свежие ингредиенты' },
              { icon: Clock, title: 'Работаем ежедневно', text: 'С 10:00 до 23:00 без выходных' },
              { icon: ShieldCheck, title: 'Безопасно', text: 'Проверенные курьеры и упаковка' },
            ].map((feature) => (
              <div key={feature.title} className="card p-6 text-center">
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted text-sm">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container-app">
          <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-center">Отзывы клиентов</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Анна М.',
                text: 'Отличная пицца! Доставка пришла быстро, еда горячая.',
                rating: 5,
              },
              {
                name: 'Дмитрий К.',
                text: 'Бургеры просто огонь! Большие, сочные, отличные ингредиенты.',
                rating: 5,
              },
              {
                name: 'Елена С.',
                text: 'Любим заказывать суши здесь. Всегда свежие и вкусные.',
                rating: 4,
              },
            ].map((review) => (
              <div key={review.name} className="card p-6">
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-muted mb-4">{review.text}</p>
                <p className="font-bold">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
