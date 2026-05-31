import type { CartState } from '../store/cartSlice'

const CART_KEY = 'ifome-cart'

export const loadCartState = (): CartState => {
  if (typeof window === 'undefined') {
    return { restaurantId: null, restaurantName: null, items: [] }
  }

  try {
    const raw = window.localStorage.getItem(CART_KEY)
    if (!raw) {
      return { restaurantId: null, restaurantName: null, items: [] }
    }

    return JSON.parse(raw) as CartState
  } catch {
    window.localStorage.removeItem(CART_KEY)
    return { restaurantId: null, restaurantName: null, items: [] }
  }
}

export const saveCartState = (cart: CartState) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export const clearCartStorage = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(CART_KEY)
}
