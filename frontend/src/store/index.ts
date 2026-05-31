import { configureStore } from '@reduxjs/toolkit'

import cartReducer, { hydrateCart } from './cartSlice'
import { loadCartState, saveCartState } from '../lib/cart'

export const store = configureStore({
  reducer: {
    cart: cartReducer
  },
  preloadedState: {
    cart: loadCartState()
  }
})

store.subscribe(() => {
  const state = store.getState()
  saveCartState(state.cart)
})

store.dispatch(hydrateCart(loadCartState()))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
