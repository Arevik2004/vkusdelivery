import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItemState {
  productId: string
  quantity: number
  price: number
  modifiers: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    weight: number
    images: { url: string; altText: string }[]
  }
}

interface CartState {
  items: CartItemState[]
  promoCode: string | null
  discount: number
  addItem: (item: CartItemState) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  applyPromo: (code: string, discount: number) => void
  removePromo: () => void
  getTotalItems: () => number
  getSubtotal: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,

      addItem: (item) => {
        const items = get().items
        const existing = items.find((i) => i.productId === item.productId)
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...items, item] })
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) })
        } else {
          set({
            items: get().items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            ),
          })
        }
      },

      clearCart: () => set({ items: [], promoCode: null, discount: 0 }),

      applyPromo: (code, discount) => set({ promoCode: code, discount }),
      removePromo: () => set({ promoCode: null, discount: 0 }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getTotal: () => Math.max(0, get().getSubtotal() - get().discount),
    }),
    {
      name: 'vkusdelivery-cart',
    }
  )
)
