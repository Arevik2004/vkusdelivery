import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1 } },
            },
          },
        },
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      items,
      deliveryAddress,
      deliveryTime,
      paymentMethod,
      comment,
      promoCode,
    } = body

    if (!items || !items.length || !deliveryAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let discount = 0
    let deliveryFee = 0
    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    )

    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: promoCode.toUpperCase(), isActive: true },
      })
      if (
        promo &&
        promo.validFrom <= new Date() &&
        promo.validUntil >= new Date() &&
        totalAmount >= promo.minOrderAmount &&
        (!promo.usageLimit || promo.usageCount < promo.usageLimit)
      ) {
        if (promo.type === 'PERCENT') {
          discount = Math.min(
            (totalAmount * promo.value) / 100,
            promo.maxDiscount || Infinity
          )
        } else if (promo.type === 'FIXED') {
          discount = promo.value
        } else if (promo.type === 'FREE_DELIVERY') {
          deliveryFee = 0
        }
      }
    }

    if (deliveryFee === 0 && totalAmount < 1500) {
      deliveryFee = 199
    }

    const finalAmount = Math.max(0, totalAmount + deliveryFee - discount)

    const order = await prisma.order.create({
      data: {
        userId: user.userId,
        totalAmount,
        deliveryFee,
        discount,
        finalAmount,
        deliveryAddress,
        deliveryTime: deliveryTime || 'Как можно скорее',
        paymentMethod,
        paymentStatus: paymentMethod === 'ONLINE' ? 'PENDING' : 'PENDING',
        comment: comment || null,
        items: {
          create: items.map(
            (item: {
              productId: string
              quantity: number
              price: number
              modifiers: string
            }) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              modifiers: item.modifiers || null,
            })
          ),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
