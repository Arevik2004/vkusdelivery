export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  image: string | null
}

export interface ProductImage {
  id: string
  url: string
  altText: string
  isMain: boolean
}

export interface ProductModifier {
  id: string
  type: string
  name: string
  price: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  composition: string
  price: number
  weight: number
  calories: number
  protein: number
  fat: number
  carbs: number
  cookingTime: number
  rating: number
  reviewsCount: number
  isPopular: boolean
  isNew: boolean
  isHit: boolean
  isVegan: boolean
  isSpicy: boolean
  isGlutenFree: boolean
  isActive: boolean
  allergens: string | null
  category: Category
  images: ProductImage[]
  modifiers: ProductModifier[]
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
  modifiers: string | null
  product: Product
}

export interface Cart {
  id: string
  items: CartItem[]
}
