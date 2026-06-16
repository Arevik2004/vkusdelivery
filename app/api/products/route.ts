import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'name'
    const isVegan = searchParams.get('isVegan')
    const isSpicy = searchParams.get('isSpicy')
    const isGlutenFree = searchParams.get('isGlutenFree')
    const isPopular = searchParams.get('isPopular')

    const where: Prisma.ProductWhereInput = { isActive: true }

    if (category && category !== 'all') {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseInt(minPrice)
      if (maxPrice) where.price.lte = parseInt(maxPrice)
    }

    if (isVegan === 'true') where.isVegan = true
    if (isSpicy === 'true') where.isSpicy = true
    if (isGlutenFree === 'true') where.isGlutenFree = true
    if (isPopular === 'true') where.isPopular = true

    let orderBy: Prisma.ProductOrderByWithRelationInput = { name: 'asc' }
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'popular':
        orderBy = { reviewsCount: 'desc' }
        break
      case 'cookingTime':
        orderBy = { cookingTime: 'asc' }
        break
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        modifiers: true,
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
